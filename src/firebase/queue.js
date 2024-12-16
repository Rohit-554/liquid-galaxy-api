import { getDatabase, ref, onValue } from 'firebase/database';
import { info, dev, error } from '../helpers/log.js'; // Import the correct log functions
import { encodeUid } from './utils.js';
import controllers from '../controllers/kml.js';

const { kml } = controllers;

/* eslint-disable quote-props */
const routes = value => ({
  'kml:value': () => kml.createKml({ contents: value }),
  'kml:href': () => kml.createKml({ uri: value }),
  'kml:clean': () => kml.cleanKml(),
  'queries': () => kml.createQuery({ contents: value }),
});
/* eslint-enable quote-props */

function controllerHandler(route, value) {
  const handler = routes(value)[route];
  if (handler) {
    handler().catch(error => error(`Error handling route ${route}:`, error));
  } else {
    error(`No handler found for route ${route}`);
  }
}

function listenQueue(uid) {
  const encodedUid = encodeUid(uid);
  const queueRef = ref(getDatabase(), `/queue/${encodedUid}`);
  onValue(queueRef, snapshot => {
    const value = snapshot.val();
    if (value) {
      Object.keys(value).forEach(route => {
        controllerHandler(route, value[route]);
      });
    }
  });
}

export { listenQueue };