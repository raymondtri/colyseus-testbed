import { PostgresDriver } from '@colyseus/postgresql-driver'
import express from 'express';

const postgresStr = "postgres://postgres:test@localhost:5432/default"

function getBearerToken(authHeader: string) {
  return (authHeader && authHeader.startsWith("Bearer ") && authHeader.substring(7, authHeader.length)) || undefined;
}

const driver = new PostgresDriver(postgresStr, {
  externalMatchmaker: false,
  // createBehavior: 'queue'
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

  try {
    const response = await driver.invokeMethod(method, roomNameOrID, clientOptions)

    console.log(response)

    res.send(response);
  } catch (e) {
    console.error(e)
    res.status(500).send(e.err);
  }

});

app.listen(port, () => {
  console.log(`Queue Receiver is running on http://localhost:${port}`);
});