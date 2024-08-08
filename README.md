# SLOStudySpots

Monorepo containing all SLOStudySpots related code.

## About

SLOStudySpots is a web application designed to help students and residents of San Luis Obispo find the best study spots in the area. This platform provides users with detailed reviews, ratings, and photos of various locations, including cafes, libraries, and public spaces, making it easier to find the perfect place for study or work.

### Built With

- [![lit][lit]][lit-url]
- [![typescript][typescript]][typescript-url]
- [![mongodb][mongodb]][mongodb-url]
- [![nodejs][nodejs]][nodejs-url]
- [![express][express]][express-url]

## Getting Started

To get a local copy up and running, follow these steps.

### Installation

1.  Clone the repo
    ```shell
    git clone https://github.com/thienan11/SLOStudySpots.git
    ```

2.  From the monorepo root, install NPM packages (dependencies)
    ```shell
    npm install
    ```

Then, refer to and follow the individual package READMEs for specific package information.

### Project Configuration

This project requires environment variables to be set up in a `.env` file for proper configuration and operation.

In the `server` package, create a file called `.env` or `.env.local` and refer to the [`.env.example`](/packages/server/.env.example) file located in the `server` package.

## Packages

- [Prototype](packages/proto/README.md): uses only static HTML, CSS, and Javascript.
- [Server](packages/server/README.md): backend Express API, with communication to MongoDB and authentication.
- [App](packages/app/README.md): frontend single-page app using Lit.

[typescript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[lit]: https://img.shields.io/badge/Lit-324FFF?logo=lit&logoColor=fff&style=for-the-badge
[lit-url]: https://lit.dev/
[mongodb]: https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff&style=for-the-badge
[mongodb-url]: https://www.mongodb.com/
[express]: https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=for-the-badge
[express-url]: https://expressjs.com/
[nodejs]: https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=fff&style=for-the-badge
[nodejs-url]: https://nodejs.org/en
