import React, { useState, useMemo } from 'react';
import { FruitType, Season } from '../types';
import { PRODUCE_CATALOG, ALL_FRUIT_TYPES } from '../constants/produce';
import { generateRoadsideStandLines } from '../services/asciiArt';
import { SoundEngine } from '../services/sound';
import { PriceSettingModal } from './PriceSettingModal';
import { MarketResearchModal } from './MarketResearchModal';

interface MarketStandViewProps {
  basket: Record<FruitType, number>;
  onSellFruit: (type: FruitType, count: number, price?: number) => void;
  onSellAll: () => void;
  priceMultiplier: number;
  money: number;
  onBack: () => void;
  askingPrices: Record<FruitType, number>;
  onUpdateAskingPrice: (type: FruitType, price: number) => void;
  autoSell: Record<FruitType, boolean>;
  onToggleAutoSell: (type: FruitType) => void;
  onToggleAllAutoSell: () => void;
  season: Season;
  lifetimeMoney?: number;
  onOpenTractorMan?: () => void;
}

export const MarketStandView: React.FC<MarketStandViewProps> = ({
  basket,
  onSellFruit,
  onSellAll: _onSellAll,
  priceMultiplier,
  money: _money,
  onBack,
  askingPrices,
  onUpdateAskingPrice,
  autoSell,
  onToggleAutoSell,
  onToggleAllAutoSell: _onToggleAllAutoSell,
  season,
  lifetimeMoney = 0,
  onOpenTractorMan,
}) => {
  const [selectedProduce, setSelectedProduce] = useState<FruitType | null>(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);

  const getEffectivePrice = (type: FruitType) =>
    askingPrices[type] ?? Math.round(PRODUCE_CATALOG[type].baseValue * priceMultiplier);

  const handleReturnToOrchard = () => {
    SoundEngine.playPluck(1.2);
    onBack();
  };

  const inventorySummary = ALL_FRUIT_TYPES.map((t) => ((basket[t] || 0) > 0 ? '1' : '0')).join('');
  const hasCrow = lifetimeMoney >= 100 || _money >= 100;

  const standLines = useMemo(() => {
    return generateRoadsideStandLines(
      (type) => askingPrices[type] ?? PRODUCE_CATALOG[type].baseValue,
      (type) => (basket[type] || 0) > 0,
      hasCrow
    );
  }, [askingPrices, inventorySummary, hasCrow]);

  const signpostLines = [
    '                            ',
    '                            ',
    '                            ',
    '                            ',
    '                            ',
    '                            ',
    '                            ',
    '                            ',
    '                            ',
    '                            ',
    '                            ',
    '                            ',
    '                            ',
    '                            ',
    "      <span class='text-[#b45309] font-bold'>.------------------.</span>  ",
    "     <span class='text-[#b45309] font-bold'>/</span>    <span class='text-[#f59e0b] font-bold'>TO ORCHARD</span>      <span class='text-[#b45309] font-bold'>\\</span> ",
    "   <span class='text-[#78350f] font-bold'>/______________________\\</span>",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>.----------------.</span>  <span class='text-[#78350f]'>|</span>",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|  &lt;=== DIRT     |</span>  <span class='text-[#78350f]'>|</span>",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|      PATH      |</span>  <span class='text-[#78350f]'>|</span>",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#78350f]'>|================|</span>  <span class='text-[#78350f]'>|</span>",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>| </span><span class='text-[#f59e0b] font-bold'>[ORCHARD 1 MI]</span><span class='text-[#92400e]'> |</span>  <span class='text-[#78350f]'>|</span>",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|________________|</span>  <span class='text-[#78350f]'>|</span>",
    "   <span class='text-[#78350f] font-bold'>|======================|</span>",
    "             <span class='text-[#8b4513] font-bold'>||</span>             ",
  ];

  const researchBoardLines = [
    "        <span class='text-stone-400'>:</span>    <span class='text-[#8b4513] font-bold'>||</span>    <span class='text-stone-400'>:</span>        ",
    "      <span class='text-[#b45309] font-bold'>.--------------------.</span>",
    "      <span class='text-[#78350f]'>|</span>  <span class='text-[#d97706] font-bold'>MARKET RESEARCH</span>   <span class='text-[#78350f]'>|</span>",
    "      <span class='text-[#78350f]'>|</span>  <span class='text-emerald-700 font-bold'>[ DEMAND FACTORS ]</span><span class='text-[#78350f]'>|</span>",
    "      <span class='text-[#b45309] font-bold'>'--------------------'</span>",
  ];

  const signpostGrassLines = [
    "             <span class='text-[#8b4513] font-bold'>||</span>             ",
    "    <span class='text-[#22c55e]'>\\v/</span>      <span class='text-[#8b4513] font-bold'>||</span>      <span class='text-[#22c55e]'>\\v/</span>    ",
    "   <span class='text-[#78350f]'>~~~~~~~~~~~~~~~~~~~~~~~</span>  ",
    '                            ',
  ];

  const handleStandClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest('[data-bird]') || target.getAttribute('data-bird') === 'true') {
      SoundEngine.playBirdChirp();
      return;
    }

    if (
      target.closest('[data-crow]') ||
      target.getAttribute('data-crow') === 'true' ||
      target.textContent?.includes('(>o)')
    ) {
      SoundEngine.playCrowCall();
      onOpenTractorMan?.();
      return;
    }

    const instaEl = target.closest('[data-insta-sell]') as HTMLElement | null;
    if (instaEl) {
      const pId = instaEl.getAttribute('data-insta-sell') as FruitType;
      if (pId) {
        const info = PRODUCE_CATALOG[pId];
        const count = basket[pId] || 0;
        const instaPrice = info.baseValue * 0.5;
        if (count > 0) {
          onSellFruit(pId, 1, instaPrice);
        } else {
          SoundEngine.playRustle();
        }
      }
      return;
    }

    const produceEl = target.closest('[data-produce-id]');
    if (produceEl) {
      const pId = produceEl.getAttribute('data-produce-id') as FruitType;
      if (pId) {
        SoundEngine.playPluck(1.3);
        setSelectedProduce(pId);
        setIsPriceModalOpen(true);
        return;
      }
    }

    const text = target.innerText;
    if (text && text.includes('OPEN')) {
      handleReturnToOrchard();
    }
  };

  const activeProduceInfo = selectedProduce ? PRODUCE_CATALOG[selectedProduce] : null;

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Main ASCII Roadside Stand Canvas */}
      <div className="w-full bg-[#f5f2eb] p-2 sm:p-4 overflow-x-auto ascii-scroll flex justify-center items-start">
        <div className="inline-flex items-start">
          {/* Signpost & Research Board Left Column */}
          <div className="select-none inline-flex flex-col items-center mr-2">
            <div
              onClick={handleReturnToOrchard}
              role="button"
              tabIndex={0}
              title="Signpost to Orchard - Click to return to the Orchard"
              className="cursor-pointer text-left group hover:brightness-125 active:scale-[0.99] transition-all"
            >
              <pre
                className="font-mono leading-none select-none m-0 p-0"
                style={{
                  fontSize: '0.85rem',
                  lineHeight: '0.95rem',
                }}
              >
                {signpostLines.map((line, idx) => (
                  <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
                ))}
              </pre>
            </div>

            <div
              onClick={() => {
                SoundEngine.playPluck(1.3);
                setIsResearchModalOpen(true);
              }}
              role="button"
              tabIndex={0}
              title="Market Research Board - Click to view seasonal demand factors for all fruits"
              className="cursor-pointer text-left group hover:brightness-125 active:scale-[0.98] transition-all"
            >
              <pre
                className="font-mono leading-none select-none m-0 p-0"
                style={{
                  fontSize: '0.85rem',
                  lineHeight: '0.95rem',
                }}
              >
                {researchBoardLines.map((line, idx) => (
                  <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
                ))}
              </pre>
            </div>

            <div className="text-left">
              <pre
                className="font-mono leading-none select-none m-0 p-0"
                style={{
                  fontSize: '0.85rem',
                  lineHeight: '0.95rem',
                }}
              >
                {signpostGrassLines.map((line, idx) => (
                  <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
                ))}
              </pre>
            </div>
          </div>

          {/* Roadside Stalls Structure */}
          <div onClick={handleStandClick} className="inline-block text-left">
            <pre
              className="font-mono leading-none select-none m-0 p-0"
              style={{
                fontSize: '0.85rem',
                lineHeight: '0.95rem',
              }}
            >
              {standLines.map((line, idx) => (
                <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
              ))}
            </pre>
          </div>
        </div>
      </div>

      {/* Produce Price & Auto-Sell Modal */}
      {activeProduceInfo && (
        <PriceSettingModal
          isOpen={isPriceModalOpen}
          produceId={activeProduceInfo.type}
          name={activeProduceInfo.name}
          symbol={activeProduceInfo.symbol}
          unit={activeProduceInfo.unit}
          price={getEffectivePrice(activeProduceInfo.type)}
          defaultPrice={activeProduceInfo.baseValue}
          autoSell={!!autoSell[activeProduceInfo.type]}
          season={season}
          inventoryCount={basket[activeProduceInfo.type] || 0}
          onUpdatePrice={(p) => onUpdateAskingPrice(activeProduceInfo.type, p)}
          onToggleAutoSell={() => onToggleAutoSell(activeProduceInfo.type)}
          onClose={() => setIsPriceModalOpen(false)}
        />
      )}

      {/* Market Research Ledger Modal */}
      <MarketResearchModal
        isOpen={isResearchModalOpen}
        currentSeason={season}
        onClose={() => setIsResearchModalOpen(false)}
      />
    </div>
  );
};
