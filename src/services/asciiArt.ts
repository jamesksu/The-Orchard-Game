import { Plot, FruitType } from '../types';
import { PRODUCE_CATALOG, ALL_FRUIT_TYPES } from '../constants/produce';

const TOP_BORDER = '+==========================+';
const V_BAR = '|';
const DIVIDER_LINE = '|--------------------------|';

export function renderOvergrownPlot(plot: Plot): string[] {
  const coord = `[${String.fromCharCode(65 + plot.row)}${plot.col + 1}]`;
  const header = `+==${coord}`.padEnd(27, '=') + '+';
  return [
    `<span class="text-[#8b5a2b]">${header}</span>`,
    `${V_BAR}                          ${V_BAR}`,
    `${V_BAR}<span class="text-[#4ade80]">       v          v       </span>${V_BAR}`,
    `${V_BAR}                          ${V_BAR}`,
    `${V_BAR}<span class="text-[#4ade80]">               v          </span>${V_BAR}`,
    `${V_BAR}<span class="text-[#4ade80]">      v                   </span>${V_BAR}`,
    `${V_BAR}<span class="text-[#4ade80]">           v              </span>${V_BAR}`,
    `${V_BAR}                          ${V_BAR}`,
    `${V_BAR}<span class="text-[#22c55e]">   \\v/              \\v/   </span>${V_BAR}`,
    `<span class="text-[#8b5a2b]">${DIVIDER_LINE}</span>`,
    `${V_BAR}<span class="text-stone-600 font-semibold">       Empty Plot:        </span>${V_BAR}`,
    `${V_BAR}<span class="text-[#16a34a] font-bold">   Overgrown with Weeds   </span>${V_BAR}`,
    `<span class="text-[#8b5a2b]">${TOP_BORDER}</span>`,
  ];
}

export function renderEmptyPlowedPlot(plot: Plot): string[] {
  const coord = `[${String.fromCharCode(65 + plot.row)}${plot.col + 1}]`;
  const header = `+==${coord}`.padEnd(27, '=') + '+';
  return [
    `<span class="text-[#8b5a2b]">${header}</span>`,
    `${V_BAR}                          ${V_BAR}`,
    `${V_BAR}<span class="text-[#a16207]">   ~~~~~~~~~~~~~~~~~~~~   </span>${V_BAR}`,
    `${V_BAR}<span class="text-[#78350f]">   ====================   </span>${V_BAR}`,
    `${V_BAR}                          ${V_BAR}`,
    `${V_BAR}<span class="text-emerald-600 font-bold">    [+ Tree or Bush +]    </span>${V_BAR}`,
    `${V_BAR}                          ${V_BAR}`,
    `${V_BAR}<span class="text-[#78350f]">   ====================   </span>${V_BAR}`,
    `${V_BAR}<span class="text-[#a16207]">   ~~~~~~~~~~~~~~~~~~~~   </span>${V_BAR}`,
    `${V_BAR}<span class="text-[#22c55e]">    \\v/              \\v/  </span>${V_BAR}`,
    `<span class="text-[#8b5a2b]">${DIVIDER_LINE}</span>`,
    `${V_BAR}   Plowed Fertile Plot    ${V_BAR}`,
    `<span class="text-[#8b5a2b]">${TOP_BORDER}</span>`,
  ];
}

export function renderBushPlot(plot: Plot): string[] {
  const tree = plot.tree!;
  const info = PRODUCE_CATALOG[tree.type];
  const count = tree.fruitCount;
  const coord = `[${String.fromCharCode(65 + plot.row)}${plot.col + 1}]`;
  const cropName = info.name.substring(0, 17);
  const header = `+==${coord} ${cropName}`.padEnd(27, '=') + '+';

  const hasFruit = [count >= 1, count >= 3, count >= 6, count >= 12, count >= 25, count >= 45];
  const renderFruit = (idx: number) =>
    hasFruit[idx]
      ? `<span class="${info.twText} font-bold animate-pulse">${info.asciiSymbol}</span>`
      : '<span class="text-[#15803d]">.</span>';

  const padCenter = (content: string) => {
    const pad = Math.floor((26 - content.length) / 2);
    return ' '.repeat(pad) + content + ' '.repeat(26 - content.length - pad);
  };

  const parseLine = (line: string) =>
    padCenter(line).replace(/[1-6]/g, (match) => renderFruit(Number(match) - 1));

  const bushLine = (line: string) =>
    `${V_BAR}<span class="tree-click text-[#22c55e]">${parseLine(line)}</span>${V_BAR}`;
  const trunkLine = (line: string) =>
    `${V_BAR}<span class="tree-click text-[#8b4513]">${padCenter(line)}</span>${V_BAR}`;

  const countStr = count.toString().padStart(2, ' ');
  const maxStr = tree.maxFruit.toString();
  const countColor =
    count >= tree.maxFruit
      ? 'text-amber-500 font-extrabold animate-bounce'
      : 'text-[#ef4444] font-bold';

  const statusText = `  Yield on Bush: <span class="${countColor}">${countStr}</span>/${maxStr}`;
  const rightPad = Math.max(0, 26 - (17 + countStr.length + 1 + maxStr.length));

  return [
    `<span class="text-[#8b4513]">${header}</span>`,
    `${V_BAR}                          ${V_BAR}`,
    bushLine('.-~~~~~~~~-.'),
    bushLine(".-'  1    2  '-."),
    bushLine('(  3    ,-.    4  )'),
    bushLine('(  5   (   )   6  )'),
    bushLine("'-.__ '---' __.-'"),
    bushLine("'-...........-'"),
    trunkLine('|| || ||'),
    `${V_BAR}<span class="text-[#22c55e]">  \\v/   </span><span class="tree-click text-[#8b4513]">~~~~~~~~~~</span><span class="text-[#22c55e]">   \\v/  </span>${V_BAR}`,
    `<span class="text-[#8b4513]">${DIVIDER_LINE}</span>`,
    `${V_BAR}${statusText}${' '.repeat(rightPad)}${V_BAR}`,
    `<span class="text-[#8b4513]">${TOP_BORDER}</span>`,
  ];
}

export function renderTreePlot(plot: Plot, hideFruitStats = false): string[] {
  if (!plot.tree) return renderEmptyPlowedPlot(plot);
  if (PRODUCE_CATALOG[plot.tree.type].plantForm === 'bush') {
    return renderBushPlot(plot);
  }

  const count = plot.tree.fruitCount;
  const max = plot.tree.maxFruit;
  const info = PRODUCE_CATALOG[plot.tree.type];
  const symbol = info.asciiSymbol;
  const twColor = info.twText;

  const coord = `[${String.fromCharCode(65 + plot.row)}${plot.col + 1}]`;
  const treeName = info.name.substring(0, 17);
  const header = `+==${coord} ${treeName}`.padEnd(27, '=') + '+';

  const f1 = count >= 1;
  const f2 = count >= 3;
  const f3 = count >= 6;
  const f4 = count >= 12;
  const f5 = count >= 25;
  const f6 = count >= 45;

  const rF = (has: boolean) =>
    has
      ? `<span class="${twColor} font-bold animate-pulse">${symbol}</span>`
      : '<span class="text-[#15803d]">.</span>';

  const countStr = count.toString().padStart(2, ' ');
  const maxStr = max.toString();
  const countColor =
    count >= max ? 'text-amber-500 font-extrabold animate-bounce' : 'text-[#ef4444] font-bold';

  const statusText = `${V_BAR}  Fruit on Tree: <span class="${countColor}">${countStr}</span>/${maxStr}`;
  const rightPad = Math.max(0, 26 - (17 + countStr.length + 1 + maxStr.length));

  return [
    `<span class="text-[#8b4513]">${header}</span>`,
    `${V_BAR}<span class="tree-click text-[#22c55e]">           _.-.           </span>${V_BAR}`,
    `${V_BAR}<span class="tree-click text-[#22c55e]">       .-.( ${rF(f1)}  )-.        </span>${V_BAR}`,
    `${V_BAR}<span class="tree-click text-[#22c55e]">      (  ${rF(f2)}  .-.  ${rF(f3)} )      </span>${V_BAR}`,
    `${V_BAR}<span class="tree-click text-[#22c55e]">     ( ${rF(f4)} .-( ${rF(f5)} )-. ${rF(f6)} )    </span>${V_BAR}`,
    `${V_BAR}<span class="tree-click text-[#22c55e]">      \`-(   ${rF(f1)}    )-'      </span>${V_BAR}`,
    `${V_BAR}<span class="tree-click text-[#22c55e]">         \`-\\||/-'         </span>${V_BAR}`,
    `${V_BAR}<span class="tree-click text-[#8b4513]">           ||||           </span>${V_BAR}`,
    `${V_BAR}<span class="tree-click text-[#8b4513]">          _||||_          </span>${V_BAR}`,
    `${V_BAR}<span class="text-[#22c55e]">   \\v/   </span><span class="tree-click text-[#8b4513]">/______\\</span><span class="text-[#22c55e]">   \\v/   </span>${V_BAR}`,
    `<span class="text-[#8b4513]">${DIVIDER_LINE}</span>`,
    hideFruitStats
      ? `${V_BAR}${' '.repeat(26)}${V_BAR}`
      : `${statusText}${' '.repeat(rightPad)}${V_BAR}`,
    `<span class="text-[#8b4513]">${TOP_BORDER}</span>`,
  ];
}

export function renderFarmhouse(smokeFrame = 0, showLadder = true): string[] {
  const weedDark = 'text-[#15803d] font-semibold';
  const weedMid = 'text-[#16a34a] font-semibold';
  const weedBright = 'text-[#22c55e] font-semibold';

  const smoke = [
    [
      "    <span class='text-slate-400'>             (   )        </span>",
      "    <span class='text-slate-400'>            (      )      </span>",
      "    <span class='text-slate-400'>             (    )       </span>",
    ],
    [
      "    <span class='text-slate-400'>            (    )        </span>",
      "    <span class='text-slate-400'>             (     )      </span>",
      "    <span class='text-slate-400'>            (      )      </span>",
    ],
    [
      "    <span class='text-slate-400'>              ( )         </span>",
      "    <span class='text-slate-400'>            (     )       </span>",
      "    <span class='text-slate-400'>             (   )        </span>",
    ],
  ];
  const s = smoke[smokeFrame % smoke.length];

  const ladder1 = "    <span class='text-[#b45309]'>|  |      </span><span class='text-[#5c2606]'>_----_</span><span class='text-[#b45309]'>      |  |</span>";

  const ladder2 = showLadder
    ? " <span class='text-[#ca8a04] font-bold'>/=/</span><span class='text-[#b45309]'>|  |     </span><span class='text-[#5c2606]'>|      |</span><span class='text-[#b45309]'>     |  |</span>"
    : "    <span class='text-[#b45309]'>|  |     </span><span class='text-[#5c2606]'>|      |</span><span class='text-[#b45309]'>     |  |</span>";

  const ladder3 = showLadder
    ? "<span class='text-[#ca8a04] font-bold'>/=/</span> <span class='text-[#b45309]'>|  |     </span><span class='text-[#5c2606]'>| [  ] |</span><span class='text-[#b45309]'>     |  |</span>"
    : "    <span class='text-[#b45309]'>|  |     </span><span class='text-[#5c2606]'>| [  ] |</span><span class='text-[#b45309]'>     |  |</span>";

  const ladder4 = showLadder
    ? "<span class='text-[#ca8a04] font-bold'>/=/</span> <span class='text-[#b45309]'>|__|_____</span><span class='text-[#5c2606]'>|______|</span><span class='text-[#b45309]'>_____|__|</span>"
    : "    <span class='text-[#b45309]'>|__|_____</span><span class='text-[#5c2606]'>|______|</span><span class='text-[#b45309]'>_____|__|</span>";

  const ladder2WithWeed = `${ladder2}  <span class="${weedBright}">\\/</span>`;
  const ladder3WithWeed = `${ladder3}   <span class="${weedMid}">(\\|/)</span>`;
  const ladder4WithWeed = `${ladder4} <span class="${weedDark}">/|\\|/</span>`;
  const groundWithWeed = `                              <span class="${weedBright}">\\v//v/</span>`;

  return [
    s[0],
    s[1],
    s[2],
    "    <span class='text-[#b45309]'>              ||||        </span>",
    "    <span class='text-[#475569]'>    /^^^^^^^^^^^^^^^^\\    </span>",
    "    <span class='text-[#475569]'>   /__________________\\   </span>",
    "    <span class='text-[#b45309]'>  /|  </span><span class='text-[#5c2606]'>[==]</span><span class='text-[#b45309]'>      </span><span class='text-[#5c2606]'>[==]</span><span class='text-[#b45309]'>  |\\  </span>",
    "    <span class='text-[#b45309]'> / |                  | \\ </span>",
    "    <span class='text-[#b45309]'>/  |                  |  \\</span>",
    "    <span class='text-[#b45309]'>|__|  </span><span class='text-[#5c2606]'>[==]</span><span class='text-[#b45309]'>      </span><span class='text-[#5c2606]'>[==]</span><span class='text-[#b45309]'>  |__|</span>",
    "    <span class='text-[#b45309]'>|  |                  |  |</span>",
    "    <span class='text-[#b45309]'>|  |  </span><span class='text-[#5c2606]'>[==]</span><span class='text-[#b45309]'>      </span><span class='text-[#5c2606]'>[==]</span><span class='text-[#b45309]'>  |  |</span>",
    "    <span class='text-[#b45309]'>|  |                  |  |</span>",
    ladder1,
    ladder2WithWeed,
    ladder3WithWeed,
    ladder4WithWeed,
    groundWithWeed,
  ];
}

export function renderSwingset(swingFrame = 0): string[] {
  const frameColor = 'text-[#78350f]';
  const ropeColor = 'text-[#64748b]';
  const seatColor = 'text-[#b45309] font-bold';
  const grassColor = 'text-[#22c55e]';

  const weedDark = 'text-[#15803d] font-semibold';
  const weedMid = 'text-[#16a34a] font-semibold';
  const weedBright = 'text-[#22c55e] font-semibold';

  // 4-phase sway cycle: 0 = center, 1 = sway right (\), 2 = center, 3 = sway left (/)
  const f = Math.abs(swingFrame) % 4;

  if (f === 1) {
    // Sway right (\  \)
    return [
      '                                 ',
      '                                 ',
      '                                 ',
      `             <span class="${frameColor}">______________</span>      `,
      `           <span class="${frameColor}">/================\\</span>    `,
      `          <span class="${frameColor}">//</span>  <span class="${ropeColor}">\\  \\    \\  \\</span>  <span class="${frameColor}">\\\\</span>   `,
      `         <span class="${frameColor}">//</span>    <span class="${ropeColor}">\\  \\    \\  \\</span>  <span class="${frameColor}">\\\\</span>  `,
      `        <span class="${frameColor}">//</span>      <span class="${ropeColor}">\\  \\    \\  \\</span>  <span class="${frameColor}">\\\\</span> `,
      `       <span class="${frameColor}">//</span>      <span class="${seatColor}">[====]  [====]</span>  <span class="${frameColor}">\\\\</span>`,
      `       <span class="${frameColor}">||</span>                      <span class="${frameColor}">||</span>  <span class="${weedBright}">\\/</span>`,
      `<span class="${weedMid}">(\\|/)</span>  <span class="${frameColor}">||</span>                      <span class="${frameColor}">||</span>   <span class="${weedMid}">(\\|/)</span>`,
      `<span class="${weedDark}">/|\\|/</span>  <span class="${frameColor}">/========================\\</span> <span class="${weedDark}">/|\\|/</span>`,
      ` <span class="${weedBright}">\\w/</span>                  <span class="${grassColor}">\\v/</span>         <span class="${weedBright}">\\v//v/</span>`,
    ];
  }

  if (f === 3) {
    // Sway left (/  /)
    return [
      '                                 ',
      '                                 ',
      '                                 ',
      `             <span class="${frameColor}">______________</span>      `,
      `           <span class="${frameColor}">/================\\</span>    `,
      `          <span class="${frameColor}">//</span>  <span class="${ropeColor}">/  /    /  /</span>  <span class="${frameColor}">\\\\</span>   `,
      `         <span class="${frameColor}">//</span>  <span class="${ropeColor}">/  /    /  /</span>    <span class="${frameColor}">\\\\</span>  `,
      `        <span class="${frameColor}">//</span>  <span class="${ropeColor}">/  /    /  /</span>      <span class="${frameColor}">\\\\</span> `,
      `       <span class="${frameColor}">//</span>  <span class="${seatColor}">[====]  [====]</span>      <span class="${frameColor}">\\\\</span>`,
      `       <span class="${frameColor}">||</span>                      <span class="${frameColor}">||</span>  <span class="${weedBright}">\\/</span>`,
      `<span class="${weedMid}">(\\|/)</span>  <span class="${frameColor}">||</span>                      <span class="${frameColor}">||</span>   <span class="${weedMid}">(\\|/)</span>`,
      `<span class="${weedDark}">/|\\|/</span>  <span class="${frameColor}">/========================\\</span> <span class="${weedDark}">/|\\|/</span>`,
      ` <span class="${weedBright}">\\w/</span>                  <span class="${grassColor}">\\v/</span>         <span class="${weedBright}">\\v//v/</span>`,
    ];
  }

  // Center resting state (|  |)
  return [
    '                                 ',
    '                                 ',
    '                                 ',
    `             <span class="${frameColor}">______________</span>      `,
    `           <span class="${frameColor}">/================\\</span>    `,
    `          <span class="${frameColor}">//</span>  <span class="${ropeColor}">|  |    |  |</span>  <span class="${frameColor}">\\\\</span>   `,
    `         <span class="${frameColor}">//</span>   <span class="${ropeColor}">|  |    |  |</span>   <span class="${frameColor}">\\\\</span>  `,
    `        <span class="${frameColor}">//</span>    <span class="${ropeColor}">|  |    |  |</span>    <span class="${frameColor}">\\\\</span> `,
    `       <span class="${frameColor}">//</span>    <span class="${seatColor}">[====]  [====]</span>    <span class="${frameColor}">\\\\</span>`,
    `       <span class="${frameColor}">||</span>                      <span class="${frameColor}">||</span>  <span class="${weedBright}">\\/</span>`,
    `<span class="${weedMid}">(\\|/)</span>  <span class="${frameColor}">||</span>                      <span class="${frameColor}">||</span>   <span class="${weedMid}">(\\|/)</span>`,
    `<span class="${weedDark}">/|\\|/</span>  <span class="${frameColor}">/========================\\</span> <span class="${weedDark}">/|\\|/</span>`,
    ` <span class="${weedBright}">\\w/</span>                  <span class="${grassColor}">\\v/</span>         <span class="${weedBright}">\\v//v/</span>`,
  ];
}

export function renderTruck(): string[] {
  const truckBody = 'text-[#1d4ed8] font-semibold';
  const truckDark = 'text-[#1e3a8a] font-semibold';
  const windowColor = 'text-[#7dd3fc]';
  const trailerWood = 'text-[#78350f]';
  const crateAmber = 'text-[#d97706] font-bold';
  const metalSilver = 'text-[#94a3b8] font-bold';
  const wheelDark = 'text-[#1e293b] font-bold';
  const hubRed = 'text-[#ef4444] font-bold';
  const lightYellow = 'text-[#facc15] font-bold';

  const weedDark = 'text-[#15803d] font-semibold';
  const weedMid = 'text-[#16a34a] font-semibold';
  const weedBright = 'text-[#22c55e] font-semibold';

  return [
    '                                          ',
    '                                          ',
    `              <span class="${truckBody}">.-----.</span>`,
    `             <span class="${truckBody}">/ </span><span class="${windowColor}">_  __</span><span class="${truckBody}"> \\</span>`,
    `            <span class="${truckBody}">/ </span><span class="${windowColor}">/ | | \\</span><span class="${truckBody}"> '-.</span><span class="${trailerWood}">================.</span>`,
    `   <span class="${metalSilver}">___mm</span> <span class="${truckBody}">__/ /__| |_/_| |</span> <span class="${crateAmber}">[=] [=] [=] [=]</span><span class="${trailerWood}">|</span>`,
    `  <span class="${metalSilver}">[==|</span><span class="${truckBody}">_________v______| |</span><span class="${trailerWood}">----------------|</span>`,
    `  <span class="${truckBody}">| </span><span class="${lightYellow}">[]</span><span class="${truckBody}">                | |</span> <span class="${crateAmber}">[=] [=] [=] [=]</span><span class="${trailerWood}">|</span>`,
    `  <span class="${truckBody}">'---'</span><span class="${truckDark}">_..-------..__</span> <span class="${truckBody}">|_|</span><span class="${trailerWood}">================'</span>`,
    `   <span class="${metalSilver}">\\_/</span>  <span class="${wheelDark}">/        \\</span>   <span class="${metalSilver}">[====]</span>   <span class="${wheelDark}">/        \\</span>  <span class="${weedBright}">\\/</span>`,
    `<span class="${weedMid}">(\\|/)</span>  <span class="${wheelDark}">|  .-</span><span class="${hubRed}">o</span><span class="${wheelDark}">-.  |</span>            <span class="${wheelDark}">|  .-</span><span class="${hubRed}">o</span><span class="${wheelDark}">-.  |</span>   <span class="${weedMid}">(\\|/)</span>`,
    `<span class="${weedDark}">/|\\|/</span>  <span class="${wheelDark}">\\ '-----' /</span>            <span class="${wheelDark}">\\ '-----' /</span> <span class="${weedDark}">/|\\|/</span>`,
    ` <span class="${weedBright}">\\v/</span>    <span class="${wheelDark}">'-------'</span>              <span class="${wheelDark}">'------'</span>   <span class="${weedBright}">\\v//v/</span>`,
  ];
}

function wrapWords(text: string, maxLen: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxLen && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function renderBoxSign(
  title: string,
  paragraphs: string[],
  contentWidth = 52,
  centerText = false
): string[] {
  const outer = 'text-[#78350f]';
  const inner = 'text-[#92400e]';
  const post = 'text-[#78716c] font-bold';
  const nail = 'text-[#d97706] font-bold';
  const accent = 'text-[#b45309] font-bold';
  const body = 'text-stone-800 font-medium';

  const makeRow = (formatted: string, plainText: string, center = false) => {
    const pad = Math.max(0, contentWidth - plainText.length);
    const leftPad = center ? Math.floor(pad / 2) : 0;
    const rightPad = pad - leftPad;
    return (
      `<span class="${outer}">|</span> <span class="${inner}">|</span>  ` +
      ' '.repeat(leftPad) +
      formatted +
      ' '.repeat(rightPad) +
      `  <span class="${inner}">|</span> <span class="${outer}">|</span>`
    );
  };

  const lines = [
    `    <span class="${post}">| |</span>` + ' '.repeat(contentWidth - 4) + `<span class="${post}">| |</span>    `,
    `    <span class="${post}">| |</span>` + ' '.repeat(contentWidth - 4) + `<span class="${post}">| |</span>    `,
    `   <span class="${nail}">( o )</span>` + ' '.repeat(contentWidth - 6) + `<span class="${nail}">( o )</span>   `,
    `<span class="${outer}">.${'='.repeat(contentWidth + 8)}.</span>`,
    `<span class="${outer}">|</span> <span class="${inner}">.${'-'.repeat(contentWidth + 6)}.</span> <span class="${outer}">|</span>`,
    makeRow('', ''),
  ];

  if (title) {
    lines.push(
      makeRow(`<span class="${accent}">${title}</span>`, title, true),
      makeRow('', '')
    );
  }

  paragraphs.forEach((p, idx) => {
    const wrapped = wrapWords(p, contentWidth);
    for (const w of wrapped) {
      lines.push(makeRow(`<span class="${body}">${w}</span>`, w, centerText));
    }
    if (idx < paragraphs.length - 1) {
      lines.push(makeRow('', ''));
    }
  });

  lines.push(
    makeRow('', ''),
    makeRow(`<span class="${accent}">~ * ~</span>`, '~ * ~', true),
    makeRow('', ''),
    `<span class="${outer}">|</span> <span class="${inner}">'${'-'.repeat(contentWidth + 6)}'</span> <span class="${outer}">|</span>`,
    `<span class="${outer}">'${'='.repeat(contentWidth + 8)}'</span>`
  );

  return lines;
}

export function renderWelcomePlaque(): string[] {
  return renderBoxSign(
    'THE ORCHARD',
    [
      'Hello, traveler.',
      'As you make your way down the lonely road, you notice an old farmhouse and a weathered roadside stand sitting just beyond the ditch.',
      'A beat-up truck rests beside the house, its tires nearly swallowed by the weeds that have grown around them. Nearby, a rusty swingset creaks softly in the breeze, though there’s no one around to hear it.',
      'The property stretches out toward the horizon, fields running for what seems like miles. There are no other houses. No cars. No people.',
      'Nothing has disturbed this place in years. Except for one thing. A large apple tree grows beside the farmhouse, its branches heavy against the sky.',
      'You slow down. Something about the place catches your attention.',
      'You decide to take a look around.',
    ],
    58
  );
}

export function renderUnreachableApplesPlaque(): string[] {
  return renderBoxSign(
    '',
    ["Those apples look delicious, but they can't be reached!"],
    58,
    true
  );
}

export function renderTruckKeysMissingPlaque(): string[] {
  return renderBoxSign(
    '',
    ['Keys are missing... Not sure it would start anyway.'],
    58,
    true
  );
}

export function renderMarketStandWelcomePlaque(): string[] {
  return renderBoxSign(
    '',
    [
      'The Roadside Stand has seen better days, but it should do for now.',
      'Anything you collect will be placed for sale on the shelf.',
    ],
    58,
    true
  );
}

export function renderFiftyDollarMilestonePlaque(): string[] {
  return renderBoxSign(
    '',
    [
      'Congratulations! You have officially commandeered this property and can call it your own, for now.',
      'Click on the apples to edit the details and start selling to passersby. Who knows maybe you’ll sell $1,000 in Apples!',
    ],
    58,
    true
  );
}

export function renderResetConfirmation(): string[] {
  const outer = 'text-[#78350f]';
  const inner = 'text-[#92400e]';
  const post = 'text-[#78716c] font-bold';
  const nail = 'text-[#d97706] font-bold';
  const warn = 'text-[#dc2626] font-bold';
  const body = 'text-stone-800 font-medium';
  const accent = 'text-[#b45309] font-bold';

  const makeRow = (content: string, plainLen: string) => {
    const pad = Math.max(0, 52 - plainLen.length);
    const left = Math.floor(pad / 2);
    const right = pad - left;
    return (
      `<span class="${outer}">|</span> <span class="${inner}">|</span>  ` +
      ' '.repeat(left) +
      content +
      ' '.repeat(right) +
      `  <span class="${inner}">|</span> <span class="${outer}">|</span>`
    );
  };

  return [
    `    <span class="${post}">| |</span>` + ' '.repeat(48) + `<span class="${post}">| |</span>    `,
    `    <span class="${post}">| |</span>` + ' '.repeat(48) + `<span class="${post}">| |</span>    `,
    `   <span class="${nail}">( o )</span>` + ' '.repeat(46) + `<span class="${nail}">( o )</span>   `,
    `<span class="${outer}">.============================================================.</span>`,
    `<span class="${outer}">|</span> <span class="${inner}">.--------------------------------------------------------.</span> <span class="${outer}">|</span>`,
    makeRow('', ''),
    makeRow(`<span class="${warn}">RESET GAME PROGRESS</span>`, 'RESET GAME PROGRESS'),
    makeRow('', ''),
    makeRow(
      `<span class="${body}">This will reset the game progress.</span>`,
      'This will reset the game progress.'
    ),
    makeRow(
      `<span class="${body}">Are you sure you want to reset the game?</span>`,
      'Are you sure you want to reset the game?'
    ),
    makeRow('', ''),
    makeRow(`<span class="${accent}">~ * ~</span>`, '~ * ~'),
    makeRow('', ''),
    `<span class="${outer}">|</span> <span class="${inner}">'--------------------------------------------------------'</span> <span class="${outer}">|</span>`,
    `<span class="${outer}">'============================================================'</span>`,
  ];
}

export function renderProducePriceSign(
  name: string,
  symbol: string,
  priceFormatted: string,
  autoSellActive: boolean,
  rateText?: string,
  demandInfo?: string,
  inventoryCount?: number
): string[] {
  const outer = 'text-[#78350f]';
  const inner = 'text-[#92400e]';
  const post = 'text-[#78716c] font-bold';
  const nail = 'text-[#d97706] font-bold';
  const titleColor = 'text-[#b45309] font-bold';
  const body = 'text-stone-800 font-medium';
  const statusColor = autoSellActive ? 'text-[#16a34a] font-bold' : 'text-[#b91c1c] font-bold';
  const demandColor = 'text-amber-800 font-bold';
  const rateColor = 'text-emerald-700 font-bold';

  const width = 52;
  const makeRow = (content: string, plain: string) => {
    const pad = Math.max(0, width - plain.length);
    const left = Math.floor(pad / 2);
    const right = pad - left;
    return (
      `<span class="${outer}">|</span> <span class="${inner}">|</span>  ` +
      ' '.repeat(left) +
      content +
      ' '.repeat(right) +
      `  <span class="${inner}">|</span> <span class="${outer}">|</span>`
    );
  };

  const plainTitle = `${symbol} ${name.toUpperCase()} ${symbol}`;
  const formattedTitle = `<span class="${titleColor}">${symbol} ${name.toUpperCase()} ${symbol}</span>`;

  const minusBtn = `<span data-action="decrease-price" role="button" tabindex="0" title="Decrease price by $0.50" class="cursor-pointer hover:brightness-125 inline-block select-none group font-bold"><span class="${body} group-hover:text-amber-800">[ </span><span class="text-amber-900 group-hover:underline underline decoration-dotted font-bold">-</span><span class="${body} group-hover:text-amber-800"> ]</span></span>`;
  const plusBtn = `<span data-action="increase-price" role="button" tabindex="0" title="Increase price by $0.50" class="cursor-pointer hover:brightness-125 inline-block select-none group font-bold"><span class="${body} group-hover:text-amber-800">[ </span><span class="text-amber-900 group-hover:underline underline decoration-dotted font-bold">+</span><span class="${body} group-hover:text-amber-800"> ]</span></span>`;

  const plainPrice = `Current Price: [ - ] ${priceFormatted} [ + ]`;
  const formattedPrice = `<span class="${body}">Current Price: </span>${minusBtn} <strong class="text-emerald-700 font-bold">${priceFormatted}</strong> ${plusBtn}`;

  const inventoryText = typeof inventoryCount === 'number' ? inventoryCount.toString() : '0';
  const plainInventory = `In Inventory: ${inventoryText}`;
  const formattedInventory = `<span class="${body}">In Inventory: <strong class="text-emerald-700 font-bold">${inventoryText}</strong></span>`;

  const autoStatusText = autoSellActive ? 'ENABLED' : 'OFF';
  const autoBracketBtn = `<span data-action="toggle-auto-sell" role="button" tabindex="0" title="Click to ${autoSellActive ? 'turn off' : 'turn on'} auto-sell" class="cursor-pointer hover:brightness-125 inline-block select-none group"><span class="${body} group-hover:text-amber-800">[ </span><span class="${statusColor} group-hover:underline underline decoration-dotted font-bold">${autoStatusText}</span><span class="${body} group-hover:text-amber-800"> ]</span></span>`;

  const plainAuto = autoSellActive && rateText
    ? `Auto-Sell: [ ${autoStatusText} ] (${rateText})`
    : `Auto-Sell: [ ${autoStatusText} ]`;
  const formattedAuto = autoSellActive && rateText
    ? `<span class="${body}">Auto-Sell: </span>${autoBracketBtn}<span class="${body}"> (</span><span class="${rateColor}">${rateText}</span><span class="${body}">)</span>`
    : `<span class="${body}">Auto-Sell: </span>${autoBracketBtn}`;

  const plainDemand = demandInfo ? `Demand: ${demandInfo}` : '';
  const formattedDemand = demandInfo
    ? `<span class="${body}">Demand: </span><span class="${demandColor}">${demandInfo}</span>`
    : '';

  return [
    `    <span class="${post}">| |</span>` + ' '.repeat(48) + `<span class="${post}">| |</span>    `,
    `    <span class="${post}">| |</span>` + ' '.repeat(48) + `<span class="${post}">| |</span>    `,
    `   <span class="${nail}">( o )</span>` + ' '.repeat(46) + `<span class="${nail}">( o )</span>   `,
    `<span class="${outer}">.============================================================.</span>`,
    `<span class="${outer}">|</span> <span class="${inner}">.--------------------------------------------------------.</span> <span class="${outer}">|</span>`,
    makeRow('', ''),
    makeRow(formattedTitle, plainTitle),
    makeRow('', ''),
    makeRow(formattedPrice, plainPrice),
    makeRow(formattedInventory, plainInventory),
    makeRow(formattedAuto, plainAuto),
    plainDemand ? makeRow(formattedDemand, plainDemand) : makeRow('', ''),
    makeRow('', ''),
    makeRow(`<span class="${titleColor}">~ * ~</span>`, '~ * ~'),
    makeRow('', ''),
    `<span class="${outer}">|</span> <span class="${inner}">'--------------------------------------------------------'</span> <span class="${outer}">|</span>`,
    `<span class="${outer}">'============================================================'</span>`,
  ];
}

// Stalls & Roadside Stand ASCII generator
export const STALLS_PER_ROW = 4;
export const STALL_CONTENT_WIDTH = 15;
const WOOD_BORDER_COLOR = 'text-[#78350f]';
const LEAF_GREEN = '#22c55e';

export const STAND_ROOF_LINES = [
  '                     _____________//________________________________________\\\\\\\\_________',
  '                    /_/  \\__//  \\__//  \\__//  \\__//  \\__//  \\__//  \\__//  \\__//  \\__/_  \\',
  '                   /  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //   \\  \\',
  '                  /====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/=====\\',
  '                 /   __    __    __    __    __    __    __    __    __    __    __    __  \\',
  '                /___/  \\__/  \\__/  \\__/  \\__/  \\__/  \\__/  \\__/  \\__/  \\__/  \\__/  \\__/  \\__\\',
  '               /____\\__/__\\__/__\\__/__\\__/__\\__/__\\__/__\\__/__\\__/__\\__/__\\__/__\\__/__\\__/__ \\',
  '              |  (o)   (o)   (o)   (o)   (o)   (o)   (o)   (o)   (o)   (o)   (o)   (o)       |',
  '              |______________________________________________________________________________|',
  '              |===/ /===\\ \\===/ /===\\ \\===/ /===\\ \\===/ /===\\ \\===/ /===\\ \\===/ /===\\ \\===/ /|',
  '              |__/_/_____\\_/__/_/_____\\_/__/_/_____\\_/__/_/_____\\_/__/_/_____\\_/__/_/_____\\_/|',
  '              (______________________________________________________________________________)',
  '               ||  |                                                                    |  ||',
  '        .------||--|  .--------------------------------------------------------------.  |--||------.',
  '       / ===== ||  |  |                                                              |  |  || ===== \\',
  '      / [OPEN] ||  |  |                   Fresh - Organic - Local                    |  |  || [EST.] \\',
  '     /    ||   ||  |  \'--------------------------------------------------------------\'  |  || [2018]  \\',
  '    /     ||   ||  |         \\   |   /                       _o_  ~ ~                   |  ||  ||      \\',
  '    |=====||===||==|        -- ( O ) --                       /   \\   `                 |==||==||======|',
  '    |     ||   ||  |         /   |   \\                       |_____| [HONEY]            |  ||  ||      |',
  '    |     ||   ||  |                                                                    |  ||  ||      |',
  '    |_____||___||__|____________________________________________________________________|__||__||______|',
  '    |                                                                                                  |',
  '    |  #-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-  |',
  '    |==================================================================================================|',
];

export const STAND_BASE_LINES = [
  '    | [][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][] |',
  '    | |_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_||',
  '    | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | ||',
  '    |===|============================================================================================|=|',
  '       /|                                                                                            |\\',
  '      / |  [o]                         ==============================                          [o]   | \\',
  '     /  |                                                                                            |  \\',
  "    '---|--------------------------------------------------------------------------------------------|---'",
  '        |  |__                                                                                  |__  |',
  '        |__|  |                                                                                 |  |_|',
];

export const STALL_ART_TEMPLATES: Record<FruitType, { lines: string[]; accent?: string }> = {
  apple: {
    lines: ['{a}` .   ` .{/}', '( Q ) ( Q )', '( Q ) ( Q )'],
    accent: '#78716c',
  },
  pear: {
    lines: ['  {l},{/}       {l},{/}  ', '  ( )   ( )  ', ' (___) (___) '],
  },
  cherry: {
    lines: ['{l}/|\\   /|\\{/}', '( o ) ( o )', '\\_/   \\_/'],
  },
  plum: {
    lines: [' {l}\\|{/}     {l}|/{/} ', ' ( * ) ( * ) ', "  '-'   '-'  "],
  },
  lemon: {
    lines: [' {l}\\{/}       {l}/{/} ', '( 0 ) ( 0 )', " '-'   '-' "],
  },
  honeycrisp: {
    lines: [' {l}\\|/{/}   {l}\\|/{/} ', '( $ ) ( $ )', " '-'   '-' "],
  },
  peaches: {
    lines: ['{l}/\\{/}     {l}/\\{/}', '( o ) ( o )', '\\__/   \\__/'],
  },
  berries: {
    lines: ['o o   o o', '( o ) ( o )', '\\___/ \\___/'],
  },
  tomatoes: {
    lines: ['{l}_o_{/}   {l}_o_{/}', '( o ) ( o )', "'-'   '-'"],
  },
  carrots: {
    lines: ['{l}\\V/{/}   {l}\\V/{/}', '/ \\   / \\', '/   \\ /   \\'],
  },
  corn: {
    lines: ['|X|   |X|', '//|\\\\ //|\\\\', '\\\\|// \\\\|//'],
  },
  potatoes: {
    lines: ['  .-.   .-.  ', ' (o o) (o o) ', "  '-'   '-'  "],
  },
  onions: {
    lines: ['  {l}\\|/{/}   {l}\\|/{/}  ', ' ( ~ ) ( ~ ) ', '  \\_/   \\_/  '],
  },
  pumpkins: {
    lines: ['{l}.---.{/}', '/ /|\\ \\', '| (   ) |'],
  },
  watermelon: {
    lines: [' .-=====-. ', '( {a}o o o o{/} )', " '-=====-' "],
    accent: '#ef4444',
  },
  honey: {
    lines: [' {a}_o_{/}   {a}_o_{/} ', '[H] [H] [H]', "'-' '-' '-'"],
    accent: '#f59e0b',
  },
};

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const spanClass = (cls: string, txt: string) => `<span class="${cls}">${esc(txt)}</span>`;
const spanStyle = (style: string, txt: string) => `<span style="${style}">${esc(txt)}</span>`;

function formatPriceTag(price: number, unit: string, width: number): string {
  let tag = `${price % 1 === 0 ? `$${price}.00` : `$${price.toFixed(2)}`} ${unit}`.trim();
  if (tag.length > width) tag = `$${Math.round(price)} ${unit}`.trim();
  if (tag.length > width) tag = `$${price}`.slice(0, width);
  const pad = Math.max(0, width - tag.length);
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return ' '.repeat(left) + tag + ' '.repeat(right);
}

export function highlightRoofLine(line: string, index: number): string {
  let s = esc(line);
  if (index === 0) {
    s = s
      .replaceAll('//', '<span class="text-[#ca8a04] font-bold animate-bird-left">//</span>')
      .replaceAll('\\\\', '<span class="text-[#ca8a04] font-bold animate-bird-right">\\\\</span>');
    return `<span class="text-[#b45309]">${s}</span>`;
  }
  if (index >= 1 && index <= 6) {
    s = s.replaceAll(
      '/====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/=====\\',
      '<span class="text-[#78350f] font-bold">/====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/====\\/=====\\</span>'
    );
    return `<span class="text-[#b45309]">${s}</span>`;
  }
  if (index >= 7 && index <= 12) {
    s = s
      .replaceAll('(o)', '<span class="text-[#f59e0b] font-bold animate-pulse">(o)</span>')
      .replaceAll('/ /', '<span class="text-[#dc2626] font-bold">/ /</span>')
      .replaceAll('\\ \\', '<span class="text-[#fef08a] font-bold">\\ \\</span>');
    return `<span class="text-[#78350f]">${s}</span>`;
  }
  if (index >= 13 && index <= 21) {
    s = s
      .replaceAll(
        'Fresh - Organic - Local',
        '<span class="text-emerald-700 font-bold">Fresh - Organic - Local</span>'
      )
      .replaceAll(
        '[OPEN]',
        '<span class="text-[#16a34a] font-extrabold animate-pulse cursor-pointer hover:underline">[OPEN]</span>'
      )
      .replaceAll('[EST.]', '<span class="text-stone-500 font-bold">[EST.]</span>')
      .replaceAll('[2018]', '<span class="text-stone-600 font-bold">[2018]</span>')
      .replaceAll('-- ( O ) --', '<span class="text-[#f59e0b] font-bold">-- ( O ) --</span>')
      .replaceAll('[HONEY]', '<span class="text-[#d97706] font-extrabold">[HONEY]</span>')
      .replaceAll('_o_', '<span class="text-[#d97706] font-bold">_o_</span>');
    return `<span class="text-[#78350f]">${s}</span>`;
  }
  if (index >= 22 && index <= 24) {
    s = s.replaceAll(
      '#-#' + '-#'.repeat(47),
      '<span class="text-amber-800 font-bold">#-#' + '-#'.repeat(47) + '</span>'
    );
    return `<span class="text-[#78350f]">${s}</span>`;
  }
  if (index >= 47) {
    s = s
      .replaceAll('[o]', '<span class="text-[#f59e0b] font-bold animate-pulse">[o]</span>')
      .replaceAll('==============================', '<span class="text-[#b45309] font-bold">==============================</span>');
    return `<span class="text-[#78350f]">${s}</span>`;
  }
  return `<span class="text-[#78350f]">${s}</span>`;
}

function parseAndPadStallLine(raw: string, mainColor: string, accentColor: string): string {
  const stripped = raw.replace(/\{(?:a|l|\/)\}/g, '');
  const leftPad = Math.floor((STALL_CONTENT_WIDTH - stripped.length) / 2);
  const rightPad = STALL_CONTENT_WIDTH - stripped.length - leftPad;

  const parts: string[] = [];
  let cur = 0;
  const re = /\{(a|l)\}(.*?)\{\/\}/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(raw))) {
    if (match.index > cur) {
      parts.push(spanStyle(`color:${mainColor};font-weight:700`, raw.slice(cur, match.index)));
    }
    const color = match[1] === 'l' ? LEAF_GREEN : accentColor;
    parts.push(spanStyle(`color:${color};font-weight:700`, match[2]));
    cur = match.index + match[0].length;
  }
  if (cur < raw.length) {
    parts.push(spanStyle(`color:${mainColor};font-weight:700`, raw.slice(cur)));
  }

  return ' '.repeat(leftPad) + parts.join('') + ' '.repeat(rightPad);
}

function buildEmptyStallBlock(): string[] {
  const line = (l: string, r: string, fill: string) =>
    `<span class="${WOOD_BORDER_COLOR} opacity-50">${l}${fill.repeat(STALL_CONTENT_WIDTH)}${r}</span>`;
  return [
    line('+', '+', '-'),
    line('|', '|', ' '),
    line('|', '|', ' '),
    line('|', '|', ' '),
    line('|', '|', ' '),
    line('+', '+', '-'),
    ' '.repeat(STALL_CONTENT_WIDTH + 2),
  ];
}

function buildProduceStallBlock(
  fruitType: FruitType,
  price: number,
  isVisible: boolean
): string[] {
  if (!isVisible) return buildEmptyStallBlock();

  const info = PRODUCE_CATALOG[fruitType];
  const color = info.colorHex;
  const tmpl = STALL_ART_TEMPLATES[fruitType] ?? {
    lines: ['', `( ${info.asciiSymbol} ) ( ${info.asciiSymbol} )`, ''],
  };
  const accent = tmpl.accent ?? '#78350f';

  const label = ` ${info.plural.toUpperCase()} `;
  const borderPad = Math.max(0, STALL_CONTENT_WIDTH - label.length);
  const leftDash = Math.floor(borderPad / 2);
  const rightDash = borderPad - leftDash;

  const b = (s: string) => spanClass(WOOD_BORDER_COLOR, s);
  const wrapClick = (inner: string) =>
    `<span data-produce-id="${fruitType}" class="cursor-pointer hover:brightness-125 transition-all inline-block" title="Click to adjust ${esc(
      info.name
    )} price & auto-sell">${inner}</span>`;

  const artLines = [0, 1, 2].map(
    (i) => b('|') + parseAndPadStallLine(tmpl.lines[i] ?? '', color, accent) + b('|')
  );

  const priceFormatted = formatPriceTag(price, info.unit, STALL_CONTENT_WIDTH);

  const stallBoxLines = [
    b('+' + '-'.repeat(leftDash)) +
      spanStyle(`color:${color};font-weight:700`, label) +
      b('-'.repeat(rightDash) + '+'),
    ...artLines,
    b('|') + spanClass('text-emerald-700 font-extrabold underline', priceFormatted) + b('|'),
    b('+' + '-'.repeat(STALL_CONTENT_WIDTH) + '+'),
  ].map(wrapClick);

  // 50% of the base price
  const instaPrice = info.baseValue * 0.5;
  const formattedInsta = instaPrice % 1 === 0 ? `$${instaPrice}` : `$${instaPrice.toFixed(2)}`;
  let instaText = `Insta-sell: ${formattedInsta}`;
  if (instaText.length > STALL_CONTENT_WIDTH + 2) {
    instaText = `Insta-sell:${formattedInsta}`;
  }
  const pad = Math.max(0, STALL_CONTENT_WIDTH + 2 - instaText.length);
  const leftPad = Math.floor(pad / 2);
  const rightPad = pad - leftPad;
  const centeredInsta = ' '.repeat(leftPad) + instaText + ' '.repeat(rightPad);

  const instaLine = `<span data-insta-sell="${fruitType}" role="button" tabindex="0" class="cursor-pointer font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 hover:text-emerald-950 active:scale-95 transition-all inline-block select-none" title="Insta-sell 1 ${esc(info.name)} for ${formattedInsta}">${esc(centeredInsta)}</span>`;

  return [...stallBoxLines, instaLine];
}

function getTillDecorLine(rowIndex: number, lineIndex: number): string {
  if (lineIndex >= 6) return ' '.repeat(13);
  const tag = (labels: string[]) => [
    '     +---+   ',
    ...labels.map((c) => `     | ${c} |   `),
    '     +---+   ',
  ][lineIndex];

  if (rowIndex === 0) return spanClass(WOOD_BORDER_COLOR, tag(['C', 'A', 'S', 'H']));
  if (rowIndex === 1) return spanClass(WOOD_BORDER_COLOR, tag(['T', 'I', 'L', 'L']));
  if (rowIndex === 2) {
    const scale = [
      '             ',
      '  [SCALE]    ',
      '  \\~~~~~/    ',
      '   \\___/     ',
      '     |       ',
      '    ---      ',
    ][lineIndex];
    return spanClass('text-[#64748b] font-bold', scale);
  }
  return ' '.repeat(13);
}

export function renderStandBirdsHeader(): string[] {
  const note1 = '<span class="animate-note-left text-amber-600 font-bold select-none inline-block">♪</span>';
  const note1b = '<span class="animate-note-right text-rose-500 font-bold select-none inline-block ml-1">♫</span>';

  const note2 = '<span class="animate-note-right text-sky-500 font-bold select-none inline-block">♫</span>';
  const note2b = '<span class="animate-note-left text-emerald-600 font-bold select-none inline-block ml-1">♪</span>';

  const bird1 = '<span data-bird="true" role="button" tabindex="0" title="Chirp! A cozy little robin (Click to chirp)" class="animate-bird-left cursor-pointer hover:scale-125 transition-transform inline-block select-none"><span class="text-[#b45309] font-bold">(</span><span class="text-[#ef4444] font-bold">o</span><span class="text-[#f59e0b] font-bold">&gt;</span></span>';

  const bird2 = '<span data-bird="true" role="button" tabindex="0" title="Chirp! A cozy little bluebird (Click to chirp)" class="animate-bird-right cursor-pointer hover:scale-125 transition-transform inline-block select-none"><span class="text-[#0284c7] font-bold">&lt;</span><span class="text-[#38bdf8] font-bold">o</span><span class="text-[#1d4ed8] font-bold">)</span></span>';

  const lineNotes = ' '.repeat(34) + `${note1} ${note1b}` + ' '.repeat(38) + `${note2} ${note2b}` + ' '.repeat(6);
  const lineBirds = ' '.repeat(34) + bird1 + ' '.repeat(38) + bird2 + ' '.repeat(6);

  return [lineNotes, lineBirds];
}

export function generateRoadsideStandLines(
  getPrice: (type: FruitType) => number,
  isVisible: (type: FruitType) => boolean = () => true,
  hasCrow: boolean = false
): string[] {
  const result: string[] = [];

  renderStandBirdsHeader().forEach((line) => result.push(line));

  STAND_ROOF_LINES.forEach((line, idx) => {
    let renderedLine = highlightRoofLine(line, idx);
    if (hasCrow) {
      if (idx === 12) {
        renderedLine = renderedLine.replace(
          /(\|  \|\|)(<\/span>)?$/,
          '$1   <span data-crow="true" role="button" tabindex="0" title="A mysterious black crow perched above the EST. 2018 sign... (Click to investigate)" class="animate-crow cursor-pointer inline-block select-none group hover:scale-125 transition-transform"><span class="text-zinc-950 font-black">&gt;</span><span class="text-zinc-900 font-bold">(</span><span class="text-amber-400 font-bold">o</span><span class="text-zinc-950 font-black">)</span></span>$2'
        );
      } else if (idx === 13) {
        renderedLine = renderedLine.replace(
          /\|--\|\|------\./,
          '|--||--<span class="text-zinc-950 font-bold animate-crow">//</span>--.'
        );
      }
    }
    result.push(renderedLine);
  });

  const totalRows = Math.ceil(ALL_FRUIT_TYPES.length / STALLS_PER_ROW);

  for (let r = 0; r < totalRows; r++) {
    const batch = ALL_FRUIT_TYPES.slice(r * STALLS_PER_ROW, (r + 1) * STALLS_PER_ROW).map(
      (type) => buildProduceStallBlock(type, getPrice(type), isVisible(type))
    );

    for (let line = 0; line < 7; line++) {
      let combined = spanClass(WOOD_BORDER_COLOR, '    |  ');
      for (let s = 0; s < STALLS_PER_ROW; s++) {
        if (s > 0) combined += ' '.repeat(5);
        combined += batch[s] ? batch[s][line] : ' '.repeat(STALL_CONTENT_WIDTH + 2);
      }
      combined += getTillDecorLine(r, line);
      combined += spanClass(WOOD_BORDER_COLOR, '|');
      result.push(combined);
    }

    result.push(spanClass(WOOD_BORDER_COLOR, '    |' + '='.repeat(98) + '|'));
  }

  STAND_BASE_LINES.forEach((line, idx) =>
    result.push(highlightRoofLine(line, 47 + idx))
  );

  return result;
}

export const TRACTOR_MAN_RAW_LINES = [
  '                                                                            _..---""""""---.._',
  '                                       _                                _.-\'                  \'-._',
  '           _                 _       _ \\\\                             .\'                          \'.',
  '         _| |_      __      ( )     / \\ \\\\                          .\'                              \'.',
  '        | | | |   _|  |_     |      \\_/  \\                        .\'                                  \'.',
  '    ____|_|_|_|__| |__| |____|_______|___|                      .\'______________________________________\'.    _',
  '   / ||.-=.-=.-=.-=.-=.-.     _..-------.._                     |                                        |   /^\\',
  '  /  |||                |   .\'             \'.                   |  ||||||||||||||||||||||||||||||||||||  | ========',
  ' |   |||________________|  /                 \\                  |  |..................................|  |   |+ ) \\\\  ',
  ' |   ||                   |                   |                 |  |..................................|  |    /\\  | |',
  ' |   ||                   |                   |                 |  ||||||||||||||||||||||||||||||||||||  |  / || / /',
  ' |   ||                   |                   |                 |________________________________________|  |||| |/ ',
  ' |                        |                   |                /|                                        |  \\\\||=)',
  ' |                        |                   |               / |                                        |   \\||-|',
  ' |                        |    _.-"""""-._    |=====00=====__/__|          _.-"""""-._          _.-"""""-. \\  WW  \\',
  ' |          .--.          |  .\'  \\  |  /  \'.  |          |   _ |        .\'  \\  |  /  \'.      .\'  \\  |  /  \'.| | |  \\',
  ' |------------------------| /  - - (O) - -  \\ |          |  | \\|       /  - - (O) - -  \\    /  - - (O) - -  \\ |||  /',
  '  \\________/ () \\_________| \\    /  |  \\    / |          |  |  |       \\    /  |  \\    /    \\    /  |  \\    / ||| /',
  '           \\    /            \'._   \\|/   _.\'  |          |__|  |        \'._   \\|/   _.\'      \'._   \\|/   _.\'  | |/',
  '            \'--\'                "-.___.-"                (_)                "-.___.-"            "-.___.-"    |__\\',
];

export function renderColoredTractorMan(): string[] {
  return TRACTOR_MAN_RAW_LINES.map((raw) => {
    let s = esc(raw);

    // 1. Spoke Hubs (O)
    s = s.replaceAll(
      '(O)',
      '<span class="text-[#f59e0b] font-black">(</span><span class="text-[#fbbf24] font-bold">O</span><span class="text-[#f59e0b] font-black">)</span>'
    );

    // 2. Wheel Spoke lines
    s = s
      .replaceAll('- -', '<span class="text-[#d97706] font-bold">- -</span>')
      .replaceAll('\\  |  /', '<span class="text-[#ca8a04] font-bold">\\  |  /</span>')
      .replaceAll('/  |  \\', '<span class="text-[#ca8a04] font-bold">/  |  \\</span>')
      .replaceAll('\\|/', '<span class="text-[#ca8a04] font-bold">\\|/</span>');

    // 3. Wheel curves & tire rims
    s = s
      .replaceAll('_.-"""""-._', '<span class="text-[#475569] font-bold">_.-"""""-._</span>')
      .replaceAll('"-.___.-"', '<span class="text-[#334155] font-bold">"-.___.-"</span>')
      .replaceAll('_..-------.._', '<span class="text-[#334155] font-bold">_..-------.._</span>');

    // 4. Coupling pin & drawbar
    s = s
      .replaceAll('=====00=====', '<span class="text-[#b45309] font-bold">=====</span><span class="text-[#f59e0b] font-black">00</span><span class="text-[#b45309] font-bold">=====</span>')
      .replaceAll('()', '<span class="text-[#f59e0b] font-bold">()</span>')
      .replaceAll('(_)', '<span class="text-[#b45309] font-bold">(_)</span>');

    // 5. Radiator grille slats
    s = s.replaceAll(
      '.-=.-=.-=.-=.-.',
      '<span class="text-[#94a3b8] font-bold">.-=.-=.-=.-=.-.</span>'
    );

    // 6. Huge Green Rear Fender & Tractor Body
    s = s
      .replaceAll(
        '_..---""""""---.._',
        '<span class="text-[#15803d] font-bold">_..---""""""---.._</span>'
      )
      .replaceAll(
        '_.-\'                  \'-._',
        '<span class="text-[#15803d] font-bold">_.-\'                  \'-._</span>'
      )
      .replaceAll(
        '.\'______________________________________\'.',
        '<span class="text-[#166534] font-bold">.\'______________________________________\'.</span>'
      );

    // 7. Slat vents & mesh
    s = s
      .replaceAll(
        '||||||||||||||||||||||||||||||||||||',
        '<span class="text-[#475569] font-bold">||||||||||||||||||||||||||||||||||||</span>'
      )
      .replaceAll(
        '..................................',
        '<span class="text-[#64748b]">..................................</span>'
      );

    // 8. Engine Hood & Exhaust Pipes
    s = s
      .replaceAll(
        '____|_|_|_|__| |__| |____|_______|___|',
        '<span class="text-[#15803d] font-bold">____|_|_|_|__| |__| |____|_______|___|</span>'
      )
      .replaceAll('| | | |', '<span class="text-[#ca8a04] font-bold">| | | |</span>')
      .replaceAll('_| |_', '<span class="text-[#d97706] font-bold">_| |_</span>')
      .replaceAll('_|  |_', '<span class="text-[#d97706] font-bold">_|  |_</span>');

    // 9. TractorMan himself!
    s = s
      .replaceAll('/^\\', '<span class="text-[#b45309] font-black">/^\\</span>')
      .replaceAll('========', '<span class="text-[#78350f] font-bold">========</span>')
      .replaceAll('|+ )', '<span class="text-[#f59e0b] font-bold">|+ )</span>')
      .replaceAll('WW', '<span class="text-[#dc2626] font-bold">WW</span>')
      .replaceAll('\\\\||=)', '<span class="text-[#2563eb] font-bold">\\\\||</span><span class="text-[#f59e0b] font-bold">=)</span>')
      .replaceAll('\\||-|', '<span class="text-[#2563eb] font-bold">\\||-|</span>')
      .replaceAll('|||| |/', '<span class="text-[#2563eb] font-bold">|||| |/</span>')
      .replaceAll('|__\\', '<span class="text-[#78350f] font-bold">|__\\</span>');

    return `<span class="text-[#334155]">${s}</span>`;
  });
}
