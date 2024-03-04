import React from 'react';
import styled from "styled-components"

import logo from './logo.svg';
import './App.css';
import { Gameboard } from './gameboard';

const Header = styled.h1`

`

function App() {
  return (
    <div className="App">
      <Header>Velvet Gridmine</Header>
      <Gameboard />
    </div>
  );
}

export default App;
