### Rapport de Fonctionnement de l'Application et API

#### Introduction
L'application est conçue pour la gestion de documents, avec des fonctionnalités d'authentification, de collaboration et de gestion des permissions. Elle utilise une architecture basée sur Node.js et Express, avec des modèles de données distincts pour les comptes utilisateurs, les documents, les feuilles et les commandes.
La partie frontend est implémentée en React.js.

#### Architecture de l'Application
- **Backend** : Node.js avec Express pour la gestion des routes API.
- **Base de Données** : Modèles MongoDB pour `Compte`, `Document`, `Permission`, `Feuille` et `HistoriqueCommande`. Via Mongoose.
Les infos de la base de données sont paramétré dans le fichier .env (se baser sur .envexemple)
- **Sécurité** : Utilisation de bcrypt pour le hachage des mots de passe et JWT pour la gestion des sessions.

#### Modèles de Données
Les modèles sont dans le dossier modèle, en voulant avoir une définition commune j'ai implémenté, des classes de models dans commun/models commun au front et au back
1. **Compte** : Représente les utilisateurs, avec des attributs tels que nom, prénom, email, mot de passe, avatar, etc.
2. **Document** : Représente un document contenant des feuilles et associé à des permissions et un historique de commandes.
3. **Feuille** : Composée de cellules, constituant les données manipulables dans un document.
4. **Permission** : Définit les niveaux d'accès des utilisateurs aux documents.
5. **HistoriqueCommande** : Enregistre les modifications effectuées sur les documents.

#### Fonctionnement de l'Application
- **Authentification** : Les utilisateurs peuvent s'inscrire, se connecter et gérer leur compte. Il est nécessaire de joindre le token jwt donnée lors de la connexion ou de l'inscription dans le header (Authorization pour pouvoir agir sur les objets dont on a la permission)
- **Gestion des Documents** : Les utilisateurs peuvent créer, modifier, supprimer et récupérer des documents.
- **Collaboration et Permissions** : Les documents peuvent être partagés avec différents niveaux de permission.
- **Historique des Modifications** : Chaque action sur un document est enregistrée, permettant des fonctionnalités d'annulation et de rétablissement.

#### Routes de l'API
1. **Authentification** :
   - POST `/login` : Connexion d'un utilisateur.
   - POST `/register` : Enregistrement d'un nouvel utilisateur.
   - GET, PUT, DELETE `/compte` : Gestion du compte utilisateur.

2. **Gestion des Documents** :
   - GET, PUT, DELETE `/document/:id` : Opérations CRUD sur les documents.
   - GET `/documents` : Récupération de tous les documents d'un utilisateur.
   - POST `/document/create` : Création d'un nouveau document.

3. **Gestion des Permissions** :
   - GET `/document/:id/permissions` : Récupérer les permissions d'un document.
   - POST `/document/:id/permission` : Ajouter une permission à un document.
   - PUT, DELETE `/permission/:idPermission` : Modifier ou supprimer une permission.

4. **Gestion des Feuilles** :
   - GET, POST, PUT, DELETE `/feuille/:id` : Opérations sur les feuilles d'un document.

5. **Historique des Commandes** :
   - GET `/document/:id/historiqueCommandes` : Récupérer l'historique des commandes d'un document.

6. **Collaboration** :
   La collaboration est gérée par les sockets, les utilisateurs peuvent recevoir les commandes des autres utilisateurs en temps réel.
   en se connectant à la socket à sur la route `/` et en envoyant le token jwt et l'id du document comme premier message et peuvent ensuite envoyer des commandes de modifications des cellules.
   . Exemple dans le fichier `frontend/src/components/DocumentEditor.js`.

### Installation et Lancement
1. **Backend** : se placer dans le dossier backend puis `npm install` et `npm start` pour lancer le serveur.
2. **Frontend** : se placer dans le dossier frontend puis `npm install` et `npm start` pour lancer le serveur.

#### Conclusion
Je n'ai implémenté que la partie backend du projet. J'ai essayé de faire la partie frontend mais je n'ai pas eu le temps de la terminer.