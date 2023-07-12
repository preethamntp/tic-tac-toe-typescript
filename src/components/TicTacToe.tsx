import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_DIMS,
  DRAW,
  GAME_STATES,
  DIMENSIONS,
} from "../constants";
import Board from "./Board";
import { getRandomInt, switchPlayer } from "./utils";
import { border } from "./styles";
import { ResultModal } from "./ResultModal";
import PlayerSelect from "./PlayerSelect";

const arr: number[] | null[] = new Array(DIMENSIONS ** 2).fill(null);
const board = new Board();

interface Props {
  squares?: Array<number | null>;
}

const TicTacToe = ({ squares = arr }: Props) => {
  const [manualMode, setManualMode] = useState<boolean>(true);
  const [players, setPlayers] = useState<Record<string, number | null>>({
    human: null,
    ai: null,
    humanTwo: null,
  });
  const [gameState, setGameState] = useState<string>(GAME_STATES.notStarted);
  const [grid, setGrid] = useState(squares);
  const [winner, setWinner] = useState<string | null>(null);
  const [nextMove, setNextMove] = useState<null | number>(null);
  const [modalOpen, setModalOpen] = useState(false);
  //   const [mode, setMode] = useState(GAME_MODES.medium);
  const yourPlayer = players.human === 1 ? "PLAYER_X" : "PLAYER_O";
  const aiPlayer = players.ai === 1 ? "PLAYER_X" : "PLAYER_O";
  const humanTwoPlayer = players.humanTwo === 1 ? "PLAYER_X" : "PLAYER_O";
  useEffect(() => {
    const boardWinner = board.getWinner(grid);

    const declareWinner = (winner: number) => {
      let winnerStr;
      switch (winner) {
        case PLAYER_X:
          winnerStr = "Player X wins!";
          break;
        case PLAYER_O:
          winnerStr = "Player O wins!";
          break;
        case DRAW:
        default:
          winnerStr = "It's a draw";
      }
      setGameState(GAME_STATES.over);
      setWinner(winnerStr);
      // Slight delay for the modal so there is some time to see the last move
      setTimeout(() => setModalOpen(true), 300);
    };

    if (boardWinner !== null && gameState !== GAME_STATES.over) {
      declareWinner(boardWinner);
    }
  }, [gameState, grid, nextMove]);

  const move = useCallback(
    (index: number, player: number | null) => {
      if (player && gameState === GAME_STATES.inProgress) {
        setGrid((grid) => {
          const gridCopy = grid.concat();
          gridCopy[index] = player;
          return gridCopy;
        });
      }
    },
    [gameState]
  );

  const humanMove = (index: number) => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);
      if (manualMode) {
        setNextMove(players.humanTwo);
      } else {
        setNextMove(players.ai);
      }
    }
    if (!grid[index] && nextMove === players.humanTwo) {
      move(index, players.humanTwo);
      setNextMove(players.human);
    }
  };

  const aiMove = useCallback(() => {
    let index = getRandomInt(0, 8);
    while (grid[index]) {
      index = getRandomInt(0, 8);
    }

    move(index, players.ai);
    setNextMove(players.human);
  }, [move, grid, players]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (
      nextMove !== null &&
      nextMove === players.ai &&
      gameState !== GAME_STATES.over
    ) {
      timeout = setTimeout(() => {
        aiMove();
      }, 500);
    }
    return () => {
      if (timeout) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        clearTimeout(timeout);
      }
    };
  }, [nextMove, aiMove, players.ai, gameState]);

  const choosePlayer = (option: number) => {
    if (manualMode) {
      setPlayers({ human: option, humanTwo: switchPlayer(option) });
    } else {
      setPlayers({ human: option, ai: switchPlayer(option) });
    }
    setNextMove(PLAYER_X);
    setGameState(GAME_STATES.inProgress);
  };

  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    setGrid(arr);
    setModalOpen(false);
  };

  const reStartGame = () => {
    setGameState(GAME_STATES.inProgress);
    setGrid(arr);
    setModalOpen(false);
  };

  const changePlayer = ({ value }: HTMLInputElement) => {
    setManualMode(value === "human" ?? true);
  };

  return gameState === GAME_STATES.notStarted ? (
    <div>
      <Inner>
        <p>Choose your player</p>
        <h1>Please choose your player</h1>
        <ButtonRow>
          <button onClick={() => choosePlayer(PLAYER_X)}>X</button>
          <p>or</p>
          <button onClick={() => choosePlayer(PLAYER_O)}>O</button>
        </ButtonRow>
        <PlayerSelect onChangeHandler={changePlayer} manualMode={manualMode} />
      </Inner>
    </div>
  ) : (
    <main>
      <h3>
        You have chosen to be:&nbsp;
        {yourPlayer}
      </h3>
      <h4>
        your oponent is:&nbsp;
        {manualMode ? `Human as ${humanTwoPlayer}}` : `AI as ${aiPlayer}}`}
      </h4>
      <Container dims={DIMENSIONS}>
        {grid.map((value, index) => {
          const isActive = value !== null;

          return (
            <Square
              data-testid={`square_${index}`}
              key={index}
              onClick={() => humanMove(index)}
            >
              {isActive && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
            </Square>
          );
        })}
        <Strikethrough
          styles={
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            gameState === GAME_STATES.over ? board.getStrikethroughStyles() : ""
          }
        />
        <ResultModal
          isOpen={modalOpen}
          winner={winner}
          close={() => setModalOpen(false)}
          startNewGame={startNewGame}
        />
        <Button onClick={reStartGame}>ReStart</Button>
      </Container>
    </main>
  );
};

const Container = styled.div<{ dims: number }>`
  display: flex;
  justify-content: center;
  width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`};
  flex-flow: wrap;
  position: relative;
`;

const Square = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SQUARE_DIMS}px;
  height: ${SQUARE_DIMS}px;
  ${border};
  &:hover {
    cursor: pointer;
  }
`;

Square.displayName = "Square";

const Marker = styled.p`
  font-size: 68px;
`;

const ButtonRow = styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Strikethrough = styled.div<{ styles: string | null }>`
  position: absolute;
  ${({ styles }) => styles}
  background-color: indianred;
  height: 5px;
  width: ${({ styles }) => !styles && "0px"};
`;

const Button = styled.button`
  font-size: 16px;
`;

export default TicTacToe;
