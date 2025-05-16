# projet-ebadge

projet-ebadge created by GitHub Classroom

## Installation du laravel

#### 1: Configuration du fichier .env

- Copier le fichier .env.example et le renommer en .env

#### 2: Création d'une base de données MySQL

- Créer une base de données MySQL avec le nom de votre choix (ex: ebadge) Référez-vous à ce qui est créé dans le fichier .env




#### 3: Installation des dépendances

Créer tous les tables dans la base de données
```bash
 php artisan migrate --seed
```

Configure l'application pour utiliser les clés de chiffrement de Passport
```bash
 php artisan passport:install
```

Générer les clés de chiffrement de Passport
```bash
 php artisan passport:keys
```

Créer un lien symbolique depuis le répertoire public/storage vers le répertoire storage/app/public
```bash
 php artisan storage:link
```

Création d'un utilisateur admin avec l'api ou le site web. (changer le role dans la base de données)

## Éxécuter les tests unitaires

- Éxécuter la commande suivants dans le répertoire du projet Laravel

```bash
 php artisan test
```

- Si des problèmes survienent

```bash
    php artisan cache:clear
    php artisan config:clear
    php artisan clear-compiled
```

#### 4: Déploiement

- Exécuter la commande pour build l'application React
```bash
 npm run build
```

- Ajuster le .env puis exécuter les migrations sur la base de données distante
```bash
 php artisan migrate
```

- Envoyer le web.config, build/ et api/ (au complet) au serveur FTP

#### 5: Erreurs à corriger

- Correction de la Navbar quand la page est rapetisser

- Absence de mise a jour de la liste de badge quand un badge est créé ou modifié

- Réparer le teste qui ne marche pas

#### 6: Feature à ajouter

- Le changement de mot de passe avec un courriel

- Uniformatisation des badges ( les badges sont différents dans les liste et dans le BadgeComponent)

- Génération des code enseignant en lot

- Épinglé des badges en lot

- Combiner les tableaux d'affichage de tous les badges (griser les nons obtenus)