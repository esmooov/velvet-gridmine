import * as React from "react";
import styled from "styled-components";

import { GameData, Pick } from "./types";
import { sortBy, throttle } from "lodash";

const ModalWrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.6);
`

const Closer = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
`

const ModalBox = styled.div`
  width: 60vw;
  border-radius: 10px;
  background-color: papayawhip;
  border: 1px solid #cecece;
  z-index: 1;
  padding: 0;
  top: 10vh;
  left: 20vw;
  position: fixed;
`

const ModalHeader = styled.div`
  padding: 14px;

  h4, h5 {
    font-weight: 500;
  } 
  h4 {
    margin-top: 0;
  }
  h5 {
    margin-bottom: 0;
  }
`

const ModalBodyInner = styled.div`
  max-height: 300px;
  overflow: scroll; 
  box-sizing: border-box;
`

const ModalBody = styled.div`
  width: 100%;
  padding: 14px;
  box-sizing: border-box;

  input {
    width: 80%;
    font-size: 18px;
    border: 0;
    border-bottom: 1px solid #cecece;
    background-color: papayawhip;
    margin-bottom: 14px;

    &:focus-visible, &:focus {
      outline: none;
      border-bottom: 2px solid #cecece;
    }
  }

  button {
    margin-top: 14px;
    background-color: blue;
    color: white;
    cursor: pointer;
  }

`


type Props = {
  target: [number, number] | false
  setShowModal: (modal: [number, number] | false) => void,
  data: GameData
  picks: Array<Array<Pick | null>>,
  setPicks: (picks: Array<Array<Pick | null>>) => void
}

export const Modal = ({ target, setShowModal, data, picks, setPicks }: Props) => {
  const hideModal = React.useCallback(() => {
    setShowModal(false)
  }, [setShowModal])
  const [searchValue, setSearchValue] = React.useState<string>("")
  const [guessValue, setGuessValue] = React.useState<Pick | null>(null)
  const onSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    setGuessValue(null)
  }, [setSearchValue])
  const [options, setOptions] = React.useState<Array<any>>([])
  const search = React.useCallback(throttle((value) => {
    const fetchMovies = async () => {
      if (!value) return null
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(value)}&api_key=203a3dfcc22d41b16e83f4a9bb4bcc24`)
      if (!response) return null
      const data = await response.json()
      if (!data) return null

      const results = data["results"]
      if (!results) return null

      const cleanedResults = sortBy(results.filter((result: any) => result["poster_path"]), (result: any) => -1 * result["vote_count"])
      setOptions(cleanedResults)
    }

    fetchMovies()
  }, 500), [])

  React.useEffect(() => {
    search(searchValue)
  }, [searchValue])

  const onGuess = React.useCallback(() => {
    if (!target || !guessValue) return
    picks[target[0]][target[1]] = guessValue
    setPicks(picks)
    setShowModal(false)
  }, [guessValue, setPicks, picks, target])


  if (target === false) {
    return null
  }

  return (
    <ModalWrapper>
      <Closer onClick={hideModal} />
      <ModalBox>
        <ModalHeader>
          <h4>Guess a movie!</h4>
          <h5>{data.columns[target[1]]} x {data.rows[target[0]]}</h5>
        </ModalHeader>
        <ModalBody>
          <input value={guessValue?.title || searchValue} onChange={onSearchChange} />
          {!guessValue && (
            <ModalBodyInner>

              {options.map((option) => <Option key={option["id"]} setGuessValue={setGuessValue} data={option} />)}
            </ModalBodyInner>
          )}
          {guessValue && (
            <div>
              <button onClick={onGuess}>Guess</button>
            </div>
          )}
        </ModalBody>
      </ModalBox>
    </ModalWrapper>
  )
}

const OptionRow = styled.div`
  padding: 4px;
  cursor: pointer;
`

type OptionProps = {
  option: Pick,
  setGuessValue: (value: Pick) => void
}

const Option = ({ data, setGuessValue }: any) => {
  const onClick = React.useCallback(() => { setGuessValue(data) }, [data])
  return (<OptionRow onClick={onClick}>{data["title"]}</OptionRow>)
}