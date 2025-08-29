FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN mkdir -p /app/uploads/banner /app/uploads/introVideo /app/uploads/video
RUN npm run build

EXPOSE 1170

CMD ["node", "dist/main"]
