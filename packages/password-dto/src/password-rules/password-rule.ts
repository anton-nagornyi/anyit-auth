export abstract class PasswordRule {
  abstract validate(password: string): Promise<boolean>;
  abstract description(): string;
}
