
export const labels = {
  appName: "UmuhinziMboni",
  nationalAverage: "National average",
  currency: "RWF",
  unit: "kg",

  inputs: {
    title: "Your storage decision",
    description: "Enter your crop, market, expected storage period, and costs.",
    crop: "Crop",
    market: "Market",
    harvestMonth: "Harvest month",
    storageMonths: "How many months will you store?",
    currentPrice: "Current selling price (RWF/kg)",
    storageCost: "Storage and handling cost (RWF/kg/month)",
    expectedLoss: "Expected total loss over storage (%)",
    exampleValue: "Example value — change to your own",
    nationalFallback:
      "No usable price history was found for this market. The current price and chart use the national series instead.",
    noHistory:
      "No usable price history was found for this selection. Enter a current price manually; the chart may be unavailable.",
  },

  results: {
    title: "Your estimated outcome",
    store: "Store it",
    sell: "Sell now",
    uncertain: "Too close to call",
    missingOutlook: "Not enough data for this combination",
    missingOutlookDetail:
      "There is no outlook for this crop, harvest month, and storage period. No recommendation or estimated gain is shown.",
    invalidInputs: "Check your inputs",
    invalidInputsDetail:
      "Enter a current price greater than zero, a non-negative storage cost, and an expected loss between 0% and 100%.",
    expected: "Estimated net change",
    range: "Possible range",
    perKg: "per kg",
    nationalNotice: "Seasonal outlook is national, not market-specific.",
  },

  chart: {
    title: "Historical prices and outlook",
    history: "Historical market price",
    expected: "Expected price after storage",
    range: "Outlook range",
    noHistory: "No historical price data is available for this selection.",
    note: "The outlook is an estimate, not a guaranteed future price.",
  },

  data: {
    title: "Data quality and confidence",
    confidenceTooltip:
      "Based on years of data and past accuracy, not a guarantee",
    preliminaryTest: "Preliminary test on past months",
    missingCombination: "Not enough data for this combination.",
    gap:
      "The historical dataset has a gap from August to October 2025.",
    lowConfidence:
      "Low confidence: limited evidence. Treat this estimate cautiously.",
    mediumConfidence:
      "Medium confidence: preliminary backtesting performed better than the no-change baseline. This is not proof of future accuracy.",
    highConfidence:
      "High confidence does not guarantee the actual future price.",
    nationalOutlook:
      "Seasonal outlook is national, not market-specific.",
    fallback:
      "The selected market has no usable history. The chart and prefilled price use national data.",
    noHistory:
      "No usable history was found for the selected market or national series.",
  },

  formula: {
    title: "How this is calculated",
    explanation:
      "The estimated change compares the projected value after storage, adjusted for expected losses and storage costs, with the current selling price.",
    warning:
      "Storage cost and expected loss are example inputs, not verified national estimates. Replace them with values that match your situation.",
    limitation:
      "Actual prices, losses, and costs can differ from the assumptions. A positive estimate does not guarantee a profit.",
  },
};
