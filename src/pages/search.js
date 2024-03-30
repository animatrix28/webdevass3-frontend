import React, { useState, useEffect } from "react";
import { Box, Typography } from '@mui/material';
import AutoCompleteSearch from '../components/search/autocomplete_search';
import '../css/search.css'
import StockDetails from '../components/search/stock_detail';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SummaryTab from "../components/search/summary_tab";
import ChartsTab from "../components/search/charts_tab";
import NewsTab from "../components/search/news_tab";
import InsightsTab from "../components/search/insights_tab";
import { height } from "@mui/system";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const [highPrice, setHighPrice] = useState("");
  const [lowPrice, setLowPrice] = useState("");
  const [openPrice, setOpenPrice] = useState("");
  const [prevClosePrice, setprevClosePrice] = useState("");
  const [webPage, setWebPage] = useState("");
  const [ipo, setIPO] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyPeers, setCompanyPeers] = useState("");
  const [timeStamp, setCurrentTimet] = useState(null);
  const [companyName, setNameCompany] = useState("");
  const [queryCheck, setQueryCheck] = useState(null);
  const [showDiv, setShowDiv] = useState(null);

  useEffect(() => {
    if (queryCheck === 1) {
      setShowDiv(component);
    } else if (queryCheck === 0) {
      setShowDiv(tickerNotFound);
    }
  }, [queryCheck, selectedStock]);

  const handlePeerClick = (peer) => {
    setSearchQuery(peer); // Set the selected peer as the new search query
    setSelectedStock(peer); // Update the selected stock to trigger rendering of StockDetails component
  };

  const tabs = [
    {
      label: 'Summary', content: <SummaryTab highPrice={highPrice} lowPrice={lowPrice} openPrice={openPrice}
        prevClosePrice={prevClosePrice} webPage={webPage} ipo={ipo} industry={industry} companyPeers={companyPeers} searchQuery={searchQuery}
        timeStamp={timeStamp} onPeerClick={handlePeerClick} />
    },
    { label: 'Top News', content: <NewsTab searchQuery={searchQuery} /> },
    { label: 'Charts', content: <ChartsTab searchQuery={searchQuery} /> },
    { label: 'Insights', content: <InsightsTab searchQuery={searchQuery} companyName={companyName} /> }
  ];

  const tickerNotFound = (<div className="d-flex flex-column" style={{ alignItems: "center" }}>
    <div className="mx-4 mt-5 mb-3" style={{ fontWeight: "400", fontSize: "30px", width: "55%", minWidth: "400px" }}>
    </div>
    <div className="mx-md-5 mx-sm-4 mt-2 d-flex" style={{
      border: "1px solid lightgrey", borderRadius: "5px", width: "55%", minWidth: "400px",
      height: "100%", minHeight: "45px", alignItems: "center", justifyContent: "center", backgroundColor: "#F6D2D6"
    }}>
      <span className="d-flex" style={{ flex: 1, justifyContent: "center" }}>Please enter a valid ticker.</span>
      <i className="bi bi-x mx-2" style={{ fontSize: "25px", position: "relative", cursor: "pointer" }}></i>
    </div>
  </div>);

  const component = (<div class="stock_details" >
    {selectedStock && (
      <div style={{ minHeight: "50vh", height: "100%" }}>
        <StockDetails selectedStock={selectedStock} searchQuery={searchQuery}
          setHighPrice={setHighPrice} setLowPrice={setLowPrice} setOpenPrice={setOpenPrice} setprevClosePrice={setprevClosePrice}
          setWebPage={setWebPage} setIPO={setIPO} setIndustry={setIndustry} setCompanyPeers={setCompanyPeers} setCurrentTimet={setCurrentTimet}
          setNameCompany={setNameCompany}

          style={{}} />

        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          aria-label="basic tabs example"
          sx={{ width: '100%' }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label.charAt(0).toUpperCase() + tab.label.slice(1).toLowerCase()} sx={{ textTransform: 'none', width: '290px' }} />
          ))}
        </Tabs>
        {tabs[activeTab].content}

      </div>
    )}
  </div>);

  return (
    // {loading && <CircularProgress size={20} />}
    <Box
      className="main_box"
      component="main"
      sx={{
        flexGrow: 1,
      }}>
      <div style={{ padding: '20px' }}>
        <Typography align="center" variant="h4" component="div" sx={{ flexGrow: 1 }}>
          STOCK SEARCH
        </Typography>
      </div>
      <div className="search_bar">
        <AutoCompleteSearch setSelectedStock={setSelectedStock} setSearchQuery={setSearchQuery} setQueryCheck={setQueryCheck} />
      </div>
      {component}
    </Box>

  );
}