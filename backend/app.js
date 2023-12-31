import express from "express";
import path from "path";
import createError from "http-errors";
import { config } from "dotenv";
import { default as logger } from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { } from "express-session";
import cors from "cors";

import routes from "./routes.js";

config(); // Initialisation de dotenv pour charger les variables d'environnement

const app = express();

let uri;
if (process.env.MONGO_SCHEME === 'mongodb+srv') {
  // Connexion à MongoDB Atlas (sans port)
  uri = `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_URI}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
} else {
  // Connexion à une instance MongoDB locale (avec port)
  uri = `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_URI}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Configuration du moteur de rendu
app.set("view engine", "ejs");

// Configuration des middlewares
app
  .use(cors())
  .use(logger("tiny")) // Pour afficher les requêtes dans la console
  .use(express.json()) // Pour analyser le JSON
  .use(express.urlencoded({ extended: true })) // Pour analyser les données de formulaire
  // pour accepter les websockets
  .use(cookieParser()) // Pour analyser les cookies
  .use(express.static("public"))
  .use(express.static("client"))
  .use(routes)
  .use((req, res, next) => {
    // Si aucune route n'est trouvée, génère une erreur 404 json
    next(createError(404));
  })
  .use((err, req, res, next) => {
    // envoie une erreur JSON
    res.status(err.status || 500).json(
      {
        message: err.message,
      }
    );
  });

export default app;
