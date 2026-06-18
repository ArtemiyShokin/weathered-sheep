import X from "@/assets/x.svg";
import { StyledMenuBar, StyledButton, XButton } from "../Global/Global.styled";
import { StyledFormContainer, StyledForm } from "./AddSheepForm.styled";

export default function AddSheepForm({ onFormSubmit }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    onFormSubmit(data);
    event.target.reset();
  }
  return (
    <StyledFormContainer>
      <StyledMenuBar>
        <XButton>
          <X width="10px" height="8px" fill="var(--huemint4)" />
        </XButton>
      </StyledMenuBar>
      <StyledForm onSubmit={handleSubmit}>
        <label htmlFor="name"> Name your sheep</label>
        <input name="name" id="name" />
        <StyledButton> create</StyledButton>
      </StyledForm>
    </StyledFormContainer>
  );
}
