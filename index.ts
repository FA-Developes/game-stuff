import "./style.scss";
import "./Addons";
import Skillbox from "./Components/Skillbox";
import { Inventory, ItemDto } from "./Components/Inventory";

let uniqueId = 0;
function getUniqueId() {
  return uniqueId++;
}

let items: ItemDto[] = [
  { count: 1, itemTypeName: "sword", id: getUniqueId() },
  { count: 5, itemTypeName: "string" },
]

let items2 = [
  { count: 1, itemTypeName: "sword", id: getUniqueId() },
  { count: 3, itemTypeName: "stick" },
]

let inv = new Inventory("#inventory", "Me", items, 100);
let inv2 = new Inventory("#inventory2", "You", items2, 100);

let strengthBox = Skillbox.generate("skillboxes", "strength", 100);
let agilieBox = Skillbox.generate("skillboxes", "agility", 100);

document.getElementById("add-button").onclick = () => {
  strengthBox.addProgress(-30);
  agilieBox.addProgress(100);
  inv.addItems({ count: 5, itemTypeName: "apple" })
}
