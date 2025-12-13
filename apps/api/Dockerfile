FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y openssl libssl3 curl \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable \
  && corepack prepare pnpm@9.12.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

COPY apps/api/prisma ./apps/api/prisma
COPY apps/api ./apps/api

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/api

RUN npx prisma generate --schema=prisma/schema.prisma

RUN pnpm run build

CMD ["node", "dist/main.js"]
