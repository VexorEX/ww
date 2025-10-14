"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountriesByRank = getCountriesByRank;
exports.getCountriesByRegion = getCountriesByRegion;
exports.getCountriesByLang = getCountriesByLang;
exports.getCountriesByGov = getCountriesByGov;
exports.getAvailableCountries = getAvailableCountries;
exports.getAvailableCountriesList = getAvailableCountriesList;
exports.formatCountryList = formatCountryList;
exports.getCountryByName = getCountryByName;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const countries_json_1 = __importDefault(require("../config/countries.json"));
const COUNTRIES_FILE = path_1.default.join(__dirname, '../config/countries.json');
const AVAILABLE_COUNTRIES_FILE = path_1.default.join(__dirname, '../config/fc.json');
let countriesData = null;
function loadCountries() {
    if (!countriesData) {
        countriesData = JSON.parse(fs_1.default.readFileSync(COUNTRIES_FILE, 'utf8'));
    }
    return countriesData;
}
let availableCountries = null;
function loadAvailableCountries() {
    if (!availableCountries) {
        if (fs_1.default.existsSync(AVAILABLE_COUNTRIES_FILE)) {
            const data = fs_1.default.readFileSync(AVAILABLE_COUNTRIES_FILE, 'utf8');
            availableCountries = JSON.parse(data);
        }
        else {
            availableCountries = [];
        }
    }
    return availableCountries;
}
function getCountriesByRank(rank) {
    if (rank < 0 || rank > 3)
        return [];
    const data = loadCountries();
    const results = [];
    Object.entries(data).forEach(([region, countries]) => {
        Object.entries(countries).forEach(([code, country]) => {
            if (country.rank === rank) {
                results.push({ ...country, region, country: code });
            }
        });
    });
    return results;
}
function getCountriesByRegion(region) {
    const data = loadCountries();
    const regionData = data[region];
    if (!regionData)
        return [];
    return Object.values(regionData).map((c) => ({ ...c, region }));
}
function getCountriesByLang(lang) {
    const data = loadCountries();
    const results = [];
    Object.entries(data).forEach(([region, countries]) => {
        Object.entries(countries).forEach(([_, country]) => {
            if ((country.lang || '').toLowerCase().includes(lang.toLowerCase())) {
                results.push({ ...country, region });
            }
        });
    });
    return results;
}
function getCountriesByGov(gov) {
    const data = loadCountries();
    const results = [];
    Object.entries(data).forEach(([region, countries]) => {
        Object.entries(countries).forEach(([_, country]) => {
            if ((country.gov || '').toLowerCase().includes(gov.toLowerCase())) {
                results.push({ ...country, region });
            }
        });
    });
    return results;
}
function getAvailableCountries() { return loadAvailableCountries(); }
function getAvailableCountriesList(name) {
    const allCountries = loadCountries();
    const availableNames = loadAvailableCountries();
    const results = [];
    for (const [region, countries] of Object.entries(allCountries)) {
        for (const [_, country] of Object.entries(countries)) {
            if (availableNames.includes(country.name)) {
                results.push({ ...country, region });
            }
        }
    }
    return results;
}
function formatCountryList(countries, title) {
    if (countries.length === 0)
        return '❌ نتیجه‌ای پیدا نشد!';
    const list = Array.isArray(countries[0])
        ? countries.map(c => c.name).join(' | ')
        : countries.join(' | ');
    return `🌍 ${title}:\n${list}\n(تعداد: ${countries.length})`;
}
function getCountryByName(name) {
    name = name.toLowerCase().trim();
    for (const continent in countries_json_1.default) {
        const continentData = countries_json_1.default[continent];
        for (const key in continentData) {
            const country = continentData[key];
            if (key.toLowerCase() === name ||
                country.name.toLowerCase().includes(name)) {
                return country;
            }
        }
    }
    return null;
}
