import styled from "styled-components";

export const StyledHeading = styled.h1`
  margin: 16px 24px;
  color: var(--huemint3);
  text-transform: uppercase;
  font-size: 3.1rem;
  line-height: 1.5;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
  z-index: 20;
  position: fixed;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 8px 12px;
  }
`;

export const StyledHomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  z-index: 20;
  position: fixed;
  right: 24px;
  top: calc(16px + 3.1rem * 1.5);

  @media (max-width: 768px) {
    right: 0;
    left: 0;
    bottom: 76px;
    top: auto;
    height: auto;
    z-index: 25;
  }
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

  .soundButton&:disabled {
    background-color: lightgreen;
  }

  @media (max-width: 768px) {
    width: auto;
    margin-left: 0;
    font-size: 10px;
    padding: 7px 4px;
    white-space: nowrap;
  }
`;

export const StyledWindowContainer = styled.div`
  margin: 16px;
  max-height: 55vh;
  width: fit-content;

  top: ${(props) => (props.$top === "center" ? "50vh" : "auto")};

  background-color: var(--huemint1-lighter);
  border-radius: 2px;
  border-style: solid;
  border-width: 1px;
  border-color: var(--huemint4);

  font-family: var(--roboto-font);

  overflow: auto;

  ul {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(auto-fit, minmax(150px, 1fr));
    max-height: 50vh;
    width: max-content;
  }

  .cardButton {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0;
    max-height: 35vh;

    ul {
      grid-auto-flow: row;
      grid-template-rows: unset;
      grid-template-columns: 1fr;
      width: 100%;
      max-height: none;
    }
  }
`;

export const StyledListicle = styled.li`
  margin: 16px 16px 16px 8px;
  position: relative;

  border: 2px solid ${(props) => (props.$active ? props.$color : "transparent")};
  border-radius: 4px;

  border-left: 8px solid ${(props) => props.$color};

  padding: 8px;
  width: 250px;

  @media (max-width: 768px) {
    width: 100%;
    margin: 2px 0;
    padding: 4px 6px;

    h2 {
      font-size: 11px;
    }

    p {
      font-size: 10px;
      line-height: 1.3;
    }
  }
`;

export const StyledMenuBar = styled.div`
  margin: 0;
  background-color: var(--huemint4);
  height: 24px;
  z-index: 100;
  display: flex;
  flex-direction: row-reverse;

  position: relative;
`;

export const XButton = styled.button`
  position: absolute;
  line-height: 1;
  background-color: var(--huemint4-lighter);
  display: flex;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 2px;
  border-radius: 2px;
`;

export const StyledMapPosition = styled.div`
  position: fixed;
  bottom: 56px;
  left: 0px;
  z-index: 20;

  @media (max-width: 768px) {
    bottom: 80px;
    left: 0;
    right: 0;
  }
`;

export const StyledButtonContainerLow = styled.div`
  bottom: 16px;
  position: fixed;
  z-index: 20;

  @media (max-width: 768px) {
    bottom: 0;
    left: 0;
    right: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    padding: 6px;

    button {
      width: 100%;
    }
  }
`;

export const StyledButtonContainerUp = styled.div`
  top: 32px;
  right: 40px;
  position: fixed;
  z-index: 20;

  @media (max-width: 768px) {
    top: 48px;
    right: 8px;
    display: flex;
    flex-direction: row;
    gap: 4px;
  }
`;

export const StyledCanvasContainer = styled.div`
  width: 70vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;

  @media (max-width: 768px) {
    width: 100vw;
    transform: translateY(-18%);
  }
`;

export const StyledArticle = styled.article`
  color: var(--huemint3);
  position: absolute;
  bottom: 0;
  right: 0;
  width: 500px;
  overflow-wrap: normal;

  p {
    font-family: var(--roboto-font);
    font-size: 14px;
  }
  ul {
    list-style: square;
  }

  .mobileInfo {
    display: none;
  }

  @media (max-width: 768px) {
    bottom: 60px;
    width: 90%;

    p {
      font-size: 10px;
    }

    .mobileInfo {
      display: contents;
      font-size: 10px;
    }

    ${(props) => props.$hidden && "display: none;"}
  }
  z-index: -1;
`;
