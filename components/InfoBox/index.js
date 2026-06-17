import { StyledWindowContainer, StyledMenuBar } from "../Global/Global.styled";
export default function InfoBox({ sheep }) {
  return (
    <StyledWindowContainer>
      <StyledMenuBar />
      <ul>
        {sheep.map((oneSheep) => (
          <li key={oneSheep.id}>
            <h2>{oneSheep.name}</h2>
            <p>lat: {oneSheep.position[0]}</p>
            <p>lng: {oneSheep.position[1]} </p>
            <p>temperature: {oneSheep.temperature}C</p>
            <p>wind-speed: {oneSheep.wind}km/h</p>
            <p>humidity: {oneSheep.humidity}%</p>
          </li>
        ))}
      </ul>
    </StyledWindowContainer>
  );
}
