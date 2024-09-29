# Используем официальный образ Node.js версии 20.12.0 в качестве базового
FROM node:20.12.0 AS base

# Этап сборки приложения
FROM base AS builder

# Устанавливаем рабочую директорию для сборки
WORKDIR /app

# Копируем файлы зависимостей в рабочую директорию
COPY package.json yarn.lock ./

# Устанавливаем кэш для Yarn
ENV YARN_CACHE_FOLDER=/tmp/.yarn-cache

# Устанавливаем зависимости проекта
RUN yarn install

# Копируем остальные файлы приложения в рабочую директорию
COPY . .

# Генерируем Prisma клиент
RUN yarn prisma generate

# Собираем приложение
RUN yarn build

# Этап запуска приложения
FROM base AS runner

# Устанавливаем рабочую директорию для запуска
WORKDIR /app

# Устанавливаем переменную окружения для режима работы приложения
ENV NODE_ENV=production

# Копируем файлы зависимостей для продакшн-режима
COPY --chown=nodejs:nodejs package.json yarn.lock ./

# Устанавливаем только продакшн-зависимости
RUN yarn install --production

# Копируем собранные файлы из этапа сборки
COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist
COPY --chown=nodejs:nodejs --from=builder /app/prisma/__generated__ ./prisma/__generated__

# Команда для запуска приложения
CMD ["node", "dist/main"]