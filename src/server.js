const http = require('http'); // http server module
const url = require('url'); // url module
const query = require('querystring'); // query module
const htmlHandler = require('./htmlResponses.js'); // pull in html handler
const jsonHandler = require('./jsonResponses.js'); // pull in json response handler

// set the port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// function to handle POST requests
const handlePost = (request, response) => {
  const body = [];

  // if upload stream throws error, throw bad request
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // add each piece of data to byte array
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // on end of upload stream
  request.on('end', () => {
    // combine byte array
    // convert to string
    const bodyString = Buffer.concat(body).toString();
    // parse into an object
    const bodyParams = query.parse(bodyString);

    // call addNote function, passing bodyParams
    jsonHandler.addNote(request, response, bodyParams);
  });
};

// key:value object to look up URL routes to specific functions
const urlStruct = {
  // GET
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getNotes': jsonHandler.getNotes,
    notFound: jsonHandler.notFound,
  },
  // HEAD
  HEAD: {
    '/getNotes': jsonHandler.getNotesMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  // POST
  POST: {
    '/addNote': handlePost,
  },
};

// function to handle http requests
const onRequest = (request, response) => {
  // parse the url using the url module
  const parsedUrl = url.parse(request.url);

  // grab the 'accept' headers and split them into an array
  const acceptedTypes = request.headers.accept.split(',');

  // check if the path name matches any in our url path,
  // if it does call that function, if not default to notFound
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response, acceptedTypes);
  } else {
    urlStruct[request.method].notFound(request, response, acceptedTypes);
  }
};

// start the http server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
