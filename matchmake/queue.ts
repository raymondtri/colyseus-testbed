import { Queue } from '@colyseus/matchmaker'
import { ValkeyDriver } from '@colyseus/valkey-driver'
import express from 'express';

function getBearerToken(authHeader: string) {
  return (authHeader && authHeader.startsWith("Bearer ") && authHeader.substring(7, authHeader.length)) || undefined;
}

const redisStr = `redis://127.0.0.1:6379`;

const driver = new ValkeyDriver({
  metadataSchema: {
    region: 'string',
    taskId: 'string',
  },
  processProperties: ['region', 'taskId'],
  externalMatchmaker: false
}, redisStr)

const queue = new Queue(driver);

const app = express();
const port = 3000;

app.use(express.json());

app.post('*', async (req, res) => {
  const [ _, matchmake, method, roomNameOrID ] = req.url.split('/');
  const clientOptions = req.body;

  console.log(method)
  console.log(roomNameOrID)
  console.log(clientOptions)

  // TODO authentication

  const response = await queue.invokeMethod(method, roomNameOrID, clientOptions)

  res.send(response);
});

app.listen(port, () => {
  console.log(`Queue Receiver is running on http://localhost:${port}`);
});