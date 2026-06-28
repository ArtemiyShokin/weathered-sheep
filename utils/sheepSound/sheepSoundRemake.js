import * as Tone from "tone";

function tempToSemitones(temperature) {
  // cold = high pitch, hot = low pitch; -90°C → +16, +57°C → -16
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
  // 0% → 1Hz, 100% → 6Hz
  return 1 + Math.min(humidity / 100, 1.0) * 5;
}

function windToNoteDuration(wind) {
  // 0 m/s → 0.2s, 50 m/s → 2.5s
  const normalized = Math.min(wind / 50, 1.0);
  return 0.2 + normalized * 2.3;
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
  [synth, sVibrato, sAutoFilter, sLimiter].forEach((node) => {
    if (node)
      try {
        node.dispose();
      } catch (e) {}
  });
  synth = sVibrato = sAutoFilter = sLimiter = null;
  synthReady = null;
}

const melodies = [
  [
    ["C4", 0],
    ["E4", 0.3],
    ["G4", 0.6],
  ],
  [
    ["A3", 0],
    ["C4", 0.3],
    ["E4", 0.6],
  ],
  [
    ["G3", 0],
    ["B3", 0.3],
    ["D4", 0.6],
  ],
];

export async function newSynthSound(humidity, wind, temperature) {
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
