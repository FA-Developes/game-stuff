import { ObjectMap, htmlToElement } from "../Utils"

interface ItemType {
  name: string,
  weight: number,
  description: string,
  attributes?: any
  unique?: boolean,
}

const ItemTypes: ObjectMap<ItemType> = {
  "string": {
    name: "String",
    weight: 2,
    description: "Used for all types of crafting."
  },
  "stick": {
    name: "Stick",
    weight: 5,
    description: "Used to craft tools and weapons."
  },
  "apple": {
    name: "Apple",
    weight: 3,
    description: "Tasty!"
  },
  "sword": {
    name: "Sword",
    weight: 20,
    description: "To kill you enemies",
    unique: true,
    attributes: {
      damage: 10
    }
  }
}

export interface ItemDto {
  itemTypeName: string,
  count: number,
  id?: number,
  attributes?: any
}


class Item implements ItemDto {
  itemTypeName: string;
  count: number;
  element: HTMLElement;
  id?: number;
  attributes?: any;

  itemType: ItemType;

  constructor(data: ItemDto) {
    Object.assign(this, data);
    this.itemType = ItemTypes[this.itemTypeName];
    if (this.itemType.unique && data.id == undefined) {
      console.error(data, "has no id but is unique")
    }
  }
}
let draggedItem: Item;
let draggedItemInventory: Inventory;
export function dragItem(item: Item, inventory: Inventory, event: DragEvent) {
  event.dataTransfer.setData("type", "item")
  draggedItem = item;
  draggedItemInventory = inventory;
}

function dropItem(inventory: Inventory, event: DragEvent) { 
  event.preventDefault(); 
  if (draggedItem && inventory.canAdd(draggedItem)) { 
    inventory.addItems(draggedItem);
    draggedItemInventory.removeItems(draggedItem);
    draggedItem = draggedItemInventory = null;
  }
}

export class Inventory {
  element: HTMLElement;
  items: Item[];
  selectedItem: Item;

  get weight() {
    return Inventory.calcWeight(this.items);
  }

  constructor(selector: string, public name: string, items: ItemDto[], public maxWeight: number) {
    this.element = document.querySelector(selector);
    this.element.ondrop = (ev) => dropItem(this,ev);
    this.element.ondragover = (ev) => {
      if(draggedItemInventory && this != draggedItemInventory) {
        ev.preventDefault();
      }
    };
    this.items = items.map(i => new Item(i));
    this.buildIventoryBase();
  }

  static calcWeight(items: ItemDto[]) {
    return items.reduce((val, item) => val + (ItemTypes[item.itemTypeName].weight * item.count), 0);
  }

  private buildIventoryBase() {
    let html = `<thead>
    <tr><th colspan="3" class="header">
      <h3>${this.name} <small class="weigth-used"><span class="curr-weight">${this.weight}</span>/${this.maxWeight}w</small></h3>
    </th></tr></thead><tbody>`;
    this.element.innerHTML = html + "</tbody>";
    this.buildIventory();
  }

  private buildIventory() {
    let body = this.element.getElementsByTagName("tbody")[0];
    let weight = this.element.getElementsByClassName("curr-weight")[0];
    weight.innerHTML = this.weight.toString();
    body.innerHTML = "";
    this.items.forEach(item => {
      let element = htmlToElement(`
      <tr title="${item.itemType.description}" draggable="true">
        <td>${item.count}x</td> 
        <td>${item.itemType.name}</td>
        <td>${item.itemType.weight}w</td>
      </tr>`)
      element.addEventListener("click", () => this.selectItem(item));
      element.addEventListener("dragstart", (ev) => dragItem(item, this, ev));
      item.element = element;
      if (this.selectedItem == item) {
        element.classList.add("selected")
      }
      body.appendChild(element);
    })
  }

  selectItem(item: Item) {
    if (this.selectedItem) {
      this.selectedItem.element.classList.remove("selected");
    }
    this.selectedItem = item;
    item.element.classList.add("selected");

  }

  canAdd(...items: ItemDto[]) {
    return Inventory.calcWeight(items) + this.weight <= this.maxWeight;
  }

  addItems(...items: ItemDto[]) {
    items.forEach(item => {
      if (!ItemTypes[item.itemTypeName].unique) {
        let found = this.items.find(i => i.itemTypeName == item.itemTypeName);
        if (found) {
          found.count += item.count;
          return;
        }
      }
      this.items.push(new Item(item));
    })
    this.buildIventory();
  }

  hasItems(...items: ItemDto[]) {
    return items.every(item => {
      if (!ItemTypes[item.itemTypeName].unique) {
        let found = this.items.find(i => i.itemTypeName == item.itemTypeName);
        if (found) {
          return found.count >= item.count;
        }
      } else {
        if (item.id != undefined) {
          return !!this.items.find(i => i.id == item.id);
        } else if (item.count == 1) {
          return !!this.items.find(i => i.itemTypeName == item.itemTypeName);
        } else {
          return this.items.filter(i => i.itemTypeName == item.itemTypeName).length > item.count;
        }
      }
      return false;
    })
  }

  removeItems(...items: ItemDto[]) {
    items.forEach(item => {
      if (!ItemTypes[item.itemTypeName].unique) {
        let index = this.items.findIndex(i => i.itemTypeName == item.itemTypeName);
        let found = this.items[index];
        if (found) {
          found.count -= item.count;
          if (found.count <= 0) {
            this.items.splice(index, 1)
          }
          return;
        }
      } else {
        if (item.id != undefined) {
          this.items.findAndRemove(i => i.id == item.id)
        } else {
          this.items.findAndRemoveAmount((i => i.itemTypeName == item.itemTypeName), item.count)
        }
      }
    })
    this.buildIventory();
  }
}