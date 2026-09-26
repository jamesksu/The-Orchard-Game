import React from 'react';
import { SoundEngine } from '../services/sound';

interface FarmhouseInteriorProps {
  onBack: () => void;
  onOpenCiderPress: () => void;
}

export const FarmhouseInterior: React.FC<FarmhouseInteriorProps> = ({
  onBack,
  onOpenCiderPress,
}) => {

  const interiorLines = [
    '_______________________________________________________________________________________________________________________________',
    '|                                                                                                                             |',
    '|                                 ||                                                             ||                           |',
    '|                                 ||                                                             ||                           |',
    '|                                 ||                                                             ||                           |',
    '|                              ___||___                                                       ___||___                        |',
    '|                             /        \\                                                     /        \\                       |',
    '|                            |__________|                                                   |__________|                      |',
    '|                                                                                                                             |',
    '|         ________________________________             _____________________             ________________________________     |',
    '|        |     [___]     (O)      [___]   |           /                     \\           |   [___]      (O)     [___]     |    |',
    '|        |================================|          /                       \\          |================================|    |',
    '|        |     (O)      (O_O)      (O)    |         /                         \\         |    (O)      (O_O)      (O)     |    |',
    '|        |================================|        /___________________________\\        |================================|    |',
    '|        |    (O_O)     [___]     (O_O)   |        |     _ _ _ _ _ _ _ _ _     |        |   (O_O)     [___]     (O_O)    |    |',
    '|        |================================|        |    |_|_|_|_|_|_|_|_|_|    |        |================================|    |',
    '|        |                                |        |___________________________|        |                                |    |',
    '|                                                                                                                             |',
    '|======================================|===============================================|======================================|',
    '|      |                        |      |   |=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|   |      |                        |      |',
    '|      |     [============]     |      |   | | | (O)   (O)   (O)   (O)   (O)   (O) |   |      |     [============]     |      |',
    '|  ()  |     |   |    |   |     |  ()  |   |=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|   |  ()  |     |   |    |   |     |  ()  |',
    '|______|_____/____\\__/____\\_____|______|   |_|_|___________________________________|_|_|______|_____/____\\__/____\\_____|______|',
    '|      |                        |      |     |                                   |     |      |                        |      |',
    '|      |                        |      |     |     [_______________________]     |     |      |                        |      |',
    '|  ()  |                        |  ()  |     |     |                       |     |     |  ()  |                        |  ()  |',
    '|______|________________________|______|_____|_____|_______________________|_____|_____|______|________________________|______|',
    '|                                                                                                                             |',
    '|                    _____________________________________________________________________________________                    |',
    '|                   /                                                                                     \\                   |',
    '|                  /                                     _ ( oOo ) _                                       \\                  |',
    '|                 /______________________________________\\___/_\\___/________________________________________\\                 |',
    '|                 |                                                                                         |                 |',
    '|                 |             [========]                 [========]                 [========]            |                 |',
    '|                 |                                                                                         |                 |',
    '|                 |_________________________________________________________________________________________|                 |',
    '|                        ||            ||                ||            ||                ||            ||                     |',
    '|                        ||            ||                ||            ||                ||            ||                     |',
    '|                      __||____________||__            __||____________||__            __||____________||__                   |',
    '|_____________________|____________________|__________|____________________|__________|____________________|__________________|',
  ];

  const doorLines = [
    '                      ',
    '                      ',
    '                      ',
    '                      ',
    '                      ',
    '                      ',
    '                      ',
    '                      ',
    "      <span class='text-[#b45309] font-bold'>.--------.</span>      ",
    "     <span class='text-[#b45309] font-bold'>/  </span><span class='text-[#ef4444] font-bold'>[EXIT]</span><span class='text-[#b45309] font-bold'>  \\</span>     ",
    "    <span class='text-[#b45309] font-bold'>/  </span><span class='text-[#f59e0b] font-bold'>ORCHARD</span><span class='text-[#b45309] font-bold'>   \\</span>    ",
    "   <span class='text-[#78350f] font-bold'>/______________\\</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>.--------.</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|  /  \\  |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>| /    \\ |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|/      \\|</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#78350f]'>|========|</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>| </span><span class='text-[#f59e0b] font-bold'>(O)</span><span class='text-[#92400e]'>    |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#78350f]'>|========|</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|\\      /|</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>| \\    / |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|  \\  /  |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|________|</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>.--------.</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|        |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|  [==]  |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|        |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#78350f]'>|========|</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|        |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|  [==]  |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|        |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|________|</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|              |</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>.--------.</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>| ====== |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>| ====== |</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f]'>|</span>  <span class='text-[#92400e]'>|________|</span>  <span class='text-[#78350f]'>|</span>   ",
    "   <span class='text-[#78350f] font-bold'>|==============|</span>   ",
    "   <span class='text-[#5c2606] font-bold'>|______________|</span>   ",
    "<span class='text-[#78350f] font-semibold'>______________________</span>",
  ];

  const handleDoorClick = () => {
    SoundEngine.playPluck(1.4);
    onBack();
  };

  const highlightInteriorLine = (line: string, idx: number): string => {
    let escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (idx === 0 || idx === interiorLines.length - 1) {
      return `<span class="text-[#78350f] font-semibold">${escaped}</span>`;
    }
    if (idx >= 2 && idx <= 7) {
      escaped = escaped
        .replace(/(\|\|)/g, '<span class="text-[#475569] font-bold">$1</span>')
        .replace(/(___\|\|___)/g, '<span class="text-[#b45309] font-bold">$1</span>')
        .replace(/(\/[ ]+\\)/g, '<span class="text-[#d97706]">$1</span>')
        .replace(/(\|__________\|)/g, '<span class="text-[#f59e0b] font-bold">$1</span>');
    }
    if (idx >= 9 && idx <= 16) {
      escaped = escaped
        .replace(/(\(O\))/g, '<span class="text-[#ef4444] font-bold">$1</span>')
        .replace(/(\(O_O\))/g, '<span class="text-[#d97706] font-bold">$1</span>')
        .replace(/(\[___\])/g, '<span class="text-[#0d9488] font-bold">$1</span>')
        .replace(/(\|_\|_\|_\|_\|_\|_\|_\|_\|_\|)/g, '<span class="text-[#ea580c] font-bold">$1</span>')
        .replace(/(_ _ _ _ _ _ _ _ _)/g, '<span class="text-[#f97316]">$1</span>');
    }
    if (idx >= 18 && idx <= 26) {
      escaped = escaped
        .replace(/(\(\))/g, '<span class="text-[#ca8a04] font-bold">$1</span>')
        .replace(/(\[============\])/g, '<span class="text-[#0284c7] font-semibold">$1</span>')
        .replace(/(\(O\))/g, '<span class="text-[#ef4444] font-bold">$1</span>')
        .replace(/(\[_______________________\])/g, '<span class="text-[#475569] font-bold">$1</span>');
    }
    if (idx >= 28 && idx <= 39) {
      escaped = escaped
        .replace(/(_ \( oOo \) _)/g, '<span class="text-[#ef4444] font-bold">$1</span>')
        .replace(/(\[========\])/g, '<span class="text-[#0284c7] font-medium">$1</span>')
        .replace(/(__\|\|____________\|\|__)/g, '<span class="text-[#5c2606] font-bold">$1</span>');
    }

    escaped = escaped
      .replace(/^(\|)/, '<span class="text-[#78350f] font-semibold">$1</span>')
      .replace(/(\|)$/, '<span class="text-[#78350f] font-semibold">$1</span>');

    return `<span class="text-[#573a1d]">${escaped}</span>`;
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="w-full bg-[#f5f2eb] p-2 sm:p-4 overflow-x-auto ascii-scroll flex justify-center items-start">
        <div className="inline-flex items-start">
          {/* Farmhouse Exit Door */}
          <div
            onClick={handleDoorClick}
            role="button"
            tabIndex={0}
            title="Farmhouse Exit Door - Click to return to the Orchard"
            className="select-none cursor-pointer inline-block text-left group hover:brightness-125 active:scale-[0.99] transition-all"
          >
            <pre
              className="font-mono leading-none select-none m-0 p-0"
              style={{
                fontSize: '0.85rem',
                lineHeight: '0.95rem',
              }}
            >
              {doorLines.map((line, idx) => (
                <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
              ))}
            </pre>
          </div>

          {/* Farmhouse Interior Room & Press */}
          <div
            onClick={onOpenCiderPress}
            role="button"
            tabIndex={0}
            title="Cider Press & Pantry - Click to open Cider Press & Pantry"
            className="inline-block text-left ml-1 select-none cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all"
          >
            <pre
              className="font-mono leading-none select-none m-0 p-0"
              style={{
                fontSize: '0.85rem',
                lineHeight: '0.95rem',
              }}
            >
              {interiorLines.map((line, idx) => (
                <div key={idx} dangerouslySetInnerHTML={{ __html: highlightInteriorLine(line, idx) }} />
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
