#!/usr/bin/env bash
# Usage: ./gen-url.sh [-l] "Guest Name"
#   -l   use localhost (http://localhost:8080)
#   else use domain from CNAME file

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CNAME_FILE="$SCRIPT_DIR/CNAME"

USE_LOCALHOST=false

while getopts ":l" opt; do
  case $opt in
    l) USE_LOCALHOST=true ;;
    *) echo "Unknown option: -$OPTARG" >&2; exit 1 ;;
  esac
done
shift $((OPTIND - 1))

if [[ -z "$1" ]]; then
  echo "Usage: $0 [-l] \"Guest Name\"" >&2
  exit 1
fi

GUEST_NAME="$1"
ENCODED_NAME="$(python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1]))" "$GUEST_NAME")"

if $USE_LOCALHOST; then
  BASE_URL="http://localhost:5501"
else
  if [[ ! -f "$CNAME_FILE" ]]; then
    echo "Error: CNAME file not found at $CNAME_FILE" >&2
    exit 1
  fi
  DOMAIN="$(tr -d '[:space:]' < "$CNAME_FILE")"
  BASE_URL="https://$DOMAIN"
fi

echo "${BASE_URL}/?name=${ENCODED_NAME}"
