import axios, { InternalAxiosRequestConfig } from "axios";
import AuthService from "../services/AuthService";
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = "http://142.93.134.108:1111";

const $api = axios.create({
  baseURL: API_URL,
});

interface IRetry extends InternalAxiosRequestConfig {
  _isRetry: boolean;
}

$api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (!config.headers.Authorization && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

$api.interceptors.response.use(async (res) => {
  const { statusCode, body } = res.data;
  const originalConfig = res.config as IRetry;

  if (
    statusCode &&
    statusCode === 401 &&
    body &&
    body.code === 1006 &&
    AuthService.hasRefreshToken() &&
    !originalConfig._isRetry
  ) {
    try {
      originalConfig._isRetry = true;
      const response = await axios.post<AuthResponse>(
        `${API_URL}/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AuthService.getRefreshToken()}`,
          },
        }
      );

      const { access_token, refresh_token } = response.data.body;
      if (access_token && refresh_token) {
        AuthService.setToken(access_token);
        AuthService.setRefreshToken(refresh_token);

        originalConfig.headers.Authorization = `Bearer ${access_token}`;
        return $api.request(originalConfig);
      }
    } catch (e) {
      console.log("not authorized");
    }
  }

  return res;
});

export default $api;
