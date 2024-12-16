import { publicIpv4 } from 'public-ip';
import { info, dev, error } from '../helpers/log.js'; // Import the correct log functions

/**
 * Uid is part of the firebase email name. This encoding makes sure to use only email valid
 * characters.
 * @param uid
 */
function encodeUid(uid) {
  return uid.split('').reduce((prev, curr) => {
    const encodedCurr = curr.charCodeAt(0);
    return `${prev}${encodedCurr}`;
  }, '');
}

/**
 * Fetches current public IP, and returns it Firebase encoded.
 */
async function fetchPublicIp() {
  try {
    const ip = await publicIpv4();
    return encodeUid(ip);
  } catch (error) {
    error('Error fetching public IP:', error);
    throw error;
  }
}

export { encodeUid, fetchPublicIp as encodedPublicIp };