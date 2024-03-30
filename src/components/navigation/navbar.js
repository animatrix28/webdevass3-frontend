import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { NavbarButton } from './navbar_button';
import "../../css/navbar.css"



export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(location.pathname)
    let path = location.pathname
    if (path == '/'){
      navigate('/search/home')
    }

    if (path == '/' || path == '/search/home')
      setSearchQuery('/search/home')
    else if (path == "/portfolio")
      setSearchQuery('/portfolio')
    else if (path == "/watchlist")
      setSearchQuery('/watchlist')


  });

  return (
    <AppBar position="static" color="navbar">
      <Toolbar>
        <Typography className="navbar-button-color" variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Stock Search
        </Typography>
        <NavbarButton
          button_name="Search"
          route_url="/search/home"
          is_selected={searchQuery.includes("search")}
        />
        <NavbarButton
          button_name="Watchlist"
          route_url="/watchlist"
          is_selected={searchQuery.includes("watchlist")}
        />
        <NavbarButton
          button_name="Portfolio"
          route_url="/portfolio"
          is_selected={searchQuery.includes("portfolio")}
        />
      </Toolbar>
    </AppBar>
  );
}

