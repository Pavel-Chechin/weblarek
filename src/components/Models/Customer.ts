import { ICustomer, IErrors, TPayment } from '../../types/index.ts'

export class Customer {
  private payment: TPayment = 'card';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  setData(data: ICustomer): void {
    this.payment = data.payment;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
  }

  setPayment(value: TPayment) { 
    this.payment = value; 
  }

  setEmail(value: string) {
    this.email = value;
  }

  setPhone(value: string) {
    this.phone = value;
  }

  setAddress(value: string) {
    this.address = value;
  }

  getData(): ICustomer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clearData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validateData(): IErrors {
    const errors: IErrors = {};
    
    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    } 

    if (!this.email || this.email.trim() === '') {
      errors.email = 'Не указан адрес электронной почты';
    }

    if(!this.phone || this.phone.trim() === '') {
      errors.phone = 'Не указан номер телефона';
    }

    if(!this.address || this.address.trim() === '') {
      errors.address = 'Не указан адрес доставки';
    }

    return errors;
  }
}