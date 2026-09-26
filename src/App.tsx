import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FruitType,
  Plot,
  Upgrade,
  Achievement,
  Season,
  TabType,
  FloatingParticle,
  CraftRecipe,
} from './types';
import {
  PRODUCE_CATALOG,
  ALL_FRUIT_TYPES,
  createProduceMap,
  getDemandMultiplier,
  calculateAutoSellInterval,
} from './constants/produce';
import {
  INITIAL_PLOTS,
  UPGRADES,
  INITIAL_ACHIEVEMENTS,
} from './constants/gameData';
import { SoundEngine } from './services/sound';

import { Header } from './components/Header';
import { OrchardView } from './components/OrchardView';
import { FarmhouseInterior } from './components/FarmhouseInterior';
import { MarketStandView } from './components/MarketStandView';
import { UpgradesModal } from './components/UpgradesModal';
import { LedgerModal } from './components/LedgerModal';
import { PlantModal } from './components/PlantModal';
import { CiderPressModal } from './components/CiderPressModal';
import { WelcomeModal } from './components/WelcomeModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { UnreachableApplesModal } from './components/UnreachableApplesModal';
import { TruckKeysModal } from './components/TruckKeysModal';
import { MarketWelcomeModal } from './components/MarketWelcomeModal';
import { FiftyDollarMilestoneModal } from './components/FiftyDollarMilestoneModal';
import { TractorManView } from './components/TractorManView';
import { FloatingParticles } from './components/FloatingParticles';

const SAVE_KEY = 'ascii_orchard_save_v1';
const SEASONS: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
const HOURS_PER_DAY = 24;
const DAYS_PER_SEASON = 30;
const HOURS_PER_SEASON = HOURS_PER_DAY * DAYS_PER_SEASON;

const DEFAULT_PRICES = createProduceMap((t) => PRODUCE_CATALOG[t].baseValue);
const DEFAULT_AUTO_SELL = createProduceMap(() => false);

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('orchard');
  const [plantingPlot, setPlantingPlot] = useState<Plot | null>(null);
  const [isCiderPressOpen, setIsCiderPressOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isUnreachableModalOpen, setIsUnreachableModalOpen] = useState(false);
  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
  const [hasLadder, setHasLadder] = useState(false);
  const [hasTruckKey, setHasTruckKey] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ascii_orchard_welcome_seen') !== 'true';
    } catch {
      return true;
    }
  });

  const handleDismissWelcome = () => {
    setIsWelcomeOpen(false);
    try {
      localStorage.setItem('ascii_orchard_welcome_seen', 'true');
    } catch {
      // ignore
    }
  };

  const [hasMarketWelcomeSeen, setHasMarketWelcomeSeen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ascii_orchard_market_welcome_seen') === 'true';
    } catch {
      return false;
    }
  });
  const [isMarketWelcomeOpen, setIsMarketWelcomeOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'market' && !hasMarketWelcomeSeen) {
      setIsMarketWelcomeOpen(true);
    }
  }, [activeTab, hasMarketWelcomeSeen]);

  const handleDismissMarketWelcome = () => {
    setIsMarketWelcomeOpen(false);
    setHasMarketWelcomeSeen(true);
    try {
      localStorage.setItem('ascii_orchard_market_welcome_seen', 'true');
    } catch {
      // ignore
    }
  };

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontScale, setFontScale] = useState(1);

  // Core Game State
  const [basket, setBasket] = useState<Record<FruitType, number>>(() => createProduceMap(() => 0));
  const [askingPrices, setAskingPrices] = useState<Record<FruitType, number>>(DEFAULT_PRICES);
  const [autoSell, setAutoSell] = useState<Record<FruitType, boolean>>(DEFAULT_AUTO_SELL);
  const [money, setMoney] = useState(0);
  const [plots, setPlots] = useState<Plot[]>(INITIAL_PLOTS);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(UPGRADES);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [discoveredPlotIds, setDiscoveredPlotIds] = useState<number[]>([]);

  // Statistics
  const [lifetimeFruits, setLifetimeFruits] = useState<Record<FruitType, number>>(() =>
    createProduceMap(() => 0)
  );
  const [lifetimeMoney, setLifetimeMoney] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [cidersPressed, setCidersPressed] = useState(0);

  const [hasFiftyMilestoneSeen, setHasFiftyMilestoneSeen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ascii_orchard_fifty_milestone_seen') === 'true';
    } catch {
      return false;
    }
  });
  const [isFiftyMilestoneOpen, setIsFiftyMilestoneOpen] = useState(false);

  useEffect(() => {
    if ((lifetimeMoney >= 50 || money >= 50) && !hasFiftyMilestoneSeen) {
      setIsFiftyMilestoneOpen(true);
    }
  }, [lifetimeMoney, money, hasFiftyMilestoneSeen]);

  const handleDismissFiftyMilestone = () => {
    setIsFiftyMilestoneOpen(false);
    setHasFiftyMilestoneSeen(true);
    try {
      localStorage.setItem('ascii_orchard_fifty_milestone_seen', 'true');
    } catch {
      // ignore
    }
  };

  // Visual cues
  const [shakingPlotId, setShakingPlotId] = useState<number | null>(null);
  const [isBasketPopping, setIsBasketPopping] = useState(false);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  // Time & Weather
  const [gameHours, setGameHours] = useState(0);
  const [weatherText, setWeatherText] = useState('Sunny');

  const currentSeasonIdx = Math.floor(gameHours / HOURS_PER_SEASON) % SEASONS.length;
  const currentSeason = SEASONS[currentSeasonIdx];
  const seasonProgressHours = gameHours % HOURS_PER_SEASON;
  const currentDay = Math.floor(seasonProgressHours / HOURS_PER_DAY) + 1;
  const currentHour = seasonProgressHours % HOURS_PER_DAY;

  // Load Game on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.basket) setBasket({ ...createProduceMap(() => 0), ...data.basket });
        if (data.askingPrices) setAskingPrices({ ...DEFAULT_PRICES, ...data.askingPrices });
        if (data.autoSell) setAutoSell({ ...DEFAULT_AUTO_SELL, ...data.autoSell });
        if (typeof data.money === 'number') setMoney(data.money);
        if (Array.isArray(data.plots)) setPlots(data.plots);
        if (Array.isArray(data.discoveredPlotIds)) setDiscoveredPlotIds(data.discoveredPlotIds);
        if (Array.isArray(data.upgrades)) {
          setUpgrades((prev) =>
            prev.map((u) => {
              const found = data.upgrades.find((su: Upgrade) => su.id === u.id);
              return found ? { ...u, level: found.level } : u;
            })
          );
        }
        if (Array.isArray(data.achievements)) {
          setAchievements((prev) =>
            prev.map((a) => {
              const found = data.achievements.find((sa: Achievement) => sa.id === a.id);
              return found ? { ...a, unlocked: found.unlocked, progress: found.progress } : a;
            })
          );
        }
        if (data.lifetimeFruits) {
          setLifetimeFruits({ ...createProduceMap(() => 0), ...data.lifetimeFruits });
        }
        if (typeof data.lifetimeMoney === 'number') setLifetimeMoney(data.lifetimeMoney);
        if (typeof data.totalClicks === 'number') setTotalClicks(data.totalClicks);
        if (typeof data.cidersPressed === 'number') setCidersPressed(data.cidersPressed);
        if (typeof data.gameHours === 'number') setGameHours(data.gameHours);
        if (typeof data.hasLadder === 'boolean') {
          setHasLadder(data.hasLadder);
        } else if ((data.lifetimeFruits?.apple || 0) > 0) {
          setHasLadder(true);
        }
        if (typeof data.hasTruckKey === 'boolean') {
          setHasTruckKey(data.hasTruckKey);
        }
        if (typeof data.hasFiftyMilestoneSeen === 'boolean') {
          setHasFiftyMilestoneSeen(data.hasFiftyMilestoneSeen);
        }
        if (typeof data.soundEnabled === 'boolean') {
          setSoundEnabled(data.soundEnabled);
          SoundEngine.setEnabled(data.soundEnabled);
        }
      }
    } catch {
      // ignore parse error
    }
  }, []);

  // Update discovered plots as money/unlocks progress
  useEffect(() => {
    setDiscoveredPlotIds((prev) => {
      const newlyDiscovered = plots
        .filter((p) => !prev.includes(p.id) && (p.unlocked || money >= p.unlockCost))
        .map((p) => p.id);
      return newlyDiscovered.length > 0 ? [...prev, ...newlyDiscovered] : prev;
    });
  }, [money, plots]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const saveTimer = setInterval(() => {
      try {
        const payload = {
          hasLadder,
          hasTruckKey,
          basket,
          askingPrices,
          autoSell,
          money,
          plots,
          discoveredPlotIds,
          upgrades,
          achievements,
          lifetimeFruits,
          lifetimeMoney,
          totalClicks,
          cidersPressed,
          gameHours,
          soundEnabled,
          hasFiftyMilestoneSeen,
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
      } catch {
        // ignore storage errors
      }
    }, 5000);
    return () => clearInterval(saveTimer);
  }, [
    hasLadder,
    hasTruckKey,
    hasFiftyMilestoneSeen,
    basket,
    askingPrices,
    autoSell,
    money,
    plots,
    discoveredPlotIds,
    upgrades,
    achievements,
    lifetimeFruits,
    lifetimeMoney,
    totalClicks,
    cidersPressed,
    gameHours,
    soundEnabled,
  ]);

  // Game Clock: 1 in-game hour every 5 seconds
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setGameHours((h) => h + 1);
    }, 5000);
    return () => clearInterval(clockTimer);
  }, []);

  // Weather variations every 3 in-game days (72 hours)
  useEffect(() => {
    const weatherOptions = [
      'Sunny',
      'Gentle Breeze',
      'Morning Dew',
      'Warm Sunbeam',
      'Soft Rain (+50% Growth)',
    ];
    if (gameHours > 0 && gameHours % 72 === 0) {
      setWeatherText(weatherOptions[Math.floor(Math.random() * weatherOptions.length)]);
    }
  }, [gameHours]);

  // Upgrade Boost Calculations
  const shearsLvl = upgrades.find((u) => u.id === 'shears')?.level || 0;
  const basketLvl = upgrades.find((u) => u.id === 'basket')?.level || 0;
  const fertilizerLvl = upgrades.find((u) => u.id === 'fertilizer')?.level || 0;
  const irrigationLvl = upgrades.find((u) => u.id === 'irrigation')?.level || 0;
  const robinLvl = upgrades.find((u) => u.id === 'robin')?.level || 0;
  const beatriceLvl = upgrades.find((u) => u.id === 'beatrice')?.level || 0;
  const silasLvl = upgrades.find((u) => u.id === 'silas')?.level || 0;

  const critChance = shearsLvl * 0.1;
  const bonusFruitPerClick = shearsLvl;
  const marketPriceBonus = 1 + basketLvl * 0.15;
  const growthSpeedMultiplier =
    1 + fertilizerLvl * 0.2 + beatriceLvl * 0.25 + (weatherText.includes('Rain') ? 0.5 : 0);
  const extraCapacity = irrigationLvl * 15;

  const spawnParticle = useCallback(
    (text: string, x: number, y: number, color = '#ef4444', isCrit = false) => {
      const id = `${Date.now()}-${Math.random()}`;
      setParticles((prev) => [...prev, { id, text, x, y, color, isCrit }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 750);
    },
    []
  );

  const triggerBasketPop = useCallback(() => {
    setIsBasketPopping(false);
    requestAnimationFrame(() => {
      setIsBasketPopping(true);
      setTimeout(() => setIsBasketPopping(false), 300);
    });
  }, []);

  // Check achievements against current stats
  const checkAchievements = useCallback(
    (
      _curBasket: Record<FruitType, number>,
      curMoney: number,
      curPlots: Plot[],
      curCiders: number,
      curLifetime: Record<FruitType, number>
    ) => {
      setAchievements((prev) =>
        prev.map((ach) => {
          if (ach.unlocked) return ach;
          let unlocked = false;
          const prog = ach.progress;
          const totalHarvested = Object.values(curLifetime).reduce((a, b) => a + b, 0);

          if (ach.id === 'first_pluck' && totalHarvested >= 1) unlocked = true;
          if (ach.id === 'bushel_full' && (curLifetime.apple || 0) >= 50) unlocked = true;
          if (ach.id === 'orchard_expansion' && curPlots.filter((p) => p.unlocked).length >= 4) {
            unlocked = true;
          }
          if (ach.id === 'cider_presser' && curCiders >= 1) unlocked = true;
          if (
            ach.id === 'variety_grower' &&
            new Set(curPlots.filter((p) => p.tree).map((p) => p.tree!.type)).size >= 3
          ) {
            unlocked = true;
          }
          if (ach.id === 'penny_pincher' && curMoney >= 1000) unlocked = true;
          if (ach.id === 'grand_estate' && curPlots.filter((p) => p.unlocked).length >= 16) {
            unlocked = true;
          }
          if (ach.id === 'thousand_fruits' && totalHarvested >= 1000) unlocked = true;

          if (unlocked) {
            SoundEngine.playFanfare();
            spawnParticle(
              `🏆 ${ach.title}!`,
              window.innerWidth / 2,
              120,
              '#d97706',
              true
            );
            return { ...ach, unlocked: true, progress: ach.maxProgress };
          }
          return { ...ach, progress: prog };
        })
      );
    },
    [spawnParticle]
  );

  // Harvesting a single plot
  const handleHarvestPlot = useCallback(
    (plot: Plot, e?: React.MouseEvent) => {
      if (!plot.tree || plot.tree.fruitCount <= 0) return;

      if (!hasLadder && plot.tree.type === 'apple') {
        SoundEngine.playRustle();
        setIsUnreachableModalOpen(true);
        return;
      }

      const baseAmount = plot.tree.fruitCount;
      const fruitType = plot.tree.type;
      const info = PRODUCE_CATALOG[fruitType];

      const isCrit = Math.random() < critChance;
      const extraCrit = isCrit ? baseAmount * 2 + bonusFruitPerClick : bonusFruitPerClick;
      const totalGained = baseAmount + extraCrit;

      SoundEngine.playPluck(Math.min(5, Math.ceil(totalGained / 5)), isCrit);
      SoundEngine.playRustle();

      setShakingPlotId(plot.id);
      setTimeout(() => setShakingPlotId(null), 250);

      if (e) {
        const text = isCrit ? `CRIT! +${totalGained} ${info.symbol}` : `+${totalGained} ${info.symbol}`;
        spawnParticle(text, e.clientX, e.clientY, info.colorHex, isCrit);
      } else {
        spawnParticle(`+${totalGained} ${info.symbol}`, window.innerWidth / 2, 300, info.colorHex, isCrit);
      }

      triggerBasketPop();

      setPlots((prev) =>
        prev.map((p) => (p.id === plot.id && p.tree ? { ...p, tree: { ...p.tree, fruitCount: 0 } } : p))
      );

      setBasket((prev) => ({
        ...prev,
        [fruitType]: (prev[fruitType] || 0) + totalGained,
      }));

      setLifetimeFruits((prev) => {
        const updated = {
          ...prev,
          [fruitType]: (prev[fruitType] || 0) + totalGained,
        };
        checkAchievements(basket, money, plots, cidersPressed, updated);
        return updated;
      });

      setTotalClicks((c) => c + 1);
    },
    [
      hasLadder,
      critChance,
      bonusFruitPerClick,
      spawnParticle,
      triggerBasketPop,
      checkAchievements,
      basket,
      money,
      plots,
      cidersPressed,
    ]
  );

  // Harvesting all plots at once (Spacebar or Wagon helper)
  const handleHarvestAll = useCallback(
    (e?: React.MouseEvent) => {
      const ripePlots = plots.filter((p) => p.tree && p.tree.fruitCount > 0);
      if (ripePlots.length === 0) return;

      if (!hasLadder) {
        SoundEngine.playRustle();
        setIsUnreachableModalOpen(true);
        return;
      }

      SoundEngine.playRustle();
      SoundEngine.playPluck(3, false);

      let totalHarvested = 0;
      const gainedByType: Partial<Record<FruitType, number>> = {};

      setPlots((prev) =>
        prev.map((p) => {
          if (p.tree && p.tree.fruitCount > 0) {
            const t = p.tree.type;
            const amt = p.tree.fruitCount;
            gainedByType[t] = (gainedByType[t] || 0) + amt;
            totalHarvested += amt;
            return { ...p, tree: { ...p.tree, fruitCount: 0 } };
          }
          return p;
        })
      );

      if (totalHarvested > 0) {
        triggerBasketPop();

        setBasket((prev) => {
          const updated = { ...prev };
          Object.entries(gainedByType).forEach(([k, v]) => {
            const ft = k as FruitType;
            updated[ft] = (updated[ft] || 0) + (v || 0);
          });
          return updated;
        });

        setLifetimeFruits((prev) => {
          const updated = { ...prev };
          Object.entries(gainedByType).forEach(([k, v]) => {
            const ft = k as FruitType;
            updated[ft] = (updated[ft] || 0) + (v || 0);
          });
          checkAchievements(basket, money, plots, cidersPressed, updated);
          return updated;
        });

        const posX = e ? e.clientX : window.innerWidth / 2;
        const posY = e ? e.clientY : 280;
        spawnParticle(`🌟 All Ripe Harvested! +${totalHarvested}`, posX, posY, '#d97706', true);
      }
    },
    [hasLadder, plots, triggerBasketPop, checkAchievements, basket, money, cidersPressed, spawnParticle]
  );

  // Collect ladder from farmhouse wall
  const handleCollectLadder = useCallback(
    (e?: React.MouseEvent) => {
      SoundEngine.playRustle();
      SoundEngine.playPluck(1.5, true);
      setHasLadder(true);
      const posX = e ? e.clientX : window.innerWidth / 2;
      const posY = e ? e.clientY : 240;
      spawnParticle('🪜 Wooden Ladder added to inventory!', posX, posY, '#d97706', true);
    },
    [spawnParticle]
  );

  // Collect truck key from patch of grass near swingset
  const handleCollectTruckKey = useCallback(
    (e?: React.MouseEvent) => {
      if (hasTruckKey) return;
      SoundEngine.playRustle();
      SoundEngine.playPluck(1.8, true);
      setHasTruckKey(true);
      const posX = e ? e.clientX : window.innerWidth / 2;
      const posY = e ? e.clientY : 240;
      spawnParticle('🔑 Truck Key added to inventory!', posX, posY, '#2563eb', true);
    },
    [hasTruckKey, spawnParticle]
  );

  // Unlock overgrown plot
  const handleUnlockPlot = useCallback(
    (plot: Plot) => {
      if (money < plot.unlockCost) {
        SoundEngine.playPluck(0.5);
        spawnParticle(`Need $${plot.unlockCost} to clear plot!`, window.innerWidth / 2, 280, '#ef4444');
        return;
      }

      SoundEngine.playFanfare();
      setMoney((m) => m - plot.unlockCost);
      setPlots((prev) => prev.map((p) => (p.id === plot.id ? { ...p, unlocked: true } : p)));
      spawnParticle('Plot Unlocked! Ready for planting', window.innerWidth / 2, 280, '#10b981', true);
      checkAchievements(basket, money - plot.unlockCost, plots, cidersPressed, lifetimeFruits);
    },
    [money, spawnParticle, checkAchievements, basket, plots, cidersPressed, lifetimeFruits]
  );

  // Plant a new tree or crop
  const handlePlantTree = useCallback(
    (plotId: number, fruitType: FruitType) => {
      const info = PRODUCE_CATALOG[fruitType];
      if (money < info.seedCost) return;

      SoundEngine.playPluck(2);
      setMoney((m) => m - info.seedCost);
      setPlots((prev) =>
        prev.map((p) =>
          p.id === plotId
            ? {
                ...p,
                tree: {
                  type: fruitType,
                  level: 1,
                  fruitCount: 0,
                  maxFruit: 99 + extraCapacity,
                  growthProgress: 0,
                },
              }
            : p
        )
      );
      spawnParticle(`Planted ${info.name}!`, window.innerWidth / 2, 280, info.colorHex);
      checkAchievements(basket, money - info.seedCost, plots, cidersPressed, lifetimeFruits);
    },
    [money, extraCapacity, spawnParticle, checkAchievements, basket, plots, cidersPressed, lifetimeFruits]
  );

  // Upgrade tool or hired hand
  const handleBuyUpgrade = useCallback(
    (upgradeId: string) => {
      const up = upgrades.find((u) => u.id === upgradeId);
      if (!up) return;
      const cost = Math.round(up.cost * Math.pow(up.costMultiplier, up.level));
      if (money < cost || up.level >= up.maxLevel) return;

      SoundEngine.playFanfare();
      setMoney((m) => m - cost);
      setUpgrades((prev) =>
        prev.map((u) => (u.id === upgradeId ? { ...u, level: u.level + 1 } : u))
      );
      spawnParticle(`⚡ Upgraded: ${up.name}!`, window.innerWidth / 2, 140, '#2563eb', true);
    },
    [upgrades, money, spawnParticle]
  );

  // Craft artisanal ciders & cordials
  const handleCraftProduct = useCallback(
    (recipe: CraftRecipe, quantity: number) => {
      const neededFruit = recipe.fruitRequired * quantity;
      if ((basket[recipe.fruitType] || 0) < neededFruit) return;

      const revenue = recipe.bottleValue * quantity;
      SoundEngine.playPress();
      SoundEngine.playCoin();

      setBasket((prev) => ({
        ...prev,
        [recipe.fruitType]: prev[recipe.fruitType] - neededFruit,
      }));
      setMoney((m) => m + revenue);
      setLifetimeMoney((m) => m + revenue);
      setCidersPressed((c) => c + quantity);

      spawnParticle(`+${quantity} ${recipe.outputName}! +$${revenue}`, window.innerWidth / 2, 200, '#d97706', true);
      checkAchievements(basket, money + revenue, plots, cidersPressed + quantity, lifetimeFruits);
    },
    [basket, money, plots, cidersPressed, lifetimeFruits, checkAchievements, spawnParticle]
  );

  // Manual selling of fruit at the market
  const handleSellFruit = useCallback(
    (type: FruitType, count: number, customPrice?: number) => {
      if (count <= 0) return;
      const info = PRODUCE_CATALOG[type];
      const unitPrice =
        customPrice ?? askingPrices[type] ?? Math.round(info.baseValue * marketPriceBonus);
      const totalEarned = count * unitPrice;

      SoundEngine.playCoin();
      setBasket((prev) => ({
        ...prev,
        [type]: Math.max(0, (prev[type] || 0) - count),
      }));
      setMoney((m) => m + totalEarned);
      setLifetimeMoney((m) => m + totalEarned);

      spawnParticle(`Sold ${count} × ${info.name} for +$${totalEarned}!`, window.innerWidth / 2, 200, '#059669', true);
      checkAchievements(basket, money + totalEarned, plots, cidersPressed, lifetimeFruits);
    },
    [marketPriceBonus, spawnParticle, checkAchievements, basket, money, plots, cidersPressed, lifetimeFruits, askingPrices]
  );

  // Sell all items in inventory
  const handleSellAll = useCallback(() => {
    let totalValue = 0;
    Object.entries(basket).forEach(([k, count]) => {
      const ft = k as FruitType;
      const unitPrice = askingPrices[ft] ?? Math.round(PRODUCE_CATALOG[ft].baseValue * marketPriceBonus);
      totalValue += count * unitPrice;
    });

    if (totalValue <= 0) return;

    SoundEngine.playCoin();
    setBasket(createProduceMap(() => 0));
    setMoney((m) => m + totalValue);
    setLifetimeMoney((m) => m + totalValue);

    spawnParticle(`Sold All Harvest! +$${totalValue.toLocaleString()}`, window.innerWidth / 2, 200, '#059669', true);
    checkAchievements(basket, money + totalValue, plots, cidersPressed, lifetimeFruits);
  }, [basket, marketPriceBonus, spawnParticle, checkAchievements, money, plots, cidersPressed, lifetimeFruits, askingPrices]);

  // Update asking price for a fruit
  const handleUpdateAskingPrice = useCallback((type: FruitType, newPrice: number) => {
    setAskingPrices((prev) => ({ ...prev, [type]: Math.max(0.25, newPrice) }));
  }, []);

  // Toggle auto-sell for a fruit
  const handleToggleAutoSell = useCallback((type: FruitType) => {
    setAutoSell((prev) => ({ ...prev, [type]: !prev[type] }));
    SoundEngine.playPluck(1.4);
  }, []);

  // Toggle all auto-sell
  const handleToggleAllAutoSell = useCallback(() => {
    setAutoSell((prev) => {
      const anyActive = Object.values(prev).some(Boolean);
      return createProduceMap(() => !anyActive);
    });
    SoundEngine.playPluck(1.5);
  }, []);

  // Auto-Sell Tick Loop
  const autoSellLastSoldRef = useRef<Record<string, number>>({});
  const basketRef = useRef(basket);
  useEffect(() => {
    basketRef.current = basket;
  }, [basket]);

  useEffect(() => {
    const now = Date.now();
    ALL_FRUIT_TYPES.forEach((type) => {
      if (autoSell[type] && !autoSellLastSoldRef.current[type]) {
        autoSellLastSoldRef.current[type] = now;
      }
    });
  }, [autoSell]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const currentB = basketRef.current;
      const toSell: Array<{ type: FruitType; price: number }> = [];

      ALL_FRUIT_TYPES.forEach((type) => {
        if (!autoSell[type] || (currentB[type] || 0) <= 0) return;

        const baseVal = PRODUCE_CATALOG[type]?.baseValue || 1.5;
        const askingP = askingPrices[type] ?? baseVal;
        const demand = getDemandMultiplier(type, currentSeason);
        const interval = calculateAutoSellInterval(askingP, baseVal, demand);
        const lastSold = autoSellLastSoldRef.current[type] || 0;

        if (now - lastSold >= interval) {
          autoSellLastSoldRef.current[type] = now;
          toSell.push({ type, price: askingP });
        }
      });

      if (toSell.length > 0) {
        let revenueGained = 0;
        let didSell = false;

        setBasket((prev) => {
          const next = { ...prev };
          toSell.forEach(({ type, price }) => {
            if ((next[type] || 0) > 0) {
              next[type] = next[type] - 1;
              revenueGained += price;
              didSell = true;
            }
          });
          return next;
        });

        if (didSell && revenueGained > 0) {
          setMoney((m) => m + revenueGained);
          setLifetimeMoney((m) => m + revenueGained);
          SoundEngine.playCoin();
        }
      }
    }, 150);

    return () => clearInterval(timer);
  }, [autoSell, askingPrices, currentSeason]);

  // Audio Toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    SoundEngine.setEnabled(next);
    if (next) SoundEngine.playPluck(1);
  };

  // Reset Game Flow
  const handleRequestReset = () => {
    SoundEngine.playPluck(1.1);
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    localStorage.removeItem(SAVE_KEY);
    setHasLadder(false);
    setHasTruckKey(false);
    setIsTruckModalOpen(false);
    setHasMarketWelcomeSeen(false);
    setIsMarketWelcomeOpen(false);
    setHasFiftyMilestoneSeen(false);
    setIsFiftyMilestoneOpen(false);
    setBasket(createProduceMap(() => 0));
    setAskingPrices(DEFAULT_PRICES);
    setAutoSell(DEFAULT_AUTO_SELL);
    setMoney(0);
    setPlots(INITIAL_PLOTS);
    setDiscoveredPlotIds([]);
    setUpgrades(UPGRADES);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setLifetimeFruits(createProduceMap(() => 0));
    setLifetimeMoney(0);
    setTotalClicks(0);
    setCidersPressed(0);
    setGameHours(0);
    try {
      localStorage.removeItem('ascii_orchard_welcome_seen');
      localStorage.removeItem('ascii_orchard_market_welcome_seen');
      localStorage.removeItem('ascii_orchard_fifty_milestone_seen');
    } catch {
      // ignore
    }
    setIsResetConfirmOpen(false);
    setIsWelcomeOpen(true);
    setActiveTab('orchard');
    SoundEngine.playFanfare();
  };

  const handleManualSave = () => {
    const payload = {
      hasLadder,
      hasTruckKey,
      basket,
      askingPrices,
      autoSell,
      money,
      plots,
      upgrades,
      achievements,
      lifetimeFruits,
      lifetimeMoney,
      totalClicks,
      cidersPressed,
      gameHours,
      soundEnabled,
      hasFiftyMilestoneSeen,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    SoundEngine.playCoin();
    spawnParticle('Saved to browser storage! ✔', window.innerWidth / 2, 100, '#059669');
  };

  // Growth Interval: 1s ticks for tree & crop progress
  useEffect(() => {
    const growthTimer = setInterval(() => {
      setPlots((prev) =>
        prev.map((plot) => {
          if (!plot.unlocked || !plot.tree) return plot;

          const tree = plot.tree;
          const maxCapacity = 99 + extraCapacity;
          if (tree.fruitCount >= maxCapacity) return plot;

          const baseSeconds = PRODUCE_CATALOG[tree.type].growthSeconds;
          const effectiveSeconds = baseSeconds / growthSpeedMultiplier;
          const increment = 1 / effectiveSeconds;
          const nextProgress = tree.growthProgress + increment;

          if (nextProgress >= 1) {
            const addedFruit = Math.floor(nextProgress);
            const newCount = Math.min(maxCapacity, tree.fruitCount + addedFruit);
            return {
              ...plot,
              tree: {
                ...tree,
                fruitCount: newCount,
                growthProgress: nextProgress % 1,
                maxFruit: maxCapacity,
              },
            };
          } else {
            return {
              ...plot,
              tree: {
                ...tree,
                growthProgress: nextProgress,
                maxFruit: maxCapacity,
              },
            };
          }
        })
      );
    }, 1000);

    return () => clearInterval(growthTimer);
  }, [growthSpeedMultiplier, extraCapacity]);

  // Farmhand Robin automated harvesting
  useEffect(() => {
    if (robinLvl <= 0) return;
    const intervalSeconds = Math.max(1, 4 - robinLvl * 0.5);
    const robinTimer = setInterval(() => {
      setPlots((prev) => {
        const readyPlot = prev.find((p) => p.tree && p.tree.fruitCount >= 5);
        if (!readyPlot || !readyPlot.tree) return prev;

        const count = readyPlot.tree.fruitCount;
        const fType = readyPlot.tree.type;

        setBasket((b) => ({ ...b, [fType]: (b[fType] || 0) + count }));
        setLifetimeFruits((lf) => ({ ...lf, [fType]: (lf[fType] || 0) + count }));
        SoundEngine.playRustle();

        return prev.map((p) =>
          p.id === readyPlot.id && p.tree ? { ...p, tree: { ...p.tree, fruitCount: 0 } } : p
        );
      });
    }, intervalSeconds * 1000);

    return () => clearInterval(robinTimer);
  }, [robinLvl]);

  // Master Silas & Wagon automated sweeping
  useEffect(() => {
    if (silasLvl <= 0) return;
    const intervalSeconds = Math.max(5, 12 - silasLvl * 1.5);
    const silasTimer = setInterval(() => {
      handleHarvestAll();
    }, intervalSeconds * 1000);

    return () => clearInterval(silasTimer);
  }, [silasLvl, handleHarvestAll]);

  const unlockedPlotsCount = plots.filter((p) => p.unlocked).length;
  const hasFirstApple = (lifetimeFruits.apple || 0) > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f2eb] text-stone-800 font-sans selection:bg-amber-200">
      <FloatingParticles particles={particles} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6 flex flex-col items-center">
        <Header
          hasLadder={hasLadder}
          hasTruckKey={hasTruckKey}
          basket={basket}
          isBasketPopping={isBasketPopping}
          plots={plots}
          lifetimeFruits={lifetimeFruits}
          season={currentSeason}
          day={currentDay}
          hour={currentHour}
          money={money}
          fontScale={fontScale}
          setFontScale={setFontScale}
          onResetGame={handleRequestReset}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          weatherText={weatherText}
          hasFirstApple={hasFirstApple}
        />

        {/* Tab Views */}
        {activeTab === 'orchard' && (
          <OrchardView
            plots={plots}
            money={money}
            discoveredPlotIds={discoveredPlotIds}
            onHarvestPlot={handleHarvestPlot}
            onUnlockPlot={handleUnlockPlot}
            onPlantPlot={(plot) => setPlantingPlot(plot)}
            onOpenFarmhouse={() => setActiveTab('farmhouse')}
            onHarvestAll={handleHarvestAll}
            shakingPlotId={shakingPlotId}
            fontScale={fontScale}
            onOpenMarket={() => setActiveTab('market')}
            hasFirstApple={hasFirstApple}
            hasLadder={hasLadder}
            onCollectLadder={handleCollectLadder}
            onAttemptUnreachableApple={() => {
              SoundEngine.playRustle();
              setIsUnreachableModalOpen(true);
            }}
            hasTruckKey={hasTruckKey}
            onCollectTruckKey={handleCollectTruckKey}
            onAttemptLockedTruck={() => {
              SoundEngine.playRustle();
              setIsTruckModalOpen(true);
            }}
          />
        )}

        {activeTab === 'farmhouse' && (
          <FarmhouseInterior
            onBack={() => setActiveTab('orchard')}
            onOpenCiderPress={() => setIsCiderPressOpen(true)}
          />
        )}

        {activeTab === 'upgrades' && (
          <div className="w-full flex justify-center">
            <UpgradesModal
              isOpen={true}
              onClose={() => setActiveTab('orchard')}
              upgrades={upgrades}
              money={money}
              onBuyUpgrade={handleBuyUpgrade}
            />
          </div>
        )}

        {activeTab === 'market' && (
          <MarketStandView
            basket={basket}
            onSellFruit={handleSellFruit}
            onSellAll={handleSellAll}
            priceMultiplier={marketPriceBonus}
            money={money}
            lifetimeMoney={lifetimeMoney}
            onBack={() => setActiveTab('orchard')}
            onOpenTractorMan={() => setActiveTab('tractorman')}
            askingPrices={askingPrices}
            onUpdateAskingPrice={handleUpdateAskingPrice}
            autoSell={autoSell}
            onToggleAutoSell={handleToggleAutoSell}
            onToggleAllAutoSell={handleToggleAllAutoSell}
            season={currentSeason}
          />
        )}

        {activeTab === 'tractorman' && (
          <TractorManView
            onBackToMarket={() => setActiveTab('market')}
            onBackToOrchard={() => setActiveTab('orchard')}
          />
        )}

        {activeTab === 'achievements' && (
          <div className="w-full flex justify-center">
            <LedgerModal
              isOpen={true}
              onClose={() => setActiveTab('orchard')}
              lifetimeFruits={lifetimeFruits}
              lifetimeMoney={lifetimeMoney}
              totalClicks={totalClicks}
              cidersPressed={cidersPressed}
              plotsUnlockedCount={unlockedPlotsCount}
              achievements={achievements}
              onResetGame={handleRequestReset}
              onManualSave={handleManualSave}
              onOpenWelcomePlaque={() => setIsWelcomeOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Floating Modals */}
      <PlantModal
        isOpen={plantingPlot !== null}
        onClose={() => setPlantingPlot(null)}
        plot={plantingPlot}
        money={money}
        onPlantTree={handlePlantTree}
      />

      <CiderPressModal
        isOpen={isCiderPressOpen}
        onClose={() => setIsCiderPressOpen(false)}
        basket={basket}
        onCraftProduct={handleCraftProduct}
        cidersPressed={cidersPressed}
      />

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      <WelcomeModal isOpen={isWelcomeOpen} onClose={handleDismissWelcome} />

      <UnreachableApplesModal
        isOpen={isUnreachableModalOpen}
        onClose={() => setIsUnreachableModalOpen(false)}
      />

      <TruckKeysModal
        isOpen={isTruckModalOpen}
        onClose={() => setIsTruckModalOpen(false)}
      />

      <MarketWelcomeModal
        isOpen={isMarketWelcomeOpen}
        onClose={handleDismissMarketWelcome}
      />

      <FiftyDollarMilestoneModal
        isOpen={isFiftyMilestoneOpen}
        onClose={handleDismissFiftyMilestone}
      />
    </div>
  );
}
