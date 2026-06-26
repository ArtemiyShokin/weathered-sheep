import styled from "styled-components";

export const StyledHeading = styled.h1`
  margin: 16px 24px;
  color: var(--huemint3);
  text-transform: uppercase;
  font-size: 3.1rem;
  line-height: 1.5;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
`;

export const StyledHomePageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 80vh;
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
  &:disabled {
    background-color: grey;
  }
`;

export const StyledWindowContainer = styled.div`
  margin: 16px;
  max-height: 50vh;
  width: fit-content;

  top: ${(props) => (props.$top === "center" ? "50vh" : "auto")};

  background-color: var(--huemint1-lighter);
  border-radius: 2px;
  border-style: solid;
  border-width: 1px;
  border-color: var(--huemint4);

  font-family: var(--roboto-font);

  ul {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(auto-fit, minmax(150px, 1fr));
    max-height: 50vh;
    width: max-content;
  }

  button {
    position: absolute;
    top: 0;
    right: 24px;
  }
`;

export const StyledListicle = styled.li`
  margin: 16px 16px 16px 8px;
  position: relative;

  border: 2px solid ${(props) => (props.$active ? props.$color : "transparent")};
  border-radius: 4px;

  border-left: 8px solid ${(props) => props.$color};

  /* background-color: ${(props) => (props.$active ? props.$color : "none")}; */
  padding-left: 8px;
  width: 250px;
`;

export const StyledMenuBar = styled.div`
  margin: 0;
  background-color: var(--huemint4);
  height: 16px;
  z-index: 100;
  display: flex;
  flex-direction: row-reverse;
`;

export const XButton = styled.button`
  line-height: 1;
  background-color: var(--huemint4-lighter);
  display: flex;

  padding: 2px;
  border-radius: 2px;
  align-self: center !important; //no idea why this is so wonky?
`;

export const StyledButtonContainer = styled.div`
  bottom: 16px;
  position: fixed;
`;
