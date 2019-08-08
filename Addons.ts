//remove(...items:T[]);
  // findAndRemove(callback:(item:T) => boolean);
Array.prototype.remove = function(...items) {
  items.forEach(i => this.splice(this.indexOf(i),1));
}

Array.prototype.findAndRemove = function(callback) {
  this.splice(this.findIndex(callback),1);
}

Array.prototype.findAndRemoveAll = function(callback) {
  for(let i = this.length-1; i >= 0; i--) {
    if(callback(this[i])) {
      this.splice(i,1);
    }
  }
}
Array.prototype.findAndRemoveAmount = function(callback, count) {
  let removeCount = 0;
  for(let i = this.length-1; i >= 0; i--) {
    if(callback(this[i])) {
      this.splice(i,1);
      if(++removeCount == count) {
        break;
      }
    }
  }
}