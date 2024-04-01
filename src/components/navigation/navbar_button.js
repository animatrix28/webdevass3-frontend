import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";


export function NavbarButton({ button_name, route_url, is_selected }) {
  // const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();


  function navigateToRoute(route_url) {
    
    if (location.state){
        // console.log(location.state.search_query)
        navigate(route_url, {state:{search_query: location.state.search_query}});
      }
      else {
        navigate(route_url)
      }
  }

  return (
    <Button
      sx={{
        borderRadius: '15px', // Adjust the value as needed
        padding: '8px', // Adjust the padding as needed
      }}
      color="white-button"
      variant={is_selected? "outlined":"text"}
      className="navbar-button navbar-button-color mx-2"
      onClick={() => navigateToRoute(route_url)}>
      {button_name}
    </Button>
  );
}
