# Build stage
FROM oven/bun:latest AS build

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build the app (TanStack Start / Nitro)
RUN bun run build

# Production stage
FROM oven/bun:latest

WORKDIR /app

# Copy built outputs from build stage
# Nitro builds into .output by default
COPY --from=build /app/.output ./.output

EXPOSE 3000

# Run the Nitro server
CMD ["bun", ".output/server/index.mjs"]
