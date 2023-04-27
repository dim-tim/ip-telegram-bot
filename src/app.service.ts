import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entity/address.entity';
import { Repository } from 'typeorm';
import { InfoEntity } from './entity/info.entity';
import axios from 'axios';
import { IpServerResponse } from './model/ip-server-response';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressEntityRepository: Repository<AddressEntity>,
    @InjectRepository(InfoEntity)
    private readonly infoEntityRepository: Repository<InfoEntity>,
  ) {}

  async getHttpInformationByIP(ip: string) {
    const { data } = await axios.get<IpServerResponse>(
      `https://ipqualityscore.com/api/json/ip/y5Yi0se0ETEqauxQW8qULEyihfow356L/${ip}`,
    );

    console.log(data);

    if (data && data.success) {
      return data;
    }

    return null;
  }

  async getAll() {
    return this.addressEntityRepository.find({
      relations: {
        info: true,
      },
    });
  }

  async getByIp(ip: string) {
    return this.addressEntityRepository.findOne({
      where: {
        ip: ip.trim(),
      },
      relations: {
        info: true,
      },
    });
  }

  async updateAddress(
    ip: string,
    username: string,
    addressFromDB: AddressEntity,
    ipServerResponse: IpServerResponse,
  ) {
    addressFromDB.info.push(this.mapDtoToEntity(ipServerResponse, username));
    return await this.addressEntityRepository.save(addressFromDB);
  }
  async createAddress(
    ip: string,
    username: string,
    ipServerResponse: IpServerResponse,
  ) {
    const address = await this.addressEntityRepository.create({ ip });
    address.info = [this.mapDtoToEntity(ipServerResponse, username)];
    return await this.addressEntityRepository.save(address);
  }

  async deleteAddress(ip: string) {
    const address = await this.getByIp(ip);
    if (!address) return null;

    await this.addressEntityRepository.delete({ ip });
    return address;
  }

  mapDtoToEntity(ipServerResponse: IpServerResponse, username: string) {
    const infoObject = new InfoEntity();
    infoObject.username = username;
    if (ipServerResponse.success) {
      infoObject.success = ipServerResponse.success;
      infoObject.message = ipServerResponse.message;
      infoObject.fraud_score = ipServerResponse.fraud_score;
      infoObject.country_code = ipServerResponse.country_code;
      infoObject.region = ipServerResponse.region;
      infoObject.city = ipServerResponse.city;
      infoObject.ISP = ipServerResponse.ISP;
      infoObject.ASN = ipServerResponse.ASN;
      infoObject.organization = ipServerResponse.organization;
      infoObject.is_crawler = ipServerResponse.is_crawler;
      infoObject.timezone = ipServerResponse.timezone;
      infoObject.mobile = ipServerResponse.mobile;
      infoObject.host = ipServerResponse.host;
      infoObject.proxy = ipServerResponse.proxy;
      infoObject.vpn = ipServerResponse.vpn;
      infoObject.tor = ipServerResponse.tor;
      infoObject.active_vpn = ipServerResponse.active_vpn;
      infoObject.active_tor = ipServerResponse.active_tor;
      infoObject.recent_abuse = ipServerResponse.recent_abuse;
      infoObject.bot_status = ipServerResponse.bot_status;
      infoObject.connection_type = ipServerResponse.connection_type;
      infoObject.abuse_velocity = ipServerResponse.abuse_velocity;
      infoObject.zip_code = ipServerResponse.zip_code;
      infoObject.latitude = ipServerResponse.latitude;
      infoObject.longitude = ipServerResponse.longitude;
      infoObject.request_id = ipServerResponse.request_id;
    } else {
      infoObject.success = ipServerResponse.success;
      infoObject.message = ipServerResponse.message;
    }

    return infoObject;
  }
}
