import { IEvents } from '../../base/Events.ts';
import { ensureElement } from '../../../utils/utils.ts';
import { Card } from '../Cards/Card.ts';
import { TCardCatalog, CategoryKey } from '../../../types/index.ts';
import { categoryMap, CDN_URL } from '../../../utils/constants.ts';

export class CardCatalog extends Card<TCardCatalog> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.container.addEventListener('click', () => {
      this.events.emit('card:open', { card: this.id });
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value);
    }
  }

  set image(value: string) {
    const pngImage = value.replace('.svg', '.png');
    this.setImage(this.imageElement, `${CDN_URL}/${pngImage}`, this.title || '');
  }
} 