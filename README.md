These are all the nginx config files that powers gamealition.com, including all its 
subdomains and redirects. This is meant for use on Ubuntu 16.04 and above.

The purpose of having these files public, is to help other server owners. It is hoped
that this configuration is simple and commented enough, to learn nginx from.

The files available in this repo:

* `sites-enabled/gamealition.com` - Defines the domain, subdomains and paths
* `snippets/common.conf` - A snippet that gets included in subdomains that serve content
* `snippets/php.conf` - A snippet that gets included in subdomains that serve PHP content
* `snippets/phpbb.conf` - A snippet that gets included for phpBB support
* `snippets/ssl.conf` - A snippet that gets included in SSL-serving endpoints
* `install.sh` - Replaces default nginx config with this, using symlinks
* `uninstall.sh` - Reverts back to default nginx config

For a thorough but easy-to-follow explaination of how nginx works, [see this guide.][1]

[1]: http://nginx.org/en/docs/http/request_processing.html
