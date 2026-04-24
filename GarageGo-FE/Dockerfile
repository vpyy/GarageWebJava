# ── Stage 1: Build ──────────────────────────────────────────────────
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Gọi API qua Nginx proxy (path tương đối) thay vì hardcode localhost
ENV REACT_APP_API_BASE_URL=/api
ENV GENERATE_SOURCEMAP=false
ENV CI=false
# Disable ESLint during build to avoid build failures
ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run build

# ── Stage 2: Serve với Nginx ─────────────────────────────────────────
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
