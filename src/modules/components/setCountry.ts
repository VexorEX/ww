import {Markup} from 'telegraf';



export const setCountry = (bot) => {
    const ctx = bot.ctx;
    bot.action(
        'setCountry_'
    )
}

export default setCountry;