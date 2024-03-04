import * as React from "react";
import styled from "styled-components";
import { Modal } from "./modal";
import { GameData, Pick } from "./types";

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

  @media (orientation: portrait) {
    width: 80vw;
    height: 140vw;
  }
`

const Cell = styled.div<{ $bottom?: boolean, $right?: boolean, $poster?: string | null }>`
  box-sizing: border-box;
  border-top: 1px solid black;
  border-left: 1px solid black;
  border-right: ${props => props.$right && "1px solid black"};
  border-bottom: ${props => props.$bottom && "1px solid black"};
  cursor: pointer;
  background: url(${props => props.$poster});
  background-size: cover;
  background-position: center center;
`

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
`

export const Gameboard = () => {
  const data: GameData = {
    columns: ["Gena Rowlands", "Criterion", "Never nominated for an Oscar"],
    rows: ["Liza Minnelli", "Someone gets shot", "Features a dog"],
  }

  const [picks, setPicks] = React.useState<Array<Array<Pick | null>>>([[null, null, null], [null, null, null], [null, null, null]])

  const [showModal, setShowModal] = React.useState<[number, number] | false>(false)


  return (
    <Wrapper>
      <Board>
        <div></div>
        {data.columns.map(c => <Label key={c}>{c}</Label>)}
        {data.rows.map((r, i) => (
          <React.Fragment key={r}>
            <Label key={`label-${r}`}>{r}</Label>
            <CellBox picks={picks} key={`${r}-${0}`} showModal={showModal} setShowModal={setShowModal} row={i} column={0} ></CellBox>
            <CellBox picks={picks} key={`${r}-${1}`} showModal={showModal} setShowModal={setShowModal} row={i} column={1} ></CellBox>
            <CellBox picks={picks} key={`${r}-${2}`} showModal={showModal} setShowModal={setShowModal} row={i} column={2} ></CellBox>
          </React.Fragment>
        ))}
      </Board>
      <Modal picks={picks} setPicks={setPicks} data={data} target={showModal} setShowModal={setShowModal} />
    </Wrapper>
  )
}

type CellBoxProps = {
  setShowModal: (modal: [number, number] | false) => void,
  showModal: [number, number] | false,
  row: number,
  column: number,
  picks: Array<Array<Pick | null>>
}

const CellBox = ({ showModal, setShowModal, row, column, picks }: CellBoxProps) => {
  const onClick = React.useCallback(() => {
    setShowModal([row, column])
  }, [])
  console.log(picks)

  const pick = picks[row][column]

  return (
    <Cell $bottom={row === 2} $right={column === 2} onClick={onClick} $poster={pick && `https://image.tmdb.org/t/p/original/${pick["poster_path"]}`}></Cell>
  )
}