import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            style={{ backgroundColor: '#cfcfcf', height: '16px' }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'background.paper',
                py: 3, // padding top and bottom
                // mt: 'auto', // margin top auto to push to bottom
                // margin: 'top auto'
            }}
        >
            <Container maxWidth="lg" >
                <Typography variant="caption" align="center">
                    <span style={{ textAlign: 'center !important', display: 'flex', justifyContent: 'center'}}>
                        <span className='px-1' style={{ 'color': 'black', fontWeight: 'bold' }}>{"Powered by"}</span>
                        <a href='https://www.finnhub.io' target="_blank">Finnhub.io</a>
                    </span>
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;