# Solution Moderne

Mon choix s’est assez naturellement dirigé vers Next.js pour les raisons suivantes:

- Flexibilité de rendering (SSG, SSR, ISR ou CSR)
- Système de preview (Draft)
- Framework React le plus adopté, documentation exhaustive (même si parfois mal organisée), facilité de recrutement.
- SEO intégré

Il y a tout de même certains points à prendre en compte:

- NextJs mais surtout l'App Router et les Server Components introduisent de nouveaux concepts. L'équipe devra monter en compétence.
- Next.js a connu des vulnérabilités critiques en 2025 (middleware bypass, RCE dans Server Components). Les patchs ont été rapides, mais cela impose une vigilance sur les mises à jour. Cela a aussi soulevé quelques débats entre DEV sur l’utilisation des RCS qui rendent la frontière front/back un peu plus floue.
- le déploiement hors Vercel est possible mais peut demander de la configuration supplémentaire

## Stratégie de rendering et caching

La stratégie choisie est ISR avec revalidation on-demand via webhook.

**Build initial :** `generateStaticParams` récupère tous les slugs WordPress via pagination, puis chaque page est générée statiquement. Le contenu complet de chaque article est fetch individuellement au moment de la génération de sa page, évitant de charger +1000 articles en mémoire.

**Revalidation on-demand** : WordPress appelle `/api/revalidate` via un webhook à chaque publication. Seule la page concernée est de nouveau générée (quelques secondes vs N minutes de rebuild complet).


## Résilience

En cas d'erreur le cache Next.js continuera de servir la dernière version valide tant que la régénération échoue.

## SEO

Les metadata sont générées via `generateMetadata`, une convention Next.js qui produit automatiquement les balises `<head>`.
J'ai également ajouté du JSON-LD de type Article pour chaque article.

## Instructions pour exécuter la solution

Installer les dépendances
```bash
cd next
pnpm install
```

Il faut ensuite créer un fichier `.env` à la racine du dossier `next` avec les variables d'environnement suivantes:

```bash
SITE_URL="https://pretto.fr"
WP_REST_URL="https://wptavern.com/wp-json/wp/v2"
REVALIDATE_SECRET_TOKEN="super_secret_password_123"
```

Pour lancer le serveur de développement
```bash
pnpm run dev
```

Pour lancer un build de production
```bash
pnpm run build
```

Pour lancer le serveur de production localement après build
```bash
pnpm run start
```
Le site sera accessible à l'adresse http://localhost:3000
Ma source de données WordPress utilisée est https://wptavern.com, un site d'actualité sur WordPress avec beaucoup d'articles de blog pour tester la pagination et la génération de pages.
Pour avoir des liens d'articles vous pouvez consulter l'adresse http://localhost:3000/articles (page créée rapidement)
Sinon voici quelques liens d'articles existants:
- http://localhost:3000/articles/hosting-and-themes-teams-announce-representatives-for-2025
- http://localhost:3000/articles/court-grants-wp-engine-preliminary-injunction-against-automattic
- http://localhost:3000/articles/automattic-and-matt-mullenweg-push-for-dismissal-of-key-claims-in-wp-engine-lawsuit