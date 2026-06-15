import * as Tone from "tone";

const synth = new Tone.Synth();
console.log(Tone.context.state);

export default function sheepSound(humidity, wind) {
  function numberToDecimal(number) {
    if (number > 200) {
      return number / 300;
    }
    if (number > 100) {
      return number / 200;
    }
    return number / 100;
  }
  const humidityDecimated = numberToDecimal(humidity);
  const windDecimated = numberToDecimal(wind);

  const feedbackDelay = new Tone.FeedbackDelay(
    humidityDecimated,
    windDecimated
  );
  synth.connect(feedbackDelay);
  feedbackDelay.toDestination();
  //   if (Tone.context.state !== "running")  KEEP (as a reminder)HERE UNTIL  TONE.JS WORKS WITH MP3 AND ALL INITIAL FILTERS
  //     Tone.start();
  //   }
  return synth.triggerAttackRelease("C3", "4n");
}
