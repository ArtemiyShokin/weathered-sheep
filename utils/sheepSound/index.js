import * as Tone from "tone";

function tempToSemitones(temperature) {
  const normalized = (temperature + 90) / (90 + 57);
  return Math.round(-(normalized * 32 - 16));
}

function humidityToVibratoDepth(humidity) {
  return Math.min(humidity / 100, 1.0);
}

function humidityToFilterDepth(humidity) {
  return Math.min(humidity / 100, 1.0);
}

function humidityToFilterRate(humidity) {
  return 1 + Math.min(humidity / 100, 1.0) * 5;
}

function windToNoteDuration(wind) {
  const normalized = Math.min(wind / 50, 1.0);
  return 0.2 + normalized * 2.3;
}

let sampler, mVibrato, mAutoFilter, mLimiter;
let mp3Ready = null;

function buildMp3Chain() {
  if (!mp3Ready) {
    mVibrato = new Tone.Vibrato({ frequency: 4, depth: 0 });
    mAutoFilter = new Tone.AutoFilter({ frequency: 1, depth: 0 }).start();
    mLimiter = new Tone.Limiter(-3);
    sampler = new Tone.Sampler({
      urls: { C1: "/assets/sound-assets/sheep-sound-1.mp3" },
    });
    sampler.connect(mVibrato);
    mVibrato.connect(mAutoFilter);
    mAutoFilter.connect(mLimiter);
    mLimiter.toDestination();
    mp3Ready = Tone.loaded();
  }
  return mp3Ready;
}

let synth, sVibrato, sAutoFilter, sLimiter;
let synthReady = null;

function buildSynthChain() {
  if (!synthReady) {
    sVibrato = new Tone.Vibrato({ frequency: 4, depth: 0 });
    sAutoFilter = new Tone.AutoFilter({ frequency: 1, depth: 0 }).start();
    sLimiter = new Tone.Limiter(-3);
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.6 },
    });
    synth.connect(sVibrato);
    sVibrato.connect(sAutoFilter);
    sAutoFilter.connect(sLimiter);
    sLimiter.toDestination();
    synthReady = Promise.resolve();
  }
  return synthReady;
}

export function resetAudio() {
  [sampler, mVibrato, mAutoFilter, mLimiter].forEach((node) => {
    if (node)
      try {
        node.dispose();
      } catch (e) {}
  });
  sampler = mVibrato = mAutoFilter = mLimiter = null;
  mp3Ready = null;

  [synth, sVibrato, sAutoFilter, sLimiter].forEach((node) => {
    if (node)
      try {
        node.dispose();
      } catch (e) {}
  });
  synth = sVibrato = sAutoFilter = sLimiter = null;
  synthReady = null;
}

// const melodies = [
//   [
//     ["C4", 0],
//     ["G4", 0.6],
//   ],
//   [
//     ["A3", 0],
//     ["E4", 0.6],
//   ],
//   [
//     ["G3", 0],
//     ["D4", 0.6],
//   ],
//   [
//     ["E4", 0.3],
//     ["C4", 0.3],
//   ],
//   [
//     ["B3", 0.3],
//     ["C4", 0.3],
//   ],
// ];

const melodies = [
  [["A2", 0]],
  [["D3", 0]],
  [["F3", 0]],
  [["A3", 0]],
  [["C4", 0]],
  [["D4", 0]],
  [["F4", 0]],
  [["C5", 0]],
  [["A4", 0]],
];

export async function mp3Sound(humidity, wind, temperature) {
  if (
    !Number.isFinite(humidity) ||
    !Number.isFinite(wind) ||
    !Number.isFinite(temperature)
  )
    return;

  await Tone.start();
  if (Tone.context.state !== "running") return;

  await buildMp3Chain();
  if (!sampler) return;

  mVibrato.depth.value = humidityToVibratoDepth(humidity);
  mAutoFilter.depth.value = humidityToFilterDepth(humidity);
  mAutoFilter.frequency.value = humidityToFilterRate(humidity);

  const semitones = tempToSemitones(temperature);
  const noteDuration = windToNoteDuration(wind);
  const pitchedNote = new Tone.Frequency(24 + semitones, "midi").toNote();
  sampler.triggerAttackRelease(pitchedNote, noteDuration);
}

export async function synthSound(humidity, wind, temperature) {
  if (
    !Number.isFinite(humidity) ||
    !Number.isFinite(wind) ||
    !Number.isFinite(temperature)
  )
    return;

  await Tone.start();
  if (Tone.context.state !== "running") return;

  await buildSynthChain();
  if (!synth) return;

  sVibrato.depth.value = humidityToVibratoDepth(humidity);
  sAutoFilter.depth.value = humidityToFilterDepth(humidity);
  sAutoFilter.frequency.value = humidityToFilterRate(humidity);

  const semitones = tempToSemitones(temperature);
  const noteDuration = windToNoteDuration(wind);
  const melody = melodies[Math.floor(Math.random() * melodies.length)];

  melody.forEach(([note, time]) => {
    const transposed = new Tone.Frequency(note).transpose(semitones).toNote();
    synth.triggerAttackRelease(transposed, noteDuration, Tone.now() + time);
  });
}
