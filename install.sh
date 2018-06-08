#!/bin/bash
# Gamealition nginx config installer script
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

ln -s $DIR/sites-enabled/gamealition.com $NGINX_CONF/sites-enabled/gamealition.com
ln -s $DIR/snippets/common.conf $NGINX_CONF/snippets/common.conf
ln -s $DIR/snippets/php.conf $NGINX_CONF/snippets/php.conf
ln -s $DIR/snippets/phpbb.conf $NGINX_CONF/snippets/phpbb.conf
ln -s $DIR/snippets/ssl.conf $NGINX_CONF/snippets/ssl.conf
unlink $NGINX_CONF/sites-enabled/default
service nginx restart

echo "*** Done - nginx configuration installed, service restarted"
