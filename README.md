# Dependencies Status

A small web application for checking the versions of dependencies listed in a `package.json` file. The app lets you upload a file and then shows whether each dependency is up to date according to the npm registry.

## Requirements

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed locally.

## Setup

1. Clone the repository and change into the project directory.
2. Create the environment file (the `init` target does this automatically):
   ```bash
   cp .env.example .env
   ```
3. Build and start the containers:
   ```bash
   make init
   ```
   Subsequent runs can use `make up` to start the application.

The default web interface runs on the port specified by `APP_PORT` in `.env` (4010 by default).

## Available Make Targets

The `Makefile` provides a few helper commands:

- `make init` &mdash; build images, start the containers and copy `.env.example` to `.env`.
- `make up` &mdash; start the application using Docker Compose.
- `make down` &mdash; stop the containers.
- `make clean` &mdash; remove containers and associated volumes.
- `make rebuild` &mdash; force a rebuild of the images.

## Usage

Open your browser at `http://localhost:4010` (or the port set in `.env`). Upload a `package.json` file and the page will display your dependencies along with the latest versions available on npm. An API endpoint is also provided at:

```
GET /packages/:packagesNames/latest
```

where `packagesNames` is a comma‑separated list of packages.

## Development

If you prefer running the server without Docker, install the dependencies and start the application manually:

```bash
npm install
node api/index.js
```

---

Feel free to open issues or pull requests if you encounter problems or have suggestions for improvements.
