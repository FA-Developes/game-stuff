

export class XHR {
  constructor(public baseUrl: string, public headers = {"Content-Type": "application/json"}) {
  }

  request(method: string, url: string, body?: any) {
    return new Promise((res, rej) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, this.baseUrl + url);
      for(let key in this.headers) {
        xhr.setRequestHeader(key, this.headers[key])
      }
      xhr.onload = () => xhr.status < 300? res(xhr.response) : rej(JSON.parse(xhr.response));
      xhr.onerror = (e) => rej(e);
      if(body) {
        xhr.send(JSON.stringify(body));
      } else {
        xhr.send();
      }
    })
  }

  get(url:string) {
    return this.request("GET",url);
  }

  post(url:string, body: any) {
    return this.request("POST",url, body);
  }
}

export const apiXHR = new XHR("https://test-app-fa.herokuapp.com/")

export type ObjectMap<T> = {[name: string]: T};

export function htmlToElement(html: string): HTMLElement {
  let template = document.createElement('template');
  template.innerHTML = html.trim(); 
  if(template.content) {
    return template.content.firstChild as HTMLElement;
  } else {
    return template as HTMLElement;
  }
}

export function buildForm(content: string, submitCb: (input:any) => void) {
  let form = document.createElement('form');
  form.innerHTML = content;
  form.onsubmit = (e) => {
    e.preventDefault();
    let formdata = new FormData(form);
    let obj = {};
    formdata.forEach(((value, key) => obj[key] = value))
    submitCb(obj);
  }
  return form;
}