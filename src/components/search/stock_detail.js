import React, { useState, useEffect } from "react";
import { httpCall } from '../../helpers/http_helper'
import { Button, createTheme } from '@mui/material';
import { color, fontSize } from "@mui/system";
import '../../css/search.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import { TextField, Grid } from '@mui/material';
import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';

const style = {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 370,
    width: '30%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    py: 2,
    borderRadius: 2
};

export default function StockDetails({ selectedStock, searchQuery, setHighPrice, setLowPrice, setOpenPrice,
    setprevClosePrice, setWebPage, setIPO, setIndustry, setCompanyPeers, setCurrentTimet, setNameCompany }) {
    const [tickerSymbol, setTickerSymbol] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [exchange, setExchange] = useState("");
    const [logo, setLogo] = useState("");
    const [lastprice, setLastPrice] = useState("");
    const [change, setChange] = useState("");
    const [changePercent, setChangePercent] = useState("");
    const [arrow, setArrow] = useState("");
    const [timestamp, setTimeStamp] = useState("");
    const [arrowColorClass, setArrowColorClass] = useState("");
    const [marketStatus, setMarketStatus] = useState("");
    const [marketStatusClass, setmarketStatusClass] = useState("");
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [starFill, setstarFill] = useState("bi bi-star m-2"); // default icon color
    const [starColor, setstarColor] = useState("black"); // default icon color
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [sellButtonState, setSellButtonState] = useState(false);
    const [alertMessage, setalertMessage] = useState(false);
    const [successText, setsuccessText] = useState("");
    const [stockHolding, setStockHolding] = useState(0);
    const [alertMessageColor, setalertMessageColor] = useState("");

    function formatDate(epochTime) {
        const date = new Date(epochTime * 1000); // Convert seconds to milliseconds
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    useEffect(() => {
        // Fetch current date time initially
        setCurrentDateTime(formatDate(Date.now() / 1000)); // Convert milliseconds to seconds

        // Start interval to update current date time every 15 seconds
        const interval = setInterval(() => {
            setCurrentDateTime(formatDate(Date.now() / 1000));
             // Convert milliseconds to seconds
             if(marketStatus==="Market is Open"){getStockDetails();}
        }, 15000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, [marketStatus, selectedStock, searchQuery]);

    useEffect(() => {
        getStockDetails();
    }, [selectedStock, searchQuery]);
    const getStockDetails = async () => {

        try {

            //   setLoading(true);
            //   setOptions([]);

            let response = await httpCall(
                {
                    http: `${process.env.REACT_APP_API_HOST}/search/stock_details/${searchQuery}`,
                    method: "POST",
                    // body: {"search_query":searchQuery}
                    // signal: signal

                }
            );
            // console.log(response)
            if (response.error) {
                console.log(response.error)
                setTickerSymbol("");
                setCompanyName("");
                setExchange("");
                setLogo("");
                setLastPrice("");
                setChange("");
                setChangePercent("");
                setArrow("");
                // setTimeStamp("");
                setMarketStatus("");
                setCurrentTimet("");
                setCurrentDateTime("");
                setNameCompany("");

                setHighPrice("");
                setLowPrice("");
                setOpenPrice("");
                setprevClosePrice("");
                setWebPage("");
                setIPO("");
                setIndustry("");
                setCompanyPeers("");
            }
            else {
                setTickerSymbol(response.data.ticker);
                setCompanyName(response.data.name);
                setExchange(response.data.exchange);
                setLogo(response.data.logo);
                setIndustry(response.data.finnhubIndustry);
                setLastPrice(response.data.c);
                setChange((response.data.d).toFixed(2));
                setChangePercent((response.data.dp).toFixed(2));
                // setTimeStamp(formatDate(response.data.t));
                setNameCompany(response.data.name);


                if (response.data.d < 0 || response.data.dp < 0) { setArrow("bi bi-caret-down-fill red-text"); setArrowColorClass("red-text"); }
                else { setArrow("bi bi-caret-up-fill green-text"); setArrowColorClass("green-text"); }

                const current_date = new Date();
                const currentTime = current_date.getTime() / 1000;
                // console.log(currentTime)
                // console.log(currentTime - response.data.t)
                if ((currentTime - response.data.t) <= 300) { setMarketStatus("Market is Open"); setmarketStatusClass("marketOpen"); }
                else { setMarketStatus("Market Closed on " + formatDate(response.data.t)); setmarketStatusClass("marketClose"); }

                setHighPrice(response.data.h);
                setLowPrice(response.data.l);
                setOpenPrice(response.data.o);
                setprevClosePrice(response.data.pc);
                setWebPage(response.data.weburl);
                setIPO(response.data.ipo);
                setIndustry(response.data.finnhubIndustry);
                setCompanyPeers(response.data.peers);

                setCurrentTimet(response.data.t);
            }
        } catch (error) {
            //   setLoading(false);
            if (error.name === 'AbortError') {
                console.log('Fetch request was aborted');
            } else {
                console.error('Fetch error:', error);
            }
        }

    }

    const addToFav = async () => {
        try {
            // const response = await httpCall({
            //     http: `${process.env.REACT_APP_API_HOST}/watchlist/mongo/${searchQuery}`,
            //     method: "POST",
            //     body: { check: 1, exchange: exchange }
            // });
            // const data = await response;
            // console.log(data.hasOwnProperty('error'));
            if (starFill === "bi bi-star-fill m-2") {
                setstarFill("bi bi-star m-2");
                setstarColor("black");
                const response = await httpCall({
                    http: `${process.env.REACT_APP_API_HOST}/watchlist/mongo/`,
                    method: "POST",
                    body: { searchQuery: searchQuery, check: "remove", exchange: exchange }
                });
                setalertMessage(true);
                setsuccessText(`${tickerSymbol} removed from watchlist.`);
                setalertMessageColor("#F7D7DA");
            }
            else {
                setstarFill("bi bi-star-fill m-2");
                setstarColor("#EFD52A");
                const response = await httpCall({
                    http: `${process.env.REACT_APP_API_HOST}/watchlist/mongo/`,
                    method: "POST",
                    body: { searchQuery: searchQuery, check: "add", exchange: exchange }
                });
                setalertMessage(true);
                setsuccessText(`${tickerSymbol} added to watchlist.`);
                setalertMessageColor("#CCE3D9");
            }


        } catch (error) {
            console.error('Error fetching chart data:', error);
            // throw error;
        }

    };



    const openBuyModal = async () => {
        try {
            const response = await httpCall({
                http: `${process.env.REACT_APP_API_HOST}/search/mongo/${searchQuery}`,
                method: "POST",
                body: {}
            });
            const data = await response.data;
            setWalletBalance(data.balance);
            setQuantity(0);
            setIsBuyModalOpen(true);
        }
        catch (error) { console.log(error) }
    };

    const openSellModal = () => {
        setQuantity(0);
        setIsSellModalOpen(true);
    };

    const closeBuyModal = () => {
        setIsBuyModalOpen(false);
    };

    const closeSellModal = () => {
        setIsSellModalOpen(false);
    };

    useEffect(() => {
        fetchMongoStock();
    }, [selectedStock, searchQuery, tickerSymbol, starColor, starFill]);
    useEffect(() => {
        if (sellButtonState !== undefined) {
            // Sell button state can be set only when its value is determined
            setSellButtonState(sellButtonState);
        }
    }, [sellButtonState]);
    const fetchMongoStock = async () => {
        try {
            const response = await httpCall({
                http: `${process.env.REACT_APP_API_HOST}/portfolio/mongo/`,
                method: "POST",
                body: {}
            });
            const watchlistCheck = await httpCall({
                http: `${process.env.REACT_APP_API_HOST}/watchlist/mongo/`,
                method: "POST",
                body: { searchQuery: searchQuery, check: "", exchange: exchange }
            });
            const data = await response.data;
            const watchlistData = await watchlistCheck;
            // console.log(watchlistData.error)
            if (watchlistData.error === "not available") {
                setstarFill("bi bi-star m-2");
                setstarColor("black");
            } else {
                setstarFill("bi bi-star-fill m-2");
                setstarColor("#EFD52A");
            }
            // console.log(data)
            if (data && data.stockHolding) {
                const hasTickerSymbol = data.stockHolding.some(item => {
                    return item.tickerSymbol.toUpperCase() === tickerSymbol.toUpperCase();
                });

                // console.log("hasTickerSymbol:", hasTickerSymbol);

                if (hasTickerSymbol) {
                    setSellButtonState(true);
                    const index = data.stockHolding.findIndex(item => item.tickerSymbol.toUpperCase() === tickerSymbol.toUpperCase());
                    if (index !== -1) {
                        // Set setStockHolding to the quantity of that particular index
                        setStockHolding(data.stockHolding[index].quantity);
                    } else {
                        setStockHolding(0)
                    }
                }
            } else {
                setSellButtonState(false);
            }
        } catch (error) {
            console.error('Error fetching mongo data:', error);
            // throw error;
        }
    };

    const handleBuyButton = async () => {
        try {
            const response = await httpCall({
                http: `${process.env.REACT_APP_API_HOST}/portfolio/mongo/add`,
                method: "POST",
                body: { quantity: quantity, currentPrice: lastprice, tickerSymbol: tickerSymbol, operation: "buy", companyName: companyName }
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
    const handleSellButton = async () => {
        try {
            const response = await httpCall({
                http: `${process.env.REACT_APP_API_HOST}/portfolio/mongo/add`,
                method: "POST",
                body: { quantity: quantity, currentPrice: lastprice, tickerSymbol: tickerSymbol, operation: "sell", companyName: companyName }
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
        <div className="container">
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center align-items-center flex-column">
                    {alertMessage && (
                        <div className="mx-md-12 mx-sm-12 mt-2 d-flex flex-row" style={{
                            border: "1px solid lightgrey", borderRadius: "5px", width: "100%",
                            minHeight: "50px", alignItems: "center", justifyContent: "center", backgroundColor: alertMessageColor
                        }}>
                            <span className="d-flex" style={{ flex: 1, justifyContent: "center" }}>{successText}</span>
                            <i className="bi bi-x mx-2" style={{ fontSize: "25px", position: "relative", cursor: "pointer" }} onClick={closeMessage}></i>
                        </div>
                    )}
                    <div className="stock-detail-container">
                        <span className="d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex align-items-center" style={{ fontSize: 'xx-large', fontWeight: '400', height: '30px' }}>
                                {tickerSymbol}<i id="favIcon" className={starFill} style={{ color: starColor, cursor: "pointer" }} onClick={addToFav}></i>
                            </div>
                            <div className="" style={{ fontSize: 'larger', textAlign: "center", fontWeight: '400' }}>{companyName}</div>
                            <div style={{ fontSize: 'small', alignItems: "center", justifyContent: "center", textAlign: "center" }}>{exchange}</div>
                            <span >
                                <Button className="mx-1" variant="contained" style={{ backgroundColor: 'green', textTransform: 'none', marginTop: '10px' }} disableElevation onClick={openBuyModal}>
                                    Buy
                                </Button>

                                <Modal className="modal-dialog-centered modal-dialog-scrollable modal-dialog-centered-responsive" open={isBuyModalOpen} onClose={closeBuyModal}>
                                    <Box sx={style}>

                                        <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <div>
                                                <Typography className="mx-3" variant="h5" component="h5" style={{ fontWeight: "500" }}>
                                                    {tickerSymbol}
                                                </Typography>
                                            </div>
                                            <i className="bi bi-x mx-3" style={{ color: "blue", fontSize: "15px", position: "relative", cursor: "pointer" }} onClick={closeBuyModal}>
                                                <span style={{ position: "absolute", left: "0", bottom: "1px", width: "100%", borderBottom: "1px solid blue" }}></span>
                                            </i>
                                        </div>
                                        <div className="d-flex flex-column mx-4 my-2">
                                            <span>Current Price: ${lastprice}</span>
                                            <span>Money in Wallet: ${walletBalance.toFixed(2)}</span>
                                            <div>Quantity:
                                                <TextField
                                                    className="mx-2"
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                    style={{ width: "75%", maxWidth: "350px", minWidth: "200px" }}
                                                    size="small"
                                                />
                                            </div>
                                            {quantity * lastprice > walletBalance && (
                                                <span style={{ color: "red" }}>Not enough money in wallet!</span>
                                            )}
                                        </div>
                                        <div style={{ borderTop: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <div>
                                                <div className="mx-3 mt-2" style={{ fontWeight: "500" }}>
                                                    Total: ${(quantity * lastprice).toFixed(2)}
                                                </div>
                                            </div>
                                            <Button className="mx-3 mt-2" variant="contained" style={{ backgroundColor: 'green', textTransform: 'none' }} disableElevation
                                                disabled={quantity * lastprice > walletBalance}
                                                onClick={handleBuyButton}>
                                                Buy
                                            </Button>
                                        </div>
                                    </Box>
                                </Modal>
                                {sellButtonState && (
                                    <Button variant="contained" style={{ backgroundColor: 'red', textTransform: 'none', marginTop: '10px' }} disableElevation onClick={openSellModal}>
                                        Sell
                                    </Button>
                                )}
                                {/* Sell Modal */}
                                <Modal className="modal-dialog-centered modal-dialog-scrollable modal-dialog-centered-responsive" open={isSellModalOpen} onClose={closeSellModal}>
                                    <Box sx={style}>

                                        <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <div>
                                                <Typography className="mx-3" variant="h5" component="h5" style={{ fontWeight: "500" }}>
                                                    {tickerSymbol}
                                                </Typography>
                                            </div>
                                            <i className="bi bi-x mx-3" style={{ color: "blue", fontSize: "15px", position: "relative", cursor: "pointer" }} onClick={closeSellModal}>
                                                <span style={{ position: "absolute", left: "0", bottom: "1px", width: "100%", borderBottom: "1px solid blue" }}></span>
                                            </i>
                                        </div>
                                        <div className="d-flex flex-column mx-4 my-2">
                                            <span>Current Price: ${lastprice}</span>
                                            <span>Money in Wallet: ${walletBalance.toFixed(2)}</span>
                                            <div>Quantity:
                                                <TextField
                                                    className="mx-2"
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                    style={{ width: "75%", maxWidth: "350px", minWidth: "200px" }}
                                                    size="small"
                                                />
                                            </div>
                                            {quantity > stockHolding && (
                                                <span style={{ color: "red" }}>You cannot sell the stocks that you don't have!</span>
                                            )}
                                        </div>
                                        <div style={{ borderTop: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <div>
                                                <div className="mx-3 mt-2" style={{ fontWeight: "500" }}>
                                                    Total: ${(quantity * lastprice).toFixed(2)}
                                                </div>
                                            </div>
                                            <Button
                                                className="mx-3 mt-2"
                                                variant="contained"
                                                style={{ backgroundColor: '#D42D3E', textTransform: 'none' }}
                                                disableElevation
                                                disabled={quantity > stockHolding}
                                                onClick={() => handleSellButton()}
                                            >
                                                Sell
                                            </Button>
                                        </div>
                                    </Box>
                                </Modal>
                            </span>
                        </span>
                        <span className="d-flex" style={{ width: "auto", justifyContent: "center", alignItems: "center", width: "49%", maxWidth: "150px" }}>
                            <img src={logo} style={{ width: '17%', minWidth: "100px" }} alt="Error Loading" />
                        </span>
                        <span className="row d-flex flex-column">
                            <div className="col-sm-12 col-md-12">
                                <div className={arrowColorClass} style={{ height: '20px' }}>{lastprice}</div>
                            </div>
                            <div className={arrowColorClass}>
                                <div className="row">
                                    <div className="col-sm-4 col-md-4"><i className={arrow} style={{ fontSize: 'medium', fontWeight: 'lighter' }}></i>{change}</div>
                                    <div className="col-sm-4 col-md-6">({changePercent}%)</div>
                                </div>
                            </div>
                            <div className="col-12 col-md-12">
                                <div className="ms-3" style={{ fontSize: 'small' }}>{currentDateTime}</div>
                            </div>
                        </span>
                    </div>
                </div>
                <div className="d-flex col-md-12 col-sm-12 justify-content-center align-items-center">
                    <div className={marketStatusClass} style={{ display: 'flex', justifyContent: 'center', alignItems: "center", width: 'max-content', marginBottom: '20px' }}>{marketStatus}</div>
                </div>
            </div>
        </div>
    );
}