// utils/formatNumber.js
const scales = [
    { value: 1e6, label: 'million' },
    { value: 1e9, label: 'billion' },
    { value: 1e12, label: 'trillion' },
    { value: 1e15, label: 'quadrillion' },
    { value: 1e18, label: 'quintillion' },
  ];
  
  export const formatNumber = (num) => {
    if (num < 1000) {
      return num.toLocaleString();
    }
  
    for (let i = scales.length - 1; i >= 0; i--) {
      if (num >= scales[i].value) {
        const formattedNum = (num / scales[i].value).toFixed(3);
        return `${formattedNum} ${scales[i].label}`;
      }
    }
  
    return num.toLocaleString();
  };