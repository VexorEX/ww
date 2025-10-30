import fs from 'fs';
import path from 'path';
import countries from '../config/countries.json'
import { prisma } from '../prisma';


interface Country {
    country: any;
    rank: number;
    name: string;
    gov: string;
    lang: string;
    region?: string; // اضافه برای فیلتر region
}

const COUNTRIES_FILE = path.join(__dirname, '../config/countries.json');
const AVAILABLE_COUNTRIES_FILE = path.join(__dirname, '../config/fc.json'); // فرض: fc.json در ریشه

// Load JSON یکبار (singleton-like)
let countriesData: Record<string, any> | null = null;
function loadCountries(): Record<string, any> {
    if (!countriesData) {
        countriesData = JSON.parse(fs.readFileSync(COUNTRIES_FILE, 'utf8'));
    }
    return countriesData;
}

// Load available countries از fc.json (singleton-like)
let availableCountries: string[] | null = null;
function loadAvailableCountries(): string[] {
    if (!availableCountries) {
        if (fs.existsSync(AVAILABLE_COUNTRIES_FILE)) {
            const data = fs.readFileSync(AVAILABLE_COUNTRIES_FILE, 'utf8');
            availableCountries = JSON.parse(data);
        } else {
            availableCountries = [];
        }
    }
    return availableCountries;
}

// Util ۱: فیلتر بر اساس rank (exact match)
export function getCountriesByRank(rank: number): (Country & { country: string })[] {
    if (rank < 0 || rank > 3) return [];
    const data = loadCountries();
    const results: (Country & { country: string })[] = [];

    Object.entries(data).forEach(([region, countries]) => {
        Object.entries(countries as Record<string, Country>).forEach(([code, country]) => {
            if (country.rank === rank) {
                results.push({ ...country, region, country: code }); // 👈 اضافه کردن کلید اصلی
            }
        });
    });

    return results;
}

// Util ۲: فیلتر بر اساس region (exact match)
export function getCountriesByRegion(region: 'asia' | 'europe' | 'africa' | 'america' | 'australia'): Country[] {
    const data = loadCountries();
    const regionData = data[region];
    if (!regionData) return [];
    return Object.values(regionData).map((c: Country) => ({ ...c, region }));
}

// Util ۳: فیلتر بر اساس lang (partial match)
export function getCountriesByLang(lang: string): Country[] {
    const data = loadCountries();
    const results: Country[] = [];
    Object.entries(data).forEach(([region, countries]) => {
        Object.entries(countries as Record<string, Country>).forEach(([_, country]) => {
            if ((country.lang || '').toLowerCase().includes(lang.toLowerCase())) {
                results.push({ ...country, region });
            }
        });
    });
    return results;
}

// Util ۴: فیلتر بر اساس gov (partial match)
export function getCountriesByGov(gov: string): Country[] {
    const data = loadCountries();
    const results: Country[] = [];
    Object.entries(data).forEach(([region, countries]) => {
        Object.entries(countries as Record<string, Country>).forEach(([_, country]) => {
            if ((country.gov || '').toLowerCase().includes(gov.toLowerCase())) {
                results.push({ ...country, region });
            }
        });
    });
    return results;
}


export function getAvailableCountries(): string[] { return loadAvailableCountries(); }
// Util ۵: فیلتر available countries (از fc.json)
export function getAvailableCountriesList(name: string): Country[] {
    const allCountries = loadCountries();
    const availableNames = loadAvailableCountries();
    const results: Country[] = [];

    for (const [region, countries] of Object.entries(allCountries)) {
        for (const [_, country] of Object.entries(countries as Record<string, Country>)) {
            if (availableNames.includes(country.name)) {
                results.push({ ...country, region });
            }
        }
    }

    return results;
}

// Helper اضافی: فرمت لیست برای reply (اختیاری)
export function formatCountryList(countries: Country[] | string[], title: string): string {
    if (!countries || countries.length === 0) return '❌ نتیجه‌ای پیدا نشد!';

    let listStr: string;
    const first = countries[0] as any;

    if (typeof first === 'string') {
        listStr = (countries as string[]).join(' | ');
    } else if (typeof first === 'object' && first !== null && 'name' in first) {
        listStr = (countries as Country[]).map(c => c.name).join(' | ');
    } else {
        // fallback
        listStr = countries.map(c => String((c as any).name ?? c)).join(' | ');
    }

    return `🌍 ${title}:\n${listStr}\n(تعداد: ${countries.length})`;
}

export function getCountryByName(name: string) {
    name = name.toLowerCase().trim();

    for (const continent in countries) {
        const continentData = (countries as any)[continent];
        for (const key in continentData) {
            const country = continentData[key];
            // بررسی هم بر اساس کلید، هم نام فارسی/ایموجی
            if (
                key.toLowerCase() === name ||
                country.name.toLowerCase().includes(name)
            ) {
                return country;
            }
        }
    }

    return null; // اگر پیدا نشد
}

export async function getCountryByUserId(userId: number): Promise<string | null> {
    const user = await prisma.user.findUnique({
        where: { userid:userId },
        select: { country: true },
    });

    return user?.country || null;
}