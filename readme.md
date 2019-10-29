# Holdings

## Housekeeping

Managing the project directory.

## Dependencies

These packages are required.

- make
- nodejs, npm
- perl (for now ...)
- python3, python3-pip, python3-venv

### Python dependency management

Use the custom dependency management tool `dep` to manage dependencies manually.  `dep` manages `$DEP_FILE` (in this case, `requirements.txt`) according to manual entries.  *Note: `source activate` to add `utils` to PATH, excluding `./utils/` from `./utils/dep`, resulting in the easier `dep`.*

```bash
dep list  # list dependencies
dep add  <PYTHON_PKG_KEYWORD>  # add dependency with keyword from 'pip freeze'
dep rm   <PYTHON_PKG_KEYWORD>  # remove dependency with keyword from $(DEP_FILE)
```

## Development

### Setup

First, set up the project.

```bash
make setup
```

#### Python virtual environment

To enter the Python virtual environment and begin work, source the activation script.

```bash
source activate
```

To leave the Python virtual environment, deactivate.

```bash
deactivate
```

#### Use the project nodejs version

In the project base directory, do:

```bash
nvm use
```

It would be useful to have Node Version Manager (see https://github.com/nvm-sh/nvm):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
# or
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
```

#### `.env` files

Environment variables are used in multiple places within the application in substitution for hard-coded values that:

1. Change with the type of environment (e.g. production, development), and/or
2. Contain sensitive information that should not be tracked in version control for security purposes.

These environment variables are stored in `.env` files which are not tracked in version control.  When needed, environment variables are loaded from these files.  Because `.env` files are not tracked, you will need to manually generate them or copy and place them in their proper locations.

Within this documentation, each `.env` file should have well-documented variable names and descriptors.  While these could be deduced just by looking through code, that is a bit tedious, and it is nice to have a centralized location for `.env` information.  The cost, of course, is having to maintain documentation separate from the code itself, which ideally is already self-documenting.

Anyway, here are the current locations of `.env` files:

- project root directory (used by Makefile and Python source within `src/server/`)
- `src/client/web/` (React App environment variables)

They contain login credentials, API keys, and API URIs for MongoDB Stitch.  More concrete details will be provided as the project grows in size.  For now, it is important to know where the `.env` files should be located so you can get them from another developer and place them where they need to be.

*NOTE:  If the `.env` files are not in their proper locations with the right variables listed within, then you may receive errors while running the various applications.  Keep this in mind before starting up the app(s).*

### Clean

To remove the Python virtual environment and built files:

```bash
make clean
```

## Running the application

### Client

There are two client applications:

- mobile
- web

To run the `web` client, make sure to run `npm install --no-optional` within the `src/client/web/` directory.  Once you have done that, you can run the client with `make run-client-web`.

### Server

There are currently no server applications *per se* because all server code is running as MongoDB Stitch Functions on the cloud.  However, there is still server source within the `src/server/` directory that pertains to the operation of the MongoDB Stitch application.  In the future, we may need to set up a proper server application to run more complex server tasks, such as update scripts, machine learning models, etc.

All currently existing server functionality is to probe and update the MongoDB cluster.  We have:

- `make info-db` : gets information about the collections in the `test` database
- `make update-db` : updates the cluster with the newest SEC data

More functionality will be added in the future.
