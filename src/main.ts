import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog.ts';
import { Cart } from './components/Models/Cart.ts';
import { Customer } from './components/Models/Customer.ts';
import { apiProducts } from './utils/data.ts';
import { ICustomer } from './types/index.ts';
import { WebLarekApi } from './components/Models/WebLarekApi.ts';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

const productsModel = new Catalog();
productsModel.setProductsList(apiProducts.items);
console.log('Массив товаров из каталога:' , productsModel.getProductsList());

apiProducts.items.map(item => {
  const itemId = item.id;
  console.log('Поиск товара по id: ', itemId);
  const foundedItem =  productsModel.getProductById(itemId);
  console.log('founded item: ', foundedItem);
});

const selectedItem = productsModel.getProductsList()[0];
const selectedItem2 = productsModel.getProductsList()[1];

productsModel.selectProduct(selectedItem);
console.log('Выбранный товар из каталога: ', productsModel.getSelectedProduct());

const cartModel = new Cart();

cartModel.addProduct(selectedItem);
cartModel.addProduct(selectedItem2);

console.log('Добавили товар в корзину: ', cartModel.getProductList());
console.log('Проверка на наличие товара в корзине:', cartModel.hasProduct(selectedItem.id));
console.log('Общая стоимость товаров в корзине:', cartModel.getTotalPrice());
console.log('Общее количество товаров в корзине:', cartModel.getTotalProducts());

cartModel.removeProduct(selectedItem);
console.log('Удалили товар из корзины: ', cartModel.getProductList());

cartModel.clear();
console.log('Почистили корзину: ', cartModel.getProductList());

const customerModel = new Customer();

const customer: ICustomer = {
  payment: 'cash',
  email: 'bestCustomer@mail.ru',
  phone: '+79012345678',
  address: 'Россия, Тестовый край, г. Тестовск, ул. Тестовая, д. А',
};

customerModel.setData(customer);
console.log('Получены все данные покупателя: ', customerModel.getData());

customerModel.setPayment('');
console.log('Данные покупателя с изменением одного поля: ', customerModel.getData());
customerModel.setAddress('     ');
console.log('Данные покупателя измененими полей: ', customerModel.getData());

customerModel.validateData();
console.log('Валидация данных: ', customerModel.validateData());

customerModel.clearData();
console.log('Данные покупателя удалены: ', customerModel.getData());

const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);

larekApi
  .fetchProductsList()
  .then((products) => {
    console.log('Полученно данных с сервера: ', products.length);
    productsModel.setProductsList(products);
    console.log('Каталог сохранен в массив: ', productsModel.getProductsList());
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров: ', error);
  });