FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Dependências base
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --frozen-lockfile

# Copia TODO o código primeiro
COPY . .

# Prisma generate (AGORA com schema final)
RUN pnpm --filter api prisma generate

# Build
RUN pnpm --filter api build

EXPOSE 3000

CMD ["pnpm", "--filter", "api", "start:prod"]
