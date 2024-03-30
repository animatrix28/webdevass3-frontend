import React, { useState, useEffect } from "react";
import '../../css/search.css'
import { httpCall } from '../../helpers/http_helper'
import InsightsChart from "./insights_chart";

const fetchInsightsData = async (searchQuery) => {
    try {
        const response = await httpCall({
            http: `${process.env.REACT_APP_API_HOST}/search/insights/${searchQuery}`,
            method: "POST",
            body: {
                searchQuery: searchQuery
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching chart data:', error);
        throw error;
    }
};

// const sentimentValues = async (sentiments) => {
//     if (!sentiments || sentiments.length === 0) {
//         return [0, 0, 0, 0]; // Return zeros if no data is provided
//     }




//     let positiveM = 0;
//     let negativeM = 0;
//     let positiveCh = 0;
//     let negativeCh = 0;
//     sentiments.forEach(sentiment => {
//         if (sentiment.mspr >= 0) {
//             positiveM += sentiment.mspr;
//         } else if (sentiment.mspr < 0) {
//             negativeM += sentiment.mspr;
//         }

//         if (sentiment.change >= 0) {
//             positiveCh += sentiment.change;
//         } else if (sentiment.change < 0) {
//             negativeCh += sentiment.change;
//         }
//     });
//     // console.log("positive mspr: "+positiveMSPR+" Negative MSPR: "+negativeMSPR+" Positive Change: "+positiveChange+" Negative Change: "+negativeChange);

//     // return [positiveMSPR, negativeMSPR, positiveChange, negativeChange];
// };

export default function InsightsTab({ searchQuery, companyName }) {
    searchQuery = searchQuery.toUpperCase();

    const [insightsData, setInsightsData] = useState(null);
    const [positiveMSPR, setpositiveMSPR] = useState(0);
    const [negativeMSPR, setnegativeMSPR] = useState(0);
    const [positiveChange, setpositiveChange] = useState(0);
    const [negativeChange, setnegativeChange] = useState(0);
    const [recommendationAPI, setrecommendationAPI] = useState(null);
    const [earningsAPI, setearningsAPI] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchInsightsData(searchQuery);
                if (!response) {
                    throw new Error('Invalid Insights data format');
                }
                setInsightsData(response.data);
                setrecommendationAPI(response.data.recommendationAPI);
                setearningsAPI(response.data.earningsAPI);
            } catch (error) {
                console.error('Error in fetching Insights data:', error);
            }

        };
        fetchData();
    }, [searchQuery]);
    // console.log(insightsData.earningsAPI);
    useEffect(() => {

        if (insightsData && insightsData.sentimentAPI && Array.isArray(insightsData.sentimentAPI.data)) {
            let sentiments = insightsData.sentimentAPI.data;
            let positiveM = 0;
            let negativeM = 0;
            let positiveCh = 0;
            let negativeCh = 0;
            sentiments.forEach(sentiment => {
                if (sentiment.mspr >= 0) {
                    positiveM += sentiment.mspr;
                } else if (sentiment.mspr < 0) {
                    negativeM += sentiment.mspr;
                }

                if (sentiment.change >= 0) {
                    positiveCh += sentiment.change;
                } else if (sentiment.change < 0) {
                    negativeCh += sentiment.change;
                }
            });
            setpositiveMSPR(positiveM);
            setnegativeMSPR(negativeM);
            setpositiveChange(positiveCh);
            setnegativeChange(negativeCh);
        }
    }, [insightsData]);

    return (<div>
        <div className="sentiment">
            <h3 className="my-2">Insider Sentiments</h3>
            <table style={{ justifyContent: "center" }}>
                <tr><th>{companyName}</th> <th>MSPR</th> <th>Change</th></tr>
                <tr><th>Total</th> <td>{(positiveMSPR + negativeMSPR).toFixed(2)}</td> <td>{positiveChange + negativeChange}</td></tr>
                <tr><th>Positive</th> <td>{positiveMSPR.toFixed(2)}</td> <td>{positiveChange}</td></tr>
                <tr><th>Negative</th> <td>{negativeMSPR.toFixed(2)}</td> <td>{negativeChange}</td></tr>
            </table>
        </div>
        <div className="container-fluid mt-5" >
            <InsightsChart recommendationAPI={recommendationAPI} earningsAPI={earningsAPI} />
        </div>

    </div>
    );
}