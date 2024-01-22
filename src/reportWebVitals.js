const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => { //Web Vitals Metrics
      getCLS(onPerfEntry); // cumulative layout shift
      getFID(onPerfEntry); // first input delay
      getFCP(onPerfEntry); // First Contentful Paint
      getLCP(onPerfEntry); // largest contentful paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

export default reportWebVitals;
