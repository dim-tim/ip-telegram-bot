import { Context as ContextTelegraf } from 'telegraf';

export interface Context extends ContextTelegraf {
  session: {
    type?: 'list' | 'edit' | 'remove' | 'create' | 'check' | 'help';
  };
}
