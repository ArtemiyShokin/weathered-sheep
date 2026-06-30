import XIcon from "@/assets/x.svg";
import { StyledMenuBar, XButton } from "../Global/Global.styled";
import { StyledPopupContainer } from "../DeletionPopup/DeletionPopup.styled";

export default function RateLimitPopup({ onDismiss }) {
  return (
    <StyledPopupContainer>
      <StyledMenuBar>
        <XButton onClick={onDismiss} $xButton>
          <XIcon width="10px" height="8px" fill="var(--huemint4)" />
        </XButton>
      </StyledMenuBar>
      <p>
        {" "}
        Unfortunately the daily weather fetch limit from open-meteo has been
        reached. Please try again tomorrow!
      </p>
    </StyledPopupContainer>
  );
}
