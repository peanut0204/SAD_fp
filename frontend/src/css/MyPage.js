import { createTheme } from '@mui/material/styles';

const hexColorToRGB = function (hexColor) {
  let detectShorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i; // #000 vs #000000
  hexColor = hexColor.replace(detectShorthand, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const hex_array = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor); // #000000 to #ffffff
  return hex_array
    ? {
        r: parseInt(hex_array[1], 16), // 0-255
        g: parseInt(hex_array[2], 16), // 0-255
        b: parseInt(hex_array[3], 16), // 0-255
      }
    : null;
};
  
const hexToRGBAlpha = function (hexColor, alpha) {
  let rgb = hexColorToRGB(hexColor);
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
};
  
const drawerWidth = 260;
  
const transition = {
  transition: "all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)",
};
  
const containerFluid = {
  paddingRight: "5px",
  paddingLeft: "15px",
  marginRight: "5px",
  marginLeft: "5px",
  width: "100%",
};
const container = {
  ...containerFluid,
};

const boxShadow = {
  boxShadow:
    "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
};

const defaultFont = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: "300",
  lineHeight: "1.5em",
};

// Main Color
const primaryColor = "#5e3f26";
const bgColor = "#e8e6e4";
const brownColor = "#a77356"
const greyColor = "#9999"

// Default Color
/*
const warningColor = "#ff9800";
const dangerColor = "#f44336";
const successColor = "#4caf50";
const infoColor = "#00acc1";
const roseColor = "#e91e63";
*/

// BoxShadow
/*
const primaryBoxShadow = {
  boxShadow: `0 12px 20px -10px ${hexToRGBAlpha(
    primaryColor,
    0.28
  )}, 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px ${hexToRGBAlpha(
    primaryColor,
    0.2
  )}`,
};
const infoBoxShadow = {
  boxShadow: `0 12px 20px -10px ${hexToRGBAlpha(
    infoColor,
    0.28
  )}, 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px ${hexToRGBAlpha(
    infoColor,
    0.2
  )}`,
};
*/

// 大標題
const title = {
  color: primaryColor,
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold', 
};

// 白色大框框
const content = {
  marginLeft: '50px',
  marginRight: '50px',
  marginTop: '50px',
  marginBottom: '50px',
  padding: '2%',
  backgroundColor: 'white',
  borderRadius: '16px',
};

// 認養方案白色大框框
const plan = {
  marginLeft: '200px',
  marginRight: '200px',
  marginTop: '50px',
  marginBottom: '50px',
  padding: '2%',
  backgroundColor: 'white',
  borderRadius: '16px',
};

// 定義主題
const brownTheme = createTheme({
  palette: {
    primary: {
      main: brownColor,
    },
    secondary: {
      main: primaryColor,
    },
  },
});

// 分隔線
const divLine = {
  flex: '1', 
  height: '1px', 
  backgroundColor: primaryColor, 
  margin: '20px 50px'
};
  
export {
  hexToRGBAlpha,
  //variables
  drawerWidth,
  transition,
  container,
  containerFluid,
  boxShadow,
  defaultFont,
  // Main Color
  primaryColor,
  bgColor,
  brownColor,
  greyColor,
  // 自定義
  title, 
  brownTheme, 
  content,
  plan, 
  divLine, 
};
  