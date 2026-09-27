import React, { useState } from 'react';
import { SoundEngine } from '../services/sound';

interface FarmhouseInteriorProps {
  onBack: () => void;
  onOpenCiderPress: () => void;
  onOpenLivingRoom?: () => void;
  fontScale?: number;
}

export const FarmhouseInterior: React.FC<FarmhouseInteriorProps> = ({
  onBack,
  onOpenCiderPress,
  onOpenLivingRoom,
  fontScale = 1,
}) => {
  const [catPurrNotice, setCatPurrNotice] = useState<string | null>(null);

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
    '|      |                        |      |   |=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=| (  .O.  )      |                        |      |',
    '|      |     [============]     |      |   | | | (O)   (O)   (O)   (O)   (O)    \\ (O) /|      |     [============]     |      |',
    '|  ()  |     |   |    |   |     |  ()  |   |=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|= \'-----\'|  ()  |     |   |    |   |     |  ()  |',
    '|______|_____/____\\__/____\\_____|______|   |_|_|__________________________________|||__|______|_____/____\\__/____\\_____|______|',
    '|      |                        |      |     |                                 (_______)      |                        |      |',
    '|      |                        |      |     |     [_______________________]    | | | |       |                        |      |',
    '|  ()  |                        |  ()  |     |     |                       |   /\'-----\'\\  ()  |                        |  ()  |',
    '|______|________________________|______|_____|_____|__________________\\____/___| ^ _ ^ |______|________________________|______|',
    '|                              /\\_/\\                                   \\__/    |  \\_/  |====                                  |',
    '|                    _______.( =^.^= )_________________________________(..)____|       |____/_____________                    |',
    '|                   /        (")(")  \\_.~                              (__)    |  (O)  |                  \\                   |',
    '|                  /                                     _ ( oOo ) _   `--\'     \\_---_/                    \\                  |',
    '|                 /______________________________________\\___/_\\___/________________________________________\\                 |',
    '|                 |                                                                                         |                 |',
    '|                 |             [========]                 [========]                 [========]            |                 |',
    '|                 |                                                                                         |                 |',
    '|                 |_________________________________________________________________________________________|                 |',
    '|                        ||            ||                ||            ||                ||            ||                     |',
    '|                        ||            ||                ||            ||                ||            ||          HEARTH     |',
    '|                      __||____________||__            __||____________||__            __||____________||__        ====>>     |',
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

  const handleInteriorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-hearth]') || target.getAttribute('data-hearth') === 'true') {
      SoundEngine.playRustle();
      onOpenLivingRoom?.();
      return;
    }
    if (target.closest('[data-cat]') || target.getAttribute('data-cat') === 'true') {
      SoundEngine.playCatPurr();
      setCatPurrNotice('Purr... (=^..^=) ❤');
      setTimeout(() => setCatPurrNotice(null), 2500);
      return;
    }
    if (target.closest('[data-juicer]') || target.getAttribute('data-juicer') === 'true') {
      SoundEngine.playPluck(1.3);
      onOpenCiderPress();
      return;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      if (target.closest('[data-hearth]') || target.getAttribute('data-hearth') === 'true') {
        e.preventDefault();
        SoundEngine.playRustle();
        onOpenLivingRoom?.();
      } else if (target.closest('[data-juicer]') || target.getAttribute('data-juicer') === 'true') {
        e.preventDefault();
        SoundEngine.playPluck(1.3);
        onOpenCiderPress();
      } else if (target.closest('[data-cat]') || target.getAttribute('data-cat') === 'true') {
        e.preventDefault();
        SoundEngine.playCatPurr();
        setCatPurrNotice('Purr... (=^..^=) ❤');
        setTimeout(() => setCatPurrNotice(null), 2500);
      }
    }
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
    if (idx >= 27 && idx <= 29) {
      escaped = escaped
        .replace(
          /\/\\_\/\\/g,
          '<span data-cat="true" role="button" tabindex="0" title="A cozy farmhouse cat napping on the center island... (Click to pet!)" class="text-amber-700 font-bold hover:scale-110 transition-transform cursor-pointer inline-block select-none">/\\_/\\</span>'
        )
        .replace(
          /\( =\^\.\^= \)/g,
          '<span data-cat="true" role="button" tabindex="0" title="A cozy farmhouse cat napping on the center island... (Click to pet!)" class="text-amber-800 font-black hover:scale-110 transition-transform cursor-pointer inline-block select-none"><span class="text-amber-900 font-bold">(</span> <span class="text-amber-600 font-extrabold">=</span><span class="text-rose-500 font-black">^</span><span class="text-amber-900 font-black">.</span><span class="text-rose-500 font-black">^</span><span class="text-amber-600 font-extrabold">=</span> <span class="text-amber-900 font-bold">)</span></span>'
        )
        .replace(
          /\("\)\("\)/g,
          '<span data-cat="true" class="text-amber-800 font-bold cursor-pointer inline-block select-none">(")(")</span>'
        )
        .replace(
          /\\_\.~/g,
          '<span data-cat="true" role="button" tabindex="0" title="Swish swish! (Click to pet!)" class="animate-cat-tail text-amber-700 font-black cursor-pointer inline-block select-none">\\_.~</span>'
        );
    }
    if (idx >= 19 && idx <= 30) {
      escaped = escaped
        .replace(
          /\(  \.O\.  \)/g,
          '<span data-juicer="true" role="button" tabindex="0" title="Farmhouse Fruit Juicer - Click to open Farmhouse Fruit Juicer!" class="cursor-pointer inline-block transition-transform hover:scale-105 text-[#94a3b8] hover:text-sky-400 font-bold">(  <span class="text-[#ef4444] font-black">.O.</span>  )</span>'
        )
        .replace(
          /\\ \(O\) \//g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#94a3b8] font-bold">\\ <span class="text-[#f59e0b] font-black">(O)</span> /</span>'
        )
        .replace(
          /'-----'/g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#0284c7] font-bold">\'-----\'</span>'
        )
        .replace(
          /__\|\|\|__/g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#d97706] font-bold">__|||__</span>'
        )
        .replace(
          /\(_______\)/g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#64748b] font-bold">(_______)</span>'
        )
        .replace(
          /\| \| \| \|/g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#0284c7] font-bold">| | | |</span>'
        )
        .replace(
          /\/'-----'\\/g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#0284c7] font-bold">/\'-----\'\\</span>'
        )
        .replace(
          /\\____\//g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#38bdf8] font-bold">\\____/</span>'
        )
        .replace(
          /\\__\//g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#38bdf8] font-bold">\\__/</span>'
        )
        .replace(
          /\|\s+\^ _ \^\s+\|/g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#0284c7] font-bold">| <span class="text-[#f59e0b] font-black">^ _ ^</span> |</span>'
        )
        .replace(
          /\|\s+\\_\/\s+\|====/g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#0284c7] font-bold">|  <span class="text-[#ef4444] font-black">\\_/</span>  <span class="text-[#b45309] font-bold">|====</span></span>'
        )
        .replace(
          /\|\s+\|____\//g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#0284c7] font-bold">|       <span class="text-[#b45309] font-bold">|____/</span></span>'
        )
        .replace(
          /\(\.\.\)/g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#f59e0b] font-bold">(<span class="text-[#ef4444]">.</span><span class="text-[#ef4444]">.</span>)</span>'
        )
        .replace(
          /\(__\)/g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#f59e0b] font-bold">(<span class="text-[#eab308]">_</span><span class="text-[#eab308]">_</span>)</span>'
        )
        .replace(
          /\|\s+\(O\)\s+\|/g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#0284c7] font-bold">|  <span class="text-[#ef4444] font-bold">(O)</span>  |</span>'
        )
        .replace(
          /`--'/g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#38bdf8] font-bold">`--\'</span>'
        )
        .replace(
          /\\_---_\//g,
          '<span data-juicer="true" class="cursor-pointer inline-block text-[#0284c7] font-bold">\\_---_/</span>'
        );
    }
    if (idx >= 28 && idx <= 39) {
      escaped = escaped
        .replace(/(_ \( oOo \) _)/g, '<span class="text-[#ef4444] font-bold">$1</span>')
        .replace(/(\[========\])/g, '<span class="text-[#0284c7] font-medium">$1</span>')
        .replace(/(__\|\|____________\|\|__)/g, '<span class="text-[#5c2606] font-bold">$1</span>')
        .replace(
          /HEARTH/g,
          '<span data-hearth="true" role="button" tabindex="0" title="Hearth - Click to visit Living Room" class="text-amber-800 hover:text-amber-600 font-bold tracking-wider cursor-pointer inline-block transition-transform hover:scale-105 active:scale-95 select-none underline decoration-amber-600/40 hover:decoration-amber-500">HEARTH</span>'
        )
        .replace(
          /====(?:&gt;|>){2}/g,
          '<span data-hearth="true" role="button" tabindex="0" title="Hearth - Click to visit Living Room" class="text-amber-700 hover:text-amber-500 font-extrabold cursor-pointer inline-block transition-all hover:translate-x-1 active:scale-95 select-none">====&gt;&gt;</span>'
        );
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
                fontSize: `${0.85 * fontScale}rem`,
                lineHeight: `${0.95 * fontScale}rem`,
              }}
            >
              {doorLines.map((line, idx) => (
                <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
              ))}
            </pre>
          </div>

          {/* Farmhouse Interior Room */}
          <div
            onClick={handleInteriorClick}
            onKeyDown={handleKeyDown}
            role="region"
            aria-label="Farmhouse Kitchen & Hearth"
            className="relative inline-block text-left ml-1 select-none"
          >
            {catPurrNotice && (
              <div className="absolute top-[68%] left-[28%] -translate-x-1/2 -translate-y-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs font-bold px-2 py-1 rounded-md shadow-md animate-fade-in pointer-events-none z-10">
                {catPurrNotice}
              </div>
            )}
            <pre
              className="font-mono leading-none select-none m-0 p-0"
              style={{
                fontSize: `${0.85 * fontScale}rem`,
                lineHeight: `${0.95 * fontScale}rem`,
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
