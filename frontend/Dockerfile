FROM nginx:alpine

# install envsubst
RUN apk add --no-cache gettext

WORKDIR /usr/share/nginx/html

COPY index.html.template ./index.html.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
