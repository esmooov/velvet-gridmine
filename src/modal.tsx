import * as React from "react";
import styled from "styled-components";

import { GameData } from "./types";
import { sortBy, throttle } from "lodash";

const ModalWrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
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

    &:focus-visible, &:focus {
      outline: none;
      border-bottom: 2px solid #cecece;
    }
  }
`

const ModalBodyInner = styled.div`
  max-height: 300px;
  overflow: scroll; 
  padding: 14px 0;
  box-sizing: border-box;
`

type Props = {
  target: [number, number] | false
  setShowModal: (modal: [number, number] | false) => void,
  data: GameData
}

export const Modal = ({ target, setShowModal, data }: Props) => {
  const hideModal = React.useCallback(() => {
    setShowModal(false)
  }, [setShowModal])
  const [searchValue, setSearchValue] = React.useState<string>("")
  const onSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
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

      const cleanedResults = sortBy(results.filter((result: any) => result["backdrop_path"]), (result: any) => -1 * result["vote_count"])
      console.log(cleanedResults)
      setOptions(cleanedResults)
    }

    fetchMovies()
  }, 500), [])

  React.useEffect(() => {
    search(searchValue)
  }, [searchValue])

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
          <div><input value={searchValue} onChange={onSearchChange} /></div>
          <ModalBodyInner>

            {options.map((option) => <Option key={option["id"]} data={option} />)}
          </ModalBodyInner>
        </ModalBody>
      </ModalBox>
    </ModalWrapper>
  )
}

const OptionRow = styled.div`
  padding: 4px;
  cursor: pointer;
`

const Option = ({ data }: any) => {
  return (<OptionRow>{data["title"]}</OptionRow>)
}