#!/bin/sh
set -e

: "Substitute env vars in the template"
if [ -z "$GOOGLE_CLIENT_ID" ]; then
  echo "Warning: GOOGLE_CLIENT_ID is not set. The page may not work properly."
fi

envsubst '${GOOGLE_CLIENT_ID}' < /usr/share/nginx/html/index.html.template > /usr/share/nginx/html/index.html

# start nginx in foreground
nginx -g 'daemon off;'
