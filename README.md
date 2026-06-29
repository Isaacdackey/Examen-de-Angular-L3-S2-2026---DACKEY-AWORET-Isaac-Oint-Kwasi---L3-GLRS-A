# BadWallet Web Dashboard

![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?logo=reactivex&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completed-success)

## Description

BadWallet Web Dashboard est une application web développée avec Angular 19 permettant la gestion d'un portefeuille électronique.

L'application offre deux espaces distincts :

- Client
- Agent de guichet

Elle communique avec une API REST Spring Boot afin de réaliser les opérations financières telles que les dépôts, retraits, transferts et paiements.

---

## Fonctionnalités

### Espace Client

- Consultation du solde
- Tableau de bord
- Historique des transactions
- Recherche de transactions
- Transfert d'argent
- Paiement simple
- Paiement de factures

### Espace Agent

- Création d'un portefeuille
- Consultation des portefeuilles
- Recherche d'un client
- Dépôt
- Retrait

---

## Technologies utilisées

| Technologie | Version |
|-------------|---------|
| Angular | 19 |
| TypeScript | 5.7 |
| RxJS | 7.8 |
| Angular Router | Latest |
| HttpClient | Intégré |
| Reactive Forms | Intégré |
| Font Awesome | 7 |

---

## Architecture du projet

```
src/
│
├── app/
│   ├── auth/
│   ├── core/
│   ├── features/
│   ├── layouts/
│   ├── shared/
│   └── app.routes.ts
│
├── assets/
├── environments/
└── styles.css
```

Le projet suit une architecture modulaire afin de garantir une bonne séparation des responsabilités et de faciliter la maintenance.

---

## Installation

### Prérequis

- Node.js 18 ou supérieur
- Angular CLI 19

### Cloner le dépôt

```bash
git clone https://github.com/Isaacdackey/Examen-de-Angular-L3-S2-2026---DACKEY-AWORET-Isaac-Oint-Kwasi---L3-GLRS-A.git
```

### Accéder au projet

```bash
cd Examen-de-Angular-L3-S2-2026---DACKEY-AWORET-Isaac-Oint-Kwasi---L3-GLRS-A
```

### Installer les dépendances

```bash
npm install
```

### Lancer l'application

```bash
ng serve
```

L'application sera accessible à l'adresse :

```
http://localhost:4200
```

---

## Configuration du Backend

Le frontend consomme les services REST exposés par l'API Spring Boot.

URL par défaut :

```
http://localhost:8080
```

Les principales fonctionnalités disponibles sont :

- Authentification
- Gestion des portefeuilles
- Dépôt
- Retrait
- Transfert
- Paiement
- Paiement de factures
- Historique des transactions

---

## Comptes de démonstration

### Clients

| Téléphone | Email | Mot de passe |
|------------|-------|--------------|
| +221770000001 | client1@gmail.com | password123 |
| +221770000004 | client4@gmail.com | password123 |
| +221770000005 | client5@gmail.com | password123 |

### Agents

| Téléphone | Email | Mot de passe |
|------------|-------|--------------|
| +221770000002 | agent1@gmail.com | password123 |
| +221770000003 | agent2@gmail.com | password123 |

---

## Tests

Lancer les tests unitaires :

```bash
ng test
```

---

## Build

Créer une version de production :

```bash
ng build
```

---

## Auteur

**DACKEY AWORET Isaac Oint Kwasi**

Licence 3 GLRS-A

Année universitaire 2025-2026

---

## Licence

Ce projet a été réalisé dans le cadre d'un examen académique.
