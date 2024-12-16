import bluebird from 'bluebird';
import { readFile as _readFile, writeFile as _writeFile } from 'fs';
import { join } from 'path';
import { mkdirp } from 'mkdirp'; // Use named export
import { generate } from 'shortid';
import { generate as _generate } from 'generate-password';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Haikunator from 'haikunator';

import { info, dev, error } from '../helpers/log.js'; // Import the correct log functions
import { encodeUid } from './utils.js';

const { promisify } = bluebird;
const readFile = promisify(_readFile);
const writeFile = promisify(_writeFile);
const createDir = promisify(mkdirp);

async function auth() {
  const auth = getAuth();
  const email = `${generate()}@example.com`;
  const password = _generate({ length: 10, numbers: true });

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      password: password,
      displayName: userCredential.user.displayName,
    };
  } catch (err) {
    error('Error signing in with email and password:', err);
    throw err;
  }
}

function generateDisplayName() {
  const haikunator = new Haikunator({
    defaults: {
      tokenLength: 0,
      delimiter: ' ',
    },
  });
  return haikunator.haikunate();
}

async function generateCredentials() {
  const uid = generate();
  const editKey = _generate({
    length: 20,
    numbers: true,
  });
  const password = '';
  const displayName = generateDisplayName();

  return {
    uid,
    editKey,
    password,
    displayName,
  };
}

export default auth;
export { generateCredentials, generateDisplayName };