# Studio — Avancement du projet

À lire en premier pour reprendre le travail.

## Le projet

- **Studio** : un SaaS qui donne à des particuliers « tes publications prêtes pour la semaine » (7 idées de photos avec légende, hashtags et heure de publication).
- Prix : **9,99 € par mois**, abonnement, sans période d'essai.
- Porteur du projet : Alexandre, débutant complet en code.
- Site en ligne : https://studio-sable-ten-28.vercel.app

## Règles de travail (non négociables)

1. **Toujours répondre en français**, phrases courtes, langage simple.
2. Une étape à la fois : expliquer en 2 lignes, faire, montrer la preuve (captures 375 px et 1280 px), puis **attendre le « OK »**.
3. Vérifier les commandes dans la documentation officielle avant de les donner.
4. Mobile d'abord (360 à 430 px), zéro débordement horizontal.
5. Une seule police (Geist), une seule couleur d'accent (vert émeraude `#047857`).
6. Après chaque étape qui marche : commit git en ajoutant les fichiers un par un (jamais `git add -A`).
7. Les clés secrètes ne passent jamais par le chat : Alexandre les colle lui-même dans Vercel.
8. Jamais de paiement avec une vraie carte : on prouve le paiement en ouvrant puis en expirant une page Stripe.
9. En cas de doute, poser la question avant d'agir.
10. Pas de fonctionnalité en plus tant que la première version n'encaisse pas.

## La stack

Vite + React + TypeScript, TanStack Router, Tailwind CSS, shadcn/ui (registre officiel uniquement), Supabase, Stripe Checkout, Vercel, GitHub.

## Où en est-on ?

| Étape | Statut |
|---|---|
| 1. Projet vide | ✅ Terminée |
| 2. Page d'accueil | ✅ Terminée |
| 3. Moteur (OpenAI) | ✅ Terminée |
| 4. Comptes clients (Supabase) | ✅ Terminée |
| 5. Paywall et paiement (Stripe) | ⏭️ **Prochaine étape** |
| 6. Emails (Resend) | À faire |
| 7. Mise en ligne | En partie faite (site déjà sur Vercel) |
| 8. Garde-fous (coûts) | À faire |

## Choix déjà faits

- **Produit** : option A, un plan en texte (pas d'images générées par IA).
- **IA** : OpenAI, modèle `gpt-6-luna`, environ 0,2 centime par semaine générée. Plafond de 5 $ de crédit, recharge automatique désactivée.
- **Limite** : 8 semaines générées par client et par mois calendaire (testée : la 9e est refusée).
- **Légendes** : elles vouvoient les abonnés (« vous ») ; le site tutoie le client (« tu »).
- **Hébergement** : Vercel, relié au dépôt GitHub. Chaque `git push` sur `main` met le site à jour.
- **Supabase** : région Europe, confirmation par email **désactivée** pour l'instant. À réactiver à l'étape 6, quand Resend enverra les emails.

## Les variables dans Vercel (noms seulement, jamais les valeurs)

| Nom | Type | Rôle |
|---|---|---|
| `OPENAI_API_KEY` | Secret | Clé OpenAI, côté serveur |
| `VITE_SUPABASE_URL` | Config | Adresse Supabase (publique) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Config | Clé publique Supabase |
| `SUPABASE_SECRET_KEY` | Secret | Clé secrète Supabase, côté serveur |

## Fichiers importants

- `src/routes/index.tsx` : la page d'accueil.
- `src/routes/app.tsx` : l'espace client (formulaire et résultat).
- `src/routes/inscription.tsx`, `src/routes/connexion.tsx` : les comptes.
- `api/generate.ts` : la fonction serveur (connexion vérifiée, limite mensuelle, appel OpenAI).
- `supabase/schema.sql` : le SQL déjà exécuté dans Supabase (table `generations`).
- `vercel.json` : redirige les pages vers `index.html`, sauf `/api`.

## À faire plus tard (déjà prévu)

- Étape 7 : supprimer les comptes de test dans Supabase (Authentication → Users), tous ceux en `studio.test.…@mailinator.com`.
- Remplir les pages « Mentions légales » et « Conditions de remboursement » avec les vraies informations d'Alexandre.
- `npm audit` signale des failles dans l'outil d'installation de shadcn (`fast-glob`, `braces`). Elles ne sont pas envoyées dans le navigateur, mais restent à surveiller.
