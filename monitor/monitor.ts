import Redis from 'iovalkey';

const redisStr = `redis://127.0.0.1:6379`;

const client = new Redis(redisStr);

client.monitor((err, monitor) => {
  if (err) {
    console.error('Error starting Redis monitor:', err);
    return;
  }
  console.log('Entering monitoring mode.');
  
  if(!monitor) throw new Error('Monitor is not defined');

  monitor.on('monitor', (time, args, source, database) => {
    console.log(`Time: ${time}, Command: ${args.join(' ')}, Source: ${source}, Database: ${database}`);
  });
});