const securityHeaders = (req, res, next) => {
    // Set security headers
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self'",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    });
  
    // Simple CORS configuration (customize as needed)
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
    next();
  };
  
  export default securityHeaders;