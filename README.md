# Ron Omer portfolio

Personal portfolio built with React, React Router, and Vite. Includes a filterable project catalog, case studies, experience, skills, and contact details.

The About page combines biography, skills, and contact sections. Direct links use `/about#skills` and `/about#contact`. The previous `/skills` and `/contact` URLs redirect to those sections.

## Local development

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Project content lives in `src/data.js`, pages and shared components in `src/App.jsx`, and styles in `src/styles.css`. Public images and the favicon live in `public/assets`.

## Checks and production build

```sh
npm run format:check
npm run build
npm run preview
```

Run `npm run format` after editing files. The production build is generated in `dist/`.

## Upload to GitHub

Create an empty repository in your GitHub account. From this directory, run the following commands, replacing `YOUR_REPOSITORY_URL` with its HTTPS or SSH URL.

```sh
git add .
git commit -m "Prepare portfolio for deployment"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

Commit `package-lock.json` so installation uses the reviewed dependency versions. Generated files and local dependencies are excluded by `.gitignore`.

## Deploy to Vercel

Import the GitHub repository into Vercel and select the Vite framework preset. Use `npm ci` as the install command, `npm run build` as the build command, and `dist` as the output directory. Select Node.js 22.x. This site requires no environment variables.

`vercel.json` routes direct page requests to `index.html` so links such as `/projects/steamlite` also work when refreshed or opened directly. After deploying, check the home page, a project case study opened directly, the project filters, and the mobile navigation.

The configuration follows the [Vercel Vite deployment documentation](https://vercel.com/docs/frameworks/frontend/vite). For another hosting provider, configure an equivalent fallback to `index.html` for client-side routes.
