# Step 1: Build the Vue.js app
FROM node:18-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:stable-alpine AS production-stage

#Create ecommerce directory
RUN mkdir /usr/share/nginx/html/frontend

# Copy the built files from the build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html/frontend

# Copy the default nginx.conf provided by Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 3000
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]