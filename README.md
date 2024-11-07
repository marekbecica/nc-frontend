# Nacural Cycles Challenge - Frontend

A Vue.js frontend built with TypeScript that handles phone authentication and user profile management using Firebase.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Project Setup

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd backend
npm install
```

2. Configure Firebase:
   - Go to Firebase Console: https://console.firebase.google.com
   - Select your project
   - Add web app to your project
   - Copy the values and paste them into the `.env` and `.env.development` file


### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Format code

```sh
npm run format
```

### Check format

```sh
npm run format:check
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
