export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'cash' | 'card' | '';

export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
} 

export interface ICustomer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}


export interface IErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}


export interface IOrderRequest extends ICustomer {
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}