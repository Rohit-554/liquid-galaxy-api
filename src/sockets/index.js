import { info, dev, error } from '../helpers/log.js'; // Import the correct log functions
import { ServerError } from '../helpers/server.js';
import controllers from '../controllers/index.js';

const { hello, kml } = controllers;

function errorHandler(err, acknowledgement) {
  if (Object.prototype.isPrototypeOf.call(ServerError.prototype, err)) {
    return acknowledgement && acknowledgement({ error: err.message });
  }

  error('~~~ Unexpected error exception start ~~~');
  error(err);
  error('~~~ Unexpected error exception end ~~~');

  return acknowledgement && acknowledgement({ error: '⁽ƈ ͡ (ुŏ̥̥̥̥םŏ̥̥̥̥) ु' });
}

const controllerHandler = (promise, params) => async (data, acknowledgement) => {
  const boundParams = params ? params(data) : [];
  try {
    const result = await promise(...boundParams);
    return acknowledgement && acknowledgement(result);
  } catch (err) {
    return errorHandler(err, acknowledgement);
  }
};
const c = controllerHandler;

function connectionHandler(socket) {
  dev(`⚡︎ New connection: ${socket.id}`);

  socket.on('disconnect', () => {
    dev(`⚡︎ Disconnection: ${socket.id}`);
  });

  socket.on('G:/', c(hello.hello));
  socket.on('P:/kmls', c(kml.createKml, data => [data]));
  socket.on('P:/kmls/clean', c(kml.cleanKml));
  socket.on('P:/queries', c(kml.createQuery, data => [data]));
}

export default connectionHandler;