import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route} from "react-router-dom";


import Home from './components/home';
import Data from './components/data';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Templates from './components/templates';
import { ThemeProvider } from 'react-bootstrap';
import DataSetView from './components/dataSetView';
import TemplateView from './components/template';

function App() {
  return (

    <ThemeProvider
      breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
      minBreakpoint="xxs"
    >
      <Navbar expand="lg" className="bg-body-tertiary mb-5" variant="primary">
        <Container>
          <Navbar.Brand href="#home">Pdf factory</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/templates">My templates</Nav.Link>
              <Nav.Link href="/data">Data</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/data" element={<Data />}></Route>
            <Route path="/templates" element={<Templates />}></Route>
            <Route
              path="/dataSet/:setName"
              element={<DataSetView/>}
            />
            <Route
              path="/template/:templateId"
              element={<TemplateView/>}
            />
          </Routes>

        </Router>

    </ThemeProvider>

  );
}

export default App;
