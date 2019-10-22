# gghc

## housekeeping

Managing the project directory.

## dependencies

These packages are required.

- make
- nodejs, npm
- perl (for now ...)
- python3, python3-pip, python3-venv

It would be useful to have Node Version Manager (see https://github.com/nvm-sh/nvm):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
# or
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
```

### setup

First, set up the project.

```bash
make setup
```

### virtual environment

To enter the Python virtual environment and begin work, source the activation script.

```bash
source activate
```

To leave the Python virtual environment, deactivate.

```bash
deactivate
```

### clean

To remove the Python virtual environment and built files:

```bash
make clean
```

## dependency management

Use the custom dependency management tool `dep` to manage dependencies manually.  `dep` manages `$DEP_FILE` (in this case, `requirements.txt`) according to manual entries.  *Note: `source activate` to add `utils` to PATH, excluding `./utils/` from `./utils/dep`, resulting in the easier `dep`.*

```bash
dep list  # list dependencies
dep add  <PYTHON_PKG_KEYWORD>  # add dependency with keyword from 'pip freeze'
dep rm   <PYTHON_PKG_KEYWORD>  # remove dependency with keyword from $(DEP_FILE)
```
