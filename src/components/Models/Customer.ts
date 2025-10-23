import { ICustomer, IErrors, TPayment } from '../../types/index.ts'
import { EventEmitter } from "../base/Events";

export class Customer extends EventEmitter {
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
    this.emit('form:errors', this.validateData());
  }

  setEmail(value: string) {
    this.email = value;
    this.emit('form:errors', this.validateData());
  }

  setPhone(value: string) {
    this.phone = value;
    this.emit('form:errors', this.validateData());
  }

  setAddress(value: string) {
    this.address = value;
    this.emit('form:errors', this.validateData());
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

    this.emit('form:errors', errors);
    return errors;
  }
}