FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
COPY src ./src
COPY .env .env
RUN npx prisma generate
RUN npx prisma migrate deploy
EXPOSE 3000
CMD ["npm","run","start:prod"]