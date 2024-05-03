export interface IAuthTokenManager {
  createAccessToken<Payload extends object>(payload: Payload): Promise<string>;
  verifyToken<Payload extends object>(token: string): Promise<Payload>;
}
