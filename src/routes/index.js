import { Router } from 'express';
import { info, dev, error } from '../helpers/log.js'; // Import the correct log functions
import { ServerError } from '../helpers/server.js';
import controllers from '../controllers/index.js';

const router = Router();
const {
  hello,
  kml,
} = controllers;

/**
 * Handles controller execution and responds to user (API version).
 * This way controllers are not attached to the API.
 * Web socket has a similar handler implementation.
 * @param promise Controller Promise.
 * @param params (req) => [params, ...].
 */
const controllerHandler = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req) : [];
  try {
    const result = await promise(...boundParams);
    return res.json(result || { message: 'OK' });
  } catch (error) {
    return next(error);
  }
};

router.get('/', controllerHandler(hello.hello));
router.post('/kmls', controllerHandler(kml.createKml, req => [req.body]));
router.post('/kmls/clean', controllerHandler(kml.cleanKml));
router.post('/queries', controllerHandler(kml.createQuery, req => [req.body]));

export default router;