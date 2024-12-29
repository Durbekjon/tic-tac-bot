import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AxiosService {
  private readonly axios: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axios = axios.create({
      baseURL: this.configService.get('BACKEND_URL'),
    });
    this.axios.interceptors.request.use((config) => {
      return config;
    });
  }

  getAxiosInstance() {
    return this.axios;
  }
}
