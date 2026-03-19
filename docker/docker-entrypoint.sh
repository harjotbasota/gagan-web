#!/bin/sh
set -e

export PORT="${PORT:-8080}"

# Optional: comma-separated extra env names for envsubst (future-proof)
export SITE_NAME="${SITE_NAME:-Gagandeep Web}"
export SITE_TAGLINE="${SITE_TAGLINE:-Reliable rides. Anytime. Anywhere.}"
export SITE_DESCRIPTION="${SITE_DESCRIPTION:-Professional transportation with comfort, safety, and style.}"
export OWNER_EMAIL="${OWNER_EMAIL:-hello@example.com}"
export CONTACT_FORM_ACTION="${CONTACT_FORM_ACTION:-https://formspree.io/f/REPLACE_ME}"
export PRIMARY_PHONE="${PRIMARY_PHONE:-+1 (555) 000-0000}"
export WHATSAPP_URL="${WHATSAPP_URL:-}"
export META_KEYWORDS="${META_KEYWORDS:-limo, taxi, airport transfer, chauffeur}"
export META_OG_IMAGE="${META_OG_IMAGE:-}"

VARS='$SITE_NAME $SITE_TAGLINE $SITE_DESCRIPTION $OWNER_EMAIL $CONTACT_FORM_ACTION $PRIMARY_PHONE $WHATSAPP_URL $META_KEYWORDS $META_OG_IMAGE'

if [ -f /usr/share/nginx/html/config.js.template ]; then
  envsubst "$VARS" < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js
fi

if [ -f /etc/nginx/conf.d/default.conf ]; then
  sed -i "s/__PORT__/${PORT}/g" /etc/nginx/conf.d/default.conf
fi

exec nginx -g "daemon off;"
