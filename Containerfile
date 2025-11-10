FROM nginx:alpine

COPY site/nginx.conf /etc/nginx/nginx.conf
COPY site/pages/*.html /usr/share/nginx/html/

EXPOSE 80
