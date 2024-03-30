import React, { useState, useEffect } from "react";
import { Box } from '@mui/material';
// import { httpCall } from '../../helpers/http_helper'
// import '../css/search.css';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Portfolio() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {

  })

  let component1 = (<div className="d-flex flex-column" style={{ alignItems: "center" }}>
    <div className="mx-4 mt-5" style={{ fontWeight: "500", fontSize: "30px", width: "55%", minWidth: "400px" }}>
      My Portfolio
    </div>
    <div className="" style={{ fontWeight: "400", fontSize: "20px", width: "55%", minWidth: "400px" }}>
      Money in Wallet: $19961.65
    </div>

    <div className="mx-md-5 mx-sm-4 mt-2 mb-2 d-flex flex-column" style={{
      border: "1px solid lightgrey", borderRadius: "5px", width: "55%", minWidth: "400px",
      height: "100%", minHeight: "100px"
    }}>
      <div className="d-flex" style={{ backgroundColor: "#E6E6E6", width: "100%", minWidth: "400px" }}><h4 className="mx-2 my-1">AAPL</h4><p className="mx-1 my-2" style={{ fontSize: "large" }}>Apple Inc</p></div>

      <div className="d-flex m-2" style={{ width: "90%", minWidth: "300px", justifyContent: "space-between" }}>
        <div className="">
          <Typography variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Quantity:</Typography>
          <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Avg. Cost / Share:</Typography>
          <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Total Cost:</Typography>
        </div>
        <div className="">
          <Typography variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>35.00</Typography>
          <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>169.51</Typography>
          <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "14px" }}>5932.85</Typography>
        </div>
        <div className="">
          <Typography variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Change:</Typography>
          <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Current Price:</Typography>
          <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Market Value:</Typography>
        </div>
        <div className="">
          <Typography variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>0.00</Typography>
          <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>182.31</Typography>
          <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>6922.78</Typography>
        </div>
      </div>

      <div className="d-flex" style={{ backgroundColor: "#E6E6E6", width: "100%", minWidth: "400px" }}>
        <Button className="m-2" variant="contained" style={{ backgroundColor: '#0B67F6', textTransform: 'none' }} disableElevation>
          Buy
        </Button>
        <Button className="m-2" variant="contained" style={{ backgroundColor: '#D42D3E', textTransform: 'none', marginLeft: '15px' }} disableElevation>
          Sell
        </Button>
      </div>

    </div>
  </div>);

let component2 = (<div className="d-flex flex-column" style={{ alignItems: "center" }}>
<div className="mx-4 mt-5" style={{ fontWeight: "500", fontSize: "30px", width: "55%", minWidth: "400px" }}>
  My Portfolio
</div>
<div className="" style={{ fontWeight: "400", fontSize: "20px", width: "55%", minWidth: "400px" }}>
  Money in Wallet: $19961.65
</div>
<div className="mx-md-5 mx-sm-4 mt-2 d-flex flex-column" style={{
  border: "1px solid lightgrey", borderRadius: "5px", width: "55%", minWidth: "400px",
  height: "100%", minHeight: "45px", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0C9"
}}>
  Currently you don't have any stock.
</div>
</div>);

  return component1;
}