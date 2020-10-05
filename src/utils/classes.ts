export function addClass(el: Element, ...classes: string[]) {
  return classes.flatMap(c => c.split(/\s+/)).forEach(c => c && el.classList.add(c));
}

export function removeClass(el: Element, ...classes: string[]) {
  return classes.flatMap(c => c.split(/\s+/)).forEach(c => el.classList.remove(c));
}

export function hasClass(el: Element, className: string) {
  return el.classList.contains(className);
}

export function classNames(obj: Record<string, boolean>) {
  return Object.entries(obj).reduce((acc, [k, v]) => (v ? acc + k + ' ' : acc), '');
}
