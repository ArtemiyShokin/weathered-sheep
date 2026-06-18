import styled from "styled-components";

export const StyledHeading = styled.h1`
  margin: 16px 24px;
  color: var(--huemint3);
  text-transform: uppercase;
  font-size: 2.25rem;
  line-height: 1.5;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
`;

export const StyledHomePageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const StyledButton = styled.button`
  background-color: var(--huemint2);
  color: var(--huemint1);
  border-radius: 2px;
  padding: 8px 16px;
  margin-left: 16px;
  font-size: 12px;
  font-family: var(--roboto-font);
  letter-spacing: 0.1px;
  word-spacing: -2px;
  width: 160px;

  &:active {
    background-color: var(--huemint4);
  }
`;

export const StyledWindowContainer = styled.div`
  margin: 16px;
  min-width: 400px;

  top: ${(props) => (props.$top === "center" ? "50vh" : "auto")};

  background-color: var(--accent);
  border-radius: 2px;
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
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

export const XButton = styled.button`
  line-height: 1;
  background-color: var(--huemint4-lighter);
  display: flex;

  padding: 2px;
  border-radius: 2px;
  align-self: center !important; //no idea why this is so wonky?
`;
