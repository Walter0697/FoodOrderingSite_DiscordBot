FROM node:20-slim AS dependencies

WORKDIR /app
RUN npm install -g pnpm
COPY package.json package.json ./
RUN pnpm install

COPY . .

EXPOSE 6000
CMD ["pnpm", "start"]