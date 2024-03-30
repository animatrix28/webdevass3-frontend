import { httpCall } from '../../helpers/http_helper'
import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
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

export default function SummaryChart({ searchQuery, timeStamp }) {
    const [chartData, setChartData] = useState(null);
    const [highchartsOptions, setHighchartsOptions] = useState(null);
    const [chartColor, setchartColor] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                let from_date = "", to_date = "";
                const current_date = new Date();
                const currentTime = current_date.getTime() / 1000;
                // console.log(currentTime - timeStamp);
                if ((currentTime - timeStamp) <= 300) {
                    from_date = moment(current_date).subtract(1, 'day').format('YYYY-MM-DD');
                    to_date = moment(current_date).format('YYYY-MM-DD');
                    setchartColor("green");
                }
                else {
                    from_date = moment(formatDate(timeStamp)).subtract(1, 'day').format('YYYY-MM-DD');
                    to_date = formatDate(timeStamp);
                    setchartColor("red");
                }

                const response = await fetchChartData(searchQuery, from_date, to_date);
                if (!response.data || !Array.isArray(response.data.results)) {
                    throw new Error('Invalid chart data format');
                }
                setChartData(response.data.results);

                const seriesData = response.data.results.map(item => [item.t, item.c]);
                const chartsOptions = {
                    chart:{backgroundColor: '#FAFAFA'},
                    accessibility: {
                        enabled: false
                    },
                    title: {
                        text: searchQuery.toUpperCase() + ' Hourly Price Variation',
                        style: {
                            fontSize: 15,
                            color: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            format: '{value: %H:%M}'
                        },
                        title: {
                            text: ""
                        }
                    },
                    yAxis: {
                        title: {
                            text: ""
                        },
                        opposite: true,
                    },
                    legend: { enabled: false },
                    series: [{
                        name: '',
                        data: seriesData,
                        type: 'line',
                        threshold: null,
                        color: chartColor,
                        pointWidth: 3,
                        tooltip: {
                            valueDecimals: 2
                        },
                        marker: {
                            enabled: false // Setting this to false removes the points
                        }
                    }]
                };

                setHighchartsOptions(chartsOptions);
            } catch (error) {
                console.error('Error in fetching chart data:', error);
            }
        };

        fetchData();
    }, [searchQuery, timeStamp, chartColor]);

    return (
        <div>
            {highchartsOptions ? (
                <HighchartsReact
                    highcharts={Highcharts}
                    options={highchartsOptions}
                />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}
