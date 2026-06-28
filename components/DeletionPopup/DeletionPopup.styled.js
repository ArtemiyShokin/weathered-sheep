import styled from "styled-components";
export const StyledPopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 100px;

  background-color: var(--huemint1-lighter);
  border-radius: 2px;
  border-style: solid;
  border-width: 1px;
  border-color: var(--huemint4);

  font-family: var(--roboto-font);

  p {
    margin: 8px;
  }

  button {
    align-self: center;
    margin-bottom: 8px;
  }
  z-index: 1000;
`;
