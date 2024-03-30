import { httpCall } from '../../helpers/http_helper'
import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { red } from '@mui/material/colors';
import '../../css/search.css'

const moment = require('moment');

const fetchChartData = async (searchQuery, from_date, to_date) => {
    try {
        const response = await httpCall({
            http: `${process.env.REACT_APP_API_HOST}/search/charts/${searchQuery}`,
            method: "POST",
            body: {
                searchQuery: searchQuery,
                from_date: from_date,
                to_date: to_date,
                range: "hour"
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching chart data:', error);
        throw error;
    }
};

function formatDate(epochTime) {
    const date = new Date(epochTime * 1000); // Convert seconds to milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export default function InsightsChart({ recommendationAPI, earningsAPI }) {
    const [recommendationChart, setrecommendationChart] = useState(null);
    const [earningChart, setEarningChart] = useState(null);

    useEffect(() => {
        if (recommendationAPI && earningsAPI) {
            //Historical EPS Surpise Chart
            // Extracting [period, actual] data
            const actualData = earningsAPI.map(item => [
                item.period || '', // If period is null, replace with empty string
                item.actual || 0   // If actual is null, replace with 0
            ]);
            // Extracting [period, estimate] data
            const estimateData = earningsAPI.map(item => [
                item.period || '',   // If period is null, replace with empty string
                item.estimate || 0   // If estimate is null, replace with 0
            ]);
            const surpriseValue = earningsAPI.map(item => [
                item.surprise || 0,   // If period is null, replace with empty string
                item.surprisePercent || 0   // If estimate is null, replace with 0
            ]);

            const chartearning = {
                chart: {
                    backgroundColor: '#FAFAFA',
                    type: 'spline'
                },
                title: {
                    text: 'Historical EPS Surprises'
                },
                xAxis: [{
                    categories: actualData.map((dataPoint, index) => actualData[index][0] + '<br>' + "Surprise: "+ surpriseValue[index][0]), // Setting the x-axis labels 
                },
                {
                    categories: [], // Empty categories array for the second xAxis
                }],
              
                yAxis: {
                    title: {
                        text: 'Quaterly EPS'
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                series: [
                    {
                        name: 'Actual',
                        data: actualData.map(dataPoint => dataPoint[1])
                    },
                    {
                        name: 'Estimate',
                        data: estimateData.map(dataPoint => dataPoint[1])
                    }
                ]
            };

            const recommendationData = recommendationAPI.map(item => ({
                period: item.period || '', // If period is null, replace with empty string
                'Strong Buy': item.strongBuy || 0,
                'Buy': item.buy || 0,
                'Hold': item.hold || 0,
                'Sell': item.sell || 0,
                'Strong Sell': item.strongSell || 0
            }));

            const recommendation = {
                chart: {
                    type: 'column',
                    backgroundColor: '#FAFAFA'
                },
                title: {
                    text: 'Recommendation Trends',
                    align: 'center'
                },
                xAxis: {
                    categories: recommendationData.map(item => item.period || '')
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '# Analysis'
                    },
                    stackLabels: {
                        enabled: true
                    }
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    name: 'Strong Buy',
                    data: recommendationData.map(item => item['Strong Buy']),
                    color: '#1A6335'
                }, {
                    name: 'Buy',
                    data: recommendationData.map(item => item['Buy']),
                    color: '#24B050'
                }, {
                    name: 'Hold',
                    data: recommendationData.map(item => item['Hold']),
                    color: '#B07E29'
                }, {
                    name: 'Sell',
                    data: recommendationData.map(item => item['Sell']),
                    color: '#F24F54'
                }, {
                    name: 'Strong Sell',
                    data: recommendationData.map(item => item['Strong Sell']),
                    color: '#752B2C'
                }]
            };

            setEarningChart(chartearning);
            setrecommendationChart(recommendation);

        }
    }, [recommendationAPI, earningsAPI]);
    if (!recommendationAPI || !earningsAPI) {
        return null;
    }

    return (
        <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="recommendationChart">
                <HighchartsReact highcharts={Highcharts} options={recommendationChart} />
                </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="surpriseChart ms-2">
                    <HighchartsReact highcharts={Highcharts} options={earningChart} />
                </div>
            </div>
        </div>
    );
}
