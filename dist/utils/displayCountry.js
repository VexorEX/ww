"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountryData = getCountryData;
const prisma_1 = require("../prisma");
const formatters_1 = require("./formatters");
async function getCountryData(country) {
    try {
        const users = await prisma_1.prisma.user.findMany({
            where: { country: { contains: country } },
            select: {
                userid: true,
                country: true,
                countryName: true,
                level: true,
                rank: true,
                government: true,
                religion: true,
                crowd: true,
                capital: true,
                dailyProfit: true,
                satisfaction: true,
                security: true,
                lottery: true,
                oil: true,
                iron: true,
                gold: true,
                uranium: true,
                goldMine: true,
                uraniumMine: true,
                ironMine: true,
                refinery: true,
                soldier: true,
                tank: true,
                heavyTank: true,
                su57: true,
                f47: true,
                f35: true,
                j20: true,
                f16: true,
                f22: true,
                am50: true,
                b2: true,
                tu16: true,
                espionageDrone: true,
                suicideDrone: true,
                crossDrone: true,
                witnessDrone: true,
                simpleRocket: true,
                crossRocket: true,
                dotTargetRocket: true,
                continentalRocket: true,
                ballisticRocket: true,
                chemicalRocket: true,
                hyperSonicRocket: true,
                clusterRocket: true,
                battleship: true,
                marineShip: true,
                breakerShip: true,
                nuclearSubmarine: true,
                antiRocket: true,
                ironDome: true,
                s400: true,
                taad: true,
                hq9: true,
                acash: true,
            },
        });
        if (users.length === 0) {
            return { error: '❌ کشوری با این نام پیدا نشد!', count: 0 };
        }
        const formattedUsers = users.map((user) => ({
            userid: user.userid,
            country: user.country,
            countryName: user.countryName,
            level: user.level,
            rank: user.rank,
            government: user.government,
            religion: user.religion,
            crowd: (0, formatters_1.formatNumber)(user.crowd),
            capital: (0, formatters_1.formatNumber)(user.capital),
            dailyProfit: (0, formatters_1.formatNumber)(user.dailyProfit),
            satisfaction: (0, formatters_1.formatPercent)(user.satisfaction),
            security: (0, formatters_1.formatPercent)(user.security),
            lottery: user.lottery,
            oil: (0, formatters_1.formatNumber)(user.oil),
            iron: (0, formatters_1.formatNumber)(user.iron),
            gold: (0, formatters_1.formatNumber)(user.gold),
            uranium: (0, formatters_1.formatNumber)(user.uranium),
            goldMine: user.goldMine,
            uraniumMine: user.uraniumMine,
            ironMine: user.ironMine,
            refinery: user.refinery,
            soldier: (0, formatters_1.formatNumber)(user.soldier),
            tank: (0, formatters_1.formatNumber)(user.tank),
            heavyTank: (0, formatters_1.formatNumber)(user.heavyTank),
            su57: user.su57,
            f47: user.f47,
            f35: user.f35,
            j20: user.j20,
            f16: user.f16,
            f22: user.f22,
            am50: user.am50,
            b2: user.b2,
            tu16: user.tu16,
            espionageDrone: user.espionageDrone,
            suicideDrone: user.suicideDrone,
            crossDrone: user.crossDrone,
            witnessDrone: user.witnessDrone,
            simpleRocket: user.simpleRocket,
            crossRocket: user.crossRocket,
            dotTargetRocket: user.dotTargetRocket,
            continentalRocket: user.continentalRocket,
            ballisticRocket: user.ballisticRocket,
            chemicalRocket: user.chemicalRocket,
            hyperSonicRocket: user.hyperSonicRocket,
            clusterRocket: user.clusterRocket,
            battleship: user.battleship,
            marineShip: user.marineShip,
            breakerShip: user.breakerShip,
            nuclearSubmarine: user.nuclearSubmarine,
            antiRocket: user.antiRocket,
            ironDome: user.ironDome,
            s400: user.s400,
            taad: user.taad,
            hq9: user.hq9,
            acash: user.acash,
        }));
        if (formattedUsers.length > 1) {
            const summary = formattedUsers.map(u => `${u.countryName} (${u.userid})`).join(' | ');
            return {
                summary: `🌍 کشورها با "${country}":\n${summary}\n(تعداد: ${formattedUsers.length})`,
                users: formattedUsers,
                count: formattedUsers.length
            };
        }
        return {
            summary: `🌍 اطلاعات کشور ${formattedUsers[0].countryName} (کاربر ${formattedUsers[0].userid})`,
            user: formattedUsers[0],
            count: 1
        };
    }
    catch (error) {
        console.error('خطا در دریافت داده کشور:', error);
        return { error: '❌ خطا در بارگذاری داده‌ها!', count: 0 };
    }
}
