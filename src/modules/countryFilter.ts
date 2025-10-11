import { Composer } from 'telegraf';
import { getCountriesByRank, getCountriesByRegion, getCountriesByLang, getCountriesByGov, formatCountryList } from '../utils/countryUtils';
import type { CustomContext } from '../middlewares/userAuth';



const countryFilter = new Composer<CustomContext>();

// /filter_rank <rank>
countryFilter.command('filter_rank', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 1) return ctx.reply('استفاده: /filter_rank <0-3>\nمثال: /filter_rank 1');

    const rank = Number(args[0]);
    const results = getCountriesByRank(rank);
    ctx.reply(formatCountryList(results, `کشورها با rank ${rank}`));
});

// /filter_region <region>
countryFilter.command('filter_region', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 1) return ctx.reply('استفاده: /filter_region <asia| europe| africa| america| australia>\nمثال: /filter_region asia');

    const region = args[0].toLowerCase() as 'asia' | 'europe' | 'africa' | 'america' | 'australia';
    const results = getCountriesByRegion(region);
    ctx.reply(formatCountryList(results, `کشورها در ${region}`));
});

// /filter_lang <lang>
countryFilter.command('filter_lang', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 1) return ctx.reply('استفاده: /filter_lang <زبان>\nمثال: /filter_lang عربی');

    const lang = args[0];
    const results = getCountriesByLang(lang);
    ctx.reply(formatCountryList(results, `کشورها با زبان "${lang}"`));
});

// /filter_gov <gov>
countryFilter.command('filter_gov', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 1) return ctx.reply('استفاده: /filter_gov <حکومت>\nمثال: /filter_gov جمهوری');

    const gov = args[0];
    const results = getCountriesByGov(gov);
    ctx.reply(formatCountryList(results, `کشورها با حکومت "${gov}"`));
});

export default countryFilter;