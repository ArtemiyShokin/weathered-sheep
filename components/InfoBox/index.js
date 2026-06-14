import { InfoBoxContainer, StyledMenuBar } from "./InfoBox.styled";
export default function InfoBox({ sheep }) {
  return (
    <InfoBoxContainer>
      <StyledMenuBar />
      <ul>
        {sheep.map((oneSheep) => (
          <li key={oneSheep.id}>
            <h1>{oneSheep.name}</h1>
            <p>lat: {oneSheep.position[0]}</p>
            <p>lng: {oneSheep.position[1]} </p>
            <p>temperature: {oneSheep.temperature} C</p>
            <p>wind-speed: {oneSheep.wind} km/h</p>
            <p>humidity: {oneSheep.humidity}%</p>
          </li>
        ))}
      </ul>
    </InfoBoxContainer>
  );
}
