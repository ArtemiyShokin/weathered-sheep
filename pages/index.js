import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  StyledHeading,
  StyledHomePageContainer,
  StyledButton,
  StyledButtonContainer,
  StyledCanvasContainer,
} from "@/components/Global/Global.styled";

import * as Tone from "tone";
import { resetAudio } from "@/utils/sheepSound";

import ThreeScene from "@/components/3DWorld";
import InfoBox from "@/components/InfoBox";
import AddSheepForm from "@/components/AddSheepForm";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <p>A map is loading</p>,
});

export default function HomePage({
  sheep,
  soundVersion,
  setSheep,
  formOpen,
  onFormToggle,
  handleFormSubmit,
  handleSheepDelete,
  handleSheepPositionUpdate,
  handleSheepWeatherUpdate,
  onSoundVersionToggle,
  handleSetActive,
  handleSetAllSheepNotActive,
}) {
  const [sheepMovementActivated, setSheepMovementActivated] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const unlock = () => Tone.start();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") Tone.start();
    };
    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
  function handleSoundToggle() {
    muted ? (Tone.Destination.mute = false) : (Tone.Destination.mute = true);
    setMuted(!muted);
  }

  return (
    <>
      {formOpen && (
        <AddSheepForm
          onFormSubmit={handleFormSubmit}
          onFormToggle={onFormToggle}
        />
      )}

      <StyledHeading>the meadow__</StyledHeading>

      <StyledHomePageContainer>
        <InfoBox
          sheep={sheep}
          handleSheepDelete={handleSheepDelete}
          onSetActive={handleSetActive}
        />
      </StyledHomePageContainer>
      <StyledButtonContainer>
        <StyledButton
          onClick={() => {
            Tone.start();
            setSheepMovementActivated(!sheepMovementActivated);
            if (sheepMovementActivated) {
              handleSetAllSheepNotActive();
            }
          }}
        >
          {sheepMovementActivated ? "turn off movement" : "turn on movement"}
        </StyledButton>
        <StyledButton onClick={handleSoundToggle}>
          {muted ? "enable sound" : "disable sound"}
        </StyledButton>
        <StyledButton
          onClick={() => {
            resetAudio();
            Tone.start();
          }}
        >
          reset sound
        </StyledButton>
        <StyledButton onClick={onFormToggle} disabled={sheep.length >= 9}>
          add sheep
        </StyledButton>
        <StyledButton
          onClick={() => onSoundVersionToggle("mp3")}
          disabled={soundVersion === "mp3" && true}
        >
          sound: mp3
        </StyledButton>
        <StyledButton
          onClick={() => onSoundVersionToggle("synth")}
          disabled={soundVersion === "synth" && true}
        >
          sound: synth
        </StyledButton>
      </StyledButtonContainer>
      <StyledCanvasContainer>
        <ThreeScene
          sheep={sheep}
          handleSheepPositionUpdate={handleSheepPositionUpdate}
          handleSheepWeatherUpdate={handleSheepWeatherUpdate}
          sheepMovementActivated={sheepMovementActivated}
          soundVersion={soundVersion}
          handleSetActive={handleSetActive}
          onSetAllSheepNotActive={handleSetAllSheepNotActive}
        />
      </StyledCanvasContainer>

      {/* <Map
        sheep={sheep}
        setSheep={setSheep}
        sheepMovementActivated={sheepMovementActivated}
      /> */}
    </>
  );
}
