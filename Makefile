.PHONY: all run setup clean

SHELL:=/bin/bash
PIP=pip3
PYTHON=python3
DEP_FILE=requirements.txt

all:
	
run:
	
setup:
	@printf "[$@] Creating Python virtual environment (if none exists) ...\n"
	$(PYTHON) -m venv .pyenv --prompt=gghc
	@printf "\n[$@] Creating symlink to activation script ...\n"
	ln -sf .pyenv/bin/activate
	@printf "\n[$@] Installing / updating dependencies ...\n"
	source activate && $(PIP) install -U -r $(DEP_FILE)
	@printf "\nTo complete setup, run \"source activate\".\n"

clean:
	@printf "[$@] Removing Python virtual environment (if exists) ...\n"
	rm -rf .pyenv activate
	@printf "\n[$@] Removing __pycache__ (if exists) ...\n"
	find . -depth -type d -path ./.pyenv -prune -o -name __pycache__ -exec rm -rf {} \;
	@printf "\nCleaning complete.\n"
