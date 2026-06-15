import styled from "styled-components";

export const InfoBoxContainer = styled.div`
  margin: 16px;
  min-width: 400px;

  background-color: var(--accent);
  border-style: solid;
  border-width: 1px;
  border-color: var(--huemint4);

  font-family: var(--roboto-font);

  li {
    margin: 16px;
  }
`;

export const StyledMenuBar = styled.div`
  margin: 0;
  background-color: var(--huemint4);
  height: 16px;
  z-index: 100;
`;
