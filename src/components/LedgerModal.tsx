import React from 'react';
import { FruitType, Achievement } from '../types';
import { PRODUCE_CATALOG } from '../constants/produce';
import { X, Award, CheckCircle2, RotateCcw, Save, BookOpen, ScrollText } from 'lucide-react';

interface LedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lifetimeFruits: Record<FruitType, number>;
  lifetimeMoney: number;
  totalClicks: number;
  cidersPressed: number;
  plotsUnlockedCount: number;
  achievements: Achievement[];
  onResetGame: () => void;
  onManualSave: () => void;
  onOpenWelcomePlaque?: () => void;
}

export const LedgerModal: React.FC<LedgerModalProps> = ({
  isOpen,
  onClose,
  lifetimeFruits,
  lifetimeMoney,
  totalClicks: _totalClicks,
  cidersPressed,
  plotsUnlockedCount,
  achievements,
  onResetGame,
  onManualSave,
  onOpenWelcomePlaque,
}) => {
  if (!isOpen) return null;

  const totalHarvested = Object.values(lifetimeFruits).reduce((a, b) => a + b, 0);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs select-none">
      <div className="bg-[#fcfbf9] border border-stone-300 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-100/70">
          <div>
            <h2 className="text-xl font-bold font-mono text-stone-900 flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-stone-800" />
              Farmstead Ledger & Achievements
            </h2>
            <p className="text-xs font-mono text-stone-600 mt-1">
              Historical accounting of your agricultural empire and awarded milestones.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-stone-200 rounded-lg p-3 text-center">
              <div className="text-[11px] font-mono text-stone-500">Lifetime Revenue</div>
              <div className="text-lg font-mono font-bold text-emerald-800 tabular-nums mt-1">
                ${lifetimeMoney.toLocaleString()}
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-3 text-center">
              <div className="text-[11px] font-mono text-stone-500">Fruits Harvested</div>
              <div className="text-lg font-mono font-bold text-stone-900 tabular-nums mt-1">
                {totalHarvested.toLocaleString()}
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-3 text-center">
              <div className="text-[11px] font-mono text-stone-500">Ciders Pressed</div>
              <div className="text-lg font-mono font-bold text-amber-800 tabular-nums mt-1">
                {cidersPressed.toLocaleString()}
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-3 text-center">
              <div className="text-[11px] font-mono text-stone-500">Plots Cultivated</div>
              <div className="text-lg font-mono font-bold text-stone-800 tabular-nums mt-1">
                {plotsUnlockedCount} / 16
              </div>
            </div>
          </div>

          {/* Breakdown By Variety */}
          <div>
            <h3 className="font-mono font-bold text-xs text-stone-700 uppercase tracking-wider mb-2">
              Harvest Breakdown By Variety
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(PRODUCE_CATALOG).map((p) => (
                <div
                  key={p.type}
                  className="bg-white border border-stone-200 rounded p-2.5 flex items-center justify-between text-xs font-mono"
                >
                  <span className="flex items-center gap-1.5 text-stone-700">
                    <span>{p.symbol}</span>
                    <span>{p.name}</span>
                  </span>
                  <strong className="text-stone-900 tabular-nums">
                    {(lifetimeFruits[p.type] || 0).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-mono font-bold text-xs text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                Achievements ({unlockedCount}/{achievements.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`border rounded-lg p-3 flex items-start gap-3 transition-colors ${
                    ach.unlocked
                      ? 'bg-amber-50/70 border-amber-300/80'
                      : 'bg-stone-50/80 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="text-xl select-none">{ach.asciiBadge}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono font-bold text-xs text-stone-900">{ach.title}</h4>
                      {ach.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5">{ach.description}</p>
                    <div className="mt-1.5 text-[10px] font-mono text-stone-500">
                      Status: <strong className={ach.unlocked ? 'text-emerald-700' : 'text-stone-500'}>{ach.unlocked ? 'Completed' : 'In Progress'}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions & Auto-Save Note */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {onOpenWelcomePlaque && (
                <button
                  onClick={onOpenWelcomePlaque}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-mono font-medium rounded flex items-center gap-1.5 transition-colors border border-amber-200 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Welcome Plaque</span>
                </button>
              )}
              <button
                onClick={onManualSave}
                className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-mono font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Game</span>
              </button>
              <button
                onClick={onResetGame}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-mono font-medium rounded flex items-center gap-1.5 transition-colors border border-rose-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Progress</span>
              </button>
            </div>
            <span className="text-[11px] font-mono text-stone-400">
              Auto-saves to browser storage every 5s
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-medium rounded hover:bg-stone-800 transition-colors text-xs cursor-pointer"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
