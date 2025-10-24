import './scss/styles.scss';

import { Catalog } from './components/Models/Catalog.ts';
import { Cart } from './components/Models/Cart.ts';
import { Customer } from './components/Models/Customer.ts';
import { WebLarekApi } from './components/Models/WebLarekApi.ts';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

import { IOrderRequest, TPayment } from './types/index.ts';

import { EventEmitter } from './components/base/Events.ts';

import { Basket } from './components/Views/Basket.ts';
import { Gallery } from './components/Views/Gallery.ts';
import { Header } from './components/Views/Header.ts';
import { Modal } from './components/Views/Modal.ts';
import { SuccessfulOrder } from './components/Views/SuccessfulOrder.ts';

import { CardBasket } from './components/Views/Cards/CardBasket.ts';
import { CardCatalog } from './components/Views/Cards/CardCatalog.ts';
import { CardPreview } from './components/Views/Cards/CardPreview.ts';

import { ContactsForm } from './components/Views/Forms/ContactsForm.ts';
import { OrderForm } from './components/Views/Forms/OrderForm.ts';

import { ensureElement, cloneTemplate } from './utils/utils.ts';

const events = new EventEmitter();

const productsModel = new Catalog();
const cartModel = new Cart();
const customerModel = new Customer();

const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('.modal'));

const successfulOrderTmpl = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTmpl = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTmpl = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTmpl = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTmpl = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTmpl = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTmpl = ensureElement<HTMLTemplateElement>('#contacts');

const basket = new Basket(events, cloneTemplate(basketTmpl));
const orderForm = new OrderForm(events, cloneTemplate(orderFormTmpl));
const contactsForm = new ContactsForm(events, cloneTemplate(contactsFormTmpl));
const successfulOrder = new SuccessfulOrder(events, cloneTemplate(successfulOrderTmpl));
const cardPreview = new CardPreview(events, cloneTemplate(cardPreviewTmpl));

function renderCatalog() {
  const products = productsModel.getProductsList();
  const items = products.map((item) => {
    const card = new CardCatalog(events, cloneTemplate(cardCatalogTmpl));
    return card.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
  gallery.render({ catalog: items });
}

productsModel.on('catalog:changed', () => renderCatalog());



events.on('card:open', (data: { card: string }) => {
  const product = productsModel.getProductById(data.card);
  if (!product) return;

  
  const inCart = cartModel.hasProduct(product.id);

  const previewData = {
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description,
    inCart: inCart,
    disabled: product.price === null
  };

  const previewElement = cardPreview.render(previewData);
  modal.content = previewElement;
  modal.open();
  
  if (product.price === null) {
    cardPreview.disableButton();
  }
});

events.on('card:add', (data: { card: string }) => {
  const product = productsModel.getProductById(data.card);
  if (product && product.price !== null) {
    cartModel.addProduct(product);
  }
});

events.on('card:delete', (data: { card: string }) => {
  const product = productsModel.getProductById(data.card);
  if (product) {
    cartModel.removeProduct(product);
  }
});



function renderBasket() {
  const products = cartModel.getProductList();
  const items = products.map((item, index) => {
    const card = new CardBasket(events, cloneTemplate(cardBasketTmpl));
    card.index = index + 1;
    return card.render(item);
  });
  basket.items = items;
  basket.total = cartModel.getTotalPrice();
}

events.on('basket:open', () => {
  renderBasket();
  modal.content = basket.render();
  modal.open();
});

cartModel.on('basket:changed', () => {
  header.counter = cartModel.getTotalProducts();
  renderBasket();
  if (cardPreview) {
    const productId = cardPreview.id;
    const inCart = cartModel.hasProduct(productId);
    cardPreview.inCart = inCart;
    }
  }
);

events.on('basket:ready', () => {
  if (cartModel.getTotalProducts() === 0) {
    return;
  }
  
  customerModel.clearData();
  const customer = customerModel.getData();
  orderForm.payment = customer.payment;
  orderForm.addressValue = customer.address;

  modal.content = orderForm.render();
  modal.open();
});



customerModel.on('form:errors', (errors: any) => {
  orderForm.validateForm(errors);
  contactsForm.validateForm(errors);
});

events.on('order:change', (data: { field: string; value: string }) => {
  if (data.field === 'payment') {
    customerModel.setPayment(data.value as TPayment);
  } else if (data.field === 'address') {
    customerModel.setAddress(data.value);
  } else if (data.field === 'email') {
    customerModel.setEmail(data.value);
  } else if (data.field === 'phone') {
    customerModel.setPhone(data.value);
  }
});

events.on('order:next', () => {
  const customer = customerModel.getData();
  contactsForm.emailValue = customer.email;
  contactsForm.phoneValue = customer.phone;
  
  modal.content = contactsForm.render();
});

events.on("contacts:submit", () => {
  const customer = customerModel.getData();

  const orderData: IOrderRequest = {
    ...customer,
    total: cartModel.getTotalPrice(),
    items: cartModel.getProductList().map((product) => product.id),
  };

larekApi
  .submitOrder(orderData)
  .then(() => {
    cartModel.clear();
    customerModel.clearData();
    successfulOrder.total = orderData.total;
    modal.content = successfulOrder.render();
  })
  .catch((error) => {
    console.error("Ошибка оформления заказа:", error);
  });
});
    
events.on('success:closed', () => {
  cartModel.clear();
  modal.close();
});




larekApi
  .fetchProductsList()
  .then((products) => {
    productsModel.setProductsList(products);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров: ', error);
  });