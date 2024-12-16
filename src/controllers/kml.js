import { ServerError } from '../helpers/server.js';
import { saveKmlOnDisk, saveKmlUriOnDisk, cleanKml, saveQueryOnDisk } from '../services/kml.js';

function createKml({ contents, uri }) {
  if (Number(!!contents) + Number(!!uri) !== 1) {
    throw new ServerError('Either Contents or Uri must be defined.', 400);
  }

  return contents ? saveKmlOnDisk(contents) : saveKmlUriOnDisk(uri);
}

function cleanKmlHandler() {
  return cleanKml('');
}

function createQuery({ contents = '' }) {
  return saveQueryOnDisk(contents);
}

export default {
  createKml,
  cleanKml: cleanKmlHandler,
  createQuery,
};