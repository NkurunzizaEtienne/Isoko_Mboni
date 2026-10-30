# Isoko Mboni

**Sell now or store? A plain-language decision tool for Rwandan crops.**

Built by team **Umuhinzi Mboni** (University of Rwanda, UR-CAFF) for the **NISR 2026 Big Data Hackathon**, Track 1: Agricultural Productivity.

- **Live app:** https://Isoko-mboni.vercel.app
- **Open the dashboard directly:** https://.vercel.app/#desk
- **Full methodology:** [docs/METHODOLOGY.md](docs/METHODOLOGY.md)

---

## The problem

## The Sell-or-Store Decision: A Small Decision with Major Economic Consequences

Harvesting a crop should be the beginning of earning from it—not the moment a farmer has to accept whatever price the market offers. Yet for many farmers, the decision is difficult: sell immediately and secure cash at today's price, or store the harvest and wait for a potentially better price? Waiting is not automatically profitable. A future price increase must be large enough to compensate for storage and handling costs, crop deterioration, and the cost of money tied up or borrowed during storage. Without a clear way to compare these factors, farmers risk selling too early and missing potential income, or storing too long and losing money.

**Isoko Mboni turns this decision into an economic comparison.** It uses available crop-price data and user-provided storage assumptions to estimate the financial outcome of selling now versus storing for a selected period. It shows the expected return, break-even price, probability of a better outcome, and the risks behind its recommendation. This can help farmers and cooperatives assess whether storage is economically worthwhile, plan when to sell, and make more informed use of limited cash and storage capacity. The aim is not to promise higher prices or eliminate market risk; it is to make the trade-offs visible before a decision is made.

This problem directly connects to Rwanda's national development agenda. **NST2 (2024–2029)** calls for stronger agricultural productivity and value chains, and explicitly targets reducing post-harvest losses to below 5% through better handling, market linkages, and agro-processing. **Vision 2050** sets the country's long-term ambition for a more prosperous, productive and high-income economy. Its agricultural transformation pathway is advanced through **PSTA 5 (2024/25–2028/29)**, which identifies *Inclusive Markets and Post-harvest Management for Sustainable Agri-Food Systems* as a priority. PSTA 5 also emphasizes stronger market linkages, post-harvest infrastructure, value addition, and digitized agri-food systems. Isoko Mboni contributes at the decision-support level: helping turn market information into practical, farm-level decisions that can support better income management, more efficient use of storage, and stronger market participation.

[Read more about Isoko Mboni's alignment with national priorities](https://github.com/NkurunzizaEtienne/Isoko_Mboni#alignment-with-national-priorities).

## What Isoko Mboni does

You enter:

- crop and market
- harvest month and the longest you are willing to store (1 to 6 months)
- price now, and **quantity in kg**
- storage and handling cost (RWF/kg/month)
- expected total loss over storage (%)
- loan interest (% per year)
- optional: the general price rise you expect, and cash you need now

You get an answer in plain language: 

- **STORE** or **SELL NOW**
- a sentence such as: *"Storing could gain X RWF on Q kg after losses, storage and interest. Best month to sell: M."*
- the expected price in that month, the **break-even price**, expected spoilage, the downside if prices disappoint, and what storing costs
- the chance that storing pays, and a clear statement of how reliable the forecast is

The numbers above are examples of the format. Every figure is calculated from the inputs and the data.

## How it works

```
esoko.rw farmgate prices ----+
                             +--> Python pipeline --> 6 small JSON files --> React app (static site)
NISR consumer price index ---+
```

There is no backend. The Python pipeline cleans the prices, removes general inflation using the NISR consumer price index, finds the seasonal pattern and tests it against past months. It writes small JSON files that the web app reads. The sell-or-store calculation runs in the browser.

## Data

| Data | Source | Use |
|---|---|---|
| Farmgate prices, 252,986 records | esoko.rw prices API | Seasonal price patterns. Usable window: October 2024 to October 2026 (about 22 months, with no data for August to October 2025) |
| Consumer Price Index, All Rwanda, Feb 2014 = 100 (Sept 2026 release) | National Institute of Statistics of Rwanda (NISR), CC BY 4.0 | Removes general price rises from the price history. The index rose 20.0% over the 12 months to September 2026 |
| Average bank lending rate, about 16% in 2026 | National Bank of Rwanda | Default for the loan-interest input (the user can change it) |

The raw price download is **not** in this repository because it contains personal details of price collectors. [docs/METHODOLOGY.md](docs/METHODOLOGY.md) explains how to rebuild everything.

## What our testing found

We tested four storable staple crops. For each one we asked: *does last year's seasonal price change predict this year's better than assuming prices never change?*

| Crop | Our forecast error | Error if prices never change | Result |
|---|---|---|---|
| Irish potato | 13.9% | 17.3% | **Pattern is reliable enough to forecast** |
| Beans | 7.1% | 8.3% | **Pattern is reliable enough to forecast** |
| Maize | 13.6% | 14.3% | Not reliable: no forecast gain |
| Rice | 16.0% | 5.2% | Not reliable: prices barely move seasonally |

A crop counts as reliable only if its error is at least 10% below the "no change" error. We chose that margin after seeing the results, and we say so in the methodology. For maize and rice the app does **not** invent a seasonal gain: it shows a zero expected change with a wide range and a "low confidence" label, and the answer is then driven by your own costs.

These tests are preliminary: they use only about 22 months of data, and the individual tests overlap.

## Limits (please read)

- **Short history.** About 22 months of prices with a three-month gap. Seasonal patterns from so little data are weak, and most forecasts are labelled low confidence.
- **National pattern, not per market.** The seasonal outlook is national. Prices at your market may differ.
- **The price range is approximate.** The low and high prices come from how well last year's pattern predicted this year's, not from exact price statistics.
- **Your costs are your inputs.** We have no verified data on storage cost or spoilage. The defaults are examples to be changed. For reference, the national post-harvest loss rate was 13.8% in 2023 and the 2029 government target is 5%.
- **Inflation adjustment is broad.** We use the all-items consumer price index, not a food-only index, so a small part of real seasonal movement may be removed.
- **Prototype.** Results are estimates, not financial advice.

## Alignment with national priorities

- **NST2 (2024 to 2029):** aims for a more market-oriented, productive agriculture, with investment in storage, value chains and market access for farmers.
- **PSTA 5 (2024/25 to 2028/29):** the agriculture sector plan that implements NST2 and is aligned with Vision 2050. One of its priorities is inclusive markets and post-harvest management.
- **Vision 2050:** Rwanda's path to an upper-middle-income economy by 2035 and a high-income economy by 2050, with agriculture as a source of inclusive wealth creation.

Isoko Mboni supports these goals by helping farmers, cooperatives and traders make an informed storage and selling decision, and by showing clearly what storing costs.

Sources:
- MINAGRI, PSTA 5 (abridged): https://www.minagri.gov.rw/fileadmin/user_upload/Minagri/Publications/Policies_and_strategies/PSTA_5_Abridged_version_Final.pdf
- Post-harvest loss figures: https://allafrica.com/stories/202512300006.html
- NST2 agriculture priorities: https://www.ktpress.rw/2026/03/kagame-criticizes-slow-progress-in-agriculture-urges-shift-from-promises-to-action/

## Who can use it

- **Smallholder farmers and cooperatives:** decide when to sell, and how much to sell now to cover cash needs.
- **Traders and aggregators:** see what a storage period has to earn to cover costs.
- **Extension officers:** explain storage economics with the farmer's own numbers.
- **Planners and policy teams:** see how loan interest and spoilage change the case for storage.

We have not yet tested the tool with farmers. That is the next step.

## How this maps to the judging criteria

| Criterion | Where to look |
|---|---|
| Problem understanding and relevance | "The problem" and "Alignment" above; About page in the app |
| Data use and methodology | "Data" and "What our testing found" above; [docs/METHODOLOGY.md](docs/METHODOLOGY.md): cleaning rules, NISR CPI adjustment, backtest, formulas |
| Tech innovation | Inflation-adjusted seasonal forecasts with a backtest and a stated reliability rule; a decision model with break-even price, probability that storing pays, downside check and cash split |
| Usability and design | Isoko Desk: inputs on the left and all results visible on one screen; plain-language answers; mobile layout |
| Tangible impact | "Who can use it" above; works from public data and costs the user knows |

## Run it locally

Web app:

```
cd web
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
```

Rebuild the data (Python 3.10 or newer):

```
cd pipeline
pip install -r requirements.txt
python fetch_prices.py       # downloads about 253,000 rows to data/raw_prices.jsonl (resumable)
python check_crops.py        # converts to data/raw_prices.pkl and prints coverage per crop
# download the NISR CPI file and save it as pipeline/data/CPI_time_series_September_2026.xls
python build_data.py         # writes pipeline/out/*.json
# copy the JSON files from pipeline/out into web/public/data/
```

NISR CPI file: https://statistics.gov.rw/sites/default/files/documents/2026-10/CPI_time_series_September_2026.xls

## Repository structure

```
pipeline/    Python: download, cleaning, CPI adjustment, seasonal outlook, backtest, JSON export
web/         React + TypeScript + Vite + Tailwind CSS + Recharts
  public/data/   the JSON files the app reads
  src/lib/decision.ts   the sell-or-store calculation
docs/        METHODOLOGY.md
```

Stack: Python (pandas, numpy), React, TypeScript, Vite, Tailwind CSS, Recharts, deployed on Vercel.

## Tools and AI assistance

We used AI assistants (Claude by Anthropic and ChatGPT) to help write and review code and documentation. The problem choice, data sources, modelling decisions and the reliability rules are ours, and the results reported here come from running the code in this repository.

## Team

**Umuhinzi Mboni**, an initiative of two agribusiness students at the University of Rwanda (UR-CAFF): **Wonder** and **Etienne**. Use the Contact page in the app to reach us.

## Credits

Price data: esoko.rw. Consumer price index: National Institute of Statistics of Rwanda (NISR), licensed CC BY 4.0. Lending rate reference: National Bank of Rwanda.

### AI-Assisted Development and Human Oversight

AI tools were integrated into the development workflow as technical support, while the project’s direction, core decisions and implementation remained under the responsibility of the team.

- **Claude (Anthropic):** Assisted with agricultural price-data analysis, pandas-based data processing, debugging and refining data-analysis workflows.
- **ChatGPT (OpenAI):** Assisted with React and TypeScript UI debugging, interface refinements, component improvements and frontend problem-solving.

The team used these tools to accelerate experimentation, troubleshoot technical challenges and improve development efficiency. AI-generated suggestions and code were reviewed, adapted and tested before adoption. Data-source selection, analytical assumptions, decision-model design, interpretation of results and final project decisions remained team responsibilities.

**Our approach:** AI accelerated the development process; human judgment remained responsible for the product. Isoko Mboni is a team-led decision-support solution, not an AI-generated price prediction system. Its recommendations are based on documented agricultural price data, explicit economic assumptions and transparent decision rules.

*Last updated 30 October 2026.*
