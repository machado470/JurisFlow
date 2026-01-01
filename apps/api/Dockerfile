FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y openssl libssl3 curl postgresql-client \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable \
  && corepack prepare pnpm@9.12.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY apps/api ./apps/api

WORKDIR /app/apps/api

RUN pnpm install --frozen-lockfile
RUN npx prisma generate
RUN pnpm run build

EXPOSE 3000

CMD ["sh", "prisma/bootstrap.sh"]
