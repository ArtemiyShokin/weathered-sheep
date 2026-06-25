import XIcon from "@/assets/x.svg";
import { useState } from "react";
import {
  StyledWindowContainer,
  StyledMenuBar,
  XButton,
  StyledListicle,
} from "../Global/Global.styled";
import { styledListItem } from "./InfoBox.styled";
import DeletionPopup from "@/components/DeletionPopup";

export default function InfoBox({ sheep, handleSheepDelete }) {
  const [sheepToDelete, setSheepToDelete] = useState(null);
  function handleConfirmationOpen(oneSheep) {
    setSheepToDelete(oneSheep);
  }
  function handleConfirmationClose() {
    setSheepToDelete(null);
  }

  return (
    <>
      {sheepToDelete && (
        <DeletionPopup
          sheepToDelete={sheepToDelete}
          onSheepDelete={() => {
            handleSheepDelete(sheepToDelete.id);
            handleConfirmationClose();
          }}
          onConfirmationToggle={handleConfirmationClose}
        />
      )}
      <StyledWindowContainer>
        <StyledMenuBar />
        <ul>
          {sheep.map((oneSheep) => (
            <StyledListicle key={oneSheep.id} $color={oneSheep.color}>
              <h2>🐑 {oneSheep.name}</h2>
              <p>lat: {oneSheep.infoPosition[0].toFixed(2)}</p>
              <p>lng: {oneSheep.infoPosition[1].toFixed(2)} </p>
              <p>temperature: {oneSheep.temperature}C</p>
              <p>wind-speed: {oneSheep.wind}km/h</p>
              <p>humidity: {oneSheep.humidity}%</p>
              <XButton
                onClick={() => handleConfirmationOpen(oneSheep)}
                aria-label={`Delete ${oneSheep.name}`}
              >
                <XIcon width="10px" height="8px" fill="var(--huemint4)" />{" "}
              </XButton>
            </StyledListicle>
          ))}
        </ul>
      </StyledWindowContainer>
    </>
  );
}
