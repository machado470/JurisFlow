FROM node:20-slim

WORKDIR /app

# ============================
# Dependências básicas
# ============================
RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# ============================
# PNPM
# ============================
RUN npm install -g pnpm

# ============================
# Workspace manifests
# ============================
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

# ============================
# Install deps
# ============================
RUN pnpm install --frozen-lockfile

# ============================
# Copy code
# ============================
COPY . .

# ============================
# Prisma Client (PATH FIXO)
# ============================
RUN pnpm prisma generate --schema=apps/api/prisma/schema.prisma

# ============================
# Build API
# ============================
RUN pnpm --filter api build

EXPOSE 3000

CMD ["pnpm", "--filter", "api", "start"]
