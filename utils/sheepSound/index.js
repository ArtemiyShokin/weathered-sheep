import * as Tone from "tone";
import {
  normalizeToPointDecimal,
  convertTo16bitRange,
  normalizeForSemitones,
} from "../calculationFunctions";

const sampler = new Tone.Sampler({
  urls: { C1: "/assets/sound-assets/sheep-sound-1.mp3" },
});
const feedbackDelay = new Tone.FeedbackDelay();
const bitCrusher = new Tone.BitCrusher();
const pitch = new Tone.PitchShift();

sampler.connect(feedbackDelay);
feedbackDelay.connect(bitCrusher);
bitCrusher.connect(pitch);
pitch.toDestination();

export default function sheepSound(humidity, wind, temperature) {
  feedbackDelay.delayTime.value = normalizeToPointDecimal(humidity);

  feedbackDelay.feedback.value = normalizeToPointDecimal(wind);

  bitCrusher.bits.value = convertTo16bitRange(temperature, -10, 50); // -89.2, 56.7: actual min and max temperature recorded on earth so far, adapt for more distinguished effects

  pitch.pitch = normalizeForSemitones(temperature);

  sampler.triggerAttackRelease("C1");
}
