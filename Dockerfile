FROM node:20-alpine

# Install git and any other necessary dependencies
RUN apk add --no-cache git openssl

# Expose application port
EXPOSE 3000

# Set the working directory
WORKDIR /app

# Copy application files
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Install dependencies
RUN npm install

# Generate Prisma client and run migrations
RUN npm run setup

# Build the application
RUN npm run build

# Optional: Remove SQLite database if it's not needed
RUN rm -f prisma/dev.sqlite

# Start the application
CMD ["npm", "run", "docker-start"]
