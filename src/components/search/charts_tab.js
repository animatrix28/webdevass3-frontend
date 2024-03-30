import React, { useState, useEffect } from "react";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from "highcharts-react-official";
import { httpCall } from '../../helpers/http_helper';
import indicators from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';
import moment from 'moment';

indicators(Highcharts);
vbp(Highcharts);

const fetchChartData = async (searchQuery, from_date, to_date) => {
    try {
        const response = await httpCall({
            http: `${process.env.REACT_APP_API_HOST}/search/charts/${searchQuery}`,
            method: "POST",
            body: {
                searchQuery: searchQuery,
                from_date: from_date,
                to_date: to_date,
                range: "day"
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching chart data:', error);
        throw error;
    }
};

export default function ChartsTab({ searchQuery }) {
    const [chartData, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentDate = new Date();
                const from_date = moment(currentDate).subtract(2, 'years').format('YYYY-MM-DD');
                const to_date = moment(currentDate).format('YYYY-MM-DD');

                const response = await fetchChartData(searchQuery, from_date, to_date);
                if (!response.data || !Array.isArray(response.data.results)) {
                    throw new Error('Invalid chart data format');
                }
                setData(response);
            } catch (error) {
                console.error('Error in fetching chart data:', error);
            }
        };

        fetchData();
    }, [searchQuery]);

    if (!chartData) {
        return <div>Loading...</div>;
    }
    const ohlc = chartData.data.results.map(item => [
        item.t,
        item.o,
        item.h,
        item.l,
        item.c
    ]);

    const volume = chartData.data.results.map(item => [
        item.t,
        item.v
    ]);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={{
                rangeSelector: {
                    selected: 2
                },
                chart: {
                    backgroundColor: '#FAFAFA',
                    height: 600
                },
                title: {
                    text: `${searchQuery.toUpperCase()} Historical`,
                },
                subtitle: {
                    text: 'With SMA and Volume by Price technical indicators'
                },
                yAxis: [{
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'OHLC'
                    },
                    height: '60%',
                    lineWidth: 2,
                    resize: {
                        enabled: true
                    }
                }, {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'Volume'
                    },
                    top: '65%',
                    height: '35%',
                    offset: 0,
                    lineWidth: 2
                }],
                tooltip: {
                    split: true
                },
                series: [{
                    type: 'candlestick',
                    name: searchQuery.toUpperCase(),
                    id: 'ticker',
                    zIndex: 2,
                    data: ohlc
                }, {
                    type: 'column',
                    name: 'Volume',
                    id: 'volume',
                    data: volume,
                    yAxis: 1
                }, {
                    type: 'vbp',
                    linkedTo: 'ticker',
                    params: {
                        volumeSeriesID: 'volume'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    zoneLines: {
                        enabled: false
                    }
                }, {
                    type: 'sma',
                    linkedTo: 'ticker',
                    zIndex: 1,
                    marker: {
                        enabled: false
                    }
                }
                ]
            }}
        />
    );
}
