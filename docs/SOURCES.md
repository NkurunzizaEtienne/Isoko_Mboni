# Sources and evidence

This file lists the principal data, statistical and policy sources used to frame Isoko Mboni. It distinguishes primary government sources from contextual research and media reporting. These sources do not independently validate the application's forecast or decision model; those are evaluated using the project dataset and preliminary backtest described in [METHODOLOGY.md](METHODOLOGY.md).

## 1. Primary national policy documents

### 1.1 National Strategy for Transformation (NST2), 2024–2029

**Publisher:** Government of Rwanda  
**Document:** *National Strategy for Transformation (NST2), 2024–2029: Five Years Government Programme*  
**Link:** https://faolex.fao.org/docs/pdf/rwa233965.pdf

NST2 sets the national development direction for 2024–2029 and includes a strategic area on climate-resilient, productive and modernized agri-food systems. It places the strategy within the longer-term Vision 2050 framework. This supports the policy relevance of data-informed tools addressing a specific agricultural decision; it does not specifically endorse Isoko Mboni.

### 1.2 Strategic Plan for the Transformation of Agriculture (PSTA 5)

**Publisher:** Ministry of Agriculture and Animal Resources (MINAGRI)  
**Period:** 2024/25–2028/29  
**Abridged document:** https://www.minagri.gov.rw/fileadmin/user_upload/Minagri/Publications/Policies_and_strategies/PSTA_5_Abridged_version_Final.pdf  
**Full document:** https://www.minagri.gov.rw/fileadmin/user_upload/Minagri/Publications/Policies_and_strategies/PSTA_5_Fulltext__Final.pdf  
**MINAGRI policy and strategy index:** https://www.minagri.gov.rw/publications/policies-and-strategies

PSTA 5 identifies **Inclusive markets and post-harvest management** as a priority area. Isoko Mboni addresses one limited part of this agenda: comparing the potential value of delayed sale with storage, loss and financing costs.

### 1.3 MINAGRI Annual Report 2024–2025

**Publisher:** Ministry of Agriculture and Animal Resources (MINAGRI)  
**Link:** https://www.minagri.gov.rw/fileadmin/user_upload/Minagri/Publications/Annual_Reports/Annual_report_2024-2025_Final.pdf  
**MINAGRI reports index:** https://www.minagri.gov.rw/publications/reports

The report provides sector context, including post-harvest infrastructure. Its published summary lists 518 warehouses with a capacity of 240,150 metric tonnes and 12 silos with a capacity of 77,875 metric tonnes, for a combined storage capacity of 318,025 metric tonnes. These figures describe national infrastructure; they do not establish that every farmer can access suitable storage at an affordable price.

## 2. Official agricultural statistics

### 2.1 NISR Seasonal Agricultural Survey 2024 Annual Report

**Publisher:** National Institute of Statistics of Rwanda (NISR)  
**PDF supplied by the project team:** http://www.statistics.gov.rw/sites/default/files/documents/2025-02/SAS%202024%20Annual.pdf  
**NISR publication page:** https://www.alpha.statistics.gov.rw/statistical-publications/agriculture-environment/seasonal-agricultural-survey-2024-annual-report-2024

The Seasonal Agricultural Survey provides official national agricultural statistics, including crop production, yields, land use and input use. It is useful for sector context. Do not use it as evidence for a price forecast unless the relevant table directly measures prices.

### 2.2 NISR Seasonal Agricultural Survey microdata catalogue

**Publisher:** National Institute of Statistics of Rwanda  
**2025 survey catalogue:** https://microdatabk.statistics.gov.rw/catalog/124  
**Microdata portal:** https://microdata.statistics.gov.rw

The catalogue describes the SAS survey and its scope. It is a potential source for future extensions, subject to access conditions, variable definitions and suitability for the intended analysis.

### 2.3 NISR Consumer Price Index

**Publisher:** National Institute of Statistics of Rwanda  
**Data file used in the project:** `CPI_time_series_September_2026.xls`

The project methodology records use of the All Rwanda general index, February 2014 = 100, with September 2025 = 211.0 and September 2026 = 253.3. The CPI is used to restate prices in September 2026 RWF for seasonal analysis. It is an all-items index, not a food-only index. Retain the original NISR data file and publication metadata when the pipeline is made fully reproducible.

## 3. Market and price data

### 3.1 esoko.rw farmgate price API

**Provider:** esoko.rw  
**Endpoint described in the project methodology:** `esoko-prices`  
**Filters:** approved farmgate records  
**Download count:** 252,986 records

The API data is the source for historical market prices used in the application. The usable analysis window is October 2024–October 2026, with no observations for August–October 2025. The 252,986 figure refers to the full download; the analysis uses four selected crop varieties and applies additional cleaning and aggregation.

The raw download is not published in the repository because it contains personal details of price collectors.

## 4. Additional context and research

### 4.1 Warehouse receipt regulation context

**Publisher:** Trade Law Centre (tralac)  
**Article:** Rwandan government moves to regulate warehouse business for commodities exchange  
**Link:** https://tralac.org/news/article/10718-rwandan-govt-moves-to-regulate-warehouse-business-for-commodities-exchange.html

Contextual reporting on the policy and institutional environment for commodity warehousing. It is not used as a source for the project's price data, storage-cost defaults or model parameters.

### 4.2 FAO GIEWS Rwanda archive

**Publisher:** Food and Agriculture Organization of the United Nations (FAO), Global Information and Early Warning System (GIEWS)  
**Link:** https://cb.apps.fao.org/country/RWA/pdf_archive/RWA_Archive.pdf

This archive can provide historical market and food-security context. Cite a specific dated bulletin for any particular price movement; do not generalize beyond its crop, market and time period.

### 4.3 IFPRI research on bean losses in Rwanda

**Publisher:** International Food Policy Research Institute (IFPRI), Africa Regional Office  
**Article:** *Where Rwanda loses its beans, and why it starts before the harvest*  
**Link:** https://africa.ifpri.info/2026/07/24/where-rwanda-loses-its-beans-and-why-it-starts-before-the-harvest/

The article reports research on losses across the bean value chain and notes that a substantial share occurs before harvest. The article states that the underlying research is not yet peer-reviewed. It is useful as a caution against treating storage as the sole source of agricultural loss. It is not used as a parameter in the Isoko Mboni model.

## 5. Sources intentionally excluded

The project team specifically requested that the following article not be cited:

- KT Press, “Farmers keeping less than 1% of food they harvest”: https://www.ktpress.rw/2025/06/farmers-keeping-less-than-1-of-food-they-harvest/

The team identified a discrepancy in the bean figure compared with the relevant NISR table. This article is excluded from the project's evidence base. Where a national agricultural statistic is needed, use the original NISR publication and quote the exact crop, season, denominator and table.

## 6. Evidence-use rules

1. Use NST2 and PSTA 5 to establish policy alignment, not to claim government endorsement of the product.
2. Use NISR publications for official agricultural statistics. Preserve table labels, units, seasons and denominators.
3. Use esoko.rw for the project price series, and distinguish the full download count from the cleaned analysis sample.
4. Do not present the preliminary backtest as proof that farmers will earn more.
5. Do not present a national post-harvest loss indicator as the expected loss for an individual user's stored crop.
6. Treat peer testing with university students as early usability feedback, not farmer validation.
7. Record access dates and exact table/page references when preparing a formal research or competition submission.
