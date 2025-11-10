FROM nginx:alpine

COPY site/pages/ /usr/share/nginx/html/
COPY site/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
