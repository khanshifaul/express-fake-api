const logger = (req, res, next) => {
    const start = Date.now();
    const { method, originalUrl, ip } = req;
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `${method} ${originalUrl} - ${res.statusCode} - ${duration}ms - ${ip}`
      );
    });
  
    next();
  };
  
  export default logger;