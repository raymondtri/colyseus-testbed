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

const queue = new Queue(driver);

const app = express();
const port = 3000;

app.use(express.json());

app.post('*', async (req, res) => {
  const [ _, matchmake, method, roomName ] = req.url.split('/');
  const clientOptions = req.body;

  console.log(method)
  console.log(roomName)
  console.log(clientOptions)

  const reservation = await queue.queue({
    roomName,
    method,
    clientOptions,
    authOptions: { // TODO need to implement auth stuff so for now we just wrap? Realistically auth should be handled at the matchmaker process level at this point NOT the room
      token: `matchmakerToken12345`
    }
  })

  res.send(reservation);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});