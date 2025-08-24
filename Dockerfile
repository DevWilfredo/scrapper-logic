FROM ghcr.io/puppeteer/puppeteer:24.17.0

# No descargues Chromium (ya viene con la imagen)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

CMD [ "node", "app.js" ]
