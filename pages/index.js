import dynamic from "next/dynamic";
import {
  StyledHeading,
  StyledHomePageContainer,
  StyledButton,
} from "@/components/Global/Global.styled";
import InfoBox from "@/components/InfoBox";
import { useState } from "react";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <p>A map is loading</p>,
});

export default function HomePage({ sheep, setSheep }) {
  const [sheepMovementActivated, setSheepMovementActivated] = useState(true);

  return (
    <div>
      <StyledHeading>Welcome to the meadow</StyledHeading>

      <StyledHomePageContainer>
        <Map
          sheep={sheep}
          setSheep={setSheep}
          sheepMovementActivated={sheepMovementActivated}
        />
        <InfoBox sheep={sheep} />
      </StyledHomePageContainer>
      <StyledButton
        onClick={() => setSheepMovementActivated(!sheepMovementActivated)}
      >
        {sheepMovementActivated ? "Turn off movement" : "Turn on movement"}
      </StyledButton>
    </div>
  );
}
