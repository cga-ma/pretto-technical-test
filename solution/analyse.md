# Analyse de solution actuelle

Voici les points qui ont suscité mon attention

## Appels API

Les appels API ne disposent d'aucun mécanisme de gestion d'erreur. En cas d'indisponibilité le processus de build s'interrompt brutalement et l'absence de log précis rend le debug plus compliqué.

---

## Récupération des données Trustpilot non maîtrisée

Le code récupère l'intégralité des avis Trustpilot de manière **séquentielle**, sans pagination ni limite. Le temps de build est donc directement corrélé au volume de données.

De plus, les avis récupérés ne semblent pas utilisés dans le code actuel.

**Questions :**

- Les avis sont-ils essentiels au SEO des pages articles ? Si non nous pouvons les récupérer coté client.
- A-t-on besoin de l'historique complet ou seulement des N derniers ?

---

## Récupération des données WordPress non paginée

La query GraphQL a une limite arbitraire de 1000 articles et **charge tout le contenu des articles en mémoire d'un coup**. Cela pose deux problèmes majeurs:

- Le 1001ème article ne sera jamais généré (bug silencieux)
- Avec 1000 articles contenant chacun du contenu HTML complet il y a un risque de saturation de la mémoire du processus qui entrainera des lenteurs et une augmentation du temps de build voir un échec complet.