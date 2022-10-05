import { nanoid } from 'nanoid';
import { WebSocketServer } from 'ws';

import { restaurants } from './restaurants.mjs';

const port = process.env.PORT || 80;
const wss = new WebSocketServer({ port });
const clients = new Map();

console.log(`Websocket running on port :${port}`);

wss.on('connection', function connection(ws) {  
  console.info(`[${wss.clients.size}] clients has been connected!`);
  
  const id = nanoid();

  clients.set(ws, { id, send_count: 0 });

  const intervalId = setInterval(function () {
     const index = Math.floor(Math.random() * restaurants.length);
     const client = clients.get(ws);
     
     if (!client) {
        return clearInterval(intervalId);
     }
     
     client.send_count++;
     clients.set(ws, client);

     ws.send(JSON.stringify(restaurants[index]));

     console.log(`[${client.id}] has been send ${client.send_count} times.`);
  }, 10_000);

  ws.on('close', function () {
    console.info(`[${wss.clients.size}] clients has been connected!`);

    clients.delete(ws); 
  });
});
