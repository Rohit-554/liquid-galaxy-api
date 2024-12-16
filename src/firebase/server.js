import { getDatabase, ref, serverTimestamp } from 'firebase/database';
import { encodeUid, encodedPublicIp } from './utils.js';

const SERVER_TIME = serverTimestamp();

function serverRef(uid) {
  const encodedUid = encodeUid(uid);
  return ref(getDatabase(), `/servers/${encodedUid}`);
}

async function ipRef(uid) {
  const encodedUid = encodeUid(uid);
  const ip = await encodedPublicIp();
  return ref(getDatabase(), `/ips/${ip}/${encodedUid}`);
}

async function reportGeneralInfo({ uid, hasPassword = false, displayName = '' }) {
  const serverReference = serverRef(uid);
  await serverReference.set({
    uid,
    hasPassword,
    displayName,
    lastSeen: SERVER_TIME,
  });
}

async function reportAlive(uid) {
  const serverReference = serverRef(uid);
  await serverReference.update({
    lastSeen: SERVER_TIME,
  });
}

export { reportGeneralInfo, reportAlive };