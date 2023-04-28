import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('🔎 Инфа по ip из базы', 'check'),
      Markup.button.callback('📋 Список ip из базы', 'list'),
      Markup.button.callback('❌ Удалить из базы', 'remove'),
      Markup.button.callback('🆘 Помощь', 'help'),
    ],
    {
      columns: 3,
    },
  );
}
