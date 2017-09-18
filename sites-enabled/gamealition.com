# Gamealition NGINX configurations
# http://nginx.org/en/docs/http/request_processing.html

# Main gamealition.com domain
server {
    listen      443 default_server;
    server_name gamealition.com;
    root        /home/www-data;

    include snippets/common.conf;
    include snippets/ssl.conf;

    # Redirect /forums to subdomain
    location ~ ^/forums?(.*)$ {
        return 301 https://forums.gamealition.com$1;
    }

    # Redirect /media to subdomain
    location ~ ^/media?(.*)$ {
        return 301 https://media.gamealition.com$1;
    }

    # Redirect /dubtrack to third-party
    location ~ ^/dubtrack?(.*)$ {
        return 301 https://www.dubtrack.fm/join/gamealition-official$1;
    }

    # Redirect /7daystodie to subdomain
    location /7daystodie {
        return 301 https://7days.gamealition.com;
    }

    # TWiTCraft forums mirror
    location /twit-mirror {
        autoindex on;
        # Substitution to add information banner about mirror to every page
        sub_filter  "<div class=\"logo\">"
            "<div class='twit-notice'>
                This is a mirror of the forums of a former Minecraft community; <em>TWiTCraft</em>.<br/>
                This mirror is being hosted by <em>Gamealition</em>, a community of former TWiTCraft players.<br/>
                You can join us on <a href='https://gamealition.com'>https://gamealition.com</a>!
            </div><div class=\"logo\">";
        sub_filter_once on;
    }

    location /twit-mirror/forums/viewtopic.php?f=6&t=850.html { return 403; }

    # netdata monitoring panel
    # https://github.com/firehol/netdata/wiki/Running-behind-nginx
    location /status {
        return 301 /status/;
    }

    location ^~ /status/netdata.conf {
        deny all;
    }

    location ~ /status/(?<ndpath>.*) {
        auth_basic "Gamealition Server Status";
        auth_basic_user_file passwords;

        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass_request_headers on;
        proxy_set_header Connection "keep-alive";
        proxy_store off;
        proxy_pass http://127.0.0.1:19999/$ndpath$is_args$args;
        gzip_proxied any;
    }

    # Serve frontpage files
    location / {
        root /home/www-data/frontpage;
    }
}

# Forums subdomain
server {
    listen      443;
    server_name forums.gamealition.com;
    root        /home/www-data/forums;

    include snippets/common.conf;    
    include snippets/ssl.conf;
    include snippets/phpbb.conf;
}

# Media subdomain
server {
    listen      443;
    server_name media.gamealition.com;
    root        /home/www-data/media;

    include snippets/common.conf;
    include snippets/ssl.conf;

    location / {
        autoindex on;
        index index.html index.htm;
    }
}

# Survival subdomain
server {
    listen      443;
    server_name survival.gamealition.com;

    include snippets/common.conf;
    include snippets/ssl.conf;

    location /rules     { return 301 https://forums.gamealition.com/viewtopic.php?f=1&t=4; }
    location /forums    { return 301 https://forums.gamealition.com/viewforum.php?f=1; }
    location /features  { return 301 https://forums.gamealition.com/viewtopic.php?f=1&t=116; }
    location /changelog { return 301 https://forums.gamealition.com/viewtopic.php?f=1&t=38; }
    location /bugs      { return 301 https://forums.gamealition.com/viewtopic.php?f=1&t=20; }
    location /santa     { return 301 https://forums.gamealition.com/viewtopic.php?f=1&t=243; }
    location /tour      { return 301 https://forums.gamealition.com/viewtopic.php?f=9&t=306; }
    location /shops     { return 301 https://stitchhasaglitch.com/mcshopdex; }

    location /data
    {
        root      /home/www-data/survival;
        expires   5m;
        autoindex on;

        add_header 'Access-Control-Allow-Origin'  '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
    }

    # Special handler for dynmap links
    # Handles Dynmap shortcuts (e.g. /dynmap/world_nether/-666/64/666)
    location /dynmap { return 301 http://survival.gamealition.com:8123; }
    
    location ~ /dynmap/([A-Za-z_]+)/(-?\d+)/(\d+)/(-?\d+) {
        return 301 http://survival.gamealition.com:8123/?worldname=$1&mapname=surface&zoom=7&x=$2&y=$3&z=$4;
    }

    # Redirect everything else
    location / { return 301 https://gamealition.com$request_uri; }
}

# FTB subdomain
server {
    listen      443;
    server_name ftb.gamealition.com;

    location /rules     { return 301 https://forums.gamealition.com/viewtopic.php?f=4&t=393; }
    location /apply     { return 301 https://forums.gamealition.com/viewtopic.php?f=4&t=393; }
    location /forums    { return 301 https://forums.gamealition.com/viewforum.php?f=4; }
    location /changelog { return 301 https://forums.gamealition.com/viewtopic.php?f=4&t=10; }
    location /bugs      { return 301 https://forums.gamealition.com/viewtopic.php?f=4&t=398; }
    location /dynmap    { return 301 http://ftb.gamealition.com:9001/; }
    # Redirect everything else
    location /          { return 301 https://forums.gamealition.com/viewtopic.php?f=4&t=393; }
}

# ARK subdomain
server {
    listen      443;
    server_name ark.gamealition.com;

    location /rules     { return 301 https://forums.gamealition.com/viewtopic.php?f=13&t=248; }
    location /forums    { return 301 https://forums.gamealition.com/viewforum.php?f=13; }
    location /changelog { return 301 https://forums.gamealition.com/viewtopic.php?f=13&t=249; }
    # Redirect everything else
    location /          { return 301 https://gamealition.com$request_uri; }
}

# 7 Days subdomain
server {
    listen      443;
    server_name 7days.gamealition.com;

    location /forums    { return 301 https://forums.gamealition.com/viewforum.php?f=17; }
    # Redirect everything else
    location /          { return 301 https://forums.gamealition.com/viewforum.php?f=17; }
}

# TWiT subdomain
server {
    listen      443;
    server_name twit.gamealition.com;

    location /help   { return 301 https://forums.gamealition.com/viewtopic.php?f=1&t=268&p=1406#p1408; }
    location /dynmap { return 301 http://twit.gamealition.com:8124; }
    # Redirect everything else
    location /       { return 301 https://forums.gamealition.com/viewtopic.php?f=1&t=268; }
}

# Skyfactory subdomain
server {
    listen      443;
    server_name skyfactory.gamealition.com;
    return      301 https://forums.gamealition.com/viewtopic.php?f=4&t=383&p=2511;
}

# Skyblock subdomain
server {
    listen      443;
    server_name skyblock.gamealition.com;

    location /rules     { return 301 https://forums.gamealition.com/viewtopic.php?f=4&t=426; }
    location /apply     { return 301 https://forums.gamealition.com/viewtopic.php?f=4&t=426; }
    location /forums    { return 301 https://forums.gamealition.com/viewforum.php?f=4; }
    # Redirect everything else
    location /          { return 301 https://forums.gamealition.com/viewtopic.php?f=4&t=426; }
}

# Personal subdomain for vanderprot
server {
    listen      443;
    server_name vanderprot.gamealition.com;
    root        /home/vanderprot/www;

    include snippets/common.conf;
    include snippets/ssl.conf;

    location / {
        index index.html index.htm;
    }
}

# Creative information subdomain
server {
    listen      443;
    server_name creative.gamealition.com;
    return      301 https://forums.gamealition.com/viewtopic.php?f=9&t=104;
}

# IRC information subdomain
server {
    listen      443;
    listen      9000;
    server_name irc.gamealition.com;
    return      301 https://forums.gamealition.com/viewtopic.php?f=9&t=339;
}

# Mumble information subdomain
server {    
    listen      443;
    server_name mumble.gamealition.com;
    return      301 https://forums.gamealition.com/viewtopic.php?f=9&t=371;
}

# Mumble information subdomain
server {
    listen      443;
    server_name discord.gamealition.com;
    return      301 https://discord.gg/t5rBTeG;
}


# ###############
# Misc. Redirects
# ###############

# Redirect all HTTP requests to HTTPS
# https://bjornjohansen.no/redirect-to-https-with-nginx
server {
    listen      80;
    server_name .gamealition.com;
    return      301 https://$host$request_uri;
}

# Redirect all unknown subdomains to front page
server {
   listen      443;
   server_name *.gamealition.com www.gamealition.com;
   return      301 https://gamealition.com$request_uri;
}

# Reject requests with no host
server {
    listen 80;
    return 444;
}

