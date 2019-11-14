.PHONY: all run run-client-web info-db update-db setup clean

SHELL:=/bin/bash
VENV_NAME=.pyenv
VENV_PROMPT=gghc
PIP=pip3
PYTHON=python3
DEP_FILE=requirements.txt

all: # empty recipe
	
run: run-client-web

run-client-web:
	@printf "[$@] Running client web app ...\n"
	cd src/client/web && npm start

info-db:
	@printf "[$@] Running script to show existing MongoDB collections ...\n"
	$(PYTHON) src/server/info_db.py

# long process; run all import scripts after making sure the data is current
import-holdings:
	#@printf "[$@] Running SEC 13F filings script with credentials from \`.env\` ...\n"
	$(PYTHON) src/server/import_holdings.py
	
setup:
	@printf "[$@] Creating Python virtual environment (if none exists) ...\n"
	$(PYTHON) -m venv $(VENV_NAME) --prompt=$(VENV_PROMPT)
	@printf "\n[$@] Creating symlink to activation script ...\n"
	ln -sf $(VENV_NAME)/bin/activate
	@printf "\n[$@] Adding project utils directory to PATH in activation script ...\n"
	sed -i --follow-symlinks 's/^PATH="\(.*\)"/PATH="$$VIRTUAL_ENV\/\.\.\/utils:\1"/' activate
	@printf "\n[$@] Checking that \"$(DEP_FILE)\" exists and is not empty ... "
	@if [ -s $(DEP_FILE) ]; then \
    printf "SUCCESS\n"; \
		printf "> Installing / updating dependencies ...\n"; \
		source activate && $(PIP) install -U -r $(DEP_FILE); \
	else \
    printf "FAIL\n"; \
    touch $(DEP_FILE); \
		printf "> File \"$(DEP_FILE)\" either does not exist or is empty, so I (re)created one for you.\n"; \
    printf "> Add dependencies using \"dep add <DEPENDENCY_KEYWORD>\".\n"; \
	fi
	@printf "\nTo complete setup and enter the development environment, run \"source activate\".\n"
	@printf "To exit the development environment, run \"deactivate\".\n"

clean:
	@printf "[$@] Removing Python virtual environment (if exists) ...\n"
	rm -rf $(VENV_NAME) activate
	@printf "\n[$@] Removing all __pycache__ dirs (if exists) ...\n"
	find . -depth -type d -path ./$(VENV_NAME) -prune -o -name __pycache__ -exec rm -rf {} \;
	@printf "\nCleaning complete.\n"

clean-pycache:
	@printf "[$@] Removing all __pycache__ dirs (if exists) ...\n"
	find . -depth -type d -path ./$(VENV_NAME) -prune -o -name __pycache__ -exec rm -rf {} \;
	@printf "\nCleaning complete.\n"
