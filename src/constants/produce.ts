import { FruitType, ProduceInfo, Season } from '../types';

export const PRODUCE_CATALOG: Record<FruitType, ProduceInfo> = {
  apple: {
    type: 'apple',
    name: 'Crisp Apple',
    plural: 'Apples',
    unit: 'EACH',
    plantForm: 'tree',
    symbol: '🍎',
    asciiSymbol: '@',
    colorHex: '#ef4444',
    twText: 'text-[#ef4444]',
    growthSeconds: 1,
    baseValue: 1.5,
    seedCost: 0,
    description: 'A classic orchard staple, crisp, fragrant and sweet.',
  },
  pear: {
    type: 'pear',
    name: 'Golden Pear',
    plural: 'Pears',
    unit: '/ LB',
    plantForm: 'tree',
    symbol: '🍐',
    asciiSymbol: 'o',
    colorHex: '#84cc16',
    twText: 'text-[#84cc16]',
    growthSeconds: 3,
    baseValue: 5,
    seedCost: 50,
    description: 'Succulent and honey-sweet with smooth golden skin.',
  },
  cherry: {
    type: 'cherry',
    name: 'Sweet Cherry',
    plural: 'Cherries',
    unit: 'POUND',
    plantForm: 'tree',
    symbol: '🍒',
    asciiSymbol: 'o',
    colorHex: '#e11d48',
    twText: 'text-[#e11d48]',
    growthSeconds: 5,
    baseValue: 3,
    seedCost: 150,
    description: 'Ruby red cherries clustered on graceful branches.',
  },
  plum: {
    type: 'plum',
    name: 'Damson Plum',
    plural: 'Plums',
    unit: '/ LB',
    plantForm: 'tree',
    symbol: '🟣',
    asciiSymbol: '*',
    colorHex: '#a855f7',
    twText: 'text-[#a855f7]',
    growthSeconds: 8,
    baseValue: 30,
    seedCost: 400,
    description: 'Deep violet plums, rich and tart, ideal for preserves.',
  },
  lemon: {
    type: 'lemon',
    name: 'Meyer Lemon',
    plural: 'Lemons',
    unit: 'EACH',
    plantForm: 'tree',
    symbol: '🍋',
    asciiSymbol: '0',
    colorHex: '#eab308',
    twText: 'text-[#eab308]',
    growthSeconds: 12,
    baseValue: 75,
    seedCost: 1000,
    description: 'Fragrant and zesty citrus with bright golden luster.',
  },
  honeycrisp: {
    type: 'honeycrisp',
    name: 'Honeycrisp Deluxe',
    plural: 'Honeycrisps',
    unit: '/ LB',
    plantForm: 'tree',
    symbol: '🍏',
    asciiSymbol: '$',
    colorHex: '#f97316',
    twText: 'text-[#f97316]',
    growthSeconds: 20,
    baseValue: 200,
    seedCost: 2500,
    description: 'Prized heirloom variety celebrated for immense crunch and floral juice.',
  },
  peaches: {
    type: 'peaches',
    name: 'Sun Peach',
    plural: 'Peaches',
    unit: 'EACH',
    plantForm: 'tree',
    symbol: '🍑',
    asciiSymbol: 'p',
    colorHex: '#fb923c',
    twText: 'text-[#fb923c]',
    growthSeconds: 5,
    baseValue: 4,
    seedCost: 120,
    description: 'Blushing, fuzzy peaches ripened to juicy perfection in the summer sun.',
  },
  berries: {
    type: 'berries',
    name: 'Wild Berry',
    plural: 'Berries',
    unit: 'PINT',
    plantForm: 'bush',
    symbol: '🫐',
    asciiSymbol: '.',
    colorHex: '#4f46e5',
    twText: 'text-[#4f46e5]',
    growthSeconds: 4,
    baseValue: 3.5,
    seedCost: 75,
    description: 'Tangy wild berries that spring up on sprawling, thorny bushes.',
  },
  tomatoes: {
    type: 'tomatoes',
    name: 'Vine Tomato',
    plural: 'Tomatoes',
    unit: 'EACH',
    plantForm: 'bush',
    symbol: '🍅',
    asciiSymbol: 'Q',
    colorHex: '#dc2626',
    twText: 'text-[#dc2626]',
    growthSeconds: 3,
    baseValue: 2.25,
    seedCost: 40,
    description: 'Plump, sun-warmed tomatoes ripening on staked garden bushes.',
  },
  carrots: {
    type: 'carrots',
    name: 'Farm Carrot',
    plural: 'Carrots',
    unit: 'EACH',
    plantForm: 'bush',
    symbol: '🥕',
    asciiSymbol: 'V',
    colorHex: '#ea580c',
    twText: 'text-[#ea580c]',
    growthSeconds: 2,
    baseValue: 2,
    seedCost: 20,
    description: 'Sweet, crunchy carrots pulled from rich, loamy soil.',
  },
  corn: {
    type: 'corn',
    name: 'Sweet Corn',
    plural: 'Corn',
    unit: 'EACH',
    plantForm: 'bush',
    symbol: '🌽',
    asciiSymbol: '#',
    colorHex: '#ca8a04',
    twText: 'text-[#ca8a04]',
    growthSeconds: 3,
    baseValue: 2,
    seedCost: 30,
    description: 'Tall golden stalks heavy with tender, buttery kernels.',
  },
  potatoes: {
    type: 'potatoes',
    name: 'Russet Potato',
    plural: 'Potatoes',
    unit: '/ LB',
    plantForm: 'bush',
    symbol: '🥔',
    asciiSymbol: '%',
    colorHex: '#92400e',
    twText: 'text-[#92400e]',
    growthSeconds: 2,
    baseValue: 1.25,
    seedCost: 10,
    description: 'Hearty, earthy potatoes dug from deep, well-tended beds.',
  },
  onions: {
    type: 'onions',
    name: 'Sweet Onion',
    plural: 'Onions',
    unit: '/ LB',
    plantForm: 'bush',
    symbol: '🧅',
    asciiSymbol: '&',
    colorHex: '#b45309',
    twText: 'text-[#b45309]',
    growthSeconds: 2,
    baseValue: 1.75,
    seedCost: 15,
    description: 'Mild, sugary onions that grow in tidy, tight-packed bunches.',
  },
  pumpkins: {
    type: 'pumpkins',
    name: 'Heritage Pumpkin',
    plural: 'Pumpkins',
    unit: 'EACH',
    plantForm: 'bush',
    symbol: '🎃',
    asciiSymbol: 'U',
    colorHex: '#c2410c',
    twText: 'text-[#c2410c]',
    growthSeconds: 7,
    baseValue: 5,
    seedCost: 200,
    description: 'Big, bumpy heirloom pumpkins ripening in the autumn field.',
  },
  watermelon: {
    type: 'watermelon',
    name: 'Sugar Watermelon',
    plural: 'Watermelons',
    unit: 'EACH',
    plantForm: 'bush',
    symbol: '🍉',
    asciiSymbol: 'W',
    colorHex: '#16a34a',
    twText: 'text-[#16a34a]',
    growthSeconds: 6,
    baseValue: 4.5,
    seedCost: 150,
    description: 'Striped melons swollen with sweet, dripping red flesh.',
  },
  honey: {
    type: 'honey',
    name: 'Artisan Honey',
    plural: 'Honey',
    unit: 'JAR',
    plantForm: 'bush',
    symbol: '🍯',
    asciiSymbol: 'H',
    colorHex: '#d97706',
    twText: 'text-[#d97706]',
    growthSeconds: 8,
    baseValue: 6,
    seedCost: 300,
    description: 'Wildflower hedges hum with bees, filling jars with golden honey.',
  },
};

export const ALL_FRUIT_TYPES = Object.keys(PRODUCE_CATALOG) as FruitType[];

export function createProduceMap<T>(initializer: (type: FruitType) => T): Record<FruitType, T> {
  const result = {} as Record<FruitType, T>;
  for (const fruit of ALL_FRUIT_TYPES) {
    result[fruit] = initializer(fruit);
  }
  return result;
}

export const SEASONAL_DEMAND_FACTORS: Record<Season, Record<FruitType, number>> = {
  Spring: {
    apple: 0.9,
    carrots: 1.4,
    pumpkins: 0.5,
    peaches: 0.8,
    berries: 1.5,
    tomatoes: 1.1,
    corn: 0.8,
    cherry: 1.3,
    potatoes: 1.0,
    onions: 1.0,
    watermelon: 0.8,
    honey: 1.1,
    pear: 0.8,
    plum: 0.9,
    lemon: 1.1,
    honeycrisp: 0.8,
  },
  Summer: {
    apple: 0.8,
    carrots: 0.9,
    pumpkins: 0.5,
    peaches: 1.8,
    berries: 1.9,
    tomatoes: 1.7,
    corn: 1.6,
    cherry: 1.7,
    potatoes: 0.8,
    onions: 0.8,
    watermelon: 2.2,
    honey: 1.0,
    pear: 0.9,
    plum: 1.6,
    lemon: 1.8,
    honeycrisp: 0.8,
  },
  Autumn: {
    apple: 1.9,
    carrots: 1.2,
    pumpkins: 2.4,
    peaches: 1.2,
    berries: 0.8,
    tomatoes: 0.9,
    corn: 1.7,
    cherry: 0.7,
    potatoes: 1.3,
    onions: 1.2,
    watermelon: 0.6,
    honey: 1.4,
    pear: 1.6,
    plum: 1.3,
    lemon: 0.8,
    honeycrisp: 2.0,
  },
  Winter: {
    apple: 1.0,
    carrots: 1.0,
    pumpkins: 0.8,
    peaches: 0.5,
    berries: 0.5,
    tomatoes: 0.6,
    corn: 0.6,
    cherry: 0.5,
    potatoes: 1.6,
    onions: 1.5,
    watermelon: 0.4,
    honey: 1.8,
    pear: 1.1,
    plum: 0.6,
    lemon: 1.4,
    honeycrisp: 1.2,
  },
};

export function getDemandMultiplier(fruitType: FruitType, season: Season): number {
  return SEASONAL_DEMAND_FACTORS[season]?.[fruitType] ?? 1.0;
}

export function calculateAutoSellInterval(
  askingPrice: number,
  basePrice: number,
  demandMultiplier: number
): number {
  const safeBase = Math.max(0.25, basePrice || 1.5);
  const safeAsking = Math.max(0.25, askingPrice);
  const safeDemand = Math.max(0.2, demandMultiplier || 1);

  const priceRatio = safeAsking / safeBase - 1;
  const elasticityFactor = Math.exp(1.35 * priceRatio);
  const baseIntervalMs = 3000;
  const interval = (baseIntervalMs / safeDemand) * elasticityFactor;

  return Math.min(60000, Math.max(400, Math.round(interval)));
}

export function getDemandAnalysis(
  askingPrice: number,
  defaultPrice: number,
  season: Season,
  fruitType: FruitType
) {
  const demand = getDemandMultiplier(fruitType, season);
  const intervalMs = calculateAutoSellInterval(askingPrice, defaultPrice, demand);
  const intervalSec = intervalMs / 1000;
  const pricePctDiff = Math.round(((askingPrice / (defaultPrice || 1)) - 1) * 100);

  let priceLabel = 'Standard Price';
  if (pricePctDiff > 0) {
    priceLabel = `+${pricePctDiff}% Markup`;
  } else if (pricePctDiff < 0) {
    priceLabel = `${pricePctDiff}% Discount`;
  }

  let demandLabel = 'Normal';
  if (demand >= 1.6) demandLabel = 'Peak Demand 🔥';
  else if (demand >= 1.2) demandLabel = 'High Demand 📈';
  else if (demand <= 0.6) demandLabel = 'Low Off-Season 📉';
  else if (demand <= 0.8) demandLabel = 'Slow Season';

  return {
    demand,
    demandLabel,
    intervalMs,
    intervalSec,
    pricePctDiff,
    priceLabel,
    rateText: `1 every ${intervalSec < 1 ? intervalSec.toFixed(2) : intervalSec.toFixed(1)}s`,
  };
}
