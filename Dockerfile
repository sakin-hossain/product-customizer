FROM node:18-alpine

# Install OpenSSL (needed for Prisma)
RUN apk update && apk add --no-cache openssl

EXPOSE 3000

WORKDIR /app
COPY . .

ENV NODE_ENV=production

# Install dependencies
RUN npm install

# Remove CLI packages since we don't need them in production by default.
RUN npm remove @shopify/app @shopify/cli

# Generate Prisma client and run migrations
RUN npm run build

# Optionally clean up dev.sqlite file for production (if required)
RUN rm -f prisma/dev.sqlite

# Default command to start the app
CMD ["npm", "run", "docker-start"]
