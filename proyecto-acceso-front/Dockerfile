# Etapa de construcción
FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
COPY .env .env               
RUN npm install
COPY . .                     
RUN npm run build            

# Etapa de producción (Nginx)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
