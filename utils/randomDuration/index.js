export default function randomDuration(min, max) {
  return Math.random() * (max - min) + min;
}
