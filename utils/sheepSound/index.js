import * as Tone from "tone";

const synth = new Tone.Synth();
console.log(Tone.context.state);

const feedbackDelay = new Tone.FeedbackDelay(1, 0.5);
synth.connect(feedbackDelay);
feedbackDelay.toDestination();

export default function sheepSound() {
  //   if (Tone.context.state !== "running")  KEEP (as a reminder)HERE UNTIL  TONE.JS WORKS WITH MP3 AND ALL INITIAL FILTERS
  //     Tone.start();
  //   }
  return synth.triggerAttackRelease("C3", "4n");
}
