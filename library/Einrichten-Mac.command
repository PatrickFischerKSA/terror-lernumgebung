#!/bin/zsh
cd "$(dirname "$0")/.." || exit 1
if [[ -x .venv/bin/python ]]; then
  .venv/bin/python library/install-mac.py
else
  echo 'Bitte zuerst die Python-Umgebung gemäss library/MAC.md vorbereiten.'
  echo 'python3 -m venv .venv'
  echo '.venv/bin/python -m pip install pypdf'
fi
read 'reply?Zum Schliessen Enter drücken. '
