import template from '../templates/card.hbs';

export function createMarkup(arr) {
  return arr.map(el => template(el)).join('\n');
}
