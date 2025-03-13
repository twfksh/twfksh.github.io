.PHONY: all install format lint run_script

all: install format lint run_script

install:
	python -m pip install --upgrade pip
	pip install -r requirements.txt
	pip install ruff yamllint
	npm install -g prettier

format:
	ruff format --check .
	prettier --write "**/*.{html,js,css}"

lint:
	ruff check .
	yamllint portfolio.yml portfolio_example.yml .github/workflows/deploy.yml

run_script:
	python generate_portfolio.py
