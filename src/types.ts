export type FruitType =
  | 'apple'
  | 'pear'
  | 'cherry'
  | 'plum'
  | 'lemon'
  | 'honeycrisp'
  | 'peaches'
  | 'berries'
  | 'tomatoes'
  | 'carrots'
  | 'corn'
  | 'potatoes'
  | 'onions'
  | 'pumpkins'
  | 'watermelon'
  | 'honey';

export type PlantForm = 'tree' | 'bush';

export interface ProduceInfo {
  type: FruitType;
  name: string;
  plural: string;
  unit: string;
  plantForm: PlantForm;
  symbol: string;
  asciiSymbol: string;
  colorHex: string;
  twText: string;
  growthSeconds: number;
  baseValue: number;
  seedCost: number;
  description: string;
}

export interface TreeInstance {
  type: FruitType;
  level: number;
  fruitCount: number;
  maxFruit: number;
  growthProgress: number;
}

export interface Plot {
  id: number;
  row: number;
  col: number;
  unlocked: boolean;
  unlockCost: number;
  tree: TreeInstance | null;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  costMultiplier: number;
}

export interface CraftRecipe {
  id: string;
  name: string;
  outputName: string;
  fruitType: FruitType;
  fruitRequired: number;
  bottleValue: number;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardMoney: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  asciiBadge: string;
}

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface FloatingParticle {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  isCrit?: boolean;
}

export type TabType = 'orchard' | 'farmhouse' | 'market' | 'upgrades' | 'achievements' | 'tractorman';
