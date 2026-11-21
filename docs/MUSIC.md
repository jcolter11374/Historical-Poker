# Music

Every chapter has its own short music loop, in the sound of its time and place. All fourteen tunes are **original compositions written for this game**, so there is nothing to license and nobody to credit but the project. They are written as code, rendered with a free sampled-instrument soundfont, and saved as small MP3 loops.

The music sits quietly under the table, loops without a gap, and fades from one chapter to the next. The player can turn it off with "Music on" on the intro, the table and the ending, or the Music box on the chapter list. The setting is saved.

## The tunes

| Chapter | Tune | Sound | Key, time |
| --- | --- | --- | --- |
| 1 The River, 1836 | Moonlight on the Magnolia | Steamboat saloon waltz: fiddle, banjo, bass | G major, 3/4 |
| 2 The Painted Deck, 1543 | The Ashcombe Galliard | Tudor dance: recorder, lute, viol, tabor | D Dorian, 3/4 |
| 3 The North Road, 1763 | The Coaching Inn Jig | Taproom jig: fiddle (flute joins the second time), harpsichord, frame drum | D major, 6/8 |
| 4 The Camp, 1863 | Campfire on the Rappahannock | Slow air: harmonica, picked guitar, cello | D major, 4/4 |
| 5 The Last Hand, 1876 | Gold Dust Polka | Saloon upright piano | C major, 2/4 |
| Bonus The Gaming House, 1817 | Minuet on the Rue Royale | French minuet: violin, fortepiano, cello | D minor, 3/4 |
| 6 The Back Room, 1926 | Back Room Stomp | Hot jazz: clarinet, muted trumpet, stride piano, tuba, brushes | F major, swung 4/4 |
| 7 The Desert Classic, 1972 | Neon After Midnight | Casino-lounge bossa nova: vibraphone, electric piano, bass, brushes | F major, 4/4 |
| 8 The Cercle, 1992 | Valse du Cercle | Paris musette waltz: accordion, guitar, bass | A minor, 3/4 |
| 9 The Boardwalk, 1995 | Boardwalk After Midnight | Smooth jazz: alto sax, electric piano, pad, bass, soft groove | D major, 4/4 |
| 10 The Boom, 2005 | Dot Com Felt | Downtempo electronica: marimba arpeggios, pad, synth lead and bass, drum machine | A minor, 4/4 |
| 11 The Big O, 2019 | Last Orders | Lo-fi piano beat: piano, strings, bass, drums | E minor, 4/4 |
| 12 The Last Table, today | Cotai Lights | Macau at night: koto, strings, bass, taiko | D minor pentatonic, 4/4 |
| Epilogue The Kitchen Table, today | Deal Me In | Home game: piano, strummed guitar, bass, shaker | G major, 4/4 |

Each loop is 50 to 90 seconds and under about 1 MB (MP3, 96 kbps, stereo). Only the chapter being played is downloaded.

## Where things are

| What | Where |
| --- | --- |
| The scores (melodies, chords, instruments) | `tools/music/pieces.py`, one function per chapter |
| The renderer (score to MIDI to audio to MP3) | `tools/music/compose.py` |
| The loops the game plays | `public/music/<chapter-id>.mp3` |
| Each loop's title and exact length | `src/ui/music.json` (written by the renderer) |
| Which loop a chapter plays | `scene.music` in the chapter file, `music('<chapter-id>')` from `src/chapters/cast.ts` |
| Playing, looping, fading, on/off | `src/ui/sound.ts` (`playMusic`, `setMusicOn`) |

A stage with its own scene (the Boom's final table) keeps the chapter's music unless its scene names another loop.

## Changing a tune

You need Python 3 with `numpy` and `mido`, plus `fluidsynth`, `ffmpeg` and the FluidR3 General MIDI soundfont. On Debian or Ubuntu:

```bash
sudo apt install fluidsynth fluid-soundfont-gm ffmpeg
pip install numpy mido
```

Then edit the chapter's function in `tools/music/pieces.py` and render:

```bash
python3 tools/music/compose.py riverboat   # one chapter
python3 tools/music/compose.py             # all of them (about a minute)
python3 tools/music/compose.py --mid riverboat  # only write tools/music/riverboat.mid, to open in a sequencer
```

How a score reads:
- A melody is a string of `pitch:beats`: `'B4:1 D5:.5 G5:1.5 | r:1'` is B, then D for half a beat, G for a beat and a half, then a one-beat rest. `|` is a bar line, there to help reading. `E5+G5:1` plays two notes together.
- Chords are one per bar, `'G | D7 | Em C'`; two in a bar share it. Slash chords (`G/D`) set the bass note.
- `pattern(chords, steps, ...)` turns the chords into an accompaniment: a waltz, a strum, a stride piano. Each step is `(beat, what, length)`; `what` is `'B'` bass root, `'F'` bass fifth, `'C'` the whole chord, or `'1'`..`'4'` one chord note from the bottom.
- `drums(...)` takes one bar of steps per drum (`'x..o..x.'`: hit, rest, soft hit).
- Each `Part` names a General MIDI instrument number (0 piano, 21 accordion, 40 violin, 105 banjo, 110 fiddle; any GM chart lists them), and its volume, pan and reverb.

The renderer checks each melody is exactly as long as the piece. Keep new tunes original, or arrangements of music that is in the public domain. Don't copy a modern tune.

Listen to the loop round its seam (end back to the start) before committing, and check the loudness stays even with the others: the renderer brings every loop to the same level, quietly (`TARGET_RMS_DB` in `compose.py`); `MUSIC_VOLUME` in `sound.ts` sets how loud music plays under the table.

## Looping

An MP3 can't loop cleanly by itself: encoders add a few milliseconds of silence. So:
1. The renderer plays the score three times in a row and keeps the middle copy. Its start already holds the reverb tail of the copy before, so nothing is cut off at the seam.
2. It saves that copy plus half a second of what follows, and writes the exact loop length to `music.json`.
3. `sound.ts` decodes the file with Web Audio and loops just that length, skipping any encoder silence at the start.

## Licence

The tunes and their code are part of this project (MIT, like the rest). The instrument sounds come from the FluidR3 GM soundfont by Frank Wen, released under the MIT licence; it is used only to render the loops and is not shipped with the game. See [CREDITS.md](CREDITS.md).
