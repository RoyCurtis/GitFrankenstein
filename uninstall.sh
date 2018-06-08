#!/bin/bash
# Gamealition nginx config uninstaller script
# Roy Curtis, MIT, 2017

# #########
# CONFIGURATION:
# #########

# Absolute path to nginx's system configuration
NGINX_CONF=/etc/nginx

# #########
# CONSTANTS:
# #########

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# #########
# SCRIPT:
# #########

if ! [ $(id -u) = 0 ]; then
   echo "*** This script must be run as root (e.g. using sudo)"
   exit 1
fi

unlink $NGINX_CONF/sites-enabled/gamealition.com
unlink $NGINX_CONF/snippets/common.conf
unlink $NGINX_CONF/snippets/php.conf
unlink $NGINX_CONF/snippets/phpbb.conf
unlink $NGINX_CONF/snippets/ssl.conf
ln -s $NGINX_CONF/sites-available/default $NGINX_CONF/sites-enabled/default
service nginx restart

echo "*** Done - nginx configuration uninstalled, service restarted"
