import { CronJob } from 'cron';
import { dev } from '../helpers/log.js'; // Import the correct log function

class CronTask {
  constructor(name, cronTime, action) {
    const newAction = async () => {
      dev(`[CRON] Started "${name}"`);
      await action();
      dev(`[CRON] Finished "${name}"`);
    };
    this.action = newAction;
    this.cronJob = new CronJob(cronTime, newAction);
  }

  executeOnce() {
    return this.action();
  }

  start() {
    this.cronJob.start();
  }
}

export default CronTask;