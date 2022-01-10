export interface IRegisterData {
  userId: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  password: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ICustomerData {
  id: string;
  customerName: string;
  address: string;
  telephone: string;
  zip: number;
}

export interface IForecastData {
  forecastId: number;
  userId: string;
  customerId: string;
  price: number;
}

export interface IUserData extends IRegisterData {}

interface ILoginBody {
  status: string;
  message: string;
  access_token: string;
  user: IUserData;
}

interface ICustomerBody {
  status: string;
  message: string;
  data: ICustomerData[];
}

interface IForecastBody {
  status: string;
  message: string;
  data: IForecastData[];
}

interface IUsersBody {
  status: string;
  message: string;
  data: IUserData[];
}

interface IResponseBody {
  status: string;
  message: string;
  data: IUserData;
  activeToken: string;
}

export interface IResponseRegister {
  body: IResponseBody;
}

export interface IResponseLogin {
  body: ILoginBody;
}

export interface IResponseCustomer {
  body: ICustomerBody;
}

export interface IResponseForecast {
  body: IForecastBody;
}

export interface IUserResponse {
  body: IUsersBody;
}
