## Static site served by Node.js + `serve` (ES modules friendly)
FROM node:20-alpine

WORKDIR /app

# Copy site content
COPY . /app

# Install the static file server
RUN npm i -g serve

# Expose HTTP port
EXPOSE 80

# Start the server on port 80, serving current directory
CMD ["serve", "-l", "80", "."]
