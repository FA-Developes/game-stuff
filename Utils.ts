
export type ObjectMap<T> = {[name: string]: T};

export function htmlToElement(html: string): HTMLElement {
  var template = document.createElement('template');
  template.innerHTML = html.trim(); 
  if(template.content) {
    return <HTMLElement> template.content.firstChild;
  } else {
    return <HTMLElement> template;
  }
}
