import styled from "styled-components";

export const StyledFormContainer = styled.div`
  position: absolute;
  margin: 16px;
  width: 400px;
  top: 40vh;
  left: 40vw;

  background-color: var(--accent);
  border-radius: 2px;
  border-style: solid;
  border-width: 1px;
  border-color: var(--huemint4);

  font-family: var(--roboto-font);

  button {
    align-self: flex-end;
  }
  z-index: 1000;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  button {
    margin: 0;
  }
`;
