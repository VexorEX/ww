import { prisma } from '../prisma';
import type { User } from '../generated/client';
import { formatNumber, formatPercent } from './formatters';

interface FormattedUser {
    userid: number;
    country: string;
    countryName: string;
    level: number;
    rank: number;
    government: string;
    religion: string;
    crowd: string;
    capital: string;
    dailyProfit: string;
    satisfaction: string;
    security: string;
    lottery: number;
    // منابع
    oil: string;
    iron: string;
    gold: string;
    uranium: string;
    goldMine: number;
    uraniumMine: number;
    ironMine: number;
    refinery: number;
    // ارتش پایه
    soldier: string;
    tank: string;
    heavyTank: string;
    // جنگنده‌ها
    su57: number;
    f47: number;
    f35: number;
    j20: number;
    f16: number;
    f22: number;
    am50: number;
    b2: number;
    tu16: number;
    // پهپادها
    espionageDrone: number;
    suicideDrone: number;
    crossDrone: number;
    witnessDrone: number;
    // موشک‌ها
    simpleRocket: number;
    crossRocket: number;
    dotTargetRocket: number;
    continentalRocket: number;
    ballisticRocket: number;
    chemicalRocket: number;
    hyperSonicRocket: number;
    clusterRocket: number;
    // کشتی‌های دریایی
    battleship: number;
    marineShip: number;
    breakerShip: number;
    nuclearSubmarine: number;
    // دفاع
    antiRocket: number;
    ironDome: number;
    s400: number;
    taad: number;
    hq9: number;
    acash: number;
}

// Util: داده‌های کشور رو از DB بگیر و فرمت کن (JSON output)
export async function getCountryData(country: string): Promise<any> {
    try {
        const users = await prisma.user.findMany({
            where: { country: { contains: country } }, // ✅ mode حذف شد (SQLite پشتیبانی نمی‌کنه)
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

        // فرمت هر user
        const formattedUsers: FormattedUser[] = users.map((user: any) => ({
            userid: user.userid,
            country: user.country,
            countryName: user.countryName,
            level: user.level,
            rank: user.rank,
            government: user.government,
            religion: user.religion,
            crowd: formatNumber(user.crowd),
            capital: formatNumber(user.capital),
            dailyProfit: formatNumber(user.dailyProfit),
            satisfaction: formatPercent(user.satisfaction),
            security: formatPercent(user.security),
            lottery: user.lottery,
            // منابع
            oil: formatNumber(user.oil),
            iron: formatNumber(user.iron),
            gold: formatNumber(user.gold),
            uranium: formatNumber(user.uranium),
            goldMine: user.goldMine,
            uraniumMine: user.uraniumMine,
            ironMine: user.ironMine,
            refinery: user.refinery,
            // ارتش پایه
            soldier: formatNumber(user.soldier),
            tank: formatNumber(user.tank),
            heavyTank: formatNumber(user.heavyTank),
            // جنگنده‌ها
            su57: user.su57,
            f47: user.f47,
            f35: user.f35,
            j20: user.j20,
            f16: user.f16,
            f22: user.f22,
            am50: user.am50,
            b2: user.b2,
            tu16: user.tu16,
            // پهپادها
            espionageDrone: user.espionageDrone,
            suicideDrone: user.suicideDrone,
            crossDrone: user.crossDrone,
            witnessDrone: user.witnessDrone,
            // موشک‌ها
            simpleRocket: user.simpleRocket,
            crossRocket: user.crossRocket,
            dotTargetRocket: user.dotTargetRocket,
            continentalRocket: user.continentalRocket,
            ballisticRocket: user.ballisticRocket,
            chemicalRocket: user.chemicalRocket,
            hyperSonicRocket: user.hyperSonicRocket,
            clusterRocket: user.clusterRocket,
            // دریایی
            battleship: user.battleship,
            marineShip: user.marineShip,
            breakerShip: user.breakerShip,
            nuclearSubmarine: user.nuclearSubmarine,
            // دفاع
            antiRocket: user.antiRocket,
            ironDome: user.ironDome,
            s400: user.s400,
            taad: user.taad,
            hq9: user.hq9,
            acash: user.acash,
        }));

        // اگر multiple، summary اضافه کن
        if (formattedUsers.length > 1) {
            const summary = formattedUsers.map(u => `${u.countryName} (${u.userid})`).join(' | ');
            return {
                summary: `🌍 کشورها با "${country}":\n${summary}\n(تعداد: ${formattedUsers.length})`,
                users: formattedUsers,
                count: formattedUsers.length
            };
        }

        // single user
        return {
            summary: `🌍 اطلاعات کشور ${formattedUsers[0].countryName} (کاربر ${formattedUsers[0].userid})`,
            user: formattedUsers[0],
            count: 1
        };
    } catch (error) {
        console.error('خطا در دریافت داده کشور:', error);
        return { error: '❌ خطا در بارگذاری داده‌ها!', count: 0 };
    }
}
