import styled from "styled-components";
import "papercss/dist/paper.min.css";
import TicTacToe from "./components/TicTacToe";

export default function App() {
  return (
    <Main>
      <TicTacToe />
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: auto;
  width: 100vw;
  padding: 10px;
`;
