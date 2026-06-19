import dynamic from "next/dynamic";
import { useState } from "react";
import {
  StyledHeading,
  StyledHomePageContainer,
  StyledButton,
} from "@/components/Global/Global.styled";

import * as Tone from "tone";

import ThreeScene from "@/components/3DWorld";
import Boxes from "@/components/3DWorld/tutorialfile";
import InfoBox from "@/components/InfoBox";
import AddSheepForm from "@/components/AddSheepForm";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <p>A map is loading</p>,
});

export default function HomePage({
  sheep,
  setSheep,
  formOpen,
  onFormToggle,
  handleFormSubmit,
  handleSheepDelete,
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

      <StyledHeading>Welcome to the meadow__</StyledHeading>

      <StyledHomePageContainer>
        <ThreeScene sheep={sheep} />

        <InfoBox sheep={sheep} handleSheepDelete={handleSheepDelete} />
      </StyledHomePageContainer>
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
      <Map
        sheep={sheep}
        setSheep={setSheep}
        sheepMovementActivated={sheepMovementActivated}
      />
    </div>
  );
}
