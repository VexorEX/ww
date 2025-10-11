# Country Simulation Telegram Bot (WW3)

A modular Telegram bot for country simulation game with economy and military systems.

## Features

### Economy System
- **Daily Income**: Collect daily profits and resource production
- **Mining**: Buy iron, gold, and uranium mines
- **Refineries**: Purchase oil refineries for production
- **Lottery**: Daily lottery tickets with 10% chance to win 1 billion
- **Boosts**: Increase satisfaction and security levels

### Military System
- **Ground Units**: Soldiers, tanks, heavy tanks
- **Air Force**: Various fighter jets (Su-57, F-47, F-35, J-20, F-16, F-22, AM-50, B-2, TU-16)
- **Drones**: Espionage, suicide, cross, and witness drones
- **Missiles**: Multiple types including ballistic, hypersonic, and cluster rockets
- **Navy**: Battleships, marine ships, breaker ships, nuclear submarines
- **Defense**: Anti-rocket systems, iron dome, S-400, TAAD, HQ-9, A-CASH

## Setup

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Telegram Bot Token (from @BotFather)

### Installation

1. **Clone and install dependencies:**
```bash
cd ww3
npm install
```

2. **Set up environment variables:**
```bash
# Edit .env file and add your bot token
BOT_TOKEN=your_actual_bot_token_here
DATABASE_URL="file:./prisma/users.db"
NODE_ENV=development
```

3. **Generate Prisma client and set up database:**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. **Build the project:**
```bash
npm run build
```

5. **Start the bot:**
```bash
npm start
```

### Development

For development with auto-reload:
```bash
npm run dev
```

## Bot Commands

### Economy Commands
- `/economy` - View complete economic status
- `/daily` - Collect daily income and resources
- `/buymine [type]` - Buy mines (iron/gold/uranium)
- `/buyrefinery` - Purchase oil refinery
- `/lottery` - Use lottery ticket (10% win chance)
- `/boost [type] [amount]` - Boost satisfaction/security

### Military Commands
- `/military` - View complete military status
- `/buysoldier [count]` - Buy soldiers (150 iron + 150 oil each)
- `/buytank [count]` - Buy tanks (500 iron + 200 oil each)
- `/buyheavytank [count]` - Buy heavy tanks (1000 iron + 500 oil each)
- `/buysu57 [count]` - Buy Su-57 fighters (10000 iron + 5000 oil each)
- `/train` - Train units (boost based on satisfaction level)

### Starting the Game
- `/start [country] [government]` - Initialize your country

Example: `/start Iran جمهوری`

## Project Structure

```
src/
├── bot.ts                 # Main bot entry point
├── prisma.ts             # Prisma client setup
├── middlewares/
│   └── userAuth.ts       # User authentication middleware
├── modules/
│   ├── economy.ts        # Economy system commands
│   └── military.ts       # Military system commands
├── utils/
│   └── formatters.ts     # Number formatting utilities
└── generated/
    └── client/           # Prisma generated client
```

## Database Schema

The bot uses SQLite with Prisma ORM. Key user fields:
- Basic info: userid, country, countryName, government, religion
- Economy: crowd, capital, dailyProfit, satisfaction, security, lottery
- Resources: oil, iron, gold, uranium, goldMine, uraniumMine, ironMine, refinery
- Military: Various units and equipment (see schema.prisma for complete list)

## PHP Proxy

The project includes a PHP proxy script (`test.php`) for handling Telegram API requests with custom routing. This allows for custom URL structures and request handling.

## Troubleshooting

1. **Build errors**: Ensure all dependencies are installed and Prisma client is generated
2. **Database errors**: Run `npx prisma migrate dev` to set up the database
3. **Bot not responding**: Check BOT_TOKEN in .env file and network connectivity
4. **Type errors**: Run `npx prisma generate` to update Prisma client types

## Contributing

This is a modular bot system. To add new features:
1. Create new modules in `src/modules/`
2. Import and register in `src/bot.ts`
3. Follow the existing pattern for commands and database interactions
