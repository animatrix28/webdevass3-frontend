import React, { useState, useEffect } from "react";
import { httpCall } from '../helpers/http_helper'
import '../css/search.css';
import Typography from '@mui/material/Typography';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate  } from 'react-router-dom';

export default function Watchlist() {
  const [stocksData, setStocksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchMongoStock();
  }, [navigate]);

  const fetchMongoStock = async () => {
    try {
      const response = await httpCall({
        http: `${process.env.REACT_APP_API_HOST}/watchlist/mongo`,
        method: "POST",
        body: { searchQuery: "", check: "fetch", exchange: "" }
      });
      if (response.result) {
        const data = response.result;
        setStocksData(data);
      } else {
        console.error('Empty response from server');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setLoading(false);
      // throw error;
    }
  };

  const removeFromWatchlist = async (searchQuery) => {
    try {
      await httpCall({
        http: `${process.env.REACT_APP_API_HOST}/watchlist/mongo`,
        method: "POST",
        body: { check: "remove", searchQuery: searchQuery }
      });
  
      // Update stocksData state after removal
      setStocksData(prevData => {
        const updatedData = prevData.filter(stock => stock.Symbol !== searchQuery);
  
        // If there are no stocks left, set loading to false
        if (updatedData.length === 0) {
          setLoading(false);
        }
  
        return updatedData;
      });
    } catch (error) {
      console.error('Error removing stock from watchlist:', error);
    }
  };

  const handleSearch = (symbol) => {
    // Navigate to the Search page and pass the symbol as a query parameter
    navigate(`/search/home?symbol=${symbol}`);
  }

  return (
    <div>
      {loading && <div className="loading">Loading...</div>}
      {!loading && (
        <div>
          <div className="mx-4 mt-5 mb-3 d-flex align-items-center justify-content-center" style={{ fontWeight: "400", fontSize: "30px", width: "61%", minWidth: "400px" }}>
            My Watchlist
          </div>
          {stocksData.length === 0 ? (
            <div className="d-flex flex-column" style={{ alignItems: "center" }}>
              <div className="mx-md-5 mx-sm-4 mt-2 d-flex flex-column" style={{
                border: "1px solid lightgrey", borderRadius: "5px", width: "45%", minWidth: "400px",
                height: "100%", minHeight: "45px", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0C9"
              }}>
                Currently you don't have any stock in your watchlist.
              </div>
            </div>
          ) : (
            <div>
              {stocksData.map((stock, index) => {
                let arrow = "";
                let textColor = "";
                if (stock.data.d < 0 || stock.data.dp < 0) {
                  arrow = "bi bi-caret-down-fill red-text";
                  textColor = "red";
                } else {
                  arrow = "bi bi-caret-up-fill green-text";
                  textColor = "green";
                }
                return (
                  <div key={index} id={stock.Symbol} className="d-flex flex-column" style={{ alignItems: "center" }}>
                    <div className="mx-md-5 mx-sm-4 mt-2 d-flex flex-column" style={{
                      border: "1px solid lightgrey", borderRadius: "5px", width: "42%", minWidth: "400px",
                      height: "100%", minHeight: "100px"
                    }}>
                      <i className="bi bi-x mx-2 mt-1" style={{ fontSize: "15px", position: "relative", cursor: "pointer", width:"fit-content" }} onClick={() => removeFromWatchlist(stock.Symbol)}></i>

                      <div className="d-flex" style={{ width: "65%", minWidth: "300px", justifyContent: "space-between" }}>
                        <div className="mx-2">
                          <Typography variant="h6" component="h6" style={{ fontWeight: "600",cursor: "pointer" }}
                           onClick={() => handleSearch(stock.Symbol)}>{stock.Symbol}</Typography>
                          <Typography className="" variant="h6" component="h6" style={{ fontWeight: "500", fontSize: "14px" }}>{stock.Exchange}</Typography>
                        </div>
                        <div className="mx-2">
                          <Typography variant="h6" component="h6" style={{ fontWeight: "600", color: textColor }}>{stock.data.c}</Typography>
                          <Typography className="" variant="h6" component="h6" style={{ fontWeight: "600", fontSize: "15px", color: textColor }}>
                            <i className={arrow} style={{ fontSize: 'medium', fontWeight: 'lighter' }}></i>{`${stock.data.d} (${stock.data.dp}%)`}</Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
