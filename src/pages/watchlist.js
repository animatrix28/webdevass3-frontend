import React, { useState, useEffect } from "react";
import { Box } from '@mui/material';
// import { httpCall } from '../../helpers/http_helper'
import '../css/search.css';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Watchlist() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {

  })

  const component1 = (
    <div className="d-flex flex-column" style={{ alignItems: "center" }}>
      <div className="mx-4 mt-5 mb-3" style={{ fontWeight: "400", fontSize: "30px", width: "42%", minWidth: "400px" }}>
        My Watchlist
      </div>
      <div className="mx-md-5 mx-sm-4 mt-2 d-flex flex-column" style={{
        border: "1px solid lightgrey", borderRadius: "5px", width: "42%", minWidth: "400px",
        height: "100%", minHeight: "100px"
      }}>
        <i className="bi bi-x mx-2 mt-1" style={{ fontSize: "15px", position: "relative", cursor: "pointer" }}></i>
        <div className="d-flex" style={{ width: "65%", minWidth: "300px", justifyContent: "space-between" }}>
          <div className="mx-2">
            <Typography variant="h6" component="h6" style={{ fontWeight: "600" }}>GOOGL</Typography>
            <Typography className="" variant="h6" component="h6" style={{ fontWeight: "500", fontSize: "14px" }}>Alphabet Inc</Typography>
          </div>
          <div className="mx-2">
            <Typography variant="h6" component="h6" style={{ fontWeight: "600" }}>140.52</Typography>
            <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>-2.25 (-1.58%)</Typography>
          </div>
        </div>
      </div>
    </div>
  );

const component2= (
  <div className="d-flex flex-column" style={{ alignItems: "center" }}>
    <div className="mx-4 mt-5 mb-3" style={{ fontWeight: "400", fontSize: "30px", width: "55%", minWidth: "400px" }}>
      My Watchlist
    </div>
    <div className="mx-md-5 mx-sm-4 mt-2 d-flex flex-column" style={{
      border: "1px solid lightgrey", borderRadius: "5px", width: "55%", minWidth: "400px",
      height: "100%", minHeight: "45px", alignItems:"center", justifyContent:"center", backgroundColor:"#FFF0C9"
    }}>
      Currently you don't have any stock in your watchlist.
    </div>
  </div>
);

  return component1;
}