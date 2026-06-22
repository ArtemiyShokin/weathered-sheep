import styled from "styled-components";
export const StyledPopupContainer = styled.div`
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

  p {
    margin: 8px;
  }

  button {
    align-self: flex-end;
  }
  z-index: 1000;
`;
