# Audit SEO

Voici 3 problèmes SEO que j’ai identifiés dans la solution actuelle

## 1. L’absence de JSON-LD

Le plus évident est le manque de JSON-LD. Il faudrait au moins en ajouter un de type “Article”. En complément on pourrait aussi en ajouter un de type “BreadcrumbList”.

**Impact :** Le site se prive de l'affichage enrichi (Rich Snippets, carrousels), ce qui dégrade sa mise en valeur et sa compétitivité dans les résultats Google.

## 2. L’OpenGraph incomplet

Le second est l’openGraph incomplet ( type, url..) et notamment l’absence d’image pourtant important pour le partage sur les réseaux sociaux.

**Impact**: Un lien partagé sur les réseaux apparaîtra sans visuel, réduisant le taux de clic.

## 3. Url Canonical

Le troisième, et pas des moindres, et l’Url Canonical qui vient de Wordpress. Dans une architecture headless Il est recommandé de construire l’URL coté front-end pour éviter de se retrouver avec une URL canonical technique en production.

**Impact**: Risque de désindexation du domaine principal.