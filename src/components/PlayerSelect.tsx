import React from "react";
import styled from "styled-components";

const StyledLi = styled.li`
  float: left;
`;

const DropDownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
  width: inherit;
`;

const DropDownLi = styled(StyledLi)`
  display: inline-block;
  width: 9rem;
  &:hover ${DropDownContent} {
    display: block;
    cursor: pointer;
  }
`;

const SubA = styled.option`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  border-bottom: 2px solid #cbbebe;
  &:last-child {
    border: none;
  }
  &:hover {
    background-color: #f1f1f1;
  }
`;

type Props = {
  onChangeHandler: (event: HTMLInputElement) => void;
  manualMode: boolean;
  //   changePlayer: (event: React.MouseEventHandler<HTMLButtonElement>) => string;
};

function PlayerSelect({ onChangeHandler, manualMode }: Props) {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const handleClick = () => {
    setMenuVisible(!menuVisible);
  };
  const onClickHandler = (event: React.MouseEvent) => {
    const value = event.target as HTMLInputElement;
    onChangeHandler(value);
  };

  return (
    <DropDownLi>
      <button onClick={handleClick}>
        Select Your Opponent: {manualMode ? "Human" : "AI"}
      </button>
      <DropDownContent>
        <SubA value="human" onClick={onClickHandler}>
          Human
        </SubA>
        <SubA value="ai" onClick={onClickHandler}>
          AI
        </SubA>
      </DropDownContent>
    </DropDownLi>
  );
}

export default PlayerSelect;
