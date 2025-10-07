# Architecture complète - Monde éveillé

## 📁 Structure des dossiers

```
monde-eveille/
│
├── pages/
│   ├── _app.js                    # Configuration globale de l'app
│   ├── _document.js               # HTML personnalisé
│   ├── index.js                   # Page d'accueil
│   │
│   ├── boutique/
│   │   ├── index.js               # Catalogue (livres + packs)
│   │   ├── livres/
│   │   │   └── [id].js            # Détail d'un livre
│   │   └── packs/
│   │       └── [id].js            # Détail d'un pack
│   │
│   ├── panier.js                  # Page panier
│   ├── paiement.js                # Page de paiement
│   ├── confirmation.js            # Page après paiement réussi
│   │
│   ├── auth/
│   │   ├── connexion.js           # Page de connexion
│   │   ├── inscription.js         # Page d'inscription
│   │   └── mot-de-passe-oublie.js # Réinitialisation
│   │
│   ├── compte/
│   │   ├── index.js               # Dashboard utilisateur
│   │   ├── bibliotheque.js        # Livres achetés
│   │   ├── commandes.js           # Historique commandes
│   │   └── profil.js              # Modifier profil
│   │
│   ├── admin/
│   │   ├── index.js               # Dashboard admin
│   │   ├── livres/
│   │   │   ├── index.js           # Liste des livres
│   │   │   ├── ajouter.js         # Ajouter un livre
│   │   │   └── [id]/
│   │   │       └── modifier.js    # Modifier un livre
│   │   ├── packs/
│   │   │   ├── index.js           # Liste des packs
│   │   │   ├── creer.js           # Créer un pack
│   │   │   └── [id]/
│   │   │       └── modifier.js    # Modifier un pack
│   │   ├── commandes/
│   │   │   ├── index.js           # Liste des commandes
│   │   │   └── [id].js            # Détail commande
│   │   └── statistiques.js        # Stats et analytics
│   │
│   └── api/
│       ├── auth/
│       │   ├── register.js        # Inscription utilisateur
│       │   ├── login.js           # Connexion
│       │   ├── logout.js          # Déconnexion
│       │   └── reset-password.js  # Reset mot de passe
│       │
│       ├── livres/
│       │   ├── index.js           # GET tous les livres
│       │   ├── [id].js            # GET/PUT/DELETE un livre
│       │   ├── create.js          # POST créer livre
│       │   └── upload.js          # Upload PDF vers Vercel Blob
│       │
│       ├── packs/
│       │   ├── index.js           # GET tous les packs
│       │   ├── [id].js            # GET/PUT/DELETE un pack
│       │   └── create.js          # POST créer pack
│       │
│       ├── panier/
│       │   ├── ajouter.js         # Ajouter au panier
│       │   ├── retirer.js         # Retirer du panier
│       │   └── index.js           # Obtenir le panier
│       │
│       ├── commandes/
│       │   ├── create.js          # Créer une commande
│       │   ├── index.js           # Liste commandes utilisateur
│       │   └── [id].js            # Détail commande
│       │
│       ├── paiement/
│       │   ├── initier.js         # Initier paiement FedaPay
│       │   ├── webhook.js         # Callback FedaPay
│       │   └── verifier.js        # Vérifier statut paiement
│       │
│       ├── telechargement/
│       │   └── [id].js            # Télécharger un livre acheté
│       │
│       └── admin/
│           ├── stats.js           # Statistiques
│           └── commandes.js       # Toutes les commandes
│
├── components/
│   ├── layout/
│   │   ├── Header.js              # En-tête du site
│   │   ├── Footer.js              # Pied de page
│   │   ├── AdminLayout.js         # Layout admin
│   │   └── Sidebar.js             # Menu latéral admin
│   │
│   ├── boutique/
│   │   ├── LivreCard.js           # Carte produit livre
│   │   ├── PackCard.js            # Carte produit pack
│   │   ├── CatalogueFilters.js   # Filtres catalogue
│   │   └── SearchBar.js           # Barre de recherche
│   │
│   ├── panier/
│   │   ├── PanierItem.js          # Item du panier
│   │   └── PanierResume.js        # Résumé du panier
│   │
│   ├── admin/
│   │   ├── LivreForm.js           # Formulaire livre
│   │   ├── PackForm.js            # Formulaire pack
│   │   ├── UploadPDF.js           # Upload fichier PDF
│   │   ├── UploadImage.js         # Upload image couverture
│   │   ├── StatsCard.js           # Carte statistique
│   │   └── CommandeTable.js       # Tableau commandes
│   │
│   └── common/
│       ├── Button.js              # Bouton réutilisable
│       ├── Input.js               # Input réutilisable
│       ├── Modal.js               # Modal
│       ├── Loader.js              # Spinner de chargement
│       └── Alert.js               # Notifications/alertes
│
├── lib/
│   ├── mongodb.js                 # Connexion MongoDB
│   ├── auth.js                    # Helpers authentification
│   ├── email.js                   # Configuration Nodemailer
│   ├── fedapay.js                 # Configuration FedaPay
│   ├── vercelBlob.js              # Helpers Vercel Blob
│   └── utils.js                   # Fonctions utilitaires
│
├── models/
│   ├── User.js                    # Modèle utilisateur
│   ├── Livre.js                   # Modèle livre
│   ├── Pack.js                    # Modèle pack
│   ├── Commande.js                # Modèle commande
│   └── Telechargement.js          # Historique téléchargements
│
├── middleware/
│   ├── auth.js                    # Vérification JWT
│   ├── admin.js                   # Vérification rôle admin
│   └── rateLimit.js               # Limitation requêtes
│
├── contexts/
│   ├── AuthContext.js             # Context authentification
│   ├── PanierContext.js           # Context panier
│   └── NotificationContext.js     # Context notifications
│
├── hooks/
│   ├── useAuth.js                 # Hook authentification
│   ├── usePanier.js               # Hook panier
│   └── useDebounce.js             # Hook debounce recherche
│
├── styles/
│   └── globals.css                # Styles globaux + Tailwind 4
│
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   └── placeholder.jpg
│   └── favicon.ico
│
├── .env.local                     # Variables d'environnement
├── .gitignore
├── next.config.js                 # Configuration Next.js
├── tailwind.config.js             # Configuration Tailwind 4
├── postcss.config.js              # Configuration PostCSS
├── package.json
└── README.md
```

---

## 🗄️ Schémas de base de données (Mongoose)

### User
```javascript
{
  nom: String,
  prenom: String,
  email: String (unique, required),
  motDePasse: String (hashedPassword),
  role: String (enum: ['user', 'admin']),
  telephone: String,
  dateInscription: Date,
  actif: Boolean,
  emailVerifie: Boolean,
  tokenVerification: String,
  tokenResetPassword: String,
  tokenResetExpiration: Date
}
```

### Livre
```javascript
{
  titre: String (required),
  description: String,
  auteur: String,
  prix: Number (required),
  fichierPdfUrl: String (Vercel Blob URL),
  fichierPdfKey: String (Blob key pour suppression),
  couvertureUrl: String (Vercel Blob URL),
  couvertureKey: String,
  categorie: String,
  nombrePages: Number,
  taille: String (ex: "2.5 MB"),
  actif: Boolean,
  dateCreation: Date,
  dateModification: Date
}
```

### Pack
```javascript
{
  nom: String (required),
  description: String,
  prix: Number (required),
  livres: [ObjectId] (ref: 'Livre'),
  couvertureUrl: String,
  couvertureKey: String,
  reduction: Number (% par rapport au prix total des livres),
  actif: Boolean,
  dateCreation: Date,
  dateModification: Date
}
```

### Commande
```javascript
{
  numero: String (unique, auto-généré),
  utilisateur: ObjectId (ref: 'User'),
  items: [{
    type: String (enum: ['livre', 'pack']),
    reference: ObjectId (livre ou pack),
    nom: String,
    prix: Number,
    livresInclus: [ObjectId] (si pack)
  }],
  montantTotal: Number,
  statut: String (enum: ['en_attente', 'paye', 'echoue', 'annule']),
  paiement: {
    methode: String ('fedapay'),
    transactionId: String,
    fedapayTransactionId: String,
    statut: String,
    datePaiement: Date
  },
  livresDebloques: [ObjectId] (tous les livres accessibles),
  dateCommande: Date,
  dateModification: Date
}
```

### Telechargement
```javascript
{
  utilisateur: ObjectId (ref: 'User'),
  livre: ObjectId (ref: 'Livre'),
  commande: ObjectId (ref: 'Commande'),
  dateTelechargement: Date,
  ipAddress: String
}
```

---

## 🔄 Flow des processus principaux

### 1. Achat d'un livre/pack
```
1. Client ajoute au panier (PanierContext)
2. Client va à la page panier
3. Client clique "Commander"
4. Création commande (statut: en_attente) → API /api/commandes/create
5. Initiation paiement FedaPay → API /api/paiement/initier
6. Redirection vers FedaPay
7. Client paie sur FedaPay
8. Webhook FedaPay → API /api/paiement/webhook
9. Mise à jour commande (statut: paye)
10. Déblocage des livres dans la commande
11. Envoi email confirmation (Nodemailer)
12. Redirection vers page confirmation
```

### 2. Téléchargement sécurisé
```
1. Client va dans sa bibliothèque
2. Client clique "Télécharger"
3. Requête API → /api/telechargement/[id]
4. Vérification authentification (JWT)
5. Vérification que l'utilisateur a bien acheté le livre
6. Génération URL temporaire Vercel Blob (signed URL)
7. Enregistrement téléchargement dans DB
8. Redirection vers l'URL de téléchargement
```

### 3. Upload de fichiers (Admin)
```
1. Admin upload PDF/image via formulaire
2. Fichier envoyé à → API /api/livres/upload
3. Upload vers Vercel Blob → @vercel/blob
4. Récupération de l'URL et du key
5. Sauvegarde URL dans le modèle Livre
6. Retour au frontend avec l'URL
```

---

## 🔐 Authentification & Sécurité

### JWT (JSON Web Token)
- Token stocké dans cookie httpOnly
- Durée de validité: 7 jours
- Refresh token pour renouvellement

### Middleware d'authentification
```javascript
// middleware/auth.js
- Vérifie la présence du token
- Décode le token JWT
- Attache user à req.user
- Passe au handler suivant
```

### Protection des routes
- Routes client: vérification JWT
- Routes admin: vérification JWT + rôle admin
- Routes API: même système

---

## 📧 Configuration Email (Nodemailer)

### Service SMTP requis
Vercel n'a pas de service email, vous devez utiliser:
- **Gmail** (gratuit, limité)
- **SendGrid** (freemium, recommandé)
- **Mailgun** (freemium)
- **Brevo** (ex-Sendinblue, freemium)

### Types d'emails à envoyer
1. Email de vérification (inscription)
2. Email de confirmation commande
3. Email de réinitialisation mot de passe
4. Email d'accès aux livres achetés

### Configuration dans .env.local
```
SMTP_HOST=smtp.exemple.com
SMTP_PORT=587
SMTP_USER=votre-email
SMTP_PASS=votre-mot-de-passe
EMAIL_FROM=noreply@monde-eveille.com
```

---

## 💳 Intégration FedaPay

### Configuration
```javascript
// lib/fedapay.js
- API Key FedaPay
- URL de callback
- Gestion des transactions
```

### Environnement
- **Test**: Sandbox FedaPay
- **Production**: API Live FedaPay

### Webhooks
Route: `/api/paiement/webhook`
- Vérification signature FedaPay
- Mise à jour commande
- Déblocage livres
- Envoi email

---

## ☁️ Vercel Blob

### Configuration
```javascript
// lib/vercelBlob.js
import { put, del, head } from '@vercel/blob';
```

### Opérations
1. **Upload**: `put(filename, file, { access: 'public' })`
2. **Suppression**: `del(url)`
3. **Infos**: `head(url)`
4. **URL signée**: Pour téléchargements sécurisés

### Variables d'environnement
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
```

---

## 🎨 Tailwind 4

### Configuration (tailwind.config.js)
```javascript
// Tailwind 4 utilise une nouvelle syntaxe
import { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'eveil': {
          primary: '#...',
          secondary: '#...',
        }
      }
    }
  }
}
```

### styles/globals.css
```css
@import "tailwindcss";

/* Personnalisations */
```

---

## 🚀 Déploiement sur Vercel

### Variables d'environnement requises
```
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=votre_secret_tres_long_et_securise

# FedaPay
FEDAPAY_API_KEY=sk_sandbox_xxx (ou sk_live_xxx)
FEDAPAY_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_FEDAPAY_CALLBACK_URL=https://votre-site.com/confirmation

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx

# Email (exemple avec SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=votre_api_key_sendgrid
EMAIL_FROM=contact@monde-eveille.com

# URL du site
NEXT_PUBLIC_SITE_URL=https://monde-eveille.vercel.app
```

### Commandes de déploiement
```bash
# Installation
npm install

# Développement local
npm run dev

# Build production
npm run build

# Démarrer production
npm start

# Déploiement Vercel
vercel --prod
```

---

## 📦 Packages npm nécessaires

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "nodemailer": "^6.9.7",
    "@vercel/blob": "^0.15.0",
    "fedapay": "^1.x.x",
    "cookie": "^0.6.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

---

## 🔍 Points d'attention

### Sécurité
- ✅ Validation des inputs côté serveur
- ✅ Sanitization des données
- ✅ Protection CSRF
- ✅ Rate limiting sur les API sensibles
- ✅ Vérification propriété des ressources
- ✅ URLs de téléchargement temporaires

### Performance
- ✅ Lazy loading des images
- ✅ Cache des requêtes MongoDB
- ✅ Pagination des listes
- ✅ Optimisation images (Next.js Image)
- ✅ CDN Vercel pour assets

### UX
- ✅ Loading states partout
- ✅ Messages d'erreur clairs
- ✅ Confirmation avant suppression
- ✅ Responsive design
- ✅ Accessibilité (a11y)

---

## 📝 Notes importantes

1. **Vercel Blob** a des limites selon votre plan:
   - Hobby: 1 GB de stockage
   - Pro: 100 GB+
   - Vérifiez vos besoins en stockage

2. **FedaPay** nécessite:
   - Compte marchand vérifié
   - Configuration des webhooks
   - Tests en mode sandbox avant production

3. **Email service**:
   - Configurez SPF, DKIM pour éviter spam
   - Utilisez des templates email
   - Testez tous les emails

4. **MongoDB Atlas**:
   - Configurez IP whitelist pour Vercel
   - Ou utilisez "Allow access from anywhere" (0.0.0.0/0)
   - Backups réguliers

5. **Next.js Pages Router**:
   - Pas d'App Router (comme demandé)
   - API Routes dans /pages/api
   - getServerSideProps pour données dynamiques

Cette architecture est complète et prête pour le développement ! 🚀