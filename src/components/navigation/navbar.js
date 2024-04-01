import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemText, Box, IconButton } from '@mui/material';
import { NavbarButton } from './navbar_button';
import "../../css/navbar.css"

const burgerStyle={
  color: "white", border: "1px solid grey", fontSize: "x-large", borderRadius: "5px"
};

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // console.log(location.pathname)
    let path = location.pathname
    if (path == '/') {
      navigate('/search/home')
    }

    if (path == '/' || path == '/search/home')
      setSearchQuery('/search/home')
    else if (path == "/portfolio")
      setSearchQuery('/portfolio')
    else if (path == "/watchlist")
      setSearchQuery('/watchlist')


  });
  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  function navigateToRoute(route_url) {
    
    if (location.state) {
      console.log(location.state.search_query)
      navigate(route_url, { state: { search_query: location.state.search_query } });
    }
    else {
      navigate(route_url)
    }
  }

  return (
    <div style={{ paddingBottom: drawerOpen ? '150px' : '0' }}>
      <AppBar position="static" color="navbar">
        <Toolbar>
          <Typography className="navbar-button-color" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stock Search
          </Typography>
          {/* Burger menu icon */}
          <IconButton
            size="medium"
            edge="end"
            color="inherit"
            aria-label="Nothing"
            sx={{ display: { sm: 'none' } }}
            onClick={toggleDrawer(!drawerOpen)}
          >
            <Box component="span" className="material-icons">
              {drawerOpen ? <i style={burgerStyle}class="bi bi-list"></i> : <i style={burgerStyle} class="bi bi-list"></i>}
            </Box>
          </IconButton>
          {/* Navbar buttons */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
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
          </Box>
        </Toolbar>
      </AppBar>
      {/* Drawer for smaller screens */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        variant="temporary"
        ModalProps={{ BackdropProps: { invisible: true } }}
        sx={{
          '& .MuiDrawer-paper': {
            top: '55px',
            width: '100%',
          },
        }}
      >
        <List style={{ backgroundColor: "#16148b", display:"flex", flexDirection:"column" }}>
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
        </List>
      </Drawer>
    </div>
  );
}

