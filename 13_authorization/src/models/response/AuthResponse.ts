import { BodyResponse } from "./BodyResponse";

type TBody = {
  access_token: string;
  refresh_token: string;
};

export interface AuthResponse {
  body: Partial<TBody & BodyResponse>;
  statusCode: number;
}
