# Деплой на Railway

## Быстрый старт (папка `zhenskaya-site` на рабочем столе)

1. Загрузите **содержимое этой папки** на GitHub (корень репозитория).
2. Railway → **New Project** → **Deploy from GitHub**.
3. **Root Directory** — оставьте **пустым**.
4. **Variables** — не нужны.
5. **Networking → Generate Domain**.

---

## Что внутри

| Файл | Назначение |
|------|------------|
| `Dockerfile` | Production-сборка |
| `railway.toml` | Healthcheck `/api/health` |
| `src/` | Код сайта |
| `package.json` | Зависимости |

**Не загружайте:** `node_modules`, `.next`, `.env.local`

---

## GitHub (PowerShell)

```powershell
cd C:\Users\User\Desktop\zhenskaya-site
git init
git add .
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/ИМЯ_РЕПО.git
git push -u origin main
```

Через сайт GitHub: **Add file → Upload files** → перетащите все файлы из `zhenskaya-site`.

---

## Обновить папку после правок в проекте

```powershell
cd C:\Users\User\Desktop\сайт\scripts
powershell -ExecutionPolicy Bypass -File .\pack-for-deploy.ps1
```

Папка `Desktop\zhenskaya-site` пересоберётся автоматически.

---

## Проверка после деплоя

- [ ] Главная открывается
- [ ] `/api/health` → `{"status":"ok"}`
- [ ] Онбординг и кабинет работают

---

## Если репозиторий = вся папка `сайт` (не только сайт)

Тогда на Railway укажите **Root Directory:** `frontend`
