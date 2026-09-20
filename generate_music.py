#!/usr/bin/env python3
"""
Generates the upbeat synth-pop / disco retro science theme song matching the uploaded audio:
- 124 BPM, 16-bar looping structure (~31.0 seconds)
- Punchy kick drum, crisp snare + clap on 2 & 4, 16th hi-hats
- Bouncy syncopated octave synth bass in E minor
- Polysynth chord stabs (Em - C - G - D progression)
- Energetic catchy synth melody with vibrato and glide
- Cosmic sparkling stereo arpeggiator
- Encodes to high-quality MP3 with ffmpeg
"""

import math
import struct
import wave
import subprocess
import os

SAMPLE_RATE = 44100
BPM = 124.0
BEAT_DUR = 60.0 / BPM  # ~0.48387s
SIXTEENTH = BEAT_DUR / 4.0
TOTAL_BARS = 16
TOTAL_BEATS = TOTAL_BARS * 4
TOTAL_DURATION = TOTAL_BEATS * BEAT_DUR  # ~30.9677s
TOTAL_SAMPLES = int(SAMPLE_RATE * TOTAL_DURATION)

# Left and Right channel float buffers
buf_left = [0.0] * TOTAL_SAMPLES
buf_right = [0.0] * TOTAL_SAMPLES

def note_to_freq(note_name):
    # e.g., 'E3', 'A4', 'F#5'
    scale = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
             'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
             'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}
    name = note_name[:-1]
    octave = int(note_name[-1])
    semitones = scale[name] + (octave + 1) * 12
    return 440.0 * (2.0 ** ((semitones - 69) / 12.0))

# 1. DRUMS (Kick, Snare, Hi-Hats, Crash)
print("Rendering drum tracks...")
for beat in range(TOTAL_BEATS):
    beat_time = beat * BEAT_DUR
    sample_idx = int(beat_time * SAMPLE_RATE)
    
    # Four on the floor Kick drum
    for i in range(int(0.22 * SAMPLE_RATE)):
        idx = sample_idx + i
        if idx >= TOTAL_SAMPLES: break
        t = i / SAMPLE_RATE
        # Pitch drops quickly from 150Hz to 45Hz
        freq = 150.0 * math.exp(-t * 28.0) + 42.0
        phase = 2.0 * math.pi * freq * t
        env = math.exp(-t * 18.0)
        sample = math.sin(phase) * env * 0.75
        # Add subtle click
        if t < 0.005:
            sample += (1.0 - t / 0.005) * 0.35
        buf_left[idx] += sample
        buf_right[idx] += sample

    # Snare on beats 2 and 4 (beat % 4 == 1 or 3)
    if beat % 4 in (1, 3):
        for i in range(int(0.24 * SAMPLE_RATE)):
            idx = sample_idx + i
            if idx >= TOTAL_SAMPLES: break
            t = i / SAMPLE_RATE
            env = math.exp(-t * 16.0)
            # Tonal snap + noise burst
            tone = math.sin(2.0 * math.pi * (185.0 * math.exp(-t * 20.0) + 140.0) * t) * 0.4
            noise = ((math.sin(i * 12345.67) * 43758.5453) % 2.0 - 1.0) * 0.55
            sample = (tone + noise) * env * 0.65
            buf_left[idx] += sample
            buf_right[idx] += sample

    # 16th note Hi-Hats
    for sub in range(4):
        hat_idx = int((beat_time + sub * SIXTEENTH) * SAMPLE_RATE)
        is_open = (sub == 2)  # off-beat open hat for that groovy dance rhythm
        dur = 0.12 if is_open else 0.045
        vol = 0.30 if is_open else (0.16 if sub % 2 == 0 else 0.11)
        decay = 24.0 if is_open else 95.0
        
        for i in range(int(dur * SAMPLE_RATE)):
            idx = hat_idx + i
            if idx >= TOTAL_SAMPLES: break
            t = i / SAMPLE_RATE
            env = math.exp(-t * decay)
            # High-passed metallic noise
            noise = ((math.sin(i * 9876.54 + sub) * 32145.67) % 2.0 - 1.0)
            metallic = math.sin(2.0 * math.pi * 7800.0 * t) * 0.3 + math.sin(2.0 * math.pi * 9400.0 * t) * 0.2
            sample = (noise * 0.7 + metallic * 0.3) * env * vol
            buf_left[idx] += sample * 0.9
            buf_right[idx] += sample * 1.1

# 2. FUNKY SYNTH BASS (Bouncy 16th-note octaves)
print("Rendering funky synth bass...")
# 16-bar bass progression in E minor (Em - C - G - D / Em - C - Am - Bm)
bass_chords = [
    # Bars 1-4
    'E2', 'E2', 'C2', 'C2',
    # Bars 5-8
    'G2', 'G2', 'D2', 'D2',
    # Bars 9-12
    'E2', 'E2', 'C2', 'C2',
    # Bars 13-16
    'A2', 'A2', 'B2', 'B2'
]

for bar in range(TOTAL_BARS):
    root_note = bass_chords[bar]
    root_f = note_to_freq(root_note)
    octave_f = root_f * 2.0
    bar_time = bar * 4 * BEAT_DUR

    # Funky 16-step octave pattern per bar
    # 1: root, 2: root, 3: octave, 4: root, 5: octave, 6: root...
    pattern = [
        (0, root_f, 0.7), (2, root_f, 0.6), (3, octave_f, 0.9),
        (4, root_f, 0.7), (6, octave_f, 0.8), (7, root_f, 0.5),
        (8, root_f, 0.7), (10, root_f, 0.6), (11, octave_f, 0.9),
        (12, root_f, 0.7), (14, octave_f, 0.85), (15, root_f * 1.122, 0.7) # slide up
    ]

    for step, freq, velocity in pattern:
        note_time = bar_time + step * SIXTEENTH
        start_idx = int(note_time * SAMPLE_RATE)
        dur = SIXTEENTH * 0.85
        samples_count = int(dur * SAMPLE_RATE)

        for i in range(samples_count):
            idx = start_idx + i
            if idx >= TOTAL_SAMPLES: break
            t = i / SAMPLE_RATE
            # Analog sawtooth with low-pass filter decay
            phase = 2.0 * math.pi * freq * t
            saw = 2.0 * (t * freq - math.floor(t * freq + 0.5))
            square = 1.0 if math.sin(phase) > 0 else -1.0
            env = math.exp(-t * 14.0)
            sample = (saw * 0.6 + square * 0.4) * env * velocity * 0.38
            # Bass centered
            buf_left[idx] += sample
            buf_right[idx] += sample

# 3. POLYSYNTH CHORD STABS (Warm disco-synth offbeats)
print("Rendering polysynth chords...")
chords_by_bar = [
    # Em, Em, Cmaj7, Cmaj7
    ['E3', 'G3', 'B3', 'E4'], ['E3', 'G3', 'B3', 'E4'],
    ['C3', 'E3', 'G3', 'B3'], ['C3', 'E3', 'G3', 'B3'],
    # G, G, D, D
    ['G3', 'B3', 'D4', 'G4'], ['G3', 'B3', 'D4', 'G4'],
    ['D3', 'F#3', 'A3', 'D4'], ['D3', 'F#3', 'A3', 'D4'],
    # Em, Em, C, C
    ['E3', 'G3', 'B3', 'E4'], ['E3', 'G3', 'B3', 'E4'],
    ['C3', 'E3', 'G3', 'C4'], ['C3', 'E3', 'G3', 'C4'],
    # Am, Am, Bm7, B7
    ['A3', 'C4', 'E4', 'A4'], ['A3', 'C4', 'E4', 'A4'],
    ['B3', 'D#4', 'F#4', 'B4'], ['B3', 'D#4', 'F#4', 'B4'],
]

for bar in range(TOTAL_BARS):
    notes = [note_to_freq(n) for n in chords_by_bar[bar]]
    bar_time = bar * 4 * BEAT_DUR
    # Stabs on off-beats: 0.5, 1.5, 2.5, 3.5
    for beat_off in [0.5, 1.5, 2.5, 3.5]:
        stab_time = bar_time + beat_off * BEAT_DUR
        start_idx = int(stab_time * SAMPLE_RATE)
        dur = SIXTEENTH * 1.8
        for i in range(int(dur * SAMPLE_RATE)):
            idx = start_idx + i
            if idx >= TOTAL_SAMPLES: break
            t = i / SAMPLE_RATE
            env = math.exp(-t * 9.0)
            chord_sig = 0.0
            for f in notes:
                # Detuned saw waves for rich lush analog chorus
                p1 = 2.0 * math.pi * f * t
                p2 = 2.0 * math.pi * (f * 1.004) * t
                chord_sig += (math.sin(p1) + math.sin(p2) * 0.8) * 0.25
            sample = chord_sig * env * 0.18
            buf_left[idx] += sample * 0.85
            buf_right[idx] += sample * 1.15

# 4. CATCHY RETRO SYNTH LEAD MELODY
print("Rendering synth lead melody...")
# 16-bar melodic theme
melody_notes = [
    # Bar 1-2: Intro hook
    (0.0, 'B4', 0.5), (0.5, 'E5', 1.0), (1.5, 'F#5', 0.5), (2.0, 'G5', 1.5),
    (4.0, 'F#5', 0.5), (4.5, 'E5', 0.5), (5.0, 'D5', 1.0), (6.0, 'B4', 1.5),
    # Bar 3-4: Ascent
    (8.0, 'C5', 0.5), (8.5, 'D5', 0.5), (9.0, 'E5', 1.0), (10.0, 'G5', 1.5),
    (12.0, 'F#5', 1.0), (13.0, 'E5', 1.0), (14.0, 'D#5', 1.8),
    # Bar 5-6: Main Theme B
    (16.0, 'E5', 0.75), (17.0, 'G5', 0.75), (18.0, 'B5', 1.5),
    (20.0, 'A5', 0.5), (20.5, 'G5', 0.5), (21.0, 'F#5', 1.0), (22.0, 'D5', 1.5),
    # Bar 7-8: Resolution
    (24.0, 'E5', 0.5), (24.5, 'F#5', 0.5), (25.0, 'G5', 1.0), (26.0, 'B4', 1.0),
    (27.0, 'C5', 0.5), (27.5, 'D5', 0.5), (28.0, 'E5', 2.0), (30.0, 'D5', 0.5), (30.5, 'B4', 0.5),
    # Bar 9-10: Climax high octave hook
    (32.0, 'B5', 0.5), (32.5, 'E6', 1.0), (33.5, 'F#6', 0.5), (34.0, 'G6', 1.5),
    (36.0, 'F#6', 0.5), (36.5, 'E6', 0.5), (37.0, 'D6', 1.0), (38.0, 'B5', 1.5),
    # Bar 11-12: High sparkle run
    (40.0, 'C6', 0.5), (40.5, 'D6', 0.5), (41.0, 'E6', 1.0), (42.0, 'G6', 1.5),
    (44.0, 'F#6', 1.0), (45.0, 'A6', 1.0), (46.0, 'B6', 2.0),
    # Bar 13-14: Groovy breakdown riff
    (48.0, 'G5', 0.5), (48.5, 'E5', 0.5), (49.0, 'B4', 0.5), (49.5, 'E5', 0.5),
    (50.0, 'G5', 0.5), (50.5, 'A5', 0.5), (51.0, 'B5', 1.0),
    (52.0, 'A5', 0.5), (52.5, 'G5', 0.5), (53.0, 'F#5', 0.5), (53.5, 'E5', 0.5), (54.0, 'D#5', 1.8),
    # Bar 15-16: Loop turnaround
    (56.0, 'E5', 0.5), (56.5, 'G5', 0.5), (57.0, 'B5', 0.5), (57.5, 'D6', 0.5),
    (58.0, 'E6', 1.5), (60.0, 'D6', 0.5), (60.5, 'B5', 0.5), (61.0, 'A5', 0.5), (61.5, 'G5', 0.5),
    (62.0, 'F#5', 0.75), (62.75, 'D#5', 0.75), (63.5, 'E5', 0.5)
]

for beat_pos, note_name, dur_beats in melody_notes:
    start_time = beat_pos * BEAT_DUR
    f = note_to_freq(note_name)
    dur_sec = dur_beats * BEAT_DUR
    start_idx = int(start_time * SAMPLE_RATE)
    num_samples = int(dur_sec * SAMPLE_RATE)

    for i in range(num_samples):
        idx = start_idx + i
        if idx >= TOTAL_SAMPLES: break
        t = i / SAMPLE_RATE
        # ADSR Envelope
        attack = 0.015
        if t < attack:
            env = t / attack
        else:
            env = math.exp(-(t - attack) * (1.8 / max(0.2, dur_sec)))
        
        # Vibrato (5.5 Hz)
        vibrato = math.sin(2.0 * math.pi * 5.5 * t) * 4.0 if t > 0.15 else 0.0
        cur_f = f + vibrato
        phase = 2.0 * math.pi * cur_f * t
        
        # Layered lead timbre: bright pulse + square + sub
        saw = 2.0 * (t * cur_f - math.floor(t * cur_f + 0.5))
        pulse = 1.0 if (t * cur_f % 1.0) < 0.35 else -1.0
        sine = math.sin(phase)
        lead_sample = (saw * 0.45 + pulse * 0.35 + sine * 0.2) * env * 0.22
        
        # Stereo ping-pong delay / pan
        pan = 0.5 + 0.25 * math.sin(beat_pos * 0.5)
        buf_left[idx] += lead_sample * (1.0 - pan)
        buf_right[idx] += lead_sample * pan

        # Soft echo delay (3 sixteenths later)
        delay_idx = idx + int(3 * SIXTEENTH * SAMPLE_RATE)
        if delay_idx < TOTAL_SAMPLES:
            buf_left[delay_idx] += lead_sample * 0.25 * pan
            buf_right[delay_idx] += lead_sample * 0.25 * (1.0 - pan)

# 5. COSMIC ARPEGGIATOR (Sparkling high 16th notes)
print("Rendering sparkling cosmic arpeggios...")
arp_scales = [
    ['E5', 'G5', 'B5', 'E6', 'G6', 'E6', 'B5', 'G5'],
    ['C5', 'E5', 'G5', 'C6', 'E6', 'C6', 'G5', 'E5'],
    ['G5', 'B5', 'D6', 'G6', 'B6', 'G6', 'D6', 'B5'],
    ['D5', 'F#5', 'A5', 'D6', 'F#6', 'D6', 'A5', 'F#5']
]

for step in range(TOTAL_BARS * 16):
    bar = step // 16
    arp_prog = arp_scales[(bar // 2) % len(arp_scales)]
    note_name = arp_prog[step % len(arp_prog)]
    f = note_to_freq(note_name)
    step_time = step * SIXTEENTH
    start_idx = int(step_time * SAMPLE_RATE)
    dur = SIXTEENTH * 0.8
    num_samples = int(dur * SAMPLE_RATE)

    for i in range(num_samples):
        idx = start_idx + i
        if idx >= TOTAL_SAMPLES: break
        t = i / SAMPLE_RATE
        env = math.exp(-t * 22.0)
        phase = 2.0 * math.pi * f * t
        bell = (math.sin(phase) + math.sin(phase * 2.0) * 0.35 + math.sin(phase * 3.0) * 0.15)
        sample = bell * env * 0.075
        # Alternating stereo pan
        if step % 2 == 0:
            buf_left[idx] += sample * 0.9
            buf_right[idx] += sample * 0.2
        else:
            buf_left[idx] += sample * 0.2
            buf_right[idx] += sample * 0.9

# 6. MASTERING & SOFT LIMITER
print("Mastering and peak limiting...")
max_peak = 0.001
for i in range(TOTAL_SAMPLES):
    max_peak = max(max_peak, abs(buf_left[i]), abs(buf_right[i]))

print(f"Original peak: {max_peak:.3f}")
# Target 0.92 normalization
norm_gain = 0.92 / max_peak

# Smooth soft clipping limiter to prevent any distortion
def soft_clip(x):
    if x > 1.0: return 1.0
    if x < -1.0: return -1.0
    return 1.5 * x - 0.5 * (x ** 3)

# Write to 16-bit stereo WAV
wav_path = "/tmp/science_theme.wav"
print(f"Writing WAV to {wav_path}...")
with wave.open(wav_path, "wb") as wav_file:
    wav_file.setnchannels(2)
    wav_file.setsampwidth(2)
    wav_file.setframerate(SAMPLE_RATE)
    frames = bytearray()
    for i in range(TOTAL_SAMPLES):
        l = soft_clip(buf_left[i] * norm_gain)
        r = soft_clip(buf_right[i] * norm_gain)
        sample_l = int(l * 32767.0)
        sample_r = int(r * 32767.0)
        frames.extend(struct.pack("<hh", sample_l, sample_r))
    wav_file.writeframes(frames)

os.makedirs("/app/applet/public/audio", exist_ok=True)
mp3_out = "/app/applet/public/audio/science-theme.mp3"
mp3_root = "/app/applet/public/theme.mp3"

print("Encoding MP3 with ffmpeg...")
cmd = ["ffmpeg", "-y", "-i", wav_path, "-codec:a", "libmp3lame", "-qscale:a", "2", mp3_out]
subprocess.run(cmd, check=True)

# Also create copy at root /public/theme.mp3
cmd2 = ["cp", mp3_out, mp3_root]
subprocess.run(cmd2, check=True)

print("Audio generation complete! Files created:")
print(f"- {mp3_out}")
print(f"- {mp3_root}")
