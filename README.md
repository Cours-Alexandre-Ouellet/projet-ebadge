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
