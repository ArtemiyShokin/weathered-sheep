import XIcon from "@/assets/x.svg";
import {
  StyledWindowContainer,
  StyledMenuBar,
  XButton,
} from "../Global/Global.styled";
export default function InfoBox({ sheep, onSheepDelete }) {
  return (
    <StyledWindowContainer>
      <StyledMenuBar />
      <ul>
        {sheep.map((oneSheep) => (
          <li key={oneSheep.id}>
            <h2>🐑 {oneSheep.name}</h2>
            <p>lat: {oneSheep.position[0]}</p>
            <p>lng: {oneSheep.position[1]} </p>
            <p>temperature: {oneSheep.temperature}C</p>
            <p>wind-speed: {oneSheep.wind}km/h</p>
            <p>humidity: {oneSheep.humidity}%</p>
            <XButton onClick={() => onSheepDelete(oneSheep.id)}>
              {" "}
              <XIcon width="10px" height="8px" fill="var(--huemint4)" />{" "}
            </XButton>
          </li>
        ))}
      </ul>
    </StyledWindowContainer>
  );
}
