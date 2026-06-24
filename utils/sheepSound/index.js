import * as Tone from "tone";
import {
  normalizeToPointDecimal,
  convertTo16bitRange,
  normalizeForSemitones,
} from "../calculationFunctions";

let sampler;
let samplerReady;
let synth;
// OPTION MP3:

function getSampler() {
  if (!sampler) {
    sampler = new Tone.Sampler({
      urls: { C1: "/assets/sound-assets/sheep-sound-1.mp3" },
    });
    samplerReady = Tone.loaded();
  }
  return samplerReady;
}

export async function mp3Sound(humidity, wind, temperature) {
  await Tone.start();
  await getSampler();

  const feedbackDelay = new Tone.FeedbackDelay();
  const bitCrusher = new Tone.BitCrusher();
  const pitch = new Tone.PitchShift();

  sampler.connect(feedbackDelay);
  feedbackDelay.connect(bitCrusher);
  bitCrusher.connect(pitch);
  pitch.toDestination();

  feedbackDelay.delayTime.value = normalizeToPointDecimal(humidity);
  feedbackDelay.feedback.value = normalizeToPointDecimal(wind);
  bitCrusher.bits.value = convertTo16bitRange(temperature, -89, 57);
  pitch.pitch = normalizeForSemitones(temperature);
  sampler.triggerAttackRelease("C1");

  setTimeout(() => {
    feedbackDelay.dispose();
    bitCrusher.dispose();
    pitch.dispose();
  }, 8000);
}

// OPTION MELODY:
function getSynth() {
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "triangle",
      },
      envelope: {
        attack: 0.05,
        decay: 0.2,
        sustain: 0.3,
        release: 0.6,
      },
    });
  }

  return synth;
}

export async function synthSound(humidity, wind, temperature) {
  await Tone.start();
  await getSynth();

  const feedbackDelay = new Tone.FeedbackDelay();
  const bitCrusher = new Tone.BitCrusher();
  const pitch = new Tone.PitchShift();
  const vibrato = new Tone.Vibrato();

  synth.connect(feedbackDelay);
  feedbackDelay.connect(bitCrusher);
  bitCrusher.connect(vibrato);
  vibrato.connect(pitch);
  pitch.toDestination();

  feedbackDelay.delayTime.value = normalizeToPointDecimal(humidity);
  feedbackDelay.feedback.value = normalizeToPointDecimal(wind);
  bitCrusher.bits.value = convertTo16bitRange(temperature, -89, 57);
  pitch.pitch = normalizeForSemitones(temperature);

  vibrato.frequency.value = 5;
  vibrato.depth.value = 0.3;

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

  const melody = melodies[Math.floor(Math.random() * melodies.length)];

  melody.forEach(([note, time]) => {
    synth.triggerAttackRelease(note, "8n", Tone.now() + time);
  });

  setTimeout(() => {
    feedbackDelay.dispose();
    bitCrusher.dispose();
    pitch.dispose();
  }, 8000);
}
