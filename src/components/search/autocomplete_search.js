import { Autocomplete, InputAdornment, TextField, IconButton, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { httpCall } from '../../helpers/http_helper'
import StockDetails from './stock_detail';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";

// import debounce from 'lodash.debounce';

export default function AutoCompleteSearch({ setSelectedStock, setSearchQuery, setQueryCheck }) {
  const [open, setOpen] = useState(false); // State to track if auto complete is open or not.
  const [value, setValue] = useState([]); // State to keep track of selected items
  var [inputValue, setInputValue] = useState(''); // State for the input value
  const [options, setOptions] = useState([]); // Options
  // const [options, setOptions] = useState(["YUP","YUP1","OUTER","queib","QUEYREU","affunB"]); // Options
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // const [selectedStock, setSelectedStock] = useState(null);
  // const [searchQuery, setSearchQuery] = useState(null);

  // useEffect(()=>{
  //   let squery = localStorage.getItem("search_query");
  //   // && inputValue == ""
  //   if (squery && inputValue !== "") {
  //     stockSearch(squery);
  //     setInputValue(squery)
  //     // console.log("ANimehs"+squery);

  //   }
  // },[])

  useEffect(()=>{
    if (location.state){
      stockSearch(location.state.search_query);
      setInputValue(location.state.search_query);
    }
  },[])

  const handleOpen = () => {
    if (inputValue.trim() !== '') {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseButton = () => {
    setOpen(false);
    setInputValue("");
    localStorage.removeItem("search_query");
  };

  const handleSearch = async (searchQuery, { autocomplete = false }) => {
    try {
      // const controller = new AbortController();
      // const signal = controller.signal;

      // if (loading && options){
      //   setOptions([]);
      //   controller.abort()
      // }

      setLoading(true);
      setShowSpinner(true);
      setOptions([]);

      let response = await httpCall(
        {
          http: `${process.env.REACT_APP_API_HOST}/search/${searchQuery}`,
          method: "POST",
          // body: {"search_query":searchQuery}
          // signal: signal
        }
      );

      if (response.error) {
        console.log(response.error)
      }
      else {
        if (autocomplete) {
          // console.log(response.data)
          // console.log(response)

          // const optionList = String(response.data) !== '{}' ? response.data.result.map((option)=>`${option.symbol} | ${option.description}`) : []
          const optionList = response.data.result.filter(option => option.type === "Common Stock" && !option.symbol.includes("."))
            .map((option) => `${option.symbol} | ${option.description}`)
          if (response.data.result === null) {
            setQueryCheck(0);
          } else {
            setQueryCheck(1);
          }
          setOptions(optionList);
          setLoading(false);
          setShowSpinner(false);
        }
        else {
          setLoading(false);
          console.log("Search click handler")
        }
      }
    } catch (error) {
      setLoading(false);
      setShowSpinner(false);
      if (error.name === 'AbortError') {
        console.log('Fetch request was aborted');
      } else {
        console.error('Fetch error:', error);
      }
    }
  };

  const handleInputChange = async (event, newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue.trim() !== '') {
      setOpen(true);
      handleSearch(newInputValue, { autocomplete: true });
    } else {
      setOpen(false);
    }
  };


  const handleEnterKeyPress = async (event) => {
    if (event.key === 'Enter') {
      stockSearch(inputValue);
      handleClose();
    }
  };
  //when search button or enter key is pressed or any option is selected, this function is called with the input value.
  const handleOptionSelected = (event, value) => {
    if (value) {
      stockSearch(value);
      handleClose();
    }
  };
  const stockSearch = (search_query) => {
    // console.log("ANIMESH: " + search_query);
    setSelectedStock(search_query.split('|')[0].trim());
    setSearchQuery(search_query.split('|')[0].trim());
    
    // console.log(location.state.search_query)

    navigate(`/search/${search_query}`,{state:{search_query: search_query}});
    localStorage.setItem('search_query', search_query);
  };

  useEffect(() => {
    // Hide spinner after 3 seconds
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 3000);

    // Clear timeout on component unmount
    return () => clearTimeout(timer);
  }, [showSpinner]);

  return (
    <div>
      <div>
        <Autocomplete
          freeSolo={true}
          options={options}
          loading={loading}
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          onInputChange={handleInputChange}
          inputValue={inputValue}

          getOptionLabel={(option) => option}
          onChange={handleOptionSelected}

          renderInput={(params) => (
            <TextField
              {...params}
              // variant="standard"
              placeholder="Enter stock ticker symbol"
              variant="outlined"
              onKeyDown={handleEnterKeyPress}
              InputProps={{
                ...params.InputProps,
                style: {
                  color: '#000000', // Placeholder text color
                  paddingLeft: '30px'
                },

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => stockSearch(inputValue)}>
                      <SearchIcon />
                    </IconButton>
                    <IconButton onClick={handleCloseButton}>
                      <CloseIcon />
                    </IconButton>
                    {/* {loading && <CircularProgress size={20} />} */}
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  border: '3px solid #16148b',
                },
                width: '30vw',
                height: '16px'
              }}
            />
          )}
        />
        {showSpinner && (
          <Box className="mt-5" display="flex" justifyContent="center">
            <CircularProgress size={20} />
          </Box>
        )}
      </div>

    </div>
  );
}