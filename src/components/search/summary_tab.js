import React, { useState, useEffect } from "react";
import '../../css/search.css'
import SummaryChart from "./charts_summary";
import { httpCall } from '../../helpers/http_helper'


export default function SummaryTab({ highPrice, lowPrice, openPrice, prevClosePrice, webPage, ipo, industry, companyPeers, searchQuery, timeStamp, onPeerClick }) {
    const handlePeerClick = (peer) => {
        if (onPeerClick) {
            onPeerClick(peer);
        }
    };


    return (
        <div className="summary_tab">
            <div>
                <div className="price_detail my-4 mx-5">
                    <b>High Price:</b> {highPrice} <br /> <b>Low Price:</b> {lowPrice} <br /> <b>Open Price:</b> {openPrice} <br /> <b>Prev. Close:</b> {prevClosePrice}
                </div>

                <div className="about_company mx-5">
                    <p style={{ textDecoration: 'underline', fontWeight: '500', fontSize: '22px', marginBottom: '28px' }}>About the company</p>
                    <p style={{ fontSize: '15px' }}><b style={{ fontWeight: 500 }}>IPO Start Date:</b> {ipo}</p>
                    <p style={{ fontSize: '15px' }}><b style={{ fontWeight: 500 }}>Industry:</b> {industry}</p>
                    <p style={{ fontSize: '15px' }}><b style={{ fontWeight: 500 }}>Webpage:</b> <a href={webPage} target="_blank">{webPage}</a></p>
                    <p style={{ fontSize: '15px' }}><b style={{ fontWeight: 500 }}>Company peers:</b></p>

                    {Array.isArray(companyPeers) && companyPeers.map((peer, index) => (
                        <span key={index} className="peer" onClick={() => handlePeerClick(peer)}>
                            {peer}{index < companyPeers.length - 1 && ","}&nbsp;
                        </span>
                    ))}
                </div>
            </div>
            <div className="hourly_chart">
                {/* <SummaryChart searchQuery={searchQuery} timeStamp={timeStamp} /> */}
            </div>
        </div>
    );
} 