import styled from "styled-components";

export const StyledFormContainer = styled.div`
  position: absolute;
  margin: 16px;
  width: 400px;
  top: 40vh;
  left: 40vw;

  background-color: var(--huemint1-lighter);

  border-radius: 2px;
  border-style: solid;
  border-width: 1px;
  border-color: var(--huemint4);

  font-family: var(--roboto-font);

  z-index: 1000;

  button {
    align-self: flex-end;
  }

  @media (max-width: 768px) {
    position: fixed;
    width: calc(100vw - 32px);
    left: 16px;
    top: 20vh;
    margin: 0;
  }
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
