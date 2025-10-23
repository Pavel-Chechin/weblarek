import { categoryMap } from "../utils/constants";

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

export type TCard = Pick<IProduct, 'title' | 'price' | 'id'>;

export type TCardBasket = {index: number} & TCard;

export type CategoryKey = keyof typeof categoryMap;

export type TCardCatalog = Pick<IProduct, 'category' | 'image'> & TCard;

export type TCardPreview = Pick<IProduct, 'category' | 'image' | 'description' > & TCard & {
  inCart?: boolean;
};

export type TForm = {
  formElement: HTMLFormElement;
  formErrors: HTMLElement;
  nextButton: HTMLButtonElement;
  formInputs: HTMLInputElement[];
}

export type TOrderForm = {
  addressElement: HTMLInputElement;
  cashButton: HTMLButtonElement;
  cardButton: HTMLButtonElement;
} & TForm

export type TContactsForm = {
  emailElement: HTMLInputElement;
  phoneElement: HTMLInputElement;
} & TForm