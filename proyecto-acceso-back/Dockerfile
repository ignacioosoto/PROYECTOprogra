FROM node:18

WORKDIR /app

# 👇 Copia package.json y package-lock.json primero para cache correcta
COPY package*.json ./

# 👇 Instala dependencias (incluye dotenv)
RUN npm install

# 👇 Ahora copia el resto del código
COPY . .

# 👇 Expone el puerto y ejecuta la app
EXPOSE 3500
CMD ["node", "app.js"]
