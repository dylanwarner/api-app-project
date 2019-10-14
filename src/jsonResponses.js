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
    message: 'Title and note are both required.',
  };

  // if the note or title or color are missing, missing params response
  if (!body.note || !body.title || !body.color) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // create 201 response code
  let responseCode = 201;

  // if the title is in the post, update the content
  if (notes[body.title]) {
    responseCode = 204;
  } else {
    notes[body.title] = {};
  }

  notes[body.title].title = body.title;
  notes[body.title].note = body.note;
  notes[body.title].color = body.color;


  // if response code is 201, send created response
  if (responseCode === 201) {
    responseJSON.message = 'Note added.';
    return respondJSON(request, response, responseCode, responseJSON);
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
