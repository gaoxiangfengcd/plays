# Play Picks Deployment Guide

This project is a static website for `plays.jiandengcun.com`.

Use this guide when deploying from a new computer or updating the production server.

## Project Info

- Local project path on the original Mac: `/Users/gaoxiangfeng/Desktop/我的软件/play-picks`
- GitHub repository: `https://github.com/gaoxiangfengcd/plays.git`
- Production server IP: `159.223.116.111`
- Server project path: `/var/www/play-picks`
- Production domain: `https://plays.jiandengcun.com`
- Main branch: `main`

## Local Preview

From the project folder:

```bash
cd /Users/gaoxiangfeng/Desktop/我的软件/play-picks
python3 -m http.server 8093
```

Open:

```text
http://127.0.0.1:8093/
```

Important pages to check before deploying:

```text
http://127.0.0.1:8093/
http://127.0.0.1:8093/tools/flip-a-coin/
http://127.0.0.1:8093/tools/decision-maker/
http://127.0.0.1:8093/tools/spin-the-wheel/
http://127.0.0.1:8093/tools/dice-roller/
http://127.0.0.1:8093/tools/random-name-picker/
http://127.0.0.1:8093/games/carpet-cleaning/
http://127.0.0.1:8093/sitemap.xml
http://127.0.0.1:8093/robots.txt
```

If styles or scripts look old, hard refresh the browser:

```text
Command + Shift + R
```

## Deploy From Local Computer

Run these commands locally:

```bash
cd /Users/gaoxiangfeng/Desktop/我的软件/play-picks
git status
git add .
git commit -m "Update Play Picks"
git push origin main
```

If there is nothing to commit, Git will say the working tree is clean. In that case, continue with the server pull.

## Deploy On Server

SSH into the server:

```bash
ssh root@159.223.116.111
```

Pull the latest code:

```bash
cd /var/www/play-picks
git pull origin main
```

Check Nginx config:

```bash
nginx -t
```

Reload Nginx:

```bash
systemctl reload nginx
```

## First-Time Server Setup

If the server does not have the project yet:

```bash
cd /var/www
git clone https://github.com/gaoxiangfengcd/plays.git play-picks
```

Example Nginx config:

```nginx
server {
    listen 80;
    server_name plays.jiandengcun.com;

    root /var/www/play-picks;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|svg|webp|ico|wasm|data)$ {
        expires 30d;
        add_header Cache-Control "public";
        try_files $uri =404;
    }
}
```

After creating or editing the config:

```bash
nginx -t
systemctl reload nginx
```

## HTTPS

SEO and AdSense are better with HTTPS. After DNS points to the server, install a certificate:

```bash
apt update
apt install -y certbot python3-certbot-nginx
certbot --nginx -d plays.jiandengcun.com
```

Then verify:

```text
https://plays.jiandengcun.com/
https://plays.jiandengcun.com/sitemap.xml
https://plays.jiandengcun.com/robots.txt
```

## Google Search Console After Deployment

Submit or resubmit:

```text
https://plays.jiandengcun.com/sitemap.xml
```

For important changed pages, use URL Inspection and request indexing:

```text
https://plays.jiandengcun.com/
https://plays.jiandengcun.com/tools/spin-the-wheel/
https://plays.jiandengcun.com/tools/flip-a-coin/
https://plays.jiandengcun.com/tools/decision-maker/
https://plays.jiandengcun.com/tools/dice-roller/
https://plays.jiandengcun.com/tools/random-name-picker/
```

## Deploy From A New Computer

Install Git, then clone:

```bash
cd ~/Desktop
git clone https://github.com/gaoxiangfengcd/plays.git play-picks
cd play-picks
python3 -m http.server 8093
```

After making changes:

```bash
git status
git add .
git commit -m "Update Play Picks"
git push origin main
```

Then SSH into the server and run the server deploy steps above.

## Common Problems

### The live site still shows old CSS or JavaScript

Hard refresh the browser:

```text
Command + Shift + R
```

Also confirm the HTML references a new version string, for example:

```html
<link rel="stylesheet" href="../../assets/styles.css?v=...">
<script src="../../assets/app.js?v=..."></script>
```

### `git pull` has conflicts on the server

Do not run `git reset --hard` unless you intentionally want to discard server changes.

First inspect:

```bash
cd /var/www/play-picks
git status
```

If the server only contains generated or accidental edits, back them up before resetting.

### Unity WebGL page does not load

Check that these files exist on the server:

```text
/var/www/play-picks/games/carpet-cleaning/unity-build/Build/unity-build.loader.js
/var/www/play-picks/games/carpet-cleaning/unity-build/Build/unity-build.wasm
/var/www/play-picks/games/carpet-cleaning/unity-build/Build/unity-build.data
/var/www/play-picks/games/carpet-cleaning/unity-build/Build/unity-build.framework.js
```

If Nginx blocks `.wasm`, add this in `/etc/nginx/mime.types` or the site config:

```nginx
types {
    application/wasm wasm;
}
```

