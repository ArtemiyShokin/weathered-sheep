export default function InfoBox({ sheep }) {
  return (
    <div>
      <article>hello sheep</article>
      <ul>
        {sheep.map((oneSheep) => (
          <li key={oneSheep.id}>
            <h1>{oneSheep.name}</h1>
            <p> {oneSheep.position[0]}</p>
            <p> {oneSheep.position[1]} </p>
            <p> {oneSheep.weatherLocation[0]}</p>
            <p> {oneSheep.weatherLocation[1]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
