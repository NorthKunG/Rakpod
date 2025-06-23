import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  typography:{
    fontFamily:["Poppins","Noto Sans Thai"].join(',')
  },
  
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#FF5412',
      dark:"black"
    },
    error: {
      main: red.A400,
    }, 
   
  },
});

export default theme;
