export interface ResponseErroreValidationDTO {
  path:string;
  message:string;
  timestamp:string;
  errori:Record<string,string>;
}
