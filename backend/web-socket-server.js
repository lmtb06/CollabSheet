import { WebSocketServer } from 'ws';
import { NiveauPermission } from '../commun/models/permission.mjs';
import { verifierPermission } from './middlewares/documentMiddleware.js'
import { verifyTokenAndGetAccount } from './middlewares/authMiddleware.js';
import Document from './models/document/document.js';
import rooms from "./rooms.js";

const initializeWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, request) => {
    let authenticated = false;
    let isAuthorized = false;

    ws.on('message', async (message) => {
      if (!authenticated) {
        // Traitement du message d'authentification
        const data = JSON.parse(message);
        if (data.type === 'auth') {
          try {
            const compte = await verifyTokenAndGetAccount(data.token);
            authenticated = true;
            console.log(data);
            // Popule le document avec toute ses données
            const document = await Document.findById(data.idDocument);
            if (!document) {
              throw new Error('Document introuvable');
            }

            // Vérifie si l'utilisateur est autorisé
            isAuthorized = await verifierPermission(document, compte._id, NiveauPermission.LECTURE);
            if (!isAuthorized) {
              throw new Error('Accès refusé, utilisateur non autorisé');
            }
            ws.compte = compte; // Stocke les informations de l'utilisateur pour une utilisation ultérieure
            ws.document = document; // Stocke le document pour une utilisation ultérieure
            // Ajoute le client à la room du document
            if (!rooms[document._id]) {
              rooms[document._id] = new Set();
            }
            rooms[document._id].add(ws);

            console.log(`Utilisateur ${compte.prenom} ${compte.nom} connecté`);
          } catch (error) {
            ws.send(JSON.stringify({ type: 'error', message: error.message }));
            ws.close(); // Ferme la connexion en cas d'échec de l'authentification ou de l'autorisation
            return;
          }
        }
      } else {
        // Traite le message comme une commande
        const commande = JSON.parse(message);
        // valide la commande
        if (!commande || !commande.type) {
          ws.send(JSON.stringify({ type: 'error', message: 'Commande invalide' }));
          return;
        }

        commande.document = document._id;
        commande.save()
          .then(commande => {
            // Ajouter la commande à l'historique des commande du document
            document.historiqueCommandes.push(commande._id);
            document.save();
          })
          .catch(error => {
            // Previent le client que la commande n'a pas pu être sauvegardée avec un code approprié
            ws.send(JSON.stringify({ type: 'error', message: 'Erreur lors de la sauvegarde de la commande' }));
          });



        // Diffuse la commande à tous les autres clients connectés à ce document
        rooms[document._id].forEach(client => {
          if (client !== ws) {
            client.send(JSON.stringify(commande));
          }
        });
      }
    });


    ws.on('close', () => {

      if (!authenticated || !isAuthorized) {
        return;
      }

      // Gére la déconnexion
      rooms[document._id].delete(ws);
      if (rooms[document._id].size === 0) {
        delete rooms[document._id];
      }
    });

  });
};

export default initializeWebSocketServer;
