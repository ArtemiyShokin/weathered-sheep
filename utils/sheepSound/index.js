import * as Tone from "tone";
import {
  normalizeToPointDecimal,
  convertTo16bitRange,
  normalizeForSemitones,
} from "../calculationFunctions";

function vibratoDepth(humidity) {
  return Math.min(normalizeToPointDecimal(humidity), 0.4);
}

function echoFeedback(wind) {
  return Math.min(normalizeToPointDecimal(wind), 0.5);
}

function overdriveAmount(temperature) {
  const order = Math.max(1, Math.min(convertTo16bitRange(temperature, -89, 57), 16));
  return ((order - 1) / 15) * 0.35;
}

// ---- MP3 chain (built once, reused for every sheep) ----
let sampler, vibrato, echo, overdrive, limiter;
let mp3Ready = null;

function buildMp3Chain() {
  if (!mp3Ready) {
    vibrato = new Tone.Vibrato({ frequency: 4, depth: 0 });
    echo = new Tone.FeedbackDelay({ delayTime: 0.3, feedback: 0 });
    overdrive = new Tone.Distortion(0);
    limiter = new Tone.Limiter(-3);
    sampler = new Tone.Sampler({
      urls: { C1: "/assets/sound-assets/sheep-sound-1.mp3" },
    });
    sampler.connect(vibrato);
    vibrato.connect(echo);
    echo.connect(overdrive);
    overdrive.connect(limiter);
    limiter.toDestination();
    mp3Ready = Tone.loaded();
  }
  return mp3Ready;
}

// ---- Synth chain (built once, reused for every sheep) ----
let synth, sVibrato, sEcho, sOverdrive, sLimiter;
let synthReady = null;

function buildSynthChain() {
  if (!synthReady) {
    sVibrato = new Tone.Vibrato({ frequency: 4, depth: 0 });
    sEcho = new Tone.FeedbackDelay({ delayTime: 0.3, feedback: 0 });
    sOverdrive = new Tone.Distortion(0);
    sLimiter = new Tone.Limiter(-3);
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.6 },
    });
    synth.connect(sVibrato);
    sVibrato.connect(sEcho);
    sEcho.connect(sOverdrive);
    sOverdrive.connect(sLimiter);
    sLimiter.toDestination();
    synthReady = Promise.resolve();
  }
  return synthReady;
}

export function resetAudio() {
  [sampler, vibrato, echo, overdrive, limiter].forEach((node) => {
    if (node) try { node.dispose(); } catch (e) {}
  });
  sampler = vibrato = echo = overdrive = limiter = null;
  mp3Ready = null;

  [synth, sVibrato, sEcho, sOverdrive, sLimiter].forEach((node) => {
    if (node) try { node.dispose(); } catch (e) {}
  });
  synth = sVibrato = sEcho = sOverdrive = sLimiter = null;
  synthReady = null;
}

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
  if (!sampler) return; // resetAudio was called while loading

  vibrato.depth.value = vibratoDepth(humidity);
  echo.feedback.value = echoFeedback(wind);
  overdrive.distortion = overdriveAmount(temperature);

  const semitones = normalizeForSemitones(temperature);
  const pitchedNote = new Tone.Frequency(24 + semitones, "midi").toNote();
  sampler.triggerAttackRelease(pitchedNote);
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
  if (!synth) return; // resetAudio was called while loading

  sVibrato.depth.value = vibratoDepth(humidity);
  sEcho.feedback.value = echoFeedback(wind);
  sOverdrive.distortion = overdriveAmount(temperature);

  const semitones = normalizeForSemitones(temperature);
  const melodies = [
    [["C4", 0], ["E4", 0.3], ["G4", 0.6]],
    [["A3", 0], ["C4", 0.3], ["E4", 0.6]],
    [["G3", 0], ["B3", 0.3], ["D4", 0.6]],
  ];
  const melody = melodies[Math.floor(Math.random() * melodies.length)];

  melody.forEach(([note, time]) => {
    const transposed = new Tone.Frequency(note).transpose(semitones).toNote();
    synth.triggerAttackRelease(transposed, "8n", Tone.now() + time);
  });
}
