import React from "react";
import styled from "styled-components";
import { SQUARE_DIMS } from "../constants";

const Containertyle = styled.div<{ dims: number }>`
  display: flex;
  justify-content: center;
  width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`};
  flex-flow: wrap;
  position: relative;
`;

type Props = {
  children: React.ReactNode;
  DIMENSIONS: number;
};

function Container({ children, DIMENSIONS }: Props) {
  return <Containertyle dims={DIMENSIONS}>{children}</Containertyle>;
}

export default Container;
