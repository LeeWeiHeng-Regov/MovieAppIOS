declare interface IAuthenticationFailedResponse {
  name: string;
  message: string;
  details: {
    message: string;
    name: string;
  };
}
