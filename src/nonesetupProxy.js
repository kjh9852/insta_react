const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware('https://kjh9852-react-insta.netlify.app/',{
      target: 'https://www.instagram.com/',
      changeOrigin: true,
    })
  );
};