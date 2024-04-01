import React, { useState, useEffect } from "react";
import { Box } from '@mui/material';
import { httpCall } from '../helpers/http_helper'
import '../css/search.css';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "bootstrap-icons/font/bootstrap-icons.css";
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 350,
  width: '30%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  py: 2,
  borderRadius: 2
};

export default function Portfolio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [changeValue, setChangeValue] = useState(0);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [profitStatusColor, setProfitStatusColor] = useState([]);
  const [quant, setQuantity] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [stockSymbol, setStockSymbol] = useState("");
  const [compName, setCompName] = useState("");
  const [stockHolding, setStockHolding] = useState(0);
  const [alertMessage, setalertMessage] = useState(false);
  const [successText, setsuccessText] = useState("");
  const [alertMessageColor, setalertMessageColor] = useState("");
  const [arrow, setArrow] = useState("");

  useEffect(() => {
    fetchMongoStock();
  }, []);
  const openSellModal = (selectedStock) => {
    setCurrentPrice(selectedStock.currentPrice);
    setStockSymbol(selectedStock.tickerSymbol);
    setCompName(selectedStock.companyName);
    setStockHolding(selectedStock.quantity)
    setQuantity(0);
    setIsSellModalOpen(true);
  };

  const openBuyModal = (selectedStock) => {

    setCurrentPrice(selectedStock.currentPrice);
    setStockSymbol(selectedStock.tickerSymbol);
    setCompName(selectedStock.companyName);
    setQuantity(0);
    setIsBuyModalOpen(true);
  };
  const closeBuyModal = () => {
    setIsBuyModalOpen(false);
  };

  const closeSellModal = () => {
    setIsSellModalOpen(false);
  };
  const fetchMongoStock = async () => {
    try {
      const wallet = await httpCall({
        http: `${process.env.REACT_APP_API_HOST}/search/mongo/search`,
        method: "POST",
        body: {}
      });
      const data = await wallet.data;
      // console.log("balance:" + data.balance)
      setWalletBalance(data.balance);
      const response = await httpCall({
        http: `${process.env.REACT_APP_API_HOST}/portfolio/mongo/`,
        method: "POST",
        body: { check: "portfolio" }
      });

      setPortfolioData(response.result || []);
      const colors = portfolioData.map(stock => {
        const profit = stock.currentPrice - stock.avgCost;
        if (profit > 0) {
          setArrow("bi bi-caret-up-fill");
          return "green";
        } else if (profit < 0) {
          setArrow("bi bi-caret-down-fill");
          return "red";
        } else {
          setArrow("");
          return "black";
        }
      });
      setProfitStatusColor(colors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setLoading(false);
      // throw error;
    }
  };

  const handleBuyButton = async (quantity, currentPrice, tickerSymbol, companyName) => {
    try {
      const response = await httpCall({
        http: `${process.env.REACT_APP_API_HOST}/portfolio/mongo/add`,
        method: "POST",
        body: { quantity: quantity, currentPrice: currentPrice, tickerSymbol: tickerSymbol, operation: "buy", companyName: companyName }
      });
      const data = await response;
      // Close the buy modal if the purchase was successful
      setIsBuyModalOpen(false);
      // Set state to indicate the stock was bought successfully
      setalertMessage(true);
      setsuccessText(`${tickerSymbol} bought successfully.`);
      setalertMessageColor("#CCE3D9");
      // console.log(data);
      fetchMongoStock();
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // throw error;
    }
  };
  const handleSellButton = async (quantity, currentPrice, tickerSymbol, companyName) => {
    try {
      const response = await httpCall({
        http: `${process.env.REACT_APP_API_HOST}/portfolio/mongo/add`,
        method: "POST",
        body: { quantity: quantity, currentPrice: currentPrice, tickerSymbol: tickerSymbol, operation: "sell", companyName: companyName }
      });
      const data = await response;
      // Close the buy modal if the purchase was successful
      setIsSellModalOpen(false);
      // Set state to indicate the stock was bought successfully
      setalertMessage(true);
      setsuccessText(`${tickerSymbol} sold successfully.`);
      setalertMessageColor("#F7D7DA");
      fetchMongoStock();
      // console.log(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // throw error;
    }
  };
  const closeMessage = () => { setalertMessage(false); }
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        closeMessage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);


  return (
    <div>
      {loading && <div className="loading">Loading...</div>}
      {!loading && (
        <div>
          <div className="col-md-12 d-flex justify-content-center align-items-center flex-column">
            {alertMessage && (
              <div className="mx-md-12 mx-sm-12 mt-4 d-flex flex-row" style={{
                border: "1px solid lightgrey", borderRadius: "5px", width: "100%",
                minHeight: "50px", alignItems: "center", justifyContent: "center", backgroundColor: alertMessageColor
              }}>
                <span className="d-flex" style={{ flex: 1, justifyContent: "center" }}>{successText}</span>
                <i className="bi bi-x mx-2" style={{ fontSize: "25px", position: "relative", cursor: "pointer" }} onClick={closeMessage}></i>
              </div>
            )}
            <div className="mx-4 mt-3 d-flex" style={{ fontWeight: "500", fontSize: "30px", width: "55.8%", minWidth: "400px" }}>
              My Portfolio
            </div>
            <div className="mx-5 d-flex" style={{ fontWeight: "400", fontSize: "20px", width: "57%", minWidth: "300px" }}>
              Money in Wallet: ${walletBalance.toFixed(2)}
            </div>
          </div>
          {portfolioData.length === 0 ? (
            <div className="d-flex flex-column" style={{ alignItems: "center" }}>
              <div className="mx-md-5 mx-sm-4 mt-2 d-flex flex-column" style={{
                border: "1px solid lightgrey", borderRadius: "5px", width: "55%", minWidth: "400px",
                height: "100%", minHeight: "45px", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0C9"
              }}>
                Currently you don't have any stock.
              </div>
            </div>
          ) : (
            <div>
              {portfolioData.map((stock, index) => (
                <div className="d-flex flex-column" style={{ alignItems: "center" }}>
                  <div className="mx-md-5 mx-sm-4 mt-2 mb-2 d-flex flex-column" style={{
                    border: "1px solid lightgrey", borderRadius: "5px", width: "55%", minWidth: "370px",
                    height: "100%", minHeight: "100px"
                  }}>
                    <div className="d-flex" style={{ backgroundColor: "#E6E6E6", width: "100%", minWidth: "400px" }}><h4 className="mx-2 my-1">{stock.tickerSymbol}</h4><p className="mx-1 my-2" style={{ fontSize: "large" }}>{stock.companyName}</p></div>

                    <div className="d-flex m-2" style={{ width: "90%", minWidth: "300px", justifyContent: "space-between" }}>
                      <div className="">
                        <Typography variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Quantity:</Typography>
                        <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Avg. Cost / Share:</Typography>
                        <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Total Cost:</Typography>
                      </div>
                      <div className="">
                        <Typography variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>{stock.quantity}</Typography>
                        <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>{(stock.avgCost).toFixed(2)}</Typography>
                        <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "14px" }}>{(stock.totalPrice).toFixed(2)}</Typography>
                      </div>
                      <div className="">
                        <Typography variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Change:</Typography>
                        <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Current Price:</Typography>
                        <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px" }}>Market Value:</Typography>
                      </div>
                      <div className="">
                        <Typography variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px", color: profitStatusColor[index] }}>
                          <i className={arrow} style={{ fontSize: 'medium', fontWeight: 'lighter', color: profitStatusColor[index] }}></i>
                          {(stock.currentPrice - stock.avgCost).toFixed(2)}</Typography>
                        <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px", color: profitStatusColor[index] }}>{(stock.currentPrice).toFixed(2)}</Typography>
                        <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px", color: profitStatusColor[index] }}>{(stock.quantity * stock.currentPrice).toFixed(2)}</Typography>
                      </div>
                    </div>

                    <div className="d-flex" style={{ backgroundColor: "#E6E6E6", width: "100%", minWidth: "400px" }}>
                      <Button className="m-2" variant="contained" style={{ backgroundColor: '#0B67F6', textTransform: 'none' }} disableElevation
                        onClick={() => openBuyModal(stock)}>
                        Buy
                      </Button>

                      <Modal className="modal-dialog-centered modal-dialog-scrollable modal-dialog-centered-responsive" open={isBuyModalOpen} onClose={closeBuyModal}>
                        <Box sx={style}>

                          <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <Typography className="mx-3" variant="h5" component="h5" style={{ fontWeight: "500" }}>
                                {stockSymbol}
                              </Typography>
                            </div>
                            <i className="bi bi-x mx-3" style={{ color: "blue", fontSize: "15px", position: "relative", cursor: "pointer" }} onClick={closeBuyModal}>
                              <span style={{ position: "absolute", left: "0", bottom: "1px", width: "100%", borderBottom: "1px solid blue" }}></span>
                            </i>
                          </div>
                          <div className="d-flex flex-column mx-4 my-2">
                            <span>Current Price: ${currentPrice.toFixed(2)}</span>
                            <span>Money in Wallet: ${walletBalance.toFixed(2)}</span>
                            <div>Quantity:
                              <TextField
                                className="mx-2"
                                type="number"
                                value={quant}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                style={{ width: "75%", maxWidth: "350px", minWidth: "200px" }}
                                size="small"
                              />
                            </div>
                            {quant * currentPrice > walletBalance && (
                              <span style={{ color: "red" }}>Not enough money in wallet!</span>
                            )}
                          </div>
                          <div style={{ borderTop: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <div className="mx-3 mt-2" style={{ fontWeight: "500" }}>
                                Total: ${(quant * currentPrice).toFixed(2)}
                              </div>
                            </div>
                            <Button
                              className="mx-3 mt-2"
                              variant="contained"
                              style={{ backgroundColor: 'green', textTransform: 'none' }}
                              disableElevation
                              disabled={quant * currentPrice > walletBalance}
                              onClick={() => handleBuyButton(quant, currentPrice, stockSymbol, compName)}
                            >
                              Buy
                            </Button>
                          </div>
                        </Box>
                      </Modal>

                      {/* SELL MODAL */}
                      <Button className="m-2" variant="contained" style={{ backgroundColor: '#D42D3E', textTransform: 'none' }} disableElevation
                        onClick={() => openSellModal(stock)}>
                        Sell
                      </Button>

                      <Modal className="modal-dialog-centered modal-dialog-scrollable modal-dialog-centered-responsive" open={isSellModalOpen} onClose={closeSellModal}>
                        <Box sx={style}>

                          <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <Typography className="mx-3" variant="h5" component="h5" style={{ fontWeight: "500" }}>
                                {stockSymbol}
                              </Typography>
                            </div>
                            <i className="bi bi-x mx-3" style={{ color: "blue", fontSize: "15px", position: "relative", cursor: "pointer" }} onClick={closeSellModal}>
                              <span style={{ position: "absolute", left: "0", bottom: "1px", width: "100%", borderBottom: "1px solid blue" }}></span>
                            </i>
                          </div>
                          <div className="d-flex flex-column mx-4 my-2">
                            <span>Current Price: ${currentPrice.toFixed(2)}</span>
                            <span>Money in Wallet: ${walletBalance.toFixed(2)}</span>
                            <div>Quantity:
                              <TextField
                                className="mx-2"
                                type="number"
                                value={quant}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                style={{ width: "75%", maxWidth: "350px", minWidth: "200px" }}
                                size="small"
                              />
                            </div>
                            {quant > stockHolding && (
                              <span style={{ color: "red" }}>You cannot sell the stocks that you don't have!</span>
                            )}
                          </div>
                          <div style={{ borderTop: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <div className="mx-3 mt-2" style={{ fontWeight: "500" }}>
                                Total: ${(quant * currentPrice).toFixed(2)}
                              </div>
                            </div>
                            <Button
                              className="mx-3 mt-2"
                              variant="contained"
                              style={{ backgroundColor: '#D42D3E', textTransform: 'none' }}
                              disableElevation
                              disabled={quant * currentPrice > walletBalance}
                              onClick={() => handleSellButton(quant, currentPrice, stockSymbol, compName)}
                            >
                              Sell
                            </Button>
                          </div>
                        </Box>
                      </Modal>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}