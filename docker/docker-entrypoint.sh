#!/bin/sh
set -e

export PORT="${PORT:-8080}"

# Optional: comma-separated extra env names for envsubst (future-proof)
export SITE_NAME="${SITE_NAME:-CTY TRANSPORTATION}"
export SITE_TAGLINE="${SITE_TAGLINE:-Business-class NYC airport & luxury chauffeured service}"
export SITE_DESCRIPTION="${SITE_DESCRIPTION:-CTY Transportation serves Mississauga and the greater NYC metro: business-class airport transfers, VVIP limos, black SUVs, hourly chauffeurs, family vans, and luxury vans for large groups.}"
export OWNER_NAME="${OWNER_NAME:-Manvir Kaur}"
export OWNER_EMAIL="${OWNER_EMAIL:-hello@example.com}"
export CONTACT_FORM_ACTION="${CONTACT_FORM_ACTION:-https://formspree.io/f/REPLACE_ME}"
export PRIMARY_PHONE="${PRIMARY_PHONE:-(929) 390-5862}"
export WHATSAPP_URL="${WHATSAPP_URL:-}"
export META_KEYWORDS="${META_KEYWORDS:-CTY Transportation, Mississauga limo, NYC airport car service, black SUV, luxury van, VVIP limo, hourly chauffeur}"
export META_OG_IMAGE="${META_OG_IMAGE:-}"

VARS='$SITE_NAME $SITE_TAGLINE $SITE_DESCRIPTION $OWNER_NAME $OWNER_EMAIL $CONTACT_FORM_ACTION $PRIMARY_PHONE $WHATSAPP_URL $META_KEYWORDS $META_OG_IMAGE'

if [ -f /usr/share/nginx/html/config.js.template ]; then
  envsubst "$VARS" < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js
fi

if [ -f /etc/nginx/conf.d/default.conf ]; then
  sed -i "s/__PORT__/${PORT}/g" /etc/nginx/conf.d/default.conf
fi

exec nginx -g "daemon off;"
