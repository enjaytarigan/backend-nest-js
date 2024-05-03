export interface IPasswordHash {
  hash(plainPassword: string): Promise<string>;
  compare(plainPassword: string, encryptedPassword: string): Promise<boolean>;
}
