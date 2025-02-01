import { Queue } from '@colyseus/matchmaker'
import { ValkeyDriver } from '@colyseus/valkey-driver'

const redisStr = `redis://127.0.0.1:6379`;

const driver = new ValkeyDriver({
  metadataSchema: {
    region: 'string',
    taskId: 'string',
  },
  externalMatchmaker: false
}, redisStr)

const queue = new Queue(driver, { 
  processFilterConditions: {
    region: 'us-east-1'
  }
 });

const main = async () => {
  await queue.process()
}

// you want the queue to process every so often
// 5-10 seconds is reasonable
setInterval(main, 5000);