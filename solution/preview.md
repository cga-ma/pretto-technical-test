# Preview

Next.js intègre une fonctionnalité “draft” qui répond parfaitement à cette problématique.

https://nextjs.org/docs/app/guides/draft-mode

Coté WP il faut modifier le lien de preview (en modifiant le code ou via un Plugin)

Comment fonctionne le mode draft ?

1. **Coté WordPress** : L'éditeur clique sur "Prévisualiser" dans l'admin. et est redirigé vers une URL spéciale:
   `https://front.pretto.fr/api/draft?secret=MY_SECRET_TOKEN&slug=mon-article-draft`
2. **Route Handler (Next.js)** :
    - Vérifie le token de sécurité
    - Active le `Draft Mode`
    - Redirige l'utilisateur vers la page de l'article : `/actualites/mon-article-draft`.
3. **Page (Next.js)** :
    - Bypass le cache pour passer en **SSR (Server-Side Rendering)** à la demande et affiche le brouillon