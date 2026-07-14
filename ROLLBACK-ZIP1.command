#!/bin/bash
cd "$(dirname "$0")"
python3 tools/rollback_zip1.py
printf '\nPress Return to close...'
read
