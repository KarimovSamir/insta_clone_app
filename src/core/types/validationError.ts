// import { HttpStatus } from './http-statuses';

// export type ValidationErrorType = {
//   status: HttpStatus;
//   detail: string;
//   source?: string;
//   code?: string;
// };

export type ValidationErrorType = {
  field: string;
  message: string;
};