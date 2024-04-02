import React, { useState, useEffect } from "react";
import '../../css/search.css'
import SummaryChart from "./charts_summary";
import { httpCall } from '../../helpers/http_helper'


export default function SummaryTab({ highPrice, lowPrice, openPrice, prevClosePrice, webPage, ipo, industry, companyPeers, searchQuery, timeStamp, onPeerClick }) {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handlePeerClick = (peer) => {
        if (onPeerClick) {
            onPeerClick(peer);
        }
    };


    return (
        <div className="container">
            <div class="row">
                <div class="col-md-6 col-sm-12 d-flex flex-column">
                    <div className="price_detail my-4 d-flex flex-column row align-items-center align-items-md-start" >
                        <span style={{ width: "fit-content" }}><b>High Price:</b> {highPrice} </span>
                        <span style={{ width: "fit-content" }}><b>Low Price:</b> {lowPrice}</span>
                        <span style={{ width: "fit-content" }}><b>Open Price:</b> {openPrice} </span>
                        <span style={{ width: "fit-content" }}><b>Prev. Close:</b> {prevClosePrice}</span>
                    </div>

                    <div className="about_company row d-flex flex-column" style={{ textAlign: "center" }} >
                        <p style={{ textDecoration: 'underline', fontWeight: '500', fontSize: '22px', marginBottom: '15px' }}>About the company</p>
                        <p style={{ fontSize: '15px' }}><b style={{ fontWeight: 500 }}>IPO Start Date:</b> {ipo}</p>
                        <p style={{ fontSize: '15px' }}><b style={{ fontWeight: 500 }}>Industry:</b> {industry}</p>
                        <p style={{ fontSize: '15px' }}><b style={{ fontWeight: 500 }}>Webpage:</b> <a href={webPage} target="_blank">{webPage}</a></p>
                        <p style={{ fontSize: '15px' }}><b style={{ fontWeight: 500 }}>Company peers:</b></p>
                        <div className="d-flex flex-wrap justify-content-center align-items-center">
                            {Array.isArray(companyPeers) && companyPeers.map((peer, index) => (
                                !peer.includes(".") && (
                                    <span key={index} className="peer" onClick={() => handlePeerClick(peer)} style={{}}>
                                        {peer}{index < companyPeers.length - 1 && ","}&nbsp;
                                    </span>
                                )
                            ))}
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-sm-6">
                    <div className="hourly_chart">
                        {windowWidth >= 350 && <SummaryChart searchQuery={searchQuery} timeStamp={timeStamp} />}
                    </div>
                </div>

            </div>
        </div>
    );
} 