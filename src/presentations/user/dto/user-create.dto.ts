export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly profilePicUrl: string;
  readonly createdBy: number | null;
  readonly password: string;
}

export class CreateUserDtoOut {
  constructor(public readonly id: number) {}
}
