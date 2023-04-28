import { InfoEntity } from './entity/info.entity';

export const showListIps = (ips) =>
  `${ips
    .map((item) => {
      const msg = item.ip + '\n';
      return msg;
    })
    .join('')}`;
export const showList = (ips) =>
  `${ips
    .map((item) => {
      let msg = '🚩 ' + item.ip + '\n\n';
      item.info?.map((inf) => {
        let fraudMsg = '🟢 <b>Низкий риск</b>';
        if (inf.fraud_score >= 85) {
          fraudMsg = '⛔ <b>Высокий риск</b>';
        } else if (inf.fraud_score >= 45 && inf.fraud_score < 85) {
          fraudMsg = '⚠ <b>Подозрительный</b>';
        }

        let proxyMsg = '🟢 <b>Not Detected</b>';
        if (inf.proxy || inf.vpn) {
          proxyMsg = '⚠ <b>Proxy/VPN Detected</b>';
        }

        msg =
          msg +
          '📅 ' +
          inf.created_at.toLocaleString() +
          '\n' +
          'Статус: ' +
          fraudMsg +
          '\n' +
          'Fraud Score: ' +
          '<b>' +
          inf.fraud_score +
          '</b>' +
          '\n' +
          'Proxy/VPN: ' +
          proxyMsg +
          '\n' +
          'Частота исп-ия: ' +
          '<b>' +
          item.info.length +
          '</b>' +
          '\n' +
          '👧 ' +
          '@' +
          inf.username +
          '\n' +
          '🌐 ' +
          inf.country_code +
          ', ' +
          inf.city +
          '\n' +
          '📌 lat: ' +
          inf.latitude +
          ', lon: ' +
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

      let fraudMsg = '🟢 <b>Низкий риск</b>';
      if (lastInfo.fraud_score >= 85) {
        fraudMsg = '⛔ <b>Высокий риск</b>';
      } else if (lastInfo.fraud_score >= 45 && lastInfo.fraud_score < 85) {
        fraudMsg = '⚠ <b>Подозрительный</b>';
      }

      let proxyMsg = '🟢 <b>Not Detected</b>';
      if (lastInfo.proxy || lastInfo.vpn) {
        proxyMsg = '⚠ <b>Proxy/VPN Detected</b>';
      }

      let msg = '🚩 ' + address.ip + '\n';
      msg =
        msg +
        '📅 ' +
        lastInfo.created_at.toLocaleString() +
        '\n' +
        'Статус: ' +
        fraudMsg +
        '\n' +
        'Fraud Score: ' +
        '<b>' +
        lastInfo.fraud_score +
        '</b>' +
        '\n' +
        'Proxy/VPN: ' +
        proxyMsg +
        '\n' +
        'Частота использования: ' +
        '<b>' +
        address.info.length +
        '</b>' +
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
