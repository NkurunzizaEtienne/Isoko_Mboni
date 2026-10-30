import type { Route } from "./lib/useHashRoute";

// ================= EDIT THESE BEFORE YOU PUSH =================
export const CONTACT = {
  email: "enkurun ziza2002@gmail.com",
  phone: "+250 792 573 184",
  location: "Kigali, Rwanda",
};

export const TEAM: { name: string; role: string; bio: string }[] = [
    {
    name: "NKURUNZIZA Etienne",
    role: "Co-founder · Agribusiness and technology",
    bio: "Combines agricultural economics and technology to build practical digital solutions for the agricultural sector.",
  },
  {
    name: "MUNYAZIKWIYE Claude",
    role: "Co-worker · Project team",
    bio: "Contributes to the development of Isoko Mboni and its mission to support better harvest decisions.",
  }
  
];
// ==============================================================

export const NAV: { route: Route; label: string }[] = [
  { route: "home", label: "Home" },
  { route: "about", label: "About" },
  { route: "desk", label: "Isoko Desk" },
  { route: "contact", label: "Contact" },
];

export const SITE = {
  brand: "Isoko Mboni",
  team: "Umuhinzi Mboni",
  tagline: "Helping harvest holders make informed decisions about when to sell and when to store.",
  institution: "University of Rwanda (UR-CAFF)",
};

export const HERO = {
  eyebrow: "Smarter harvest decisions for Rwandan agriculture",
  titleLine1: "Know when to sell.",
  titleLine2: "Know when to store.",
  subtitle:
    "Every harvest is an opportunity. Isoko Mboni helps farmers and other harvest holders decide whether to sell now or store for a better return, using market prices, storage costs, expected losses and financing costs.",
  ctaPrimary: "Open Isoko Desk",
  ctaSecondary: "How it works",
  previewCaption:
    "Irish potato: the typical price through the year, after removing general price rises (NISR consumer price index).",
  stats: [
    { value: "250,000+", label: "farmgate price records analysed" },
    { value: "50+", label: "Rwandan markets covered" },
    { value: "4", label: "crops tested for seasonal patterns" },
    { value: "20.0%", label: "overall price rise to Sept 2026 (NISR), adjusted for" },
  ],
};

export const HOW_IT_WORKS = {
  title: "Three steps to a clear answer",
  intro: "No spreadsheets, no statistics. Tell us about your harvest and your costs.",
  steps: [
    {
      title: "Describe your harvest",
      text: "Choose your crop and market, then enter today's price and how many kilograms you have.",
    },
    {
      title: "Add your costs",
      text: "Storage and handling cost, the share you expect to spoil, and the interest on any loan.",
    },
    {
      title: "Get your answer",
      text: "Store or sell now, the best month to sell, the break-even price and your expected gain in RWF.",
    },
  ],
};

export const WHY = {
  title: "Built to be trusted",
  items: [
    {
      title: "Real market prices",
      text: "Our forecasts start from more than 250,000 farmgate prices collected in Rwandan markets (esoko.rw).",
    },
    {
      title: "Inflation-aware",
      text: "We use the NISR consumer price index to separate normal seasonal movement from general price rises.",
    },
    {
      title: "Honest about uncertainty",
      text: "Every answer shows how sure we are, how our method performed in testing, and where it falls short.",
    },
    {
      title: "Plain language",
      text: "Answers in kilograms and Rwandan francs, not formulas. The formulas are there if you want to check them.",
    },
  ],
};

export const AUDIENCE = {
  title: "Made for everyone who holds a harvest",
  items: [
    "Smallholder farmers",
    "Cooperatives",
    "Traders and aggregators",
    "Extension officers",
    "Planners and policy teams",
  ],
};

export const CTA_BAND = {
  title: "Try it with your own harvest",
  text: "It takes under a minute. Potato and bean forecasts are the strongest in this prototype.",
  button: "Open Isoko Desk",
};

export const ABOUT = {
  title: "Two agribusiness students. One question every harvest raises.",
  intro:
    "Umuhinzi Mboni is a team initiative from the University of Rwanda (UR-CAFF). We built Isoko Mboni to help farmers and other harvest holders make informed decisions about when to sell and when to store, using market data and their own costs.",
  problemTitle: "The problem",
  problem:
    "After harvest, many farmers sell immediately because they need cash, and prices are often lowest when everyone sells at once. Storing can pay, but only if the later price covers spoilage, storage costs and the interest on any loan. That is a calculation few people can do on the spot.",
  projectTitle: "Our answer: Isoko Mboni",
  project:
    "Isoko Mboni compares selling today with storing for up to six months, using real market prices and your own costs. It gives a plain verdict, the best month to sell, the break-even price and the expected gain on your quantity, and it shows how reliable the forecast is.",
  principlesTitle: "How we work",
  principles: [
    {
      title: "Simple first",
      text: "If a farmer cannot read the answer in ten seconds, we have not finished.",
    },
    {
      title: "Honest by design",
      text: "We test our forecasts against past months and publish the result, including where they fail.",
    },
    {
      title: "Open about method",
      text: "Every formula, source and limit is on the page.",
    },
  ],
  sourcesTitle: "Data we use",
  sources: [
    {
      name: "esoko.rw farmgate prices",
      text: "Market prices collected across Rwanda, October 2024 to October 2026 (about 22 months).",
    },
    {
      name: "NISR Consumer Price Index",
      text: "Used to remove general price rises before we look for seasonal patterns. NISR data is licensed CC BY 4.0.",
    },
    {
      name: "National Bank of Rwanda",
      text: "The average bank lending rate (about 16% in 2026) is the starting point for loan interest. You can change it.",
    },
  ],
  nextTitle: "What comes next (not built yet)",
  next: [
    "More crops, as their price patterns pass our tests",
    "Sharper forecasts as more months of data arrive",
    "A Kinyarwanda interface",
  ],
  teamTitle: "The team",
};

export const CONTACT_PAGE = {
  title: "Let's talk",
  subtitle:
    "Questions, feedback, or want to try Isoko Mboni with your cooperative? Write to us.",
  detailsTitle: "Reach us",
  formTitle: "Send a message",
  nameLabel: "Your name",
  emailLabel: "Your email",
  messageLabel: "Message",
  submit: "Send message",
  note: "Sending opens your email app with your message ready to send.",
};

export const FOOTER = {
  blurb: "Plain-language sell-or-store advice for Rwandan crops, built on real market prices.",
  exploreTitle: "Explore",
  dataTitle: "Data and credits",
  dataItems: [
    "Prices: esoko.rw (farmgate)",
    "Consumer price index: National Institute of Statistics of Rwanda (CC BY 4.0)",
    "Lending rate reference: National Bank of Rwanda",
  ],
  disclaimer:
    "Isoko Mboni is a prototype. Results are estimates based on about 22 months of price data and the costs you enter. They are not financial advice.",
  copyright: "© 2026 Umuhinzi Mboni. Supporting smarter harvest decisions.",
};

export const DESK = {
  title: "Isoko Desk",
  subtitle: "Fill This Form With Your Numbers. Scroll to See Your The Recommendations.",
};