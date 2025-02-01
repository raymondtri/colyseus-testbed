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
  externalMatchmaker: false
}, redisStr)

const queue = new Queue(driver, { 
  processFilterConditions: {
    region: 'us-east-1'
  }
 });

const app = express();
const port = 3000;

app.use(express.json());

// I really don't like this get available rooms lol but it's in the spec
// you should be able to have more filters etc. on it
app.get('*', async (req, res) => {
  const [ _, matchmake, roomName ] = req.url.split('/');

})

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