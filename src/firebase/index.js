import { initializeApp } from 'firebase/app';
import config from 'config';
import { info } from '../helpers/log.js';

import CronTask from '../cron/CronTask.js';
import auth from './auth.js';
import { reportGeneralInfo, reportAlive } from './server.js';
import { listenQueue } from './queue.js';

const firebaseConfig = config.get('firebase');

async function initialize() {
  initializeApp(firebaseConfig);
  const authValues = await auth();
  await reportGeneralInfo({
    uid: authValues.uid,
    hasPassword: !!authValues.password,
    displayName: authValues.displayName,
  });
  return authValues;
}

function bgReportAlive(serverUid) {
  const cron = new CronTask('Report Alive', '0,30 * * * * *', () => reportAlive(serverUid));
  cron.executeOnce();
  cron.start();
}

function bgListenQueue(serverUid) {
  listenQueue(serverUid);
}

async function start() {
  const { uid, password } = await initialize();
  info(`[Firebase] Signed in as ${uid} (${password ? `password ${password}` : 'no password'})`);

  bgReportAlive(uid);
  bgListenQueue(uid);
}

export default { start };