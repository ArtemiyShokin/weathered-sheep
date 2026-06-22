import * as Tone from "tone";
import {
  normalizeToPointDecimal,
  convertTo16bitRange,
  normalizeForSemitones,
} from "../calculationFunctions";

let sampler, feedbackDelay, bitCrusher, pitch;
let loadPromise;

function initAudio() {
  if (sampler) return;

  sampler = new Tone.Sampler({
    urls: { C1: "/assets/sound-assets/sheep-sound-1.mp3" },
  });
  feedbackDelay = new Tone.FeedbackDelay();
  bitCrusher = new Tone.BitCrusher();
  pitch = new Tone.PitchShift();

  sampler.connect(feedbackDelay);
  feedbackDelay.connect(bitCrusher);
  bitCrusher.connect(pitch);
  pitch.toDestination();

  loadPromise = Tone.loaded();
}

export default async function sheepSound(humidity, wind, temperature) {
  await Tone.start();
  initAudio();
  await loadPromise;

  feedbackDelay.delayTime.value = normalizeToPointDecimal(humidity);
  feedbackDelay.feedback.value = normalizeToPointDecimal(wind);
  bitCrusher.bits.value = convertTo16bitRange(temperature, -89, 57);
  pitch.pitch = normalizeForSemitones(temperature);
  sampler.triggerAttackRelease("C1");
}
