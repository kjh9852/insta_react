const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/oauth',
    createProxyMiddleware({
      target: 'https://api.instagram.com',
      changeOrigin: true,
    })
  );
};