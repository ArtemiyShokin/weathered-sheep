import * as Tone from "tone";

export default function sheepSound() {
  const synth = new Tone.Synth().toDestination();

  return synth.triggerAttackRelease("C4", "8n");
}
