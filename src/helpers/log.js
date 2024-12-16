import debug from 'debug';
import config from 'config';

const { has, get } = config;

const prefix = has('log.prefix') ? get('log.prefix') : '';

const info = debug(`${prefix}info`);
const dev = debug(`${prefix}dev`);
const error = debug(`${prefix}error`);

export { info, dev, error };