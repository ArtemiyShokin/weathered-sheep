import dynamic from "next/dynamic";
import {
  StyledHeading,
  StyledHomePageContainer,
  StyledButton,
} from "@/components/Global/Global.styled";
import InfoBox from "@/components/InfoBox";
import { useState } from "react";
import * as Tone from "tone";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <p>A map is loading</p>,
});

export default function HomePage({ sheep, setSheep }) {
  const [sheepMovementActivated, setSheepMovementActivated] = useState(false);
  const [muted, setMuted] = useState(false);
  function handleSoundToggle() {
    muted ? (Tone.Destination.mute = false) : (Tone.Destination.mute = true);
    setMuted(!muted);
  }

  return (
    <div>
      <StyledHeading>Welcome to the meadow_</StyledHeading>

      <StyledHomePageContainer>
        <Map
          sheep={sheep}
          setSheep={setSheep}
          sheepMovementActivated={sheepMovementActivated}
        />
        <InfoBox sheep={sheep} />
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
        {sheepMovementActivated ? "Turn off movement" : "Turn on movement"}
      </StyledButton>
      <StyledButton onClick={handleSoundToggle}>
        {muted ? "enable sound" : "disable sound"}
      </StyledButton>
    </div>
  );
}
