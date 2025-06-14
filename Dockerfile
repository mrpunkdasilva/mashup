FROM node:19-alpine AS base

# Instalar dependências apenas quando necessário
FROM base AS deps
WORKDIR /app

# Instalar dependências baseadas no gerenciador de pacotes
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile não encontrado." && exit 1; \
  fi

# Construir a aplicação
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Construir aplicação Next.js
RUN yarn build

# Imagem de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Criar usuário não-root para produção
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar código necessário
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Configuração automática baseada no Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/server ./server
COPY --from=builder --chown=nextjs:nodejs /app/server.ts ./server.ts

USER nextjs

EXPOSE 3000

# Comando para iniciar o servidor
CMD ["yarn", "start:server"]