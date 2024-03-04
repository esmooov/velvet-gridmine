import * as React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10vw;
`

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 100px repeat(3, 1fr);
  width: 60vh;
  height: 80vh;
`

const Cell = styled.div<{ $bottom?: boolean, $right?: boolean }>`
  box-sizing: border-box;
  border-top: 1px solid black;
  border-left: 1px solid black;
  border-right: ${props => props.$right && "1px solid black"};
  border-bottom: ${props => props.$bottom && "1px solid black"};
`

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
`

export const Gameboard = () => {
  const columns = ["Gena Rowlands", "Criterion", "Never nominated for an Oscar"]
  const rows = ["Liza Minnelli", "Someone gets shot", "Features a dog"]

  return (
    <Wrapper>
      <Board>
        <div></div>
        {columns.map(c => <Label>{c}</Label>)}
        {rows.map((r, i) => (
          <>
            <Label>{r}</Label>
            <Cell $bottom={i == 2}></Cell>
            <Cell $bottom={i == 2}></Cell>
            <Cell $right={true} $bottom={i == 2}></Cell>
          </>
        ))}
      </Board>
    </Wrapper>
  )
}