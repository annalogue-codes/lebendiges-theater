<p align="center">
  <img width=60% src="public/images/cloudySofa.jpg">
</p>

<p align="center">
  A little game about Theater and Drama.
</p>

<p align="center">
  <sub>
    Made with ❤︎ by <a href="https://annalogue.codes">Annalogue Codes</a></br>
    for the <a href="https://atzeberlin.de">ATZE Musiktheater</a>
  </sub>
</p>

# Lebendiges Theater

A little game intended to raise intererest in children in all topics related to theater and drama in general.

Made with ❤︎ by [Annalogue Codes](https://annalogue.codes) for the [ATZE Musiktheater](https://atzeberlin.de).

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js and npm.

For Windows users there is [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows).

Install Node.js and `npm` with `nvm`:

```bash
nvm install node

nvm use node
```

Replace 'node' with 'latest' for `nvm-windows`.

## Getting Started

You can clone this repository or use [degit](https://github.com/Rich-Harris/degit) to just download the last commit:

```bash
npx degit https://github.com/annalogue-codes/lebendiges-theater lebendigesTheater
cd lebendigesTheater

npm install
```

Start development server:

```
npm run start
```

To create a production build:

```
npm run build
```

Production files will be placed in the `dist` folder. Then upload those files to a web server. 🎉

## Project Structure

```
    .
    ├── dist
    ├── node_modules
    ├── public
    │   ├── images
    │   │   ├── icon.png
    │   ├── ...
    ├── src
    │   ├── scenes
    │   │   ├── Loading.ts
    │   │   ├── Entrance.ts
    │   ├── ...
    │   ├── main.ts
	├── index.html
	├── manifest.json
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── LICENSE.txt
    ├── README.md
```

TypeScript files are intended for the `src` folder. `main.ts` is the entry point referenced by `index.html`.

Other than that there is no limitation on how you can change the structure of the project.

## Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It will then be served from the root. For example: http://localhost:8000/images/my-image.png

Example `public` structure:

```
    public
    ├── images
    │   ├── my-image.png
    ├── music
    │   ├── ...
    ├── sfx
    │   ├── ...
```

They can then be loaded by Phaser with `this.image.load('my-image', 'images/my-image.png')`.

# TypeScript ESLint

This code uses a basic `typescript-eslint` set up for code linting.

It does not aim to be opinionated.

[See here for rules to turn on or off](https://eslint.org/docs/rules/).

## Dev Server Port

You can change the dev server's port number by modifying the `vite.config.ts` file. Look for the `server` section:

```js
{
	// ...
	server: { host: '0.0.0.0', port: 8000 },
}
```

Change 8000 to whatever you want.

## License

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)

