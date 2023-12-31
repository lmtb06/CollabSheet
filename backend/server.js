import { createServer } from 'http';
import initializeWebSocketServer from './web-socket-server.js';
import app from "./app.js";

const server = createServer(app);

initializeWebSocketServer(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
