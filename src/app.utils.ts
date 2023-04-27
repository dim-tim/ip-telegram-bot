import { InfoEntity } from './entity/info.entity';

export const showList = (ips) =>
  `${ips
    .map((item) => {
      let msg = '🚩 ' + item.ip + '\n\n';
      item.info?.map((inf) => {
        msg =
          msg +
          '📅 ' +
          inf.created_at.toLocaleString() +
          '\n' +
          '👧 ' +
          inf.username +
          '\n' +
          '🌐 ' +
          inf.country_code +
          ', ' +
          inf.city +
          '\n' +
          '📌 lat: ' +
          inf.latitude +
          ', lon' +
          inf.longitude +
          '\n\n';
      });
      return msg;
    })
    .join('')}`;

export const showLastItem = (address) => {
  {
    if (address.info.length === 0) {
      return (
        '🚩 ' +
        address.ip +
        '\n' +
        'Дата занесения ip в базу: ' +
        address.created_at.toLocaleString() +
        '\n' +
        'Доп инфы по айпи в базе нету'
      );
    } else {
      const lastInfo: InfoEntity = address.info[address.info.length - 1];
      let msg = '🚩 ' + address.ip + '\n';
      msg =
        msg +
        '📅 ' +
        lastInfo.created_at.toLocaleString() +
        '\n' +
        '👧 ' +
        '@' +
        lastInfo.username +
        '\n' +
        '🌐 ' +
        lastInfo.country_code +
        ', ' +
        lastInfo.city +
        '\n' +
        '📌 lat: ' +
        lastInfo.latitude +
        ', lon: ' +
        lastInfo.longitude +
        '\n\n';
      return msg;
    }
  }
};
