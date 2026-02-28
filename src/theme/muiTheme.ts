import { createTheme } from '@mui/material/styles';

// MUI Theme for DatePicker to match brand colors
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#8B7355', // brand-brown
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#8B7355',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#8B7355',
            borderWidth: '2px',
          },
        },
      },
    },
  },
});
