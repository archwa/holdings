.PHONY: all run setup clean

SHELL:=/bin/bash
VENV_NAME=.pyenv
VENV_PROMPT=gghc
PIP=pip3
PYTHON=python3
DEP_FILE=requirements.txt

all:
	
run:
	
setup:
	@printf "[$@] Creating Python virtual environment (if none exists) ...\n"
	$(PYTHON) -m venv $(VENV_NAME) --prompt=$(VENV_PROMPT)
	@printf "\n[$@] Creating symlink to activation script ...\n"
	ln -sf $(VENV_NAME)/bin/activate
	@printf "\n[$@] Adding project utils directory to PATH in activation script ...\n"
	sed -i --follow-symlinks 's/^PATH="\(.*\)"/PATH="$$VIRTUAL_ENV\/\.\.\/utils:\1"/' activate
	@printf "\n[$@] Installing / updating dependencies ...\n"
	source activate && $(PIP) install -U -r $(DEP_FILE)
	@printf "\nTo complete setup, run \"source activate\".\n"

clean:
	@printf "[$@] Removing Python virtual environment (if exists) ...\n"
	rm -rf $(VENV_NAME) activate
	@printf "\n[$@] Removing all __pycache__ dirs (if exists) ...\n"
	find . -depth -type d -path ./$(VENV_NAME) -prune -o -name __pycache__ -exec rm -rf {} \;
	@printf "\nCleaning complete.\n"
