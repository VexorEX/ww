"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const userAuth_1 = __importDefault(require("./middlewares/userAuth"));
const economy_1 = __importDefault(require("./modules/economy"));
const military_1 = __importDefault(require("./modules/military"));
const dotenv = __importStar(require("dotenv"));
const countryFilter_1 = __importDefault(require("./modules/countryFilter"));
const registeration_1 = __importDefault(require("./modules/registeration"));
const userPanel_1 = __importDefault(require("./modules/userPanel"));
dotenv.config();
console.log('BOT_TOKEN loaded:', process.env.BOT_TOKEN ? 'YES' : 'NO');
const bot = new telegraf_1.Telegraf("7639208583:AAGI9rCVNrAD-9-fmX5DxEw-FSych-XpgC4", {
    telegram: { apiRoot: "http://46.38.138.55:808/" }
});
bot.use((0, telegraf_1.session)());
bot.use(userAuth_1.default);
bot.use(economy_1.default.middleware());
bot.use(military_1.default.middleware());
bot.use(countryFilter_1.default);
bot.use(registeration_1.default);
bot.use(userPanel_1.default);
bot.launch();
console.log('بات راه‌اندازی شد!');
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
