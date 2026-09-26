import React, { useState, useEffect } from 'react';
import { Plot } from '../types';
import {
  renderFarmhouse,
  renderSwingset,
  renderTruck,
  renderTreePlot,
  renderEmptyPlowedPlot,
  renderOvergrownPlot,
} from '../services/asciiArt';
import { SoundEngine } from '../services/sound';

interface OrchardViewProps {
  plots: Plot[];
  money: number;
  discoveredPlotIds: number[];
  onHarvestPlot: (plot: Plot, e?: React.MouseEvent) => void;
  onUnlockPlot: (plot: Plot) => void;
  onPlantPlot: (plot: Plot) => void;
  onOpenFarmhouse: () => void;
  onHarvestAll: (e?: React.MouseEvent) => void;
  shakingPlotId: number | null;
  fontScale: number;
  onOpenMarket: () => void;
  hasFirstApple: boolean;
  hasLadder: boolean;
  onCollectLadder: (e: React.MouseEvent) => void;
  onAttemptUnreachableApple: () => void;
  hasTruckKey: boolean;
  onCollectTruckKey: (e: React.MouseEvent) => void;
  onAttemptLockedTruck: () => void;
}

export const OrchardView: React.FC<OrchardViewProps> = ({
  plots,
  money,
  discoveredPlotIds,
  onHarvestPlot,
  onUnlockPlot,
  onPlantPlot,
  onOpenFarmhouse,
  onHarvestAll,
  shakingPlotId,
  fontScale,
  onOpenMarket,
  hasFirstApple,
  hasLadder,
  onCollectLadder,
  onAttemptUnreachableApple,
  hasTruckKey,
  onCollectTruckKey,
  onAttemptLockedTruck,
}) => {
  const [smokeFrame, setSmokeFrame] = useState(0);
  const [swingFrame, setSwingFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSmokeFrame((f) => (f + 1) % 3);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const swingTimer = setInterval(() => {
      setSwingFrame((f) => (f + 1) % 4);
    }, 900);
    return () => clearInterval(swingTimer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        if (!hasLadder) {
          onAttemptUnreachableApple();
          return;
        }
        onHarvestAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onHarvestAll, hasLadder, onAttemptUnreachableApple]);

  const handlePlotClick = (plot: Plot, e: React.MouseEvent) => {
    if (plot.unlocked) {
      if (plot.tree) {
        if (!hasLadder && plot.tree.type === 'apple') {
          onAttemptUnreachableApple();
          return;
        }
        onHarvestPlot(plot, e);
      } else {
        onPlantPlot(plot);
      }
    } else {
      onUnlockPlot(plot);
    }
  };

  const handleDriveToMarket = () => {
    if (!hasTruckKey) {
      SoundEngine.playRustle();
      onAttemptLockedTruck();
      return;
    }
    SoundEngine.playPluck(0.9);
    onOpenMarket();
  };

  const showLadder = !hasLadder;
  const farmhouseLines = renderFarmhouse(smokeFrame, showLadder);
  const swingsetLines = renderSwingset(swingFrame);
  const truckLines = renderTruck();

  const textStyle: React.CSSProperties = {
    fontSize: `${0.85 * fontScale}rem`,
    lineHeight: '1.18',
  };

  const isPlotVisible = (plot: Plot) => {
    if (plot.id === 0) return true;
    return plot.unlocked || money >= plot.unlockCost || discoveredPlotIds.includes(plot.id);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
      {/* Main ASCII Canvas */}
      <div className="w-full bg-[#f5f2eb] p-2 sm:p-5 overflow-x-auto ascii-scroll">
        <div className="w-max mx-auto flex flex-col items-center">
          {/* Farm Buildings Header Row: Swingset, Farmhouse, Old Farm Truck */}
          <div className="flex items-end justify-center gap-1.5 sm:gap-3 mb-2">
            {/* Swingset */}
            <div
              title="Orchard Swingset - Swaying gently in the breeze"
              className="relative inline-block select-none"
            >
              {!hasTruckKey && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCollectTruckKey(e);
                  }}
                  aria-label="Small patch of grass"
                  title="Small patch of grass"
                  className="absolute left-0 bottom-0 w-14 sm:w-16 h-8 sm:h-10 cursor-pointer z-20 focus:outline-hidden"
                />
              )}
              <pre
                style={textStyle}
                className="font-mono text-stone-800 m-0 p-0 font-medium tracking-tight"
                dangerouslySetInnerHTML={{ __html: swingsetLines.join('\n') }}
              />
            </div>

            {/* Farmhouse & Leaning Ladder */}
            <div className="relative inline-block select-none">
              {showLadder && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCollectLadder(e);
                  }}
                  aria-label="Collect Wooden Ladder"
                  className="absolute left-0 bottom-0 w-12 sm:w-14 h-12 sm:h-14 cursor-pointer z-20"
                />
              )}

              <div
                onClick={onOpenFarmhouse}
                title="Rustic Farmhouse - Click to enter Cider Press & Pantry"
                className="inline-block select-none cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all"
              >
                <pre
                  style={textStyle}
                  className="font-mono text-stone-800 m-0 p-0 font-medium tracking-tight"
                  dangerouslySetInnerHTML={{ __html: farmhouseLines.join('\n') }}
                />
              </div>
            </div>

            {/* Old Farm Truck */}
            <div
              onClick={handleDriveToMarket}
              title={
                hasTruckKey
                  ? "Old Farm Truck with Trailer in Tow - Click to drive to Roadside Stand"
                  : "Old Farm Truck - Keys are missing"
              }
              className="inline-block select-none cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all ml-1 sm:ml-3"
            >
              <pre
                style={textStyle}
                className="font-mono text-stone-800 m-0 p-0 font-medium tracking-tight"
                dangerouslySetInnerHTML={{ __html: truckLines.join('\n') }}
              />
            </div>
          </div>

          {/* 4x4 Cultivated Plots Grid */}
          <div>
            {[0, 1, 2, 3].map((rowIdx) => {
              const rowPlots = plots.filter((p) => p.row === rowIdx);
              if (!rowPlots.some(isPlotVisible)) return null;

              return (
                <div key={`row-${rowIdx}`} className="flex items-start">
                  {[0, 1, 2, 3].map((colIdx) => {
                    const plot = rowPlots.find((p) => p.col === colIdx);
                    if (plot && isPlotVisible(plot)) {
                      let lines: string[];
                      if (plot.unlocked) {
                        lines = plot.tree
                          ? renderTreePlot(plot, !hasFirstApple)
                          : renderEmptyPlowedPlot(plot);
                      } else {
                        lines = renderOvergrownPlot(plot);
                      }

                      const isShaking = shakingPlotId === plot.id;
                      const titleTooltip = plot.unlocked
                        ? plot.tree
                          ? `Plot [${String.fromCharCode(65 + plot.row)}${plot.col + 1}] - Click to Harvest ${plot.tree.fruitCount} fruit!`
                          : `Plot [${String.fromCharCode(65 + plot.row)}${plot.col + 1}] - Click to Plant a Tree or Bush`
                        : `Plot [${String.fromCharCode(65 + plot.row)}${plot.col + 1}] - Click to Unlock ($${plot.unlockCost})`;

                      return (
                        <div
                          key={plot.id}
                          onClick={(e) => handlePlotClick(plot, e)}
                          title={titleTooltip}
                          className={`inline-block select-none cursor-pointer transition-transform duration-100 ${
                            isShaking ? 'animate-tree-shake' : ''
                          } hover:brightness-105 active:scale-[0.99]`}
                        >
                          <pre
                            style={textStyle}
                            className="font-mono text-stone-800 m-0 p-0 font-medium tracking-tight"
                            dangerouslySetInnerHTML={{ __html: lines.join('\n') }}
                          />
                        </div>
                      );
                    }

                    // Spacer placeholder
                    return (
                      <div
                        key={`spacer-${rowIdx}-${colIdx}`}
                        className="inline-block select-none pointer-events-none"
                      >
                        <pre
                          style={textStyle}
                          className="font-mono text-transparent m-0 p-0 select-none"
                        >
                          {Array(13)
                            .fill(' '.repeat(28))
                            .join('\n')}
                        </pre>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
