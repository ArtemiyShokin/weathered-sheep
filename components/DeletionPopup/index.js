import XIcon from "@/assets/x.svg";
import { StyledMenuBar, StyledButton, XButton } from "../Global/Global.styled";
import { StyledPopupContainer } from "./DeletionPopup.styled";

export default function DeletionPopup({
  sheepToDelete,
  onSheepDelete,
  onConfirmationToggle,
}) {
  return (
    <StyledPopupContainer>
      <StyledMenuBar>
        <XButton onClick={onConfirmationToggle} $xButton>
          <XIcon width="10px" height="8px" fill="var(--huemint4)" />
        </XButton>
      </StyledMenuBar>
      <p> Are you sure you want to remove {sheepToDelete.name}</p>
      <StyledButton onClick={onConfirmationToggle}> cancel </StyledButton>
      <StyledButton onClick={onSheepDelete}> remove</StyledButton>
    </StyledPopupContainer>
  );
}
