import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Navbar from "./components/navigation/navbar";
import Footer from "./components/navigation/footer";

import Search from "./pages/search";
import Watchlist from "./pages/watchlist";
import Portfolio from "./pages/portfolio";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {Box} from "@mui/material";


function App() {

  const theme = createTheme({
    palette: {
      secondary: {
        light: "#000",
        main: "#000",
        dark: "#000",
        contrastText: "#fff",
      },
      success: {
        main: "#3fbf4c",
        contrastText: "#fff",
      },
      navbar: {
        main: '#16148b',
        // contrastText: '#FFFFFF'
      },
      'white-button': {
        main: '#FFFFFF'
      }
    },
  });
  // #16148b

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <div className="container-main">

          <Router>
            <Navbar />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '87.8vh',
              }}
            >
              <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/search/:searchQuery" element={<Search />}  />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/portfolio" element={<Portfolio />} />
              </Routes>
            </Box>
            <Footer />
          </Router>

        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;