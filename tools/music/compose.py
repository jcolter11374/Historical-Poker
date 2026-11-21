"""
The game's music, written as code and rendered to MP3 loops.

Every tune here is an original composition written for this game (see
docs/MUSIC.md). Each one is a short score in pieces.py: a key, a tempo,
chords and a melody, plus which accompaniment pattern each instrument plays.
This file turns a score into MIDI, renders it with FluidSynth and the
FluidR3 General MIDI soundfont (MIT license), cuts out one seamless loop,
evens out the loudness and saves an MP3 in public/music/, and each loop's
exact length in src/ui/music.json.

    python3 tools/music/compose.py            # every chapter
    python3 tools/music/compose.py riverboat  # one chapter
    python3 tools/music/compose.py --mid      # MIDI only, for a quick look in a sequencer

Needs: python3 with numpy and mido, fluidsynth, ffmpeg, and the soundfont at
/usr/share/sounds/sf2/FluidR3_GM.sf2 (Debian/Ubuntu: apt install fluidsynth
fluid-soundfont-gm ffmpeg; pip install numpy mido).

How a loop is made seamless: the score is rendered three times in a row and
the middle copy is kept. Its start already holds the reverb tail of the copy
before it, so when the player jumps from its end back to its start, nothing
is cut off. The game loops it with Web Audio (src/ui/sound.ts).
"""
from __future__ import annotations

import json
import math
import os
import random
import re
import subprocess
import sys
import tempfile
import wave
from dataclasses import dataclass, field

import mido
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = os.path.join(ROOT, 'public', 'music')
# Each loop's title and exact length, read by src/ui/sound.ts to loop without a gap.
MANIFEST = os.path.join(ROOT, 'src', 'ui', 'music.json')
SOUNDFONT = os.environ.get('SOUNDFONT', '/usr/share/sounds/sf2/FluidR3_GM.sf2')
RATE = 44100
TPB = 480  # MIDI ticks per beat
# Loudness every loop is brought to (RMS, dBFS). Quiet on purpose: music sits under the table.
TARGET_RMS_DB = -23.0
PEAK_LIMIT = 0.7

# ---------------------------------------------------------------- notes and chords

NOTE_INDEX = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def note(name: str) -> int:
    """'C4' -> 60, 'F#3' -> 54, 'Bb5' -> 82."""
    m = re.fullmatch(r'([A-G])([#b]*)(-?\d)', name)
    if not m:
        raise ValueError(f'bad note {name!r}')
    n = NOTE_INDEX[m.group(1)] + m.group(2).count('#') - m.group(2).count('b')
    return 12 * (int(m.group(3)) + 1) + n


CHORD_SHAPES = {
    '': [0, 4, 7], 'm': [0, 3, 7], '7': [0, 4, 7, 10], 'm7': [0, 3, 7, 10], 'maj7': [0, 4, 7, 11],
    '6': [0, 4, 7, 9], 'm6': [0, 3, 7, 9], 'dim': [0, 3, 6], 'dim7': [0, 3, 6, 9], 'm7b5': [0, 3, 6, 10],
    'aug': [0, 4, 8], 'sus4': [0, 5, 7], 'sus2': [0, 2, 7], '9': [0, 4, 7, 10, 14], '7sus4': [0, 5, 7, 10], 'm9': [0, 3, 7, 10, 14],
    'maj9': [0, 4, 7, 11, 14], 'add9': [0, 4, 7, 14], '5': [0, 7], '7b9': [0, 4, 7, 10, 13], '13': [0, 4, 10, 14, 21],
}


@dataclass
class Chord:
    root: int  # pitch class 0-11
    tones: list[int]  # intervals above the root
    bass: int  # pitch class of the bass note (slash chords)

    def pcs(self) -> list[int]:
        return [(self.root + t) % 12 for t in self.tones]


def chord(sym: str) -> Chord:
    """'Am7', 'F#dim', 'G7/B', 'Bbmaj7'."""
    m = re.fullmatch(r'([A-G][#b]?)([^/]*)(?:/([A-G][#b]?))?', sym)
    if not m:
        raise ValueError(f'bad chord {sym!r}')
    root = note(m.group(1) + '4') % 12
    shape = CHORD_SHAPES[m.group(2)]
    bass = note(m.group(3) + '4') % 12 if m.group(3) else root
    return Chord(root, shape, bass)


def nearest(pc: int, around: int) -> int:
    """The pitch with pitch class `pc` closest to `around`."""
    base = around - ((around - pc) % 12)
    return base if around - base <= 6 else base + 12


def voicing(c: Chord, around: int, size: int = 3) -> list[int]:
    """A close voicing of the chord near `around`, `size` notes, sorted."""
    pcs = c.pcs()
    if len(pcs) > size:
        # Keep the colour notes (third, seventh, ninth) first, then the root, then the fifth.
        order = [t for t in c.tones if t not in (0, 7)] + [t for t in (0, 7) if t in c.tones]
        pcs = [(c.root + t) % 12 for t in order][:size]
    return sorted(nearest(p, around) for p in pcs)


# ---------------------------------------------------------------- scores

@dataclass
class Note:
    start: float  # beats from the top
    dur: float
    pitch: int
    vel: int


@dataclass
class Part:
    name: str
    program: int  # General MIDI program, 0-127 (0 = grand piano)
    notes: list[Note] = field(default_factory=list)
    volume: int = 100  # CC7
    pan: int = 64  # CC10, 0 left .. 127 right
    reverb: int = 50  # CC91
    chorus: int = 0  # CC93
    drums: bool = False
    drum_kit: int = 0  # program on the drum channel: 0 standard, 32 jazz, 40 brush, 24 electronic, 25 TR-808
    humanize: float = 0.012  # seconds of timing wobble
    swing: float = 0.0  # 0 straight, 0.33 hard triplet swing on eighths


@dataclass
class Score:
    id: str
    title: str
    tempo: float  # beats per minute
    beats_per_bar: int
    bars: int
    parts: list[Part]
    seed: int = 1

    @property
    def beats(self) -> float:
        return self.bars * self.beats_per_bar

    @property
    def seconds(self) -> float:
        return self.beats * 60 / self.tempo


def melody(text: str, start: float = 0, vel: int = 88, transpose: int = 0) -> list[Note]:
    """
    A line of notes: 'E5:1 D5:.5 C5:.5 r:1 G4:2'. Each token is pitch:beats;
    'r' is a rest; 'E5+G5:1' plays a double stop; a trailing '>' accents.
    Bar lines '|' are ignored (they help reading).
    """
    out: list[Note] = []
    t = start
    for tok in text.split():
        if tok == '|':
            continue
        accent = tok.endswith('>')
        tok = tok.rstrip('>')
        pitch, _, dur = tok.partition(':')
        d = eval_dur(dur or '1')
        if pitch != 'r':
            for p in pitch.split('+'):
                out.append(Note(t, d * 0.95, note(p) + transpose, min(127, vel + (14 if accent else 0))))
        t += d
    return out


def eval_dur(s: str) -> float:
    if '/' in s:
        a, b = s.split('/')
        return float(a) / float(b)
    return float(s)


def line_length(text: str) -> float:
    return sum(eval_dur(tok.rstrip('>').partition(':')[2] or '1') for tok in text.split() if tok != '|')


def chords_by_bar(text: str, beats_per_bar: int) -> list[tuple[float, float, Chord]]:
    """
    'G | G | C D7 | G' -> (start, length, chord) for each chord. Chords
    sharing a bar split it evenly; '%' repeats the last chord.
    """
    out = []
    last = None
    for i, bar in enumerate(text.split('|')):
        syms = bar.split()
        if not syms:
            continue
        each = beats_per_bar / len(syms)
        for j, s in enumerate(syms):
            c = last if s == '%' else chord(s)
            last = c
            out.append((i * beats_per_bar + j * each, each, c))
    return out


# ---------------------------------------------------------------- accompaniment patterns
# Each takes the chord list and returns notes. `around` is the register.

def pattern(chords, steps: list[tuple[float, str, float]], around: int = 60, bass_around: int = 43, vel: int = 70, size: int = 3) -> list[Note]:
    """
    A repeating rhythm over each chord. steps: (beat offset within the chord,
    what, length). what: 'B' bass root, 'F' bass fifth, 'C' the chord, '1'..'4'
    one chord note from the bottom, 'U' chord an octave up.
    """
    out = []
    for start, length, c in chords:
        v = voicing(c, around, size)
        b = nearest(c.bass, bass_around)
        for off, what, d in steps:
            if off >= length:
                continue
            t = start + off
            d = min(d, length - off)
            if what == 'B':
                out.append(Note(t, d, b, vel + 6))
            elif what == 'F':
                out.append(Note(t, d, nearest((c.root + 7) % 12, bass_around), vel))
            elif what == 'C':
                out += [Note(t, d, p, vel - 6) for p in v]
            elif what == 'U':
                out += [Note(t, d, p + 12, vel - 10) for p in v]
            elif what.isdigit():
                k = int(what) - 1
                out.append(Note(t, d, v[k % len(v)] + 12 * (k // len(v)), vel - 4))
    return out


def walking_bass(chords, around: int = 40, vel: int = 78, seed: int = 3) -> list[Note]:
    """Quarter notes: root on the beat, chord tones and a step into the next chord."""
    rnd = random.Random(seed)
    out = []
    for i, (start, length, c) in enumerate(chords):
        nxt = chords[(i + 1) % len(chords)][2]
        root = nearest(c.bass, around)
        target = nearest(nxt.bass, root)
        beats = int(round(length))
        tones = [root + t for t in (c.tones[1], c.tones[2] if len(c.tones) > 2 else 7)]
        for k in range(beats):
            if k == 0:
                p = root
            elif k == beats - 1:
                p = target + (1 if rnd.random() < 0.5 else -1)
            else:
                p = rnd.choice(tones)
            out.append(Note(start + k, 0.9, p, vel - (0 if k == 0 else 8)))
    return out


def drums(beats_per_bar: int, bars: int, hits: dict[int, str], vel: int = 70, fills: dict[int, dict[int, str]] | None = None, step: float = 0.5) -> list[Note]:
    """
    A drum groove: hits maps a GM drum note to a step string for one bar, one
    character per `step` beats: 'x' hit, 'o' soft hit, 'X' accent, '.' rest.
    `fills` replaces the pattern on given bars (0-based).
    """
    out = []
    for bar in range(bars):
        pat = (fills or {}).get(bar, hits)
        for drum, steps in pat.items():
            for i, ch in enumerate(steps.replace(' ', '')):
                if ch == '.':
                    continue
                v = {'x': vel, 'o': int(vel * 0.6), 'X': min(127, int(vel * 1.3))}[ch]
                out.append(Note(bar * beats_per_bar + i * step, 0.25, drum, v))
    return out


def repeat(notes: list[Note], times: int, every: float) -> list[Note]:
    return [Note(n.start + k * every, n.dur, n.pitch, n.vel) for k in range(times) for n in notes]


def shift(notes: list[Note], beats: float) -> list[Note]:
    return [Note(n.start + beats, n.dur, n.pitch, n.vel) for n in notes]


def soften(notes: list[Note], factor: float) -> list[Note]:
    return [Note(n.start, n.dur, n.pitch, max(1, int(n.vel * factor))) for n in notes]


# ---------------------------------------------------------------- rendering

def to_midi(score: Score, copies: int = 3) -> mido.MidiFile:
    """The score `copies` times in a row, one MIDI track per part."""
    rnd = random.Random(score.seed)
    mid = mido.MidiFile(ticks_per_beat=TPB)
    meta = mido.MidiTrack()
    meta.append(mido.MetaMessage('set_tempo', tempo=int(60_000_000 / score.tempo)))
    meta.append(mido.MetaMessage('time_signature', numerator=score.beats_per_bar, denominator=4))
    mid.tracks.append(meta)
    channel = 0
    for part in score.parts:
        ch = 9 if part.drums else channel
        if not part.drums:
            channel += 1
            if channel == 9:
                channel = 10
        tr = mido.MidiTrack()
        tr.append(mido.Message('program_change', channel=ch, program=part.drum_kit if part.drums else part.program, time=0))
        for cc, val in ((7, part.volume), (10, part.pan), (91, part.reverb), (93, part.chorus)):
            tr.append(mido.Message('control_change', channel=ch, control=cc, value=val, time=0))
        events = []
        wobble = part.humanize * score.tempo / 60  # seconds -> beats
        for k in range(copies):
            for n in part.notes:
                start = n.start
                if part.swing:
                    beat = math.floor(start + 1e-6)
                    frac = start - beat
                    if abs(frac - 0.5) < 1e-6:
                        start = beat + 0.5 + part.swing / 2
                start += k * score.beats + rnd.uniform(-wobble, wobble)
                start = max(0.0, start)
                vel = max(1, min(127, n.vel + rnd.randint(-6, 6)))
                on = int(round(start * TPB))
                off = int(round((start + n.dur) * TPB))
                events.append((on, 1, mido.Message('note_on', channel=ch, note=n.pitch, velocity=vel)))
                events.append((max(on + 1, off), 0, mido.Message('note_off', channel=ch, note=n.pitch, velocity=0)))
        events.sort(key=lambda e: (e[0], e[1]))
        now = 0
        for t, _, msg in events:
            tr.append(msg.copy(time=t - now))
            now = t
        mid.tracks.append(tr)
    return mid


def read_wav(path: str) -> np.ndarray:
    with wave.open(path) as w:
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        return data.reshape(-1, w.getnchannels())


def write_wav(path: str, audio: np.ndarray) -> None:
    pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, 'wb') as w:
        w.setnchannels(audio.shape[1])
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(pcm.tobytes())


def render(score: Score, midi_only: bool = False) -> dict:
    os.makedirs(OUT_DIR, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        mid_path = os.path.join(tmp, f'{score.id}.mid')
        to_midi(score).save(mid_path)
        if midi_only:
            to_midi(score, copies=1).save(os.path.join(ROOT, 'tools', 'music', f'{score.id}.mid'))
            return {}
        wav_path = os.path.join(tmp, 'full.wav')
        subprocess.run(
            ['fluidsynth', '-ni', '-g', '0.5', '-r', str(RATE), '-o', 'synth.reverb.room-size=0.55', '-o', 'synth.reverb.level=0.6', '-F', wav_path, SOUNDFONT, mid_path],
            check=True, capture_output=True,
        )
        audio = read_wav(wav_path)
        loop = int(round(score.seconds * RATE))
        tail = int(0.5 * RATE)
        # The middle copy, plus half a second of what follows (see docs/MUSIC.md, "Looping").
        clip = audio[loop: 2 * loop + tail]
        rms = math.sqrt(float(np.mean(clip[:loop] ** 2)))
        gain = 10 ** (TARGET_RMS_DB / 20) / max(rms, 1e-6)
        peak = float(np.max(np.abs(clip))) * gain
        if peak > PEAK_LIMIT:
            gain *= PEAK_LIMIT / peak
        clip = clip * gain
        out_wav = os.path.join(tmp, 'loop.wav')
        write_wav(out_wav, clip)
        mp3 = os.path.join(OUT_DIR, f'{score.id}.mp3')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', out_wav, '-codec:a', 'libmp3lame', '-b:a', '96k', mp3], check=True)
    return {'file': f'{score.id}.mp3', 'title': score.title, 'loop': round(score.seconds, 4)}


def main(argv: list[str]) -> None:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from pieces import SCORES  # noqa: E402

    midi_only = '--mid' in argv
    wanted = [a for a in argv if not a.startswith('--')]
    manifest_path = MANIFEST
    manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {}
    for score in SCORES:
        if wanted and score.id not in wanted:
            continue
        print(f'{score.id}: {score.title}, {score.seconds:.1f}s loop', flush=True)
        info = render(score, midi_only)
        if info:
            manifest[score.id] = info
    if not midi_only:
        with open(manifest_path, 'w') as f:
            json.dump(dict(sorted(manifest.items())), f, indent=2)
            f.write('\n')


if __name__ == '__main__':
    main(sys.argv[1:])
