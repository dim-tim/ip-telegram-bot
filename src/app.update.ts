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
import { showLastItem, showListIps } from './app.utils';
import { Context } from './context.interface';
import { isIPAddress } from 'ip-address-validator';

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
    await ctx.reply(
      'Щоб зберегти ip - просто вводь його нижче і тисни Enter',
      actionButtons(),
    );
    await ctx.reply(
      'Для отримання додаткових функцій - переходи в меню та дотримуйся інструкцій',
      actionButtons(),
    );
  }

  @Help()
  async helpCommand(ctx: Context) {
    // ctx.session.type = 'help';
    await ctx.reply(`/start - Перезапустить бота`);
    await ctx.reply('/help - Помощь', actionButtons());
  }

  @Hears('🔎 Инфа по ip из базы')
  async checkIp(ctx: Context) {
    ctx.session.type = 'check';
    await ctx.reply('Кидай сюда айпишник ⬇');
  }

  @Hears('📋 Список ip из базы')
  async listIps(ctx: Context) {
    // ctx.session.type = 'list';
    const ips = await this.appService.getAllWithoutInfo();
    console.log('IPS', ips);
    if (ips && ips.length > 0) {
      const messageString = showListIps(ips);

      const max_size = 4096;

      const amount_sliced = messageString.length / max_size;
      let start = 0;
      let end = max_size;
      let message;
      const messagesArray = [];
      for (let i = 0; i < amount_sliced; i++) {
        message = messageString.slice(start, end);
        messagesArray.push(message);
        start = start + max_size;
        end = end + max_size;
      }
      for (const messagesArrayElement of messagesArray) {
        await ctx.reply(messagesArrayElement);
        await new Promise((f) => setTimeout(f, 3000));
      }
    } else {
      await ctx.reply('В базе пока нет ни одного айпишника');
    }
  }

  // @Hears('📋 Список ip')
  // async listIps(ctx: Context) {
  //   const ips = await this.appService.getAll();
  //   await ctx.replyWithHTML(showList(ips));
  // }

  @Hears('❌ Удалить из базы')
  async deleteTask(ctx: Context) {
    ctx.session.type = 'remove';
    // await ctx.deleteMessage();
    await ctx.reply('Введи айпишник, который нужно удалить ⬇');
  }

  @Hears('🆘 Помощь')
  async help(ctx: Context) {
    // ctx.session.type = 'help';
    const helpMsg = '/start - Перезапустить бота' + '\n' + '/help - Помощь';
    await ctx.reply(helpMsg, actionButtons());
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'check') {
      const ip = message.trim();
      const addressFromDB = await this.appService.getByIp(ip);
      if (addressFromDB) {
        await ctx.reply(`Вот что у нас есть по этому ip:`);
        await ctx.replyWithHTML(showLastItem(addressFromDB));
      } else {
        await ctx.reply(`IP ${ip} в базе не найден...`);
      }

      ctx.session.type = 'create';
      return;
    }

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

        let username: string = ctx.message.from?.username
          ? '@' + ctx.message.from?.username
          : null;
        if (!username) {
          username = ctx.message.from?.first_name;
        }

        if (addressFromDB) {
          await ctx.replyWithHTML(`‼‼🚨<b>${ip} уже есть в базе‼‼</b>`);
          await ctx.reply(`Обновляем состояние...`);
          const saved = await this.appService.updateAddress(
            ip,
            username ? username : '',
            addressFromDB,
            ipServerResponse,
          );
          if (saved) {
            await ctx.replyWithHTML(showLastItem(saved));
          } else {
            await ctx.reply(`Не смог обновить IP в базе...`);
          }
        } else {
          await ctx.reply(`Новый IP ${ip} принят...`);
          const saved = await this.appService.createAddress(
            ip,
            username ? username : '',
            ipServerResponse,
          );
          if (saved) {
            console.log(saved);
            await ctx.replyWithHTML(showLastItem(saved));
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
    if (ctx.session.type === 'remove') {
      const ip = message.trim();
      const todos = await this.appService.deleteIP(ip);

      if (!todos) {
        // await ctx.deleteMessage();
        await ctx.reply(`${ip} в базе не найден`);
      } else {
        await ctx.reply(`${ip} удален из базы`);
      }

      ctx.session.type = 'create';
      return;
    }
  }
}
