# gghc

## housekeeping

Managing the project directory.

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

Use the custom dependency management tool `dep` to manage dependencies manually.  `dep` manages `$DEP_FILE` (in this case, `requirements.txt`) according to manual entries.  *Note: `source activate` to add `.` to PATH, excluding `./` from `./dep`, resulting in the easier `dep`.*

```bash
dep add  <PYTHON_PKG_KEYWORD>
dep list <PYTHON_PKG_KEYWORD>
dep rm   <PYTHON_PKG_KEYWORD>
```
