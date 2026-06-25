import dynamic from "next/dynamic";
import { useState } from "react";
import {
  StyledHeading,
  StyledHomePageContainer,
  StyledButton,
  StyledButtonContainer,
} from "@/components/Global/Global.styled";

import * as Tone from "tone";

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
}) {
  const [sheepMovementActivated, setSheepMovementActivated] = useState(false);
  const [muted, setMuted] = useState(false);
  function handleSoundToggle() {
    muted ? (Tone.Destination.mute = false) : (Tone.Destination.mute = true);
    setMuted(!muted);
  }

  return (
    <div>
      {formOpen && (
        <AddSheepForm
          onFormSubmit={handleFormSubmit}
          onFormToggle={onFormToggle}
        />
      )}

      <StyledHeading>the meadow__</StyledHeading>

      <StyledHomePageContainer>
        <ThreeScene
          sheep={sheep}
          handleSheepPositionUpdate={handleSheepPositionUpdate}
          handleSheepWeatherUpdate={handleSheepWeatherUpdate}
          sheepMovementActivated={sheepMovementActivated}
          soundVersion={soundVersion}
        />

        <InfoBox sheep={sheep} handleSheepDelete={handleSheepDelete} />
      </StyledHomePageContainer>
      <StyledButtonContainer>
        <StyledButton
          onClick={() => {
            if (Tone.context.state !== "running") {
              Tone.start();
            }
            setSheepMovementActivated(!sheepMovementActivated);
            console.log(Tone.context.state);
          }}
        >
          {sheepMovementActivated ? "turn off movement" : "turn on movement"}
        </StyledButton>
        <StyledButton onClick={handleSoundToggle}>
          {muted ? "enable sound" : "disable sound"}
        </StyledButton>
        <StyledButton onClick={onFormToggle} disabled={sheep.length >= 6}>
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

      {/* <Map
        sheep={sheep}
        setSheep={setSheep}
        sheepMovementActivated={sheepMovementActivated}
      /> */}
    </div>
  );
}
