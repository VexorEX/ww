"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const countryUtils_1 = require("../utils/countryUtils");
const countryFilter = new telegraf_1.Composer();
countryFilter.command('filter_rank', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 1)
        return ctx.reply('استفاده: /filter_rank <0-3>\nمثال: /filter_rank 1');
    const rank = Number(args[0]);
    const results = (0, countryUtils_1.getCountriesByRank)(rank);
    ctx.reply((0, countryUtils_1.formatCountryList)(results, `کشورها با rank ${rank}`));
});
countryFilter.command('filter_region', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 1)
        return ctx.reply('استفاده: /filter_region <asia| europe| africa| america| australia>\nمثال: /filter_region asia');
    const region = args[0].toLowerCase();
    const results = (0, countryUtils_1.getCountriesByRegion)(region);
    ctx.reply((0, countryUtils_1.formatCountryList)(results, `کشورها در ${region}`));
});
countryFilter.command('filter_lang', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 1)
        return ctx.reply('استفاده: /filter_lang <زبان>\nمثال: /filter_lang عربی');
    const lang = args[0];
    const results = (0, countryUtils_1.getCountriesByLang)(lang);
    ctx.reply((0, countryUtils_1.formatCountryList)(results, `کشورها با زبان "${lang}"`));
});
countryFilter.command('filter_gov', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 1)
        return ctx.reply('استفاده: /filter_gov <حکومت>\nمثال: /filter_gov جمهوری');
    const gov = args[0];
    const results = (0, countryUtils_1.getCountriesByGov)(gov);
    ctx.reply((0, countryUtils_1.formatCountryList)(results, `کشورها با حکومت "${gov}"`));
});
exports.default = countryFilter;
