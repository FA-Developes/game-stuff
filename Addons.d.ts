interface Array<T> {
  remove(...items:T[]);
  findAndRemove(callback:(item:T) => boolean);
  findAndRemoveAll(callback:(item:T) => boolean);
  findAndRemoveAmount(callback:(item:T) => boolean, count: number);
}