export const bigintFields = [
    'capital',
    'dailyProfit',
    'crowd',
    'iron',
    'gold',
    'oil',
    'uranium'
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