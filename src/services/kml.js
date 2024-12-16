import config from 'config';
import fs from 'fs';
import bluebird from 'bluebird'; // Import the default export
import { v4 as uuidv4 } from 'uuid';

const { promisify } = bluebird;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const kmlPath = config.get('kmlPath');
const tmpKmlPath = config.get('tmpKmlPath');
const tmpKmlUrl = config.get('tmpKmlUrl');
const queriesPath = config.get('queriesPath');

/**
 * Saves KML file on disk and sets the kmls.txt to point at it.
 * @param data KML contents.
 */
export async function saveKmlOnDisk(contents) {
  const id = uuidv4();
  await writeFile(tmpKmlPath, contents);
  return writeFile(kmlPath, `${tmpKmlUrl}?${uuidv4()}`);
}

/**
 * Overrides kmls.txt to point to the indicated URI.
 * @param uri any uri (i.e. http://192.168.1.10/kmls.txt).
 */
export function saveKmlUriOnDisk(uri) {
  return writeFile(kmlPath, `${uri}?${uuidv4()}`);
}

/**
 * Empties kmls.txt.
 */
export function cleanKml() {
  return writeFile(kmlPath, '');
}

export function saveQueryOnDisk(contents) {
  return writeFile(queriesPath, contents);
}