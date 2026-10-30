
export const SELL_NOW_RW = "";

export const labels = {
  appName: "Isoko Mboni",
  tagline: "Make your next selling decision with clearer price signals.",
  loading: "Loading price data…",
  loadErrorTitle: "We could not load the data",
  loadErrorDetail:
    "Check your connection and try again. If the problem continues, check that the generated data files exist in public/data.",
  retry: "Try again",
  dataUnavailable: "Price data is not available for this selection.",
  noPrice: "No price found. Enter a price to continue.",
  noOutlook: "Not enough data for this crop and harvest month.",
  noOutlookDetail:
    "We will not make a recommendation without a matching outlook.",
  nationalAverage: "National average",
  nationalFallback:
    "No history was found for this market. The price below uses national history instead.",
  priceMissing:
    "No matching market or national price history was found. Enter a price yourself.",
  noReliablePattern:
    "No reliable seasonal price pattern found for this crop in our data. See details below.",
  detailsLink: "How reliable is this? See details below",
  thousands: "RWF",
  perKg: "RWF/kg",
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  shortMonths: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
  inputs: {
    heading: "Your situation",
    intro: "Adjust these values to compare selling now with storing your harvest.",
    crop: "Crop",
    market: "Market",
    harvestMonth: "Harvest month",
    storeFor: "Store for",
    storeForHelper:
      "The longest you are willing to store. We find the best month to sell.",
    monthsUnit: "months",
    priceNow: "Price now, at harvest",
    priceHelper: "Your current selling price, in RWF per kilogram.",
    quantity: "Quantity",
    quantityHelper: "How much of your harvest are you deciding about?",
    storageCost: "Storage and handling cost",
    costHelper: "Example, change to your own",
    loss: "Expected total loss over storage",
    lossHelper: "Example, change to your own",
    loanInterest: "Loan interest",
    interestHelper: "Example: the average bank lending rate in Rwanda was about 16% in 2026 (National Bank of Rwanda). Change it to your own rate.",
    moreOptions: "More options",
    lessOptions: "Hide extra options",
    cashNeeded: "Cash you need now",
    cashHelper: "We may suggest selling part now to cover this amount.",
    perKg: "RWF/kg",
    kg: "kg",
    nationalFallback: "No history was found for this market. The price below uses national history instead.",
    priceMissing: "No matching market or national price history was found. Enter a price yourself.",
    priceRequired: "Enter a price above zero to see a result.",
    quantityRequired: "Enter a quantity above zero.",
    nonNegative: "Use zero or a positive number.",
  },
  results: {
    heading: "Your selling decision",
    storeEyebrow: "Bika",
    storeTitle: "STORE",
    sellTitle: "SELL NOW",
    storeSummary:
      "Storing could gain {gain} RWF on {quantity} kg after losses, storage and interest. Best month to sell: {month}.",
    cashSummary: "Sell {quantity} kg now to cover your cash need.",
    sellSummary:
      "Selling now looks safer. Storing is unlikely to pay after losses, storage and interest.",
    closest: "Closest option: store until {month}.",
    detailsLink: "How reliable is this? See details below",
    noReliablePattern:
      "No reliable seasonal price pattern found for this crop in our data. See details below.",
    missing: "Not enough data for this crop and harvest month.",
    missingDetail:
      "No recommendation is shown because there is no matching forecast for the selected inputs.",
    noCover: "No price would cover your costs",
    expected: "Expected",
    estimate: "Estimate based on the available price data",
    gain: "gain",
    loss: "loss",
    noGain: "No gain expected",
    unknown: "Not available",
  },
  stats: {
    priceNow: "Price at harvest",
    expectedPrice: "Expected price in {month}",
    breakEven: "Break-even price",
    breakEvenHelper:
      "The price you need in {month} just to cover losses, storage and interest.",
    spoilage: "Expected spoilage",
    about: "about {quantity} kg",
    ifPricesDisappoint: "If you stored until {month} and prices disappoint",
    stillGain: "you would still gain {amount} RWF",
    couldLose: "you could lose {amount} RWF",
    storingCosts: "What storing costs you",
    storage: "Storage",
    interest: "Interest",
    closestOption: "Closest storing option: until {month}",
  },
  data: {
    title: "Data transparency",
    lowConfidence: "Low confidence: limited data or weak past accuracy.",
    mediumConfidence: "Medium confidence: some supporting evidence, but uncertainty remains.",
    highConfidence: "High confidence: stronger supporting evidence, not a guarantee.",
    missingCombination: "Not enough data for this crop and harvest month.",
    confidenceTooltip: "Based on how much data we have and how well past patterns held. Not a guarantee.",
    gap: "There is a gap in the available monthly data, so some months are missing.",
    fallback: "No history was found for this market. The price below uses national history instead.",
    noHistory: "No matching market or national price history was found. Enter a price yourself.",
    nationalOutlook: "Seasonal outlooks are national, not market-specific.",
    preliminaryTest: "Preliminary historical accuracy test",
  },
  chart: {
    heading: "Seasonal price pattern",
    subtitle:
      "Typical national prices by calendar month. This is a pattern, not a guaranteed future price.",
    average: "Average",
    sellAtHarvest: "Sell at harvest",
    sellAfterStoring: "Sell after storing",
    noSeasonalData: "No seasonal price data is available for this crop.",
    priceAxis: "Average price (RWF/kg)",
    monthAxis: "Month",
  },
  reliability: {
    heading: "Additional details: how reliable is this?",
    confidence: "How sure are we?",
    low: "Low",
    medium: "Medium",
    high: "High",
    confidenceTooltip:
      "Based on how much data we have and how well past patterns held. Not a guarantee.",
    dataBehind: "Data behind this",
    dataRange: "Price data range",
    observations: "Based on {count} past observation(s) of this harvest month.",
    dataGap:
      "There is a gap in the available monthly data, so some months are missing.",
    chance: "Chance storing pays",
    chanceDetail:
      "In {month} the price could reasonably range from {low} to {high} RWF/kg (approximate).",
    tested: "How we tested it",
    backtest:
      "We tested this on past months. Our guess was off by about {error}% on average, compared with {baseline}% if we simply assumed prices never change. This is a preliminary test on limited data.",
    limits: "Limits you should know",
    limitNational: "Seasonal prices are national, not market-specific.",
    limitCosts:
      "Storage cost and spoilage are your own estimates; we do not have verified storage data.",
    limitRange: "The price range is approximate.",
    limitData:
      "With more months of data, the forecast improves.",
    dataSources: "Data sources",
    dataSourcePrices: "esoko.rw farmgate prices, October 2024 to October 2026.",
    dataSourceInterest: "National Bank of Rwanda: average lending rate about 16% (2026), used only as the default loan interest.",
    calculation: "How we calculated",
    calcSell:
      "Selling now means using today's price, plus the interest you save by not borrowing to wait.",
    calcStore:
      "Storing means using the expected future price, minus what spoils and minus storage cost.",
    calcGain: "Gain is the value of storing minus the value of selling now.",
    calcBreakEven:
      "Break-even is the future price at which both choices are equal after costs and losses.",
    calcChance:
      "The chance storing pays is estimated from the range of possible prices.",
    calcRule:
      "We recommend storing only when the chance of paying off is at least 60%, and a bad price would not cost more than 10% of the sale value.",
    noBacktest:
      "A comparable past test is not available for this crop, so we do not show an accuracy figure.",
    noConfidence: "Confidence is not available for this selection.",
  },
} as const;
