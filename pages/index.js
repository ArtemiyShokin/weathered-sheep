import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  StyledHeading,
  StyledHomePageContainer,
  StyledButton,
  StyledButtonContainerLow,
  StyledButtonContainerUp,
  StyledCanvasContainer,
  StyledMapPosition,
  StyledArticle,
} from "@/components/Global/Global.styled";

import * as Tone from "tone";
import { resetAudio } from "@/utils/sheepSound/olderversion";

import ThreeScene from "@/components/3DWorld";
import InfoBox from "@/components/InfoBox";
import AddSheepForm from "@/components/AddSheepForm";
import RateLimitPopup from "@/components/RateLimitPopup";

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
  infoBoxOpen,
  onInfoBoxToggle,
  mapOpen,
  onMapToggle,
  handleFormSubmit,
  handleSheepDelete,
  handleSheepPositionUpdate,
  handleSheepWeatherUpdate,
  onSoundVersionToggle,
  handleSetActive,
  handleSetAllSheepNotActive,
  isWireframe,
  onToggleWireframe,
}) {
  const [sheepMovementActivated, setSheepMovementActivated] = useState(false);
  const [muted, setMuted] = useState(false);
  const [clickDestination, setClickDestination] = useState(null);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [rateLimitPopupOpen, setRateLimitPopupOpen] = useState(false);

  function handleRateLimitError() {
    setRateLimitError(true);
    setRateLimitPopupOpen(true);
  }

  function handleSheepWeatherSuccess(sheepId, temp, wind, humidity) {
    handleSheepWeatherUpdate(sheepId, temp, wind, humidity);
    setRateLimitError(false);
    setRateLimitPopupOpen(false);
  }

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
      {rateLimitPopupOpen && (
        <RateLimitPopup onDismiss={() => setRateLimitPopupOpen(false)} />
      )}
      <StyledHeading>the meadow__</StyledHeading>
      <StyledButtonContainerUp>
        <StyledButton onClick={onInfoBoxToggle}>
          {infoBoxOpen ? "hide info" : "show info"}{" "}
        </StyledButton>
        <StyledButton onClick={onMapToggle}>
          {mapOpen ? "hide map" : "show map"}{" "}
        </StyledButton>
        <StyledButton onClick={onFormToggle} disabled={sheep.length >= 9}>
          add sheep
        </StyledButton>
      </StyledButtonContainerUp>

      <StyledHomePageContainer>
        {infoBoxOpen && (
          <InfoBox
            sheep={sheep}
            handleSheepDelete={handleSheepDelete}
            onSetActive={handleSetActive}
            onInfoBoxToggle={onInfoBoxToggle}
          />
        )}
        <StyledArticle>
          <h2> controls:</h2>
          {rateLimitError && (
            <p>
              weather data unavailable — daily API limit reached. try again
              tomorrow!
            </p>
          )}
          <ul>
            <li>
              <p>
                the sheep wander around the globe when you turn on movement and
                stop periodically to produce sounds depending on the current
                weather in that location
              </p>{" "}
            </li>
            <li>
              <p>use the mouse to rotate and pan around the globe</p>{" "}
            </li>
            <li>
              <p>use the clickwheel to zoom</p>{" "}
            </li>
            <li>
              <p>click on a sheep to select it</p>{" "}
            </li>
            <li>
              <p>
                click anywhere on the globe to send the selected sheep there
              </p>
            </li>
            <li>
              <p>
                use the buttons to add sheep, toggle info and change sounds
              </p>{" "}
            </li>
            <li>
              <p>
                if the weather sounds become overwhelming, feel free to disable
                the audio
              </p>
            </li>
          </ul>
        </StyledArticle>
      </StyledHomePageContainer>
      {mapOpen && (
        <StyledMapPosition>
          <Map
            sheep={sheep}
            setSheep={setSheep}
            sheepMovementActivated={sheepMovementActivated}
            onMapToggle={onMapToggle}
            onSetActive={handleSetActive}
            onSetClickDestination={setClickDestination}
          />
        </StyledMapPosition>
      )}
      <StyledButtonContainerLow>
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

        <StyledButton
          className="soundButton"
          onClick={() => onSoundVersionToggle("mp3")}
          disabled={soundVersion === "mp3" && true}
        >
          bleat: organic
        </StyledButton>
        <StyledButton
          className="soundButton"
          onClick={() => onSoundVersionToggle("synth")}
          disabled={soundVersion === "synth" && true}
        >
          bleat: synth
        </StyledButton>
        <StyledButton onClick={onToggleWireframe}>
          {isWireframe ? "toggle earth" : "toggle wireframe"}
        </StyledButton>
      </StyledButtonContainerLow>
      <StyledCanvasContainer>
        <ThreeScene
          sheep={sheep}
          handleSheepPositionUpdate={handleSheepPositionUpdate}
          handleSheepWeatherUpdate={handleSheepWeatherSuccess}
          sheepMovementActivated={sheepMovementActivated}
          soundVersion={soundVersion}
          handleSetActive={handleSetActive}
          onSetAllSheepNotActive={handleSetAllSheepNotActive}
          clickDestination={clickDestination}
          onSetClickDestination={setClickDestination}
          isWireframe={isWireframe}
          handleRateLimitError={handleRateLimitError}
        />
      </StyledCanvasContainer>
    </>
  );
}
