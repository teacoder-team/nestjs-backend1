# Используем официальный образ Node.js в качестве базового образа
FROM node:18 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock для установки зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Копируем все файлы приложения в рабочую директорию
COPY . .

RUN yarn prisma generate
# Собираем проект для production
RUN yarn build

# Используем более легкий образ для production
FROM node:18-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только необходимые файлы из предыдущего этапа сборки
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --chown=nodejs:nodejs --from=builder /app/prisma/__generated__ ./prisma/__generated__

# Установка продакшн зависимостей с помощью yarn
RUN yarn install --production

# Запускаем приложение
CMD ["node", "dist/main"]