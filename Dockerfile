FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g next
EXPOSE 3000
CMD [ "node", "index.js" ]