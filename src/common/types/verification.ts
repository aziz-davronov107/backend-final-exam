export enum EverifationsTypes {
  REGISTER = 'register',
  RESET_PASSWORD = 'reset_password',
  EDIT_PHONE = 'edit_phone',
}

export interface ICheckOtp {
  type: EverifationsTypes;
  phone: string;
  otp: string;
}
