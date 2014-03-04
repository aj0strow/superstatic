var path = require('path');
var deliver = require('deliver');
var mime = require('mime');
var url = require('url');

module.exports = function (fileStore) {
  return function (req, res, next) {
    res.send = function (pathname, isNotRelative, statusCode) {
      req.url = (isNotRelative)
        ? pathname
        : fileStore.getPath(path.join('/', req.config.cwd, pathname || ''));
      
      // S3 content types aren't set,
      // so they need to be set
      res.on('header', function () {
        res.setHeader('content-type', mime.lookup(url.parse(req.url).pathname));
      });
      
      // return deliver(req).pipe(res);
      
      return deliver(req, {
        statusCode: statusCode
      }).pipe(res);
    };
    
    next();
  };
};