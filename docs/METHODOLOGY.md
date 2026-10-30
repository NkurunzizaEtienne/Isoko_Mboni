# Methodology

This document records the data sources, preparation rules, seasonal outlook, preliminary backtest and decision calculation used by Isoko Mboni. It preserves the methodology supplied by the project team and identifies important limits on interpretation.

## 1. Research question and scope

**Question:** For a selected crop, market, quantity and set of costs, is it economically preferable to sell at harvest or store for up to six months and sell later?

The prototype covers four selected storable crop varieties: maize, Irish potato, beans and rice. Seasonal forecast-based changes are used only for Irish potato and beans, which passed the project's preliminary backtest rule. Maize and rice are assigned zero expected seasonal change because their seasonal pattern did not pass the rule.

All prices and costs are expressed in Rwandan francs (RWF) per kilogram unless stated otherwise.

## 2. Data sources

### 2.1 Farmgate prices: esoko.rw

The price series was downloaded from the esoko.rw `esoko-prices` API using these filters and pagination settings:

- `price_type=farmgate`
- `status=approved`
- `_limit=1000`
- `_sort=id:DESC`
- Pagination through `_start`

The endpoint was provided to the team by a developer contact.

The download contained **252,986 approved farmgate records** and 103 columns after flattening nested fields. Entry dates ranged from June 2023 to October 2026. Fewer than 400 records (about 0.2%) were earlier than October 2024. The usable analysis window is therefore October 2024–October 2026, approximately 22 months. There are no observations for August, September or October 2025.

Fields used:

- `entry_date`
- `average_price`
- `market_name`
- `agent_code`
- `product.commodity_name_en`, falling back to `commodity_name`

Selected varieties:

| Crop | Source variety |
|---|---|
| Maize | `Maize` |
| Irish potato | `Irish- Potato- Kirundo` |
| Beans | `Bean Shyushya` |
| Rice | `Rice -Rw - Kigori` |

Each selected variety has approximately 2,800–4,400 raw price records before subsequent cleaning and aggregation.

The raw download is not included in the public repository because it contains personal information about price collectors, including phone numbers and email addresses.

### 2.2 Consumer Price Index: NISR

The workflow uses the National Institute of Statistics of Rwanda (NISR) file `CPI_time_series_September_2026.xls`, sheet `All Rwanda`, general index (province 0, urban/rural 0, COICOP 00), with February 2014 = 100 as the base.

The project methodology records these check values:

- September 2025 CPI: 211.0
- September 2026 CPI: 253.3
- Twelve-month increase: approximately 20.0%

The CPI series is used to remove broad price-level inflation from the seasonal analysis. It is an all-items measure, not a food-only CPI.

### 2.3 Lending-rate assumption

The application default is 16% annual loan interest. It is an indicative starting assumption and can be changed by the user. It should not be interpreted as a personal borrowing quote or as a rate available to every farmer.

### 2.4 Storage-cost and loss assumptions

The default storage and handling cost is 10 RWF/kg/month and the default total expected loss is 5%. These are illustrative inputs, not verified national averages. Users should replace them with locally relevant estimates.

The project does not have a verified dataset of storage costs or crop-specific loss rates. National post-harvest loss indicators are contextual statistics and must not be substituted directly for an individual farmer's expected loss during a particular storage period.

## 3. Cleaning and preprocessing

The supplied workflow describes the following steps, implemented in `pipeline/build_data.py`:

1. Convert `entry_date` to a date and `average_price` to a numeric value.
2. Remove rows with missing dates, missing prices, or prices less than or equal to zero.
3. Retain records from 1 October 2024 onward.
4. Remove duplicates based on collector, entry date, crop and market.
5. Retain the four selected crop varieties listed in Section 2.1.
6. Remove implausible values below 0.4 times or above 2.5 times the median price for the relevant crop.
7. Calculate monthly national prices as the median of observations in each month, requiring at least 10 observations.
8. Calculate monthly market prices as the median for each market and month, requiring at least 3 observations.
9. Offer a market in the application only when it has at least 6 months of data.

The median is used to reduce sensitivity to remaining extreme observations.

## 4. Inflation adjustment

Seasonal movements should not simply reflect a general increase in the price level. The workflow converts historical prices to September 2026 RWF:

```text
real_price = nominal_price
             × CPI(September 2026)
             / CPI(month_of_observation)
```

For months after the latest available CPI month (September 2026), the last available CPI value is reused.

Seasonal patterns and the backtest are calculated using inflation-adjusted prices. The historical price chart uses nominal prices, because these are the observed market prices rather than values restated in constant purchasing-power terms.

**Limitation:** the all-items CPI is not a food-only index. It may remove some movement specific to food prices and therefore affect the seasonal estimates.

## 5. Seasonal outlook

For each crop, harvest calendar month `m` (1–12) and storage horizon `h` (1–6 months), the workflow measures the percentage change in the real national price from month `m` to month `m + h` for each year in which both months have observations.

Because the usable history is approximately two years and contains a three-month gap, there are at most two observations for a given harvest-month/horizon pair.

### 5.1 Irish potato and beans

For crops that passed the backtest rule:

- Expected change is the mean of the observed changes.
- Range half-width is the larger of (a) the backtest error and (b) half the spread of the observed changes.
- Low and high changes are expected change minus/plus the range half-width.
- Confidence is labelled medium when at least two years of observations exist for that pair; otherwise it is low.

### 5.2 Maize and rice

For crops that did not pass the backtest rule:

- Expected seasonal change is set to 0%.
- Range half-width is the larger of the no-change test error and 5 percentage points.
- Confidence is labelled low.
- The application states that no reliable seasonal pattern was found.

The low and high price estimates are treated as approximate 10th and 90th percentile values in the probability calculation. They are not exact empirical percentiles.

## 6. Backtest

### 6.1 Design

The usable history is divided into:

- **Year 1:** changes starting from October 2024 through September 2025.
- **Year 2:** changes starting from October 2025 onward.

For each harvest-month and storage-horizon pair with observations in both periods, two estimates of the Year 2 percentage change are compared:

1. **Seasonal-pattern estimate:** repeat the change observed in Year 1.
2. **Baseline estimate:** assume no change (0%).

The error is the mean absolute difference, in percentage points, between the estimate and the observed Year 2 change. There are 33 overlapping tests per crop.

### 6.2 Results

| Crop | Seasonal-pattern error | No-change baseline error | Relative difference | Passes? |
|---|---:|---:|---:|---|
| Irish potato | 13.9% | 17.3% | 19.7% lower | Yes |
| Beans | 7.1% | 8.3% | 14.5% lower | Yes |
| Maize | 13.6% | 14.3% | 4.9% lower | No |
| Rice | 16.0% | 5.2% | Seasonal error about 3 times higher | No |

### 6.3 Reliability threshold and disclosure

A crop is treated as forecast-eligible only when its seasonal-pattern error is below 90% of the no-change baseline error—that is, at least 10% lower.

The 10% margin was selected after reviewing the results. Without that margin, maize would narrowly outperform the baseline (13.6% compared with 14.3%). The team considered that difference too small to trust given the short history.

Before CPI adjustment, the same test produced:

| Crop | Seasonal-pattern error | No-change baseline error |
|---|---:|---:|
| Irish potato | 18.3% | 23.5% |
| Beans | 10.8% | 13.3% |
| Maize | 12.7% | 10.7% |
| Rice | 14.1% | 3.0% |

Irish potato and beans pass under both treatments; rice fails under both. Maize does not pass the 10% margin under the inflation-adjusted results.

### 6.4 Interpretation

The 33 tests per crop are generated from the same two years of one series. They overlap because the same calendar months can appear in several storage horizons. They are not independent observations. The backtest is preliminary evidence, not proof of general predictive accuracy.

The rice result indicates that a seasonal rule did not improve on the no-change baseline in this dataset. The model therefore avoids claiming a seasonal gain for rice.

## 7. Sell-or-store decision model

The calculation is implemented in `src/lib/decision.ts`. It evaluates each available storage horizon from one month to the user-selected maximum.

### 7.1 Variables

| Symbol | Meaning |
|---|---|
| \(P_0\) | Current/starting price (RWF/kg) |
| \(P_h\) | Expected price after \(h\) months (RWF/kg) |
| \(C\) | Storage and handling cost (RWF/kg/month) |
| \(L\) | Monthly loss fraction, derived from total expected loss divided by the maximum storage period |
| \(r\) | Monthly interest rate, annual loan-interest input divided by 12 |
| \(i\) | User-entered expected general price rise per year |
| \(Q\) | Quantity available (kg) |
| \(h\) | Storage horizon in months |

### 7.2 Expected price

The expected future price combines the seasonal change in the outlook data with the user's expected general price rise:

\[
P_h = P_0(1+s_h)(1+i)^{h/12}
\]

where \(s_h\) is the expected seasonal change for the selected crop, harvest month and storage horizon, and \(i\) is expressed as a decimal annual rate.

### 7.3 Sell-now value

The model uses simple monthly interest on the value that could have been received by selling today:

\[
V_{\text{sell}}(h)=P_0(1+rh)
\]

### 7.4 Storage value

The expected storage value after loss and storage expenses is:

\[
V_{\text{store}}(h)=P_h(1-Lh)-Ch
\]

### 7.5 Expected gain

\[
G(h)=V_{\text{store}}(h)-V_{\text{sell}}(h)
\]

A positive value indicates that the modelled storage option has a higher expected per-kilogram value than the sell-now alternative.

### 7.6 Break-even price

The future price required for storage to match the sell-now value is:

\[
P^*(h)=\frac{P_0(1+rh)+Ch}{1-Lh}
\]

This calculation is meaningful only when the remaining quantity factor \(1-Lh\) is positive.

### 7.7 Probability that storage pays

The model approximates the price distribution as lognormal. The standard deviation parameter is estimated from the low and high price range:

\[
\sigma(h)=\frac{\ln(P_{90}/P_{10})}{2.563}
\]

The factor 2.563 approximates the standard-normal distance between the 10th and 90th percentiles.

The probability that the future price exceeds the break-even price is:

\[
\Pr(G(h)>0)=1-\Phi\left(
\frac{\ln(P^*(h))-\ln(P_h)}{\sigma(h)}
\right)
\]

where \(\Phi\) is the standard normal cumulative distribution function.

This is a model-based probability, not a measured frequency of successful storage outcomes. It depends on the approximate price range and lognormal assumption.

### 7.8 Downside check

The downside estimate substitutes the low price \(P_{10}\) into the storage-value calculation and compares it with the sell-now value:

\[
G_{\text{low}}(h)=P_{10}(1-Lh)-Ch-V_{\text{sell}}(h)
\]

### 7.9 Decision rule

A storage horizon is eligible only when all three conditions hold:

1. Expected gain is positive: \(G(h)>0\).
2. Probability that storage pays is at least 60%.
3. The low-price downside is no worse than 10% of the sell-now value: \(G_{\text{low}}(h)\geq -0.10V_{\text{sell}}(h)\).

If one or more horizons pass, the application recommends **STORE** for the eligible horizon with the highest expected gain. If none pass, it recommends **SELL NOW** and can still display the closest storage option for comparison.

### 7.10 Cash requirement split

When the user enters a cash requirement:

\[
\text{kg sold now}=\min(Q,\text{cash needed}/P_0)
\]

The storage decision is applied to the remaining quantity:

\[
\text{kg stored}=\max(0,Q-\text{kg sold now})
\]

The total expected gain for the recommended stored quantity is:

\[
\text{Total gain}=G(h)\times \text{kg stored}
\]

### 7.11 Simplifications

- A single loss factor is used; a second handling-loss term is not added.
- Interest is simple monthly interest on the sell-now value.
- The user's total expected loss is spread evenly across the selected maximum storage period.
- The model uses the national seasonal outlook even when the starting price comes from a selected market.
- The probability calculation relies on approximate range endpoints and a lognormal distribution assumption.

## 8. Defaults

| Input | Default | Interpretation |
|---|---:|---|
| Storage and handling cost | 10 RWF/kg/month | Illustrative input; replace with local cost |
| Total expected loss | 5% | Illustrative input; replace with a realistic estimate |
| Loan interest | 16% per year | Indicative starting assumption; user can change it |
| General price rise | 0% per year | Cautious default; user can change it |

These defaults are not verified offers, national averages or guaranteed conditions.

## 9. Limitations

1. **Short observation window:** approximately 22 months, with no observations in August–October 2025.
2. **Limited seasonal repetitions:** at most two annual observations per harvest-month/horizon pair.
3. **National outlook:** seasonal changes are calculated from national prices and may not represent a particular market.
4. **Approximate uncertainty range:** low and high values are not empirically calibrated percentiles.
5. **Preliminary backtest:** overlapping comparisons on a short history; not an independent validation sample.
6. **No observed storage outcomes:** the model has not been validated against actual farmer storage decisions, physical losses and realized sale prices.
7. **Broad CPI measure:** all-items CPI is used rather than a food-specific index.
8. **Reported price noise:** collector-reported data may contain errors that remain after cleaning.
9. **User-entered costs:** storage cost, loss and interest assumptions can materially change the recommendation.
10. **Crop coverage:** only four selected varieties are covered.
11. **User testing:** the team reports peer testing with fellow Agribusiness and Agricultural Economics students. This is not equivalent to farmer field validation.
12. **No financial guarantee:** the model supports comparison and does not guarantee a profit or future price.

## 10. Reproducibility and repository status

The public repository contains the React application, the decision calculation and prepared JSON files in `public/data/`. The current frontend loads `crops.json`, `history.json`, `outlook.json`, `seasonal.json` and `backtest.json`. The repository also contains `cpi.json`, although the current frontend loader does not request it directly.

The raw price download is excluded for privacy reasons. The Python scripts described in the data workflow (`fetch_prices.py`, `check_crops.py` and `build_data.py`) and the CPI source workbook are not currently present in the public repository tree reviewed for this documentation. Therefore, a fresh user can run the public frontend from the committed prepared data, but cannot independently regenerate the complete data pipeline from the public repository alone.

See [Project setup and repository structure](PROJECT_SETUP.md) for exact frontend commands and this reproducibility distinction.

## 11. Future work

- Extend the price history as new approved market observations become available.
- Add crop varieties only after coverage and forecast evaluation are adequate.
- Evaluate food-specific CPI adjustment.
- Test market-specific seasonal patterns when sufficient observations exist.
- Collect locally grounded storage-cost and crop-loss data with cooperatives and farmers.
- Conduct field testing with farmers, cooperatives and extension officers.
- Compare model recommendations with actual storage outcomes and realized net returns.

## 12. Credits

Farmgate price data: esoko.rw. Consumer Price Index: National Institute of Statistics of Rwanda (NISR). National policy and agricultural context: Government of Rwanda, NST2; Ministry of Agriculture and Animal Resources (MINAGRI), PSTA 5 and Annual Report 2024–2025. Agricultural statistics context: NISR Seasonal Agricultural Survey publications.
