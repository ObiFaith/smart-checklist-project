# Did I Forget Something?

Did I Forget Something? is a mobile-first Progressive Web App for building and using practical checklists before leaving home, starting a trip, going to work, attending school, or preparing for another activity.

The app combines ready-made situations with user-created checklists. Users can track completion, add or remove items, reset progress, rename their custom checklists, and delete content with confirmation before destructive actions.

## Features

- Four built-in checklist scenarios:
  - Going to Work
  - Traveling
  - Going to School
  - Going to the Gym
- Custom checklist creation with a name, icon, and optional starting items.
- Checklist item completion tracking with a progress indicator.
- Add, remove, and reset checklist items.
- Rename and delete custom checklists.
- Confirmation dialogs for deleting checklists and individual items.
- Keyboard-accessible confirmation dialogs with focus trapping, Escape-to-cancel, and focus restoration.
- Local browser persistence through `localStorage`.
- Installable and offline-capable PWA configuration through `vite-plugin-pwa`.
- Responsive UI designed for mobile first and adapted for larger screens.

## Technology

- React 19
- TypeScript
- Vite
- React Router
- Vite PWA plugin
- ESLint

The application is frontend-only. It does not require a backend, account, database, or network API. Checklist data is stored in the browser that is running the app.

## Getting Started

### Prerequisites

- Node.js and npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will print the local development URL in the terminal, normally `http://localhost:5173`.

### Run linting

```bash
npm run lint
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## How It Works

1. Choose a suggested scenario or create a custom checklist from the home page.
2. Open the checklist and mark items as complete as you prepare.
3. Add missing items directly to the checklist when needed.
4. Use the reset action to clear completion status without removing items.
5. Manage custom checklist names and delete actions from the home page.

Deletion is intentionally guarded by a confirmation dialog. The dialog keeps keyboard focus inside the modal and restores focus to the action that opened it after closing.

## Data and Persistence

Checklist state is stored in `localStorage` using namespaced keys. Built-in scenario templates are defined in source code, while custom scenario metadata and checklist items are stored separately.

The storage service validates persisted data before returning it and handles custom checklist creation and deletion transactionally. If a related storage operation fails, the app avoids reporting a successful operation and attempts to restore the previous metadata.

Clearing browser storage, changing browsers, or using a different device removes or hides the locally stored custom checklists.

## Project Structure

```text
src/
  components/
    checklist/       Checklist display, items, progress, and add-item form
    common/          Shared confirmation dialog
    situation/       Suggested scenario cards and lists
  data/              Built-in situations and default checklist items
  hooks/             Checklist state and persistence integration
  pages/             Home and checklist route views
  services/          Local-storage CRUD and data validation
  types/             Shared TypeScript models
```

## Production Notes

Run `npm run build` before deployment. The generated files are written to `dist/` and include the PWA manifest and service worker. Because the app uses client-side routing, the hosting platform should serve `index.html` as a fallback for application routes.
