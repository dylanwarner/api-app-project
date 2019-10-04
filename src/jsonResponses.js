// object to store notes in
const notes = {};

// function to send json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without json body
// takes request, response, and status code
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// function to get notes
const getNotes = (request, response) => {
  const responseJSON = {
    notes,
  };

  respondJSON(request, response, 200, responseJSON);
};

// function to get meta info about notes object
const getNotesMeta = (request, response) => respondJSONMeta(request, response, 200);

const addNote = (request, response, body) => {
  const responseJSON = {
    message: 'Note is required',
  };

  if (!body.note) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (notes[body.note]) {
    responseCode = 204;
  } else {
    notes[body.note] = {};
  }

  notes[body.note].note = body.note;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// function to handle 404 not found requests
const notFound = (request, response) => {
  // error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

// function for 404 request without message
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getNotes,
  getNotesMeta,
  notFound,
  notFoundMeta,
  addNote,
};
