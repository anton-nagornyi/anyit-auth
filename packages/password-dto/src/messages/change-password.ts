import { RegisterMessage } from '@anyit/messaging';
import { PasswordAuth } from './password-auth';

@RegisterMessage('01HBWPF5T9J5N2F56CWB4BJZAA')
export class ChangePassword extends PasswordAuth {}
