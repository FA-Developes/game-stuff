const tooltip: HTMLElement = document.getElementById("tooltip");

export function addTooltip(element: HTMLElement, content: string) {
  let shown;
  let width = 0;
  let height = 0;
  element.addEventListener("mouseover", (e) => {
    tooltip.style.display = "block";
    tooltip.innerHTML = content;
    height = tooltip.clientHeight;
    width = tooltip.clientWidth;
    shown = true;
  })

  element.addEventListener("mouseout", (e) => {
    tooltip.style.display = "none";
    tooltip.innerHTML = "";
    shown = false;
  })

  element.addEventListener("mousemove", (e) => {
    if (shown) {
      let x = e.pageX;
      let screenWidth = document.body.clientWidth;
      if (x - width / 2 < 10) {
        x = 10 + width / 2;
      } else if (x + width / 2 > screenWidth - 10) {
        x = screenWidth - 10 - width / 2;
      }
      tooltip.style.left = x + "px";
      tooltip.style.top = e.pageY + "px";
      if (e.pageY - height < 20) {
        tooltip.className = "bottom"
      } else {
        tooltip.className = ""
      }
    }
  })
}