FROM node:lts-slim
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm i
CMD ["npm", "run", "start"]