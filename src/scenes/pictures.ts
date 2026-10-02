/**
 * The two painted pictures that open the story, brought to life by src/ui/living.ts.
 * Coordinates are in each image's own pixels (cover 1055×1491, planners 1538×1023).
 */
import { living, type Effect } from '../ui/living'

const GOLD = 'rgba(255,226,150,1)', GLASS = 'rgba(255,236,190,1)', WARM = 'rgba(255,214,140,1)'

/** Cover: the prince points across the river city; glass panels of data glow above the planners' table. */
const COVER: Effect[] = [
  { k: 'ripple', r: [290, 0, 765, 104], amp: 1.4, wave: 46, period: 9 },              // clouds drift
  { k: 'ripple', r: [380, 398, 450, 72], amp: 1.8, wave: 14, period: 3.2 },            // the river, upper reach
  { k: 'ripple', r: [530, 505, 300, 55], amp: 1.6, wave: 12, period: 2.8 },            // the river, lower reach
  { k: 'sway', r: [0, 118, 262, 210], amp: 1.6, period: 6.5, wave: 140 },              // the parasol
  { k: 'sway', r: [268, 198, 150, 140], amp: 1.8, period: 4.8, phase: 1, wave: 60 },   // the tree by the terrace
  { k: 'sway', r: [440, 740, 90, 150], amp: 1.2, period: 5.5, phase: 2 },              // the elephant's trunk and tusks
  { k: 'breathe', r: [150, 300, 230, 330], amount: 0.004, period: 4.6 },               // the prince
  { k: 'birds', c: [372, 196], rx: 26, ry: 10, n: 3, size: 7, period: 14, color: 'rgba(58,36,22,.9)' },
  // glass panels: a slow glow, a scan line, a rare flicker
  ...([[455, 113, 208, 155], [808, 150, 187, 125], [828, 403, 177, 178], [548, 575, 197, 140], [773, 690, 244, 250], [78, 650, 237, 365], [452, 1152, 106, 78]] as const)
    .flatMap(([x, y, w, h], i): Effect[] => [
      { k: 'glow', r: [x, y, w, h], color: GLASS, min: 0.04, max: 0.16, period: 4 + i * 0.7, phase: i * 1.3, flicker: true },
      { k: 'scan', r: [x, y, w, h], color: GLASS, period: 5 + i * 0.9, phase: i * 0.29 },
    ]),
  // data running from the satellite to the panels, across the river and down to the table
  { k: 'sparks', color: GOLD, period: 4.2, size: 6, paths: [
    [[758, 84], [700, 150], [690, 330]], [[750, 90], [640, 120], [622, 300]], [[770, 92], [830, 130], [880, 205]],
    [[430, 432], [560, 520], [842, 492]], [[650, 712], [560, 820], [640, 960]], [[860, 900], [820, 950], [720, 1000]],
  ] },
  { k: 'glow', r: [540, 930, 260, 170], color: WARM, min: 0.1, max: 0.32, period: 3.6, round: true },  // the hospital model
  { k: 'twinkle', r: [310, 890, 690, 300], n: 26, color: GOLD, size: 3, seed: 7 },
  { k: 'motes', r: [0, 120, 1055, 1300], n: 34, color: GOLD, size: 4, seed: 19 },
]

/** Chapter 1: three planners bend over the sacred map; fans sway, the flag flies, the ink glows where they point. */
const PLANNERS: Effect[] = [
  { k: 'flag', r: [62, 66, 112, 44], amp: 4, wave: 40, period: 1.6 },                  // the flag on its pole
  { k: 'ripple', r: [64, 288, 290, 46], amp: 1.6, wave: 11, period: 3 },               // the river behind the city
  { k: 'sway', r: [330, 22, 480, 210], amp: 1.3, period: 6, wave: 120 },               // the trees
  { k: 'sway', r: [140, 336, 96, 120], amp: 2.2, period: 3.4 },                        // the red fan
  { k: 'sway', r: [292, 352, 64, 64], amp: 1.8, period: 3.9, phase: 1.4 },             // the pale fan
  { k: 'sway', r: [1405, 380, 66, 76], amp: 2, period: 3.6, phase: 2.2 },              // the fan on the right
  { k: 'breathe', r: [240, 360, 320, 440], amount: 0.004, period: 4.8 },               // the planner on the left
  { k: 'breathe', r: [640, 392, 340, 400], amount: 0.004, period: 5.2, phase: 2.1 },   // the planner in the middle
  { k: 'breathe', r: [1010, 372, 330, 430], amount: 0.004, period: 4.4, phase: 4.2 },  // the planner on the right
  { k: 'birds', c: [250, 140], rx: 40, ry: 12, n: 3, size: 7, period: 16, color: 'rgba(58,36,22,.85)' },
  ...([[375, 305, 170, 56], [740, 305, 150, 56], [1060, 310, 180, 56]] as const)
    .map(([x, y, w, h], i): Effect => ({ k: 'sheen', r: [x, y, w, h], period: 7, phase: i * 0.12 })),
  { k: 'glow', r: [330, 760, 1170, 210], color: WARM, min: 0.03, max: 0.12, period: 5, round: true },  // the map breathes light
  { k: 'rings', at: [[682, 890], [850, 852], [1336, 836]], color: GOLD, period: 2.6, radius: 46 },
  { k: 'twinkle', r: [360, 790, 1100, 160], n: 22, color: GOLD, size: 3, seed: 3 },
  { k: 'motes', r: [0, 0, 1538, 960], n: 26, color: GOLD, size: 4, seed: 11 },
]

export function initPictures() {
  living(document.getElementById('cover') as HTMLElement, COVER, 1055)
  living(document.getElementById('planners') as HTMLElement, PLANNERS, 1538)
}
