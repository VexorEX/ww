import commands from './admin/commands';
import features from './admin/features';
import type { CustomContext } from '../middlewares/userAuth';
import { Composer } from "telegraf";


const command = new Composer<CustomContext>();

command.use(commands)
command.use(features)

export default command;