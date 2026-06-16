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
