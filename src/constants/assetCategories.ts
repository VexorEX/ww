export const bigintFields = [
  // Economy values
  'capital',
  'dailyProfit',
  'crowd',

  // Base resources
  'iron',
  'gold',
  'oil',
  'uranium',

  // Resource facility counts (also stored as bigint in schema)
  'goldMine',
  'uraniumMine',
  'ironMine',
  'refinery',

  // Army counts
  'soldier',
  'tank',
  'heavyTank',

  // Jets / aircraft
  'su57',
  'f47',
  'f35',
  'j20',
  'f16',
  'f22',
  'am50',
  'b2',
  'tu16',

  // Drones
  'espionageDrone',
  'suicideDrone',
  'crossDrone',
  'witnessDrone',

  // Rockets / missiles
  'simpleRocket',
  'crossRocket',
  'dotTargetRocket',
  'continentalRocket',
  'ballisticRocket',
  'chemicalRocket',
  'hyperSonicRocket',
  'clusterRocket',

  // Ships / naval
  'battleship',
  'marineShip',
  'breakerShip',
  'nuclearSubmarine',

  // Defence systems
  'antiRocket',
  'ironDome',
  's400',
  'taad',
  'hq9',
  'acash'
];

export const assetCategories: Record<string, string[]> = {
  economy: [
    'capital',
    'dailyProfit',
    'crowd',
    'satisfaction',
    'security',
    'lottery'
  ],
  resources: [
    'oil',
    'iron',
    'gold',
    'uranium'
  ],
  resourceFacilities: [
    'goldMine',
    'uraniumMine',
    'ironMine',
    'refinery'
  ],
  army: [
    'soldier',
    'tank',
    'heavyTank'
  ],
  jets: [
    'su57',
    'f47',
    'f35',
    'j20',
    'f16',
    'f22',
    'am50',
    'b2',
    'tu16'
  ],
  drones: [
    'espionageDrone',
    'suicideDrone',
    'crossDrone',
    'witnessDrone'
  ],
  rockets: [
    'simpleRocket',
    'crossRocket',
    'dotTargetRocket',
    'continentalRocket',
    'ballisticRocket',
    'chemicalRocket',
    'hyperSonicRocket',
    'clusterRocket'
  ],
  ships: [
    'battleship',
    'marineShip',
    'breakerShip',
    'nuclearSubmarine'
  ],
  defense: [
    'antiRocket',
    'ironDome',
    's400',
    'taad',
    'hq9',
    'acash'
  ]
};
