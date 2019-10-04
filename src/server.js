const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getNotes': jsonHandler.getNotes,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getNotes': jsonHandler.getNotesMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {

  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
