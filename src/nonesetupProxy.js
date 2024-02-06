const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/insta_react',{
      target: 'https://www.instagram.com/',
      changeOrigin: true,
    })
  );
};