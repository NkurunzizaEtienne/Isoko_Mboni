# Project setup and repository structure

This guide describes the public repository as inspected when this documentation was prepared. The Vite application is at the repository root; there is no `web/` subdirectory.

## 1. Links

- Repository: https://github.com/NkurunzizaEtienne/Isoko_Mboni
- Live application: https://isoko-mboni.vercel.app/

## 2. Requirements

- Node.js and npm (use a current Node.js release compatible with the Vite version in `package.json`).
- Git, if cloning the repository.

## 3. Run the frontend locally

```bash
git clone https://github.com/NkurunzizaEtienne/Isoko_Mboni.git
cd Isoko_Mboni
npm install
npm run dev
```

Vite prints the local development URL in the terminal, normally `http://localhost:5173`.

## 4. Build, lint and preview

```bash
npm run build
npm run lint
npm run preview
```

For a production preview, run `npm run build` before `npm run preview`.

## 5. Current public repository structure

```text
Isoko_Mboni/
├── public/
│   └── data/
│       ├── backtest.json
│       ├── cpi.json
│       ├── crops.json
│       ├── history.json
│       ├── outlook.json
│       └── seasonal.json
├── src/
│   ├── components/
│   ├── lib/
│   │   ├── decision.ts
│   │   ├── loadData.ts
│   │   └── useHashRoute.ts
│   ├── pages/
│   ├── App.tsx
│   ├── labels.ts
│   ├── mockData.ts
│   ├── siteContent.ts
│   ├── types.ts
│   ├── index.css
│   └── styles.css
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
└── README.md
```

The frontend's `src/lib/loadData.ts` loads JSON from `public/data/`. The decision calculation is in `src/lib/decision.ts`.

## 6. Data files used by the frontend

| File | Purpose |
|---|---|
| `public/data/crops.json` | Crop and market metadata, latest prices and data range |
| `public/data/history.json` | Historical monthly prices by crop and market |
| `public/data/outlook.json` | Expected, low and high seasonal changes by crop, harvest month and horizon |
| `public/data/seasonal.json` | Seasonal chart data |
| `public/data/backtest.json` | Backtest metrics by crop |
| `public/data/cpi.json` | CPI values used in the data workflow; the current frontend loader does not request this file directly |

Do not delete or rename these files without updating the loader and corresponding types.

## 7. Data-pipeline reproducibility status

The methodology supplied by the team describes Python scripts named `pipeline/fetch_prices.py`, `pipeline/check_crops.py` and `pipeline/build_data.py`, plus a `pipeline/requirements.txt` file and an NISR CPI workbook.

**The `pipeline/` directory and those scripts were not present in the public GitHub repository tree when this guide was checked.** The raw esoko.rw data is intentionally excluded because it contains personal information about price collectors.

Therefore:

- The public repository can be used to install, run and build the frontend using the committed JSON files.
- The public repository, as currently published, does not contain all source files required to regenerate those JSON files from the raw API download.
- Do not claim that the full data pipeline is reproducible from the public repository until the pipeline scripts, dependency list and CPI-source instructions are committed.
- Keep collector personal data out of version control if the pipeline is later published.

## 8. Deployment

The application is deployed at https://isoko-mboni.vercel.app/.

The current public frontend is a static Vite application. No backend, database or verified environment-variable requirements are documented here.

## 9. Suggested documentation layout

```text
Isoko_Mboni/
├── README.md
├── docs/
│   ├── METHODOLOGY.md
│   ├── SOURCES.md
│   └── PROJECT_SETUP.md
├── public/
│   └── data/
└── src/
```

After adding these files, link to them from the root README.
