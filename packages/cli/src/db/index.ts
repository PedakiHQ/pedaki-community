import type { Command } from '~/types.ts';

class DbCommand implements Command {
  handle() {
    console.log('db');
  }
}

const cmd = new DbCommand();
export default cmd;
