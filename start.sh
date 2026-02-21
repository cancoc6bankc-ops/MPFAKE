#!/usr/bin/env bash
exec python main.py
chmod +x start.sh
git update-index --chmod=+x start.sh
