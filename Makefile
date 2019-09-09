.PHONY: all setup

SHELL:=/bin/bash
PIP=pip3
PYTHON=python3

all:
	

setup:
	@printf "[$@] Creating Python virtual environment (if none exists) ...\n"
	$(PYTHON) -m venv .pyenv --prompt=gghc
	@printf "\n[$@] Creating symlink to activation script ...\n"
	ln -sf .pyenv/bin/activate
	@printf "\n[$@] Installing dependencies ...\n"
	source activate && $(PIP) install -r requirements.txt
	@printf "\nTo complete setup, run \"source activate\".\n"
