import { httpCall } from '../../helpers/http_helper'
import React, { useState, useEffect } from "react";
import '../../css/search.css';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "bootstrap-icons/font/bootstrap-icons.css";

const moment = require('moment');
const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 350,
    width: '25%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    py: 2,
    borderRadius: 2
};

const fetchNewsData = async (searchQuery, from_date, to_date) => {
    try {
        const response = await httpCall({
            http: `${process.env.REACT_APP_API_HOST}/search/news/${searchQuery}`,
            method: "POST",
            body: {
                searchQuery: searchQuery,
                from_date: from_date,
                to_date: to_date,
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching chart data:', error);
        // throw error;
    }
};

export default function NewsTab({ searchQuery }) {
    const [newsData, setNewsData] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);

    const [open, setOpen] = useState(false);

    let currentDate = new Date();
    let from_date = moment(currentDate).subtract(30, 'day').format('YYYY-MM-DD');
    let to_date = moment(currentDate).format('YYYY-MM-DD');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchNewsData(searchQuery, from_date, to_date);
                const filteredData = response.data.filter(item => item.image && item.url);
                setNewsData(filteredData.slice(0, 20));
                // console.log(newsData);
            } catch (error) {
                console.error('Error in fetching chart data:', error);
            }
        };
        fetchData(); // Call fetchData function when component mounts
    }, [searchQuery, from_date, to_date]);

    const handleCardClick = (data) => {
        setSelectedNews(data);
        setOpen(true); // Open modal on card click
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedNews(null);
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedNews.headline)}&url=${encodeURIComponent(selectedNews.url)}`;
        window.open(twitterUrl, '_blank');
    };

    const handleFacebookShare = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedNews.url)}`, '_blank');
    };

    return (
        <div
            style={{ display: 'flex', flexWrap: 'wrap', marginTop: "15px", cursor: "pointer", flexDirection: 'row', alignItems: 'center' }}
        >
            {newsData.map((item, index) => (
                <div class='news_cards' key={index} onClick={() => handleCardClick(item)}>
                    <img src={item.image} alt="News" />
                    <div className="card-content">
                        <h6>{item.headline}</h6>
                    </div>
                </div>
            ))}
            <Modal
                className='modal-dialog-centered modal-dialog-scrollable modal-dialog-centered-responsive'
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        {selectedNews && (
                            <>
                                <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div>
                                        <Typography className="mx-3" variant="h4" component="h4" style={{ fontWeight: "bold" }}>
                                            {selectedNews.source}
                                        </Typography>
                                        <Typography className="mx-3" variant="subtitle1">
                                            {moment.unix(selectedNews.datetime).format('MMMM DD, YYYY')}
                                        </Typography>
                                    </div>
                                    <i className="bi bi-x mx-3" style={{ color: "blue", fontSize: "15px", position: "relative", cursor: "pointer" }} onClick={handleCloseModal}>
                                        <span style={{ position: "absolute", left: "0", bottom: "1px", width: "100%", borderBottom: "1px solid blue" }}></span>
                                    </i>
                                </div>
                                <Typography className="mx-3" variant="h6" component="h5" sx={{ mt: 2 }} style={{ fontWeight: "bold", lineHeight: "1.2" }}>
                                    {selectedNews.headline}
                                </Typography>
                                <Typography className="mx-3" style={{ lineHeight: "1.3" }}>
                                    {selectedNews.summary}
                                </Typography>
                                <Typography className="mx-3" sx={{ color: '#888' }}>
                                    For more details click <a href={selectedNews.url} target="_blank" rel="noopener noreferrer" style={{ cursor: "pointer" }}>here</a>
                                </Typography>

                                <div className="mt-5 mx-3" style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "10px", height: "100px" }} >
                                    <div className="my-2">Share</div>
                                    <i class="bi bi-twitter-x" style={{ fontSize: "25px", cursor: "pointer" }} onClick={handleTwitterShare}></i>
                                    <i className="bi bi-facebook mx-2" style={{ fontSize: "27px", color: "blue", cursor: "pointer" }} onClick={handleFacebookShare}></i>
                                </div>
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}