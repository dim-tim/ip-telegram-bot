import {
  Ctx,
  Hears,
  Help,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';
import { AppService } from './app.service';
import { showLastItem, showList } from './app.utils';
import { Context } from './context.interface';
import { isIPAddress } from 'ip-address-validator';

// const ips = [
//   {
//     id: 1,
//     ip: '192.1.1.1',
//     info: [
//       {
//         id: 1,
//         user_name: '@dkteluser',
//         date: '01-01-2023',
//         country: 'Argentina',
//         city: 'Bueno',
//         lat: '123213',
//         lon: '1232121',
//       },
//     ],
//   },
//   {
//     id: 2,
//     ip: '192.1.1.2',
//     info: [
//       {
//         id: 3,
//         user_name: '@sasa',
//         date: '01-01-2023',
//         country: 'Belarus',
//         city: 'Minsk',
//         lat: '123213',
//         lon: '1232121',
//       },
//     ],
//   },
// ];

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    console.log(ctx.session);
    ctx.session.type = 'create';
    await ctx.reply(`Привіт ${ctx.message.from?.first_name} ! 👋`);
    await ctx.reply('Вас вітає айпі-бот!', actionButtons());
  }

  @Help()
  async helpCommand(ctx: Context) {
    ctx.session.type = 'help';
    await ctx.reply(`/start - Перезапустить бота`);
    await ctx.reply('/help - Помощь', actionButtons());
  }

  @Hears('🔎 Пробить IP')
  async checkIp(ctx: Context) {
    ctx.session.type = 'check';
    await ctx.reply('Кидай сюда айпишник ⬇');
  }

  @Hears('📋 Список ip')
  async listIps(ctx: Context) {
    const ips = await this.appService.getAll();
    await ctx.reply(showList(ips));
  }

  @Hears('🆘 Помощь')
  async help(ctx: Context) {
    ctx.session.type = 'help';
    await ctx.reply(`/start - Перезапустить бота`);
    await ctx.reply('/help - Помощь', actionButtons());
  }

  // @Hears('⚡️ Создать задачу')
  // async createTask(ctx: Context) {
  //   ctx.session.type = 'create';
  //   await ctx.reply('Опиши задачу: ');
  // }
  //
  // @Hears('📋 Список задач')
  // async listTask(ctx: Context) {
  //   const todos = await this.appService.getAll();
  //   await ctx.reply(showList(todos));
  // }
  //
  // @Hears('✅ Завершить')
  // async doneTask(ctx: Context) {
  //   ctx.session.type = 'done';
  //   await ctx.deleteMessage();
  //   await ctx.reply('Напиши ID задачи: ');
  // }
  //
  // @Hears('✏️ Редактирование')
  // async editTask(ctx: Context) {
  //   ctx.session.type = 'edit';
  //   await ctx.deleteMessage();
  //   await ctx.replyWithHTML(
  //     'Напиши ID и новое название задачи: \n\n' +
  //       'В формате - <b>1 | Новое название</b>',
  //   );
  // }
  //
  // @Hears('❌ Удаление')
  // async deleteTask(ctx: Context) {
  //   ctx.session.type = 'remove'
  //   await ctx.deleteMessage()
  //   await ctx.reply('Напиши ID задачи: ')
  // }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'create') {
      const ip = message.trim();
      if (message && isIPAddress(ip)) {
        await ctx.reply('Айпишник прошел валидацию...');

        const addressFromDB = await this.appService.getByIp(ip);

        await ctx.reply('Пробиваем инфу по айпишнику...');
        const ipServerResponse = await this.appService.getHttpInformationByIP(
          ip,
        );

        if (!ipServerResponse) {
          await ctx.reply('Не могу получить инфу с ipqualityscore.com 😭');
          await ctx.reply('IP не был сохранен в базу.');
          return;
        }

        if (addressFromDB) {
          await ctx.reply(`IP ${ip} уже есть в базе...`);
          await ctx.reply(`Новый IP (${ip}) принят...`);
          const saved = await this.appService.updateAddress(
            ip,
            ctx.message.from?.username ? ctx.message.from?.username : '',
            addressFromDB,
            ipServerResponse,
          );
          if (saved) {
            await ctx.reply(showLastItem(saved));
          } else {
            await ctx.reply(`Не смог сохранить IP в базу...`);
          }
        } else {
          await ctx.reply(`Новый IP ${ip} принят...`);
          const saved = await this.appService.createAddress(
            ip,
            ctx.message.from?.username ? ctx.message.from?.username : '',
            ipServerResponse,
          );
          if (saved) {
            console.log(saved);
            await ctx.reply(showLastItem(saved));
          } else {
            await ctx.reply(`Не смог сохранить IP в базу...`);
          }
        }
      } else {
        // await ctx.deleteMessage();
        await ctx.reply('Введите корректный айпи');
      }
    }
    // if (ctx.session.type === 'create') {
    //   const todos = await this.appService.createTask(message)
    //   await ctx.reply(showList(todos))
    // }
    //
    // if (ctx.session.type === 'done') {
    //   const todos = await this.appService.doneTask(Number(message))
    //
    //   if (!todos) {
    //     await ctx.deleteMessage()
    //     await ctx.reply('Задачи с таким ID не найдено!')
    //     return
    //   }
    //
    //   await ctx.reply(showList(todos))
    // }
    //
    // if (ctx.session.type === 'edit') {
    //   const [taskId, taskName] = message.split(' | ')
    //   const todos = await this.appService.editTask(Number(taskId), taskName)
    //
    //   if (!todos) {
    //     await ctx.deleteMessage()
    //     await ctx.reply('Задачи с таким ID не найдено!')
    //     return
    //   }
    //
    //   await ctx.reply(showList(todos))
    // }
    //
    // if (ctx.session.type === 'remove') {
    //   const todos = await this.appService.deleteTask(Number(message))
    //
    //   if (!todos) {
    //     await ctx.deleteMessage()
    //     await ctx.reply('Задачи с таким ID не найдено!')
    //     return
    //   }
    //
    //   await ctx.reply(showList(todos))
    // }
  }
}
