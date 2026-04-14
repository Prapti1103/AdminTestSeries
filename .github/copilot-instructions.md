# Workspace Instructions for AdminTestSeries

This repository is a React + Vite admin dashboard focused on test series management. The codebase is written in modern ESM with `.jsx` and `.js` files, uses Ant Design for UI, and relies on Vite for the dev/build workflow.

## Project overview

- Entry point: `src/main.jsx`
- Root app: `src/App.jsx`
- Main layout: `src/Layout/MainLayout.jsx`
- Primary feature area: `src/TestSeries/`
- API helpers: `src/API/AllApi.js`
- Styling: `src/index.css`, `src/Layout/layout.css`, plus component-specific CSS files

## Key technologies

- React 18
- Vite
- Ant Design (`antd`)
- React hooks
- `axios` for HTTP requests
- `mathlive`, `@tinymce/tinymce-react`, `jspdf`, `html2canvas` for rich editor / PDF use cases
- ESLint config in `eslint.config.js`

## Development commands

- `npm install`
- `npm run dev` — start Vite development server
- `npm run build` — production build
- `npm run lint` — run ESLint across source files
- `npm run preview` — preview production build locally

## Conventions to follow

- Keep the codebase in ESM style using `import` / `export`
- Continue using `.jsx` for React components and `.js` for helper modules
- Reuse Ant Design components and icons where possible instead of adding a second UI library
- Do not convert the repo to TypeScript unless explicitly requested
- Avoid adding React Router or heavy new app structure without a clear need; the current app uses internal state/tab navigation
- Align with the existing ESLint config and run `npm run lint` for any component changes

## Suggested areas for agent assistance

- Modify or extend dashboard UI in `src/Layout/MainLayout.jsx`
- Add or refactor features inside `src/TestSeries/`
- Update API calls in `src/API/AllApi.js`
- Maintain styling in `src/Layout/layout.css` and `src/index.css`
- Keep changes minimal and consistent with the current app architecture

## Notes for edits

- Existing UI uses a top-tab state map in `MainLayout.jsx` rather than route-based navigation
- Sidebar and header are implemented via Ant Design `Layout` and `Menu`
- Use `useState`, `useEffect`, and other React hooks idiomatically
- Preserve the current app shell behavior unless the task explicitly requires redesigning the layout
