import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      // Markup.button.callback('🔎 Пробить IP', 'create'),
      Markup.button.callback('📋 Список ip', 'list'),
      // Markup.button.callback('📋 Как часто использовался айпи', 'list'),
      // Markup.button.callback('📋 Инфа по конкретному айпи', 'list'),
      // Markup.button.callback('📋 Последняя инфа по айпи', 'list'),
      // Markup.button.callback('✅ Завершить', 'done'),
      // Markup.button.callback('✏️ Редактирование', 'edit'),
      // Markup.button.callback('❌ Удаление', 'delete'),
      Markup.button.callback('🆘 Помощь', 'help'),
    ],
    {
      columns: 2,
    },
  );
}
