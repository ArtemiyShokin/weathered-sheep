import styled from "styled-components";

export const StyledHeading = styled.h1`
  margin: 16px;
  color: gainsboro;
  text-transform: uppercase;
  font-size: x-large;
`;

export const StyledHomePageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const StyledButton = styled.button`
  background-color: gray;
  color: gainsboro;
  border-radius: 4px;
  border-style: ridge;
  border-width: 1px;
  padding: 8px 16px;
  margin-left: 16px;
  font-size: small;
  font-family: var(--roboto-font);

  &:active {
    background-color: darkorange;
  }
`;
