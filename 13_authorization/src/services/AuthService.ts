import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import { UserResponse } from "../models/response/UserResponse";
import { BodyResponse } from "../models/response/BodyResponse";

export default class AuthService {
  static getToken() {
    return localStorage.getItem("access_token");
  }

  static setToken(accessToken: string) {
    localStorage.setItem("access_token", accessToken);
  }

  static getRefreshToken() {
    return localStorage.getItem("refresh_token");
  }

  static setRefreshToken(refrehToken: string) {
    localStorage.setItem("refresh_token", refrehToken);
  }

  static hasRefreshToken() {
    return !!localStorage.getItem("refresh_token");
  }

  static async login(email: string, password: string) {
    const response = await $api.post<AuthResponse>(
      "/login",
      {},
      {
        params: {
          email,
          password,
        },
      }
    );

    const { status, message } = response.data as AuthResponse["body"];

    if (status && status === "error") {
      return Promise.reject(message);
    }

    const { statusCode, body } = response.data;
    if (
      statusCode &&
      statusCode === 200 &&
      body.access_token &&
      body.refresh_token
    ) {
      this.setToken(body.access_token);
      this.setRefreshToken(body.refresh_token);
    }
    return statusCode;
  }

  static async registration(email: string, password: string) {
    const response = await $api.post<BodyResponse>("/sign_up", {
      email,
      password,
    });

    const { status, message } = response.data;
    if (status === "Ok") {
      return message;
    }
    if (status === "error") {
      return Promise.reject(message);
    }
  }

  static async getUser() {
    const response = await $api.get<UserResponse>("/me");

    const { statusCode, body } = response.data;

    if (statusCode === 200) {
      return body.message;
    } else {
      return Promise.reject(body.message);
    }
  }
}
