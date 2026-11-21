"""
The scores: one original tune per chapter, in the sound of its time and place.
compose.py renders them. See docs/MUSIC.md for what each one is meant to
evoke and how to change one.

Reading a melody: 'E5:1 D5:.5 C5:.5' is E above middle C for one beat, then
D and C for half a beat each; 'r' is a rest; '|' is a bar line (ignored).
Chords: 'G | D7 | Em C' is one chord a bar, two sharing a bar split it.
"""
from compose import Note, Part, Score, chords_by_bar, drums, line_length, melody, pattern, repeat, shift, soften, walking_bass


def lead(*sections: str) -> str:
    return ' '.join(sections)


def check(score: Score) -> Score:
    for part in score.parts:
        end = max((n.start for n in part.notes), default=0)
        assert end < score.beats, f'{score.id}/{part.name} runs past the end ({end} >= {score.beats})'
    return score


def melodic(text: str, beats: float, **kw) -> list[Note]:
    assert abs(line_length(text) - beats) < 1e-6, f'melody is {line_length(text)} beats, expected {beats}'
    return melody(text, **kw)


def between(notes: list[Note], start: float, end: float) -> list[Note]:
    return [n for n in notes if start <= n.start < end]


# ---------------------------------------------------------------- 1. The River, 1836
# A slow waltz on fiddle and banjo, the kind a steamboat's hired band played
# for the saloon at night. G major.

def riverboat() -> Score:
    bpb, bars = 3, 32
    a = 'G | G | C | G | G | Em | A7 | D7'
    a2 = 'G | G | C | G | C | G/D | D7 | G'
    b = 'Em | B7 | Em | G | C | G | A7 | D7'
    ch = chords_by_bar(' | '.join([a, a2, b, a2]), bpb)
    mel_a = 'B4:1 D5:1 G5:1 | A5:1.5 G5:.5 D5:1 | E5:1 C5:1 E5:1 | D5:3 | B4:1 D5:1 G5:1 | B5:1.5 A5:.5 G5:1 | E5:1 C#5:1 E5:1 | F#5:2 A4:1'
    mel_a2 = 'B4:1 D5:1 G5:1 | A5:1.5 G5:.5 D5:1 | E5:1 G5:1 C6:1 | B5:2 G5:1 | E5:1 G5:1 E5:1 | D5:1 B4:1 G4:1 | A4:1 C5:1 F#5:1 | G5:2 r:1'
    mel_b = 'G5:1 F#5:1 E5:1 | D#5:1.5 E5:.5 F#5:1 | G5:1 B5:1 G5:1 | D5:3 | E5:1 G5:1 C6:1 | B5:1.5 A5:.5 G5:1 | A5:1 G5:1 E5:1 | F#5:1 E5:1 D5:1'
    fiddle = melodic(lead(mel_a, mel_a2, mel_b, mel_a2), bars * bpb, vel=84)
    return check(Score('riverboat', 'Moonlight on the Magnolia', 100, bpb, bars, seed=11, parts=[
        Part('fiddle', 110, fiddle, volume=96, pan=50, reverb=60),
        Part('banjo', 105, pattern(ch, [(1, 'C', .5), (2, 'C', .5), (2.5, '3', .4)], around=62, vel=58), volume=80, pan=84, reverb=40),
        Part('bass', 32, pattern(ch, [(0, 'B', 1.6)], bass_around=43, vel=76), volume=96, reverb=30),
    ]))


# ---------------------------------------------------------------- 2. The Painted Deck, 1543
# A galliard for recorder and lute over a bowed viol, as a Tudor hall's
# musicians might play after supper. D Dorian.

def painted_deck() -> Score:
    bpb, bars = 3, 32
    a = 'Dm | C | Dm | Am | F | C | Dm | A'
    a2 = 'Dm | C | Dm | Am | F | C | Gm A | Dm'
    b = 'F | C | Dm | A | F | C | Gm A | Dm'
    ch = chords_by_bar(' | '.join([a, a2, b, a2]), bpb)
    mel_a = 'D5:2 E5:1 | E5:2 C5:1 | D5:1 F5:1 A5:1 | A4:1 C5:1 E5:1 | F5:2 G5:1 | E5:1.5 D5:.5 C5:1 | F5:1 E5:1 D5:1 | C#5:2 E5:1'
    mel_a2 = 'D5:2 E5:1 | E5:2 C5:1 | D5:1 F5:1 A5:1 | C6:1.5 B5:.5 A5:1 | A5:1 G5:1 F5:1 | G5:1.5 F5:.5 E5:1 | G5:1.5 E5:1.5 | D5:3'
    mel_b = 'A5:2 A5:1 | G5:2 E5:1 | F5:1.5 E5:.5 D5:1 | E5:3 | C6:2 A5:1 | G5:1.5 F5:.5 E5:1 | D5:1.5 C#5:1.5 | D5:2 r:1'
    recorder = melodic(lead(mel_a, mel_a2, mel_b, mel_a2), bars * bpb, vel=78)
    tabor = drums(bpb, bars, {45: 'x.o'}, vel=46, step=1)
    return check(Score('painted-deck', 'The Ashcombe Galliard', 112, bpb, bars, seed=12, parts=[
        Part('recorder', 74, recorder, volume=84, pan=56, reverb=70),
        Part('lute', 24, pattern(ch, [(0, 'B', 1), (0, '1', 1), (1, '2', .5), (1.5, '3', .5), (2, 'C', 1)], around=58, bass_around=45, vel=62), volume=92, pan=80, reverb=60),
        Part('viol', 42, pattern(ch, [(0, 'B', 2.8)], bass_around=38, vel=58), volume=70, pan=40, reverb=70),
        Part('tabor', 0, tabor, drums=True, volume=60, reverb=50),
    ]))


# ---------------------------------------------------------------- 3. The North Road, 1763
# A jig for fiddle and harpsichord by the taproom fire, with a frame drum.
# D major, 6/8 (written here in eighth notes: one beat = one eighth).

def north_road() -> Score:
    bpb, bars = 6, 64
    a = 'D | D | G | A | D | D | G A | D'
    b = 'Bm | Bm | G | A | Bm | Em | G A | D'
    ch = chords_by_bar(' | '.join([a, a, b, b] * 2), bpb)
    mel_a = 'A4:1 D5:1 F#5:1 A5:1 F#5:1 D5:1 | G5:1 F#5:1 E5:1 D5:2 A4:1 | B4:1 D5:1 G5:1 B5:2 G5:1 | A5:1 G5:1 F#5:1 E5:1 C#5:1 A4:1 | D5:1 F#5:1 A5:1 D6:2 A5:1 | B5:1 A5:1 F#5:1 A5:2 F#5:1 | G5:1 B5:1 G5:1 E5:1 C#5:1 E5:1 | D5:3 r:2 A4:1'
    mel_b = 'B4:1 D5:1 F#5:1 B5:2 F#5:1 | D6:1 B5:1 F#5:1 D5:2 F#5:1 | G5:1 B5:1 D6:1 B5:1 G5:1 B5:1 | A5:2 E5:1 C#5:2 E5:1 | F#5:1 B5:1 A5:1 F#5:1 D5:1 F#5:1 | E5:1 G5:1 B5:1 E6:2 B5:1 | D6:1 B5:1 G5:1 C#6:1 A5:1 E5:1 | D5:3 r:2 A4:1'
    tune = lead(mel_a, mel_a, mel_b, mel_b)
    half = 32 * bpb
    fiddle = melodic(tune, half, vel=82) + soften(melodic(tune, half, start=half, vel=80), 0.95)
    flute = melodic(tune, half, start=half, vel=64)
    return check(Score('north-road', 'The Coaching Inn Jig', 320, bpb, bars, seed=13, parts=[
        Part('fiddle', 110, fiddle, volume=92, pan=48, reverb=45),
        Part('flute', 73, flute, volume=66, pan=80, reverb=55),
        Part('harpsichord', 6, pattern(ch, [(0, 'B', 2), (2, 'C', 1), (3, 'F', 2), (5, 'C', 1)], around=62, bass_around=45, vel=60), volume=80, pan=70, reverb=40),
        Part('frame drum', 0, drums(bpb, bars, {41: 'x..o..', 42: '..o..o'}, vel=50, step=1), drums=True, volume=58, reverb=40),
    ]))


# ---------------------------------------------------------------- 4. The Camp, 1863
# A slow air on harmonica over a picked guitar, played low at a campfire on
# the Rappahannock. D major.

def camp() -> Score:
    bpb, bars = 4, 16
    ch = chords_by_bar('D | G D | D | A | D | G | D A | D | Bm | G | D | A | G | D | Em A | D', bpb)
    tune = ('F#4:1.5 A4:.5 D5:2 | B4:1 G4:1 A4:2 | F#4:1 E4:1 D4:1 F#4:1 | E4:3 r:1 | '
            'F#4:1.5 A4:.5 D5:1.5 E5:.5 | D5:1 B4:1 G4:2 | A4:1.5 F#4:.5 E4:1 G4:1 | D4:3 r:1 | '
            'F#4:1 B4:1 D5:2 | E5:1 D5:1 B4:2 | A4:1.5 B4:.5 A4:1 F#4:1 | E4:3 A4:1 | '
            'B4:1.5 D5:.5 E5:1 D5:1 | A4:2 F#4:2 | G4:1 B4:1 A4:1 C#5:1 | D5:3 r:1')
    harmonica = melodic(tune, bars * bpb, vel=74, transpose=12)
    travis = [(0, 'B', 1), (.5, '3', .5), (1, '1', 1), (1.5, '2', .5), (2, 'F', 1), (2.5, '3', .5), (3, '1', 1), (3.5, '2', .5)]
    return check(Score('camp', 'Campfire on the Rappahannock', 70, bpb, bars, seed=14, parts=[
        Part('harmonica', 22, harmonica, volume=78, pan=58, reverb=70),
        Part('guitar', 25, pattern(ch, travis, around=60, bass_around=45, vel=56), volume=88, pan=76, reverb=55),
        Part('cello', 42, pattern(ch, [(0, 'B', 3.8)], bass_around=38, vel=48), volume=62, pan=44, reverb=70),
    ]))


# ---------------------------------------------------------------- 5. The Last Hand, 1876
# A polka on a tinny saloon upright in a Deadwood gold-rush saloon. C major, 2/4.

def last_hand() -> Score:
    bpb, bars = 2, 64
    a = 'C | C | G7 | G7 | G7 | G7 | C | C'
    b = 'F | F | C | C | G7 | G7 | C | C'
    ch = chords_by_bar(' | '.join([a, a, b, a] * 2), bpb)
    mel_a = 'G4:.5 C5:.5 E5:.5 G5:.5 | A5:.5 G5:.5 E5:1 | F5:.5 E5:.5 D5:.5 B4:.5 | D5:1 G4:1 | F4:.5 B4:.5 D5:.5 F5:.5 | G5:.5 F5:.5 D5:1 | E5:.5 G5:.5 C6:.5 G5:.5 | C6:1 r:1'
    mel_a2 = 'G4:.5 C5:.5 E5:.5 G5:.5 | A5:.5 G5:.5 E5:1 | F5:.5 E5:.5 D5:.5 B4:.5 | D5:1 G4:1 | F4:.5 B4:.5 D5:.5 F5:.5 | G5:.5 F5:.5 D5:1 | E5:.5 C5:.5 G4:.5 E5:.5 | C5:1 r:1'
    mel_b = 'A4:.5 C5:.5 F5:.5 A5:.5 | C6:1 A5:1 | G5:.5 E5:.5 C5:.5 E5:.5 | G5:1 r:1 | F5:.5 D5:.5 B4:.5 D5:.5 | F5:.5 G5:.5 A5:.5 B5:.5 | C6:.5 G5:.5 E5:.5 G5:.5 | C6:1 r:1'
    tune = lead(mel_a, mel_a2, mel_b, mel_a2)
    half = 32 * bpb
    right = melodic(tune, half, vel=80) + melodic(tune, half, start=half, vel=80) + melodic(tune, half, start=half, vel=62, transpose=-12)
    left = pattern(ch, [(0, 'B', .4), (.5, 'C', .35), (1, 'F', .4), (1.5, 'C', .35)], around=58, bass_around=41, vel=62)
    return check(Score('last-hand', 'Gold Dust Polka', 104, bpb, bars, seed=15, parts=[
        Part('piano right', 3, right, volume=92, pan=70, reverb=35),
        Part('piano left', 3, left, volume=86, pan=58, reverb=35),
    ]))


# ---------------------------------------------------------------- 6. The Gaming House, 1817
# A minuet in the French style for violin, fortepiano and cello, drifting out
# over a New Orleans balcony. D minor, with an F major middle.

def gaming_house() -> Score:
    bpb, bars = 3, 32
    a = 'Dm | Gm | A7 | Dm | Bb | Gm | A7 | Dm'
    b = 'F | C7 | F | Dm | Gm | C7 | F | A7'
    ch = chords_by_bar(' | '.join([a, a, b, a]), bpb)
    mel_a = 'A4:1 D5:1 F5:1 | Bb5:1.5 A5:.5 G5:1 | E5:1 G5:1 C#5:1 | D5:2 A4:1 | Bb4:1 D5:1 F5:1 | D5:1 G5:1 Bb5:1 | A5:1.5 G5:.5 C#5:1 | D5:3'
    mel_a2 = 'F5:1 E5:.5 D5:.5 A5:1 | Bb5:1 A5:.5 G5:.5 D5:1 | E5:1 C#5:.5 E5:.5 G5:1 | F5:1.5 E5:.5 D5:1 | D5:1 F5:1 Bb5:1 | D6:1.5 C6:.5 Bb5:1 | A5:1 E5:1 C#5:1 | D5:2 r:1'
    mel_b = 'C5:1 F5:1 A5:1 | G5:1.5 F5:.5 E5:1 | F5:1 A5:1 C6:1 | D6:2 A5:1 | Bb5:1 A5:1 G5:1 | C6:1 Bb5:1 G5:1 | A5:1.5 G5:.5 F5:1 | E5:1 C#5:1 A4:1'
    violin = melodic(lead(mel_a, mel_a2, mel_b, mel_a2), bars * bpb, vel=80)
    return check(Score('gaming-house', 'Minuet on the Rue Royale', 96, bpb, bars, seed=16, parts=[
        Part('violin', 40, violin, volume=92, pan=52, reverb=70),
        Part('fortepiano', 0, pattern(ch, [(0, 'B', 1), (1, 'C', .8), (2, 'C', .8)], around=62, bass_around=45, vel=52), volume=78, pan=76, reverb=60),
        Part('cello', 42, pattern(ch, [(0, 'B', 2.8)], bass_around=38, vel=54), volume=70, pan=40, reverb=70),
    ]))


# ---------------------------------------------------------------- 7. The Back Room, 1926
# A medium hot-jazz number for clarinet, muted trumpet, stride piano, tuba
# and brushes, behind a speakeasy's back door. F major, swung.

def back_room() -> Score:
    bpb, bars = 4, 32
    a = 'F | D7 | G7 | C7 | F | D7 | G7 C7 | F C7'
    b = 'A7 | A7 | D7 | D7 | G7 | G7 | C7 | C7'
    ch = chords_by_bar(' | '.join([a, a, b, a]), bpb)
    mel_a = 'A4:.5 C5:.5 F5:1 r:.5 A5:1.5 | F#5:.5 A5:.5 F#5:.5 D5:.5 C5:2 | B4:.5 D5:.5 G5:1 r:.5 B5:1.5 | Bb5:.5 A5:.5 G5:.5 E5:.5 C5:2 | A4:.5 C5:.5 F5:1 r:.5 A5:1.5 | C6:.5 A5:.5 F#5:.5 D5:.5 A5:2 | G5:1 F5:.5 D5:.5 E5:1 Bb4:1 | F5:2 r:2'
    mel_a2 = mel_a.rsplit('|', 2)[0] + '| G5:.5 F5:.5 D5:.5 B4:.5 E5:.5 G5:.5 Bb5:.5 G5:.5 | F5:3 r:1'
    mel_b = 'E5:.5 G5:.5 A5:.5 C#6:1.5 A5:1 | G5:1 E5:1 C#5:2 | F#5:.5 A5:.5 D6:.5 C6:1.5 A5:1 | F#5:1 D5:1 r:2 | B4:.5 D5:.5 F5:.5 A5:1.5 G5:1 | F5:1 D5:1 B4:2 | E5:.5 G5:.5 Bb5:.5 C6:1.5 Bb5:1 | G5:1 E5:1 C5:1 r:1'
    clarinet = melodic(lead(mel_a, mel_a2, mel_b, mel_a2), bars * bpb, vel=84)
    fill = 'r:2 G4:.5 Bb4:.5 C5:.5 E5:.5'
    trumpet_text = lead('r:28', fill, 'r:28', 'r:2 E5:.5 G5:.5 E5:.5 C5:.5',
                        'C#5:4 C#5:4 C5:4 C5:4 B4:4 B4:4 Bb4:4 Bb4:4', 'r:28', fill)
    trumpet = melodic(trumpet_text, bars * bpb, vel=70)
    groove = {36: 'o...o...', 38: '..o...o.', 42: 'o.o.o.o.'}
    return check(Score('back-room', 'Back Room Stomp', 132, bpb, bars, seed=17, parts=[
        Part('clarinet', 71, clarinet, volume=90, pan=50, reverb=45, swing=0.3),
        Part('muted trumpet', 59, trumpet, volume=72, pan=82, reverb=45, swing=0.3),
        Part('stride piano', 0, pattern(ch, [(0, 'B', .5), (1, 'C', .5), (2, 'F', .5), (3, 'C', .5)], around=62, bass_around=43, vel=58), volume=80, pan=70, reverb=35),
        Part('tuba', 58, pattern(ch, [(0, 'B', .9), (2, 'F', .9)], bass_around=34, vel=70), volume=82, pan=56, reverb=30),
        Part('brushes', 0, drums(bpb, bars, groove, vel=52), drums=True, drum_kit=40, volume=70, reverb=35, swing=0.3),
    ]))


# ---------------------------------------------------------------- 8. The Desert Classic, 1972
# A casino-lounge bossa nova: vibraphone, electric piano, upright bass and
# drums with a side-stick clave. F major.

def desert_classic() -> Score:
    bpb, bars = 4, 32
    a = 'Fmaj7 | Fmaj7 | Gm7 | C7 | Am7 | D7 | Gm7 | C7'
    a2 = 'Fmaj7 | Fmaj7 | Gm7 | C7 | Am7 D7 | Gm7 C7 | F6 | F6'
    b = 'Bbmaj7 | Bbm6 | Am7 | D7 | Gm7 | C7 | Fmaj7 | Gm7 C7'
    ch = chords_by_bar(' | '.join([a, a2, b, a2]), bpb)
    mel_a = 'A5:1.5 G5:.5 E5:2 | r:.5 C5:.5 E5:.5 G5:.5 A5:2 | Bb5:1.5 A5:.5 F5:2 | r:.5 E5:.5 G5:.5 Bb5:.5 A5:1 G5:1 | C6:1.5 G5:.5 E5:2 | r:.5 F#5:.5 A5:.5 C6:.5 A5:2 | Bb5:1.5 F5:.5 D5:2 | E5:2 G5:2'
    mel_a2 = 'A5:1.5 G5:.5 E5:2 | r:.5 C5:.5 E5:.5 G5:.5 A5:2 | Bb5:1.5 A5:.5 G5:1 F5:1 | E5:1.5 D5:.5 C5:2 | E5:1 G5:1 F#5:1 A5:1 | G5:1 Bb5:1 E5:1 G5:1 | F5:4 | r:2 F5:.5 A5:.5 C6:1'
    mel_b = 'D6:2 A5:2 | Db6:2 G5:2 | C6:1.5 A5:.5 E5:2 | F#5:1.5 A5:.5 C6:2 | D6:1.5 C6:.5 Bb5:2 | Bb5:1 G5:1 E5:2 | A5:1 G5:1 E5:1 C5:1 | D5:1 F5:1 E5:1 G5:1'
    vibes = melodic(lead(mel_a, mel_a2, mel_b, mel_a2), bars * bpb, vel=78)
    groove = {37: 'x..x..x.', 42: 'oooooooo', 36: 'x..xx..x'}
    return check(Score('desert-classic', 'Neon After Midnight', 118, bpb, bars, seed=18, parts=[
        Part('vibraphone', 11, vibes, volume=90, pan=58, reverb=55),
        Part('electric piano', 4, pattern(ch, [(0, 'C', 1), (1.5, 'C', .5), (3, 'C', .5)], around=62, vel=54, size=4), volume=78, pan=78, reverb=45, chorus=50),
        Part('bass', 32, pattern(ch, [(0, 'B', 1.4), (1.5, 'F', .5), (2, 'F', 1.4), (3.5, 'B', .5)], bass_around=41, vel=74), volume=92, pan=60, reverb=25),
        Part('drums', 0, drums(bpb, bars, groove, vel=46), drums=True, drum_kit=40, volume=66, reverb=40),
    ]))


# ---------------------------------------------------------------- 9. The Cercle, 1992
# A musette waltz: accordion over a gypsy-jazz guitar and bass, for a Paris
# card club. A minor, with a C major middle.

def cercle() -> Score:
    bpb, bars = 3, 48
    a = 'Am | E7 | Am | A7 | Dm | Am | E7 | Am'
    a2 = 'Am | E7 | Am | A7 | Dm | Am | B7 E7 | Am'
    b = 'C | G7 | G7 | C | C | F | G7 | C'
    b2 = 'C | G7 | G7 | C | F | C | B7 | E7'
    ch = chords_by_bar(' | '.join([a, a2, b, b2, a, a2]), bpb)
    mel_a = 'E5:1 A5:1 C6:1 | B5:1.5 A5:.5 G#5:1 | A5:.5 B5:.5 C6:.5 B5:.5 A5:1 | G5:1 E5:1 C#5:1 | D5:1 F5:1 A5:1 | C6:1.5 B5:.5 A5:1 | G#5:.5 A5:.5 B5:.5 D6:.5 B5:.5 G#5:.5 | A5:2 E5:1'
    mel_a2 = mel_a.rsplit('|', 2)[0] + '| D#5:.5 F#5:.5 A5:.5 G#5:.5 B5:.5 D6:.5 | A5:3'
    mel_b = 'G5:1 C6:1 E6:1 | D6:1.5 C6:.5 B5:1 | F5:.5 G5:.5 A5:.5 B5:.5 D6:1 | C6:2 G5:1 | E5:1 G5:1 C6:1 | A5:1.5 G5:.5 F5:1 | D5:.5 E5:.5 F5:.5 G5:.5 B5:1 | C6:2 r:1'
    mel_b2 = mel_b.split('|')
    mel_b2 = '|'.join(mel_b2[:4]) + '| F5:1 A5:1 C6:1 | G5:1.5 E5:.5 C5:1 | D#5:1 F#5:1 A5:1 | G#5:1 B5:1 E5:1'
    accordion = melodic(lead(mel_a, mel_a2, mel_b, mel_b2, mel_a, mel_a2), bars * bpb, vel=76)
    return check(Score('cercle', 'Valse du Cercle', 150, bpb, bars, seed=19, parts=[
        Part('accordion', 21, accordion, volume=82, pan=56, reverb=50, chorus=30),
        Part('guitar', 24, pattern(ch, [(0, 'B', .9), (1, 'C', .45), (2, 'C', .45)], around=60, bass_around=45, vel=62), volume=90, pan=80, reverb=40),
        Part('bass', 32, pattern(ch, [(0, 'B', 1)], bass_around=38, vel=72), volume=88, pan=50, reverb=30),
    ]))


# ---------------------------------------------------------------- 10. The Boardwalk, 1995
# Late-night smooth jazz in a casino poker room: alto sax, electric piano,
# bass, a warm pad and a soft groove. D major.

def boardwalk() -> Score:
    bpb, bars = 4, 32
    a = 'Gmaj7 | F#m7 | Em7 | A7sus4 | Gmaj7 | F#m7 | Em7 | A7'
    b = 'Bm7 | Gmaj7 | Bm7 | Gmaj7 | Em7 | F#m7 | Gmaj7 | A7sus4'
    ch = chords_by_bar(' | '.join([a, a, b, a]), bpb)
    mel_a = 'F#5:1.5 E5:.5 D5:1 B4:1 | A4:.5 C#5:.5 E5:1 C#5:2 | B4:1.5 D5:.5 E5:1 G5:1 | E5:3 r:1 | F#5:1.5 A5:.5 B5:1 A5:1 | E5:1.5 C#5:.5 A4:2 | G5:1 F#5:1 E5:1 D5:1 | C#5:2 r:1 A4:1'
    mel_a2 = mel_a.rsplit('|', 2)[0] + '| G5:1 F#5:1 E5:1 G5:1 | A5:3 r:1'
    mel_b = 'D5:1 F#5:1 A5:1.5 B5:.5 | A5:2 F#5:2 | D5:1 F#5:1 A5:1 D6:1 | B5:2 F#5:2 | G5:1.5 F#5:.5 E5:1 D5:1 | C#5:1.5 E5:.5 A5:2 | B5:1 A5:1 F#5:1 D5:1 | E5:4'
    sax = melodic(lead(mel_a, mel_a2, mel_b, mel_a2), bars * bpb, vel=74, transpose=-12)
    groove = {36: 'x....x..', 37: '..x...x.', 42: 'oxoxoxox'}
    return check(Score('boardwalk', 'Boardwalk After Midnight', 88, bpb, bars, seed=20, parts=[
        Part('alto sax', 65, sax, volume=82, pan=56, reverb=55),
        Part('electric piano', 4, pattern(ch, [(0, 'C', 1.4), (1.5, 'C', .5), (2.5, 'C', 1.4)], around=60, vel=50, size=4), volume=80, pan=76, reverb=45, chorus=60),
        Part('pad', 89, pattern(ch, [(0, 'C', 4)], around=55, vel=40), volume=56, pan=40, reverb=60),
        Part('bass', 33, pattern(ch, [(0, 'B', 1.4), (1.5, 'B', .5), (2.5, 'F', .5), (3, 'B', .9)], bass_around=40, vel=72), volume=90, reverb=20),
        Part('drums', 0, drums(bpb, bars, groove, vel=48), drums=True, volume=66, reverb=30),
    ]))


# ---------------------------------------------------------------- 11. The Boom, 2005
# Downtempo electronica from the online-poker boom: marimba arpeggios, a
# synth pad, a soft lead and a drum machine. A minor.

def boom() -> Score:
    bpb, bars = 4, 32
    a = 'Am7 | Fmaj7 | C | G | Am7 | Fmaj7 | C | G'
    b = 'Dm7 | Am7 | Fmaj7 | G | Dm7 | Am7 | Fmaj7 | G'
    ch = chords_by_bar(' | '.join([a, a, b, a]), bpb)
    arp = [(i * .5, '1324'[i % 4], .45) for i in range(8)]
    hook = 'E5:1.5 D5:.5 C5:1 A4:1 | C5:4 | G5:1.5 F5:.5 E5:1 D5:1 | D5:4 | E5:1.5 D5:.5 C5:1 E5:1 | A5:4 | G5:1.5 E5:.5 D5:1 C5:1 | B4:2 D5:2'
    mel_b = 'F5:2 A5:2 | E5:3 C5:1 | A5:1.5 G5:.5 F5:1 E5:1 | D5:4 | F5:2 A5:2 | C6:3 A5:1 | A5:1.5 G5:.5 E5:1 C5:1 | D5:2 B4:2'
    lead_line = melodic(lead('r:32', hook, mel_b, hook), bars * bpb, vel=64)
    beat = {36: 'x..x.x..', 39: '..x...x.', 42: 'oooooooo'}
    hats_only = {42: 'o.o.o.o.'}
    return check(Score('boom', 'Dot Com Felt', 100, bpb, bars, seed=21, parts=[
        Part('lead', 80, lead_line, volume=56, pan=60, reverb=55, chorus=40),
        Part('marimba', 12, pattern(ch, arp, around=67, vel=56, size=4), volume=78, pan=80, reverb=45),
        Part('pad', 89, pattern(ch, [(0, 'C', 4)], around=60, vel=44, size=4), volume=64, pan=44, reverb=60),
        Part('synth bass', 38, pattern(ch, [(0, 'B', .75), (1.5, 'B', .5), (2, 'B', .75), (3.5, 'F', .5)], bass_around=36, vel=70), volume=78, reverb=15),
        Part('drum machine', 0, drums(bpb, bars, beat, vel=52, fills={i: hats_only for i in range(4)}), drums=True, drum_kit=25, volume=70, reverb=25),
    ]))


# ---------------------------------------------------------------- 12. The Big O, 2019
# A lo-fi piano beat for an English card room after last orders. E minor.

def big_o() -> Score:
    bpb, bars = 4, 24
    a = 'Cmaj7 | Bm7 | Am7 | D9 | Cmaj7 | Bm7 | Em7 | Em7'
    b = 'Am7 | D9 | Gmaj7 | Cmaj7 | F#m7b5 | B7 | Em7 | Em7'
    ch = chords_by_bar(' | '.join([a, b, a]), bpb)
    mel_a = 'E5:1 G5:1 B5:2 | A5:1.5 F#5:.5 D5:2 | C5:1 E5:1 G5:1.5 E5:.5 | F#5:3 r:1 | E5:1 G5:1 B5:1 D6:1 | A5:1.5 F#5:.5 D5:1 B4:1 | G4:1 B4:1 D5:1 E5:1 | B4:3 r:1'
    mel_b = 'C5:1 E5:1 A5:2 | F#5:1.5 E5:.5 D5:2 | B4:1 D5:1 F#5:2 | E5:1.5 D5:.5 B4:2 | A5:1 C6:1 E5:2 | D#5:1.5 F#5:.5 A5:2 | G5:1 F#5:1 E5:1 D5:1 | E5:3 r:1'
    right = melodic(lead(mel_a, mel_b, mel_a), bars * bpb, vel=66)
    strings = between(pattern(ch, [(0, 'C', 4)], around=57, vel=40), 32, 64)
    beat = {36: 'x....x..', 38: '..x...x.', 42: 'oooooooo'}
    return check(Score('big-o', 'Last Orders', 76, bpb, bars, seed=22, parts=[
        Part('piano melody', 0, right, volume=84, pan=60, reverb=55, swing=0.2),
        Part('piano chords', 0, pattern(ch, [(0, 'C', 2.2), (2.5, 'C', 1.4)], around=58, vel=46, size=4), volume=76, pan=70, reverb=55, swing=0.2),
        Part('strings', 48, strings, volume=58, pan=40, reverb=65),
        Part('bass', 33, pattern(ch, [(0, 'B', 1.8), (2.5, 'B', 1)], bass_around=40, vel=70), volume=86, reverb=20, swing=0.2),
        Part('drums', 0, drums(bpb, bars, beat, vel=42), drums=True, volume=62, reverb=30, swing=0.2),
    ]))


# ---------------------------------------------------------------- 13. The Last Table, today
# Night over the Cotai Strip in Macau: a koto line in a minor pentatonic over
# strings, bass and a slow taiko pulse. D minor.

def last_table() -> Score:
    bpb, bars = 4, 32
    a = 'Dm | Bb | F | C | Dm | Bb | F | C'
    b = 'Gm | Bb | Dm | C | Gm | Bb | Am | Am'
    ch = chords_by_bar(' | '.join([a, a, b, a]), bpb)
    mel_a = 'D5:.5 F5:.5 A5:1 G5:.5 F5:.5 D5:1 | F5:1.5 G5:.5 D5:2 | C6:1 A5:1 G5:1 F5:1 | G5:3 r:1 | A5:.5 C6:.5 D6:1 C6:.5 A5:.5 G5:1 | F5:1 D5:1 F5:1 G5:1 | A5:1.5 G5:.5 F5:1 C5:1 | C5:4'
    mel_a2 = mel_a.rsplit('|', 4)[0] + '| A5:.5 C6:.5 D6:1 F6:1 D6:1 | D6:2 C6:1 Bb5:1 | C6:1.5 A5:.5 G5:1 F5:1 | G5:2 C5:2'
    mel_b = 'D5:1 G5:1 A5:1 Bb5:1 | D6:2 C6:1 Bb5:1 | A5:3 F5:1 | G5:2 E5:2 | D5:1 G5:1 Bb5:1 D6:1 | F6:2 D6:2 | C6:1.5 A5:.5 E5:2 | A5:3 r:1'
    koto = melodic(lead(mel_a, mel_a2, mel_b, mel_a2), bars * bpb, vel=80)
    return check(Score('last-table', 'Cotai Lights', 92, bpb, bars, seed=23, parts=[
        Part('koto', 107, koto, volume=90, pan=60, reverb=60),
        Part('strings', 48, pattern(ch, [(0, 'C', 4)], around=57, vel=44), volume=64, pan=44, reverb=70),
        Part('bass', 33, pattern(ch, [(0, 'B', .9), (1.5, 'B', .4), (2, 'B', .9), (3, 'F', .9)], bass_around=38, vel=64), volume=82, reverb=20),
        Part('taiko', 116, pattern(ch, [(0, 'B', 1), (2.5, 'B', .5), (3, 'B', .5)], bass_around=36, vel=60), volume=66, reverb=50),
        Part('shaker', 0, drums(bpb, bars, {70: 'oooooooo', 42: '..o...o.'}, vel=40), drums=True, drum_kit=24, volume=56, reverb=30),
    ]))


# ---------------------------------------------------------------- 14. The Kitchen Table, today
# A warm, easy tune for a home game: strummed guitar, piano, bass and a shaker. G major.

def kitchen_table() -> Score:
    bpb, bars = 4, 32
    a = 'G | D/F# | Em | C | G | D | C | D'
    a2 = 'G | D/F# | Em | C | G | D | C D | G'
    b = 'Em | C | G | D | Em | C | Am7 | D'
    ch = chords_by_bar(' | '.join([a, a2, b, a2]), bpb)
    mel_a = 'B4:1 D5:1 G5:1.5 F#5:.5 | D5:1.5 E5:.5 F#5:2 | G5:1 E5:1 B4:2 | C5:1 E5:1 G5:2 | B5:1.5 A5:.5 G5:1 D5:1 | F#5:1.5 E5:.5 D5:1 A4:1 | E5:1 G5:1 E5:1 C5:1 | D5:3 r:1'
    mel_a2 = mel_a.rsplit('|', 2)[0] + '| E5:1 G5:1 F#5:1 A5:1 | G5:3 r:1'
    mel_b = 'B4:1 E5:1 G5:1.5 F#5:.5 | E5:1.5 D5:.5 C5:2 | D5:1 G5:1 B5:2 | A5:1.5 G5:.5 F#5:2 | G5:1 B5:1 E6:1.5 D6:.5 | C6:1.5 B5:.5 G5:2 | A5:1 G5:1 E5:1 C5:1 | D5:2 F#5:1 A5:1'
    piano = melodic(lead(mel_a, mel_a2, mel_b, mel_a2), bars * bpb, vel=70)
    strum = [(0, 'C', .9), (1, 'C', .4), (1.5, 'C', .4), (2.5, 'C', .4), (3, 'C', .4), (3.5, 'C', .4)]
    return check(Score('kitchen-table', 'Deal Me In', 96, bpb, bars, seed=24, parts=[
        Part('piano', 0, piano, volume=84, pan=58, reverb=45),
        Part('guitar', 25, pattern(ch, strum, around=57, vel=52, size=4), volume=82, pan=78, reverb=40),
        Part('bass', 32, pattern(ch, [(0, 'B', 1.5), (2, 'F', 1.5)], bass_around=40, vel=70), volume=88, reverb=20),
        Part('shaker', 0, drums(bpb, bars, {70: 'oxoxoxox', 36: 'o...o...'}, vel=44), drums=True, volume=58, reverb=30),
    ]))


SCORES = [
    riverboat(), painted_deck(), north_road(), camp(), last_hand(), gaming_house(), back_room(),
    desert_classic(), cercle(), boardwalk(), boom(), big_o(), last_table(), kitchen_table(),
]
