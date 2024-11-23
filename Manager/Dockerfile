FROM node:16.18-buster-slim as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node Package
RUN npm install

# Copy source code
COPY src ./src
COPY tsconfig*.json ./

# set port docs
EXPOSE 8080
CMD ["npm", "run", "start"]
