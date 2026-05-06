# Use Node.js LTS as the base image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.json tsconfig.base.json ./

# Copy library packages
COPY lib ./lib

# Copy mobile artifact
COPY artifacts/mobile ./artifacts/mobile

# Install all dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Build the mobile project to generate the static-build/ directory
WORKDIR /app/artifacts/mobile

# The build script requires some environment variables to be set
# We provide a placeholder domain here; it should be updated during deployment
ENV EXPO_PUBLIC_DOMAIN=localhost
RUN pnpm run build

# Expose the port the server listens on
EXPOSE 3000

# Start the standalone production server
CMD ["pnpm", "run", "serve"]
