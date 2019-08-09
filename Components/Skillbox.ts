import {htmlToElement, ObjectMap} from "../Utils";

import {addTooltip} from "./Tooltip";
const Skills: ObjectMap<SkillSetting> = {
  strength: {
    name: "Strength",
    thresholds: [0, 300, 470],
    good: true
  },
  agility: {
    name: "Agility",
    thresholds: [50, 150, 500],
    good: true
  }
}

function skillboxTemplate(id: string) {
  return `
    <div class="skillbox" id="${id}">
      <span class="currLevel"></span>
      <span class="title"></span>
      <small class="subtitle"></small>
      <div class="progressbar">
        <div class="progress"></div>
      </div>
    </div>
  `
}

type SkillSetting = { thresholds: number[], name: string, good: boolean }
export default class Skillbox {
  skill: SkillSetting;
  element;
  progressElement: HTMLElement;
  levelElement: HTMLElement;
  titleElement: HTMLElement;
  subtitleElement: HTMLElement;
  currLevel;

  animationQuery = [];
  animating = false;

  constructor(selector: string, type: string, public value: number) {
    this.element = document.querySelector(selector);
    if(!this.element) throw new Error(selector + " not found")
    this.progressElement = this.element.querySelector(".progress");
    this.levelElement = this.element.querySelector(".currLevel");
    this.titleElement = this.element.querySelector(".title");
    this.subtitleElement = this.element.querySelector(".subtitle");
    this.skill = Skills[type];

    addTooltip(this.titleElement, "Very cool")

    this.titleElement.innerText = this.skill.name

    this.calcLevel();
    this.updateProgressBar(false);
  }

  static generate(containerId:string, type:string, value:number, id?) {
    let usedId = id || (containerId + "-" + type)
    let element = htmlToElement(skillboxTemplate(usedId));
    // console.log(element)
    document.getElementById(containerId).appendChild(element);
    return new Skillbox("#"+usedId,type,value);
  }

  addProgress(p) {
    if (p == 0) return;
    let pos = p > 0;
    this.value += p;
    if (this.value < 0) {
      this.value = 0;
    }
    this.updateProgressBar();
    this.subtitleElement.innerText = pos ? `(+${p})` : `(${p})`;
    this.setProggressGood(this.skill.good == pos);
  }

  setProggressGood(good: boolean) {
    let classList = this.subtitleElement.classList;
    if (good && classList.contains("bad")) {
      classList.replace("bad", "good");
    } else if (!good && classList.contains("good")) {
      classList.replace("good", "bad");
    } else {
      classList.add(good ? "good" : "bad")
    }
  }

  updateProgressBar(animate = true) {
    let max = this.skill.thresholds[this.skill.thresholds.length - 1]
    if (this.value < max) {
      let curr = this.skill.thresholds[this.currLevel] || max;
      let last = this.skill.thresholds[this.currLevel - 1] || 0;
      // console.log(curr, last)
      let debug = 0;
      while ((this.value >= curr) || (this.value < last && this.value > 0)) {
        if (this.value >= curr) {
          this.moveProgressbarTo(100, "linear")
        } else if (this.value > 0 && curr != max) {
          this.moveProgressbarTo(0, "linear")
        }
        this.calcLevel();

        curr = this.skill.thresholds[this.currLevel];
        last = this.skill.thresholds[this.currLevel - 1] || 0;

        if (debug++ > 20) {
          throw new Error("to many loops!");
        }
      }

      let newWidth = (this.value - last) / (curr - last) * 100;

      this.moveProgressbarTo(newWidth, animate ? "linear" : undefined)
    } else {
      this.calcLevel()
    }
  }

  moveProgressbarTo(width, style?: string) {
    let oldWidth: number;
    if (this.animationQuery.length) {
      oldWidth = this.animationQuery[this.animationQuery.length - 1].width;
    } else {
      oldWidth = Number(this.progressElement.style.width.replace(/(\d+?)%/, "$1"));
    }
    let t = style ? (width - oldWidth) / 100 : 0;
    this.addProgressAnimation(Math.abs(t * 2), style, width);
  }

  calcLevel() {
    let thresholds = this.skill.thresholds;
    for (let i = 0; i < thresholds.length; i++) {
      if (thresholds[i] > this.value) {
        if (this.currLevel || this.currLevel != i) {
          if (this.currLevel < i) {
            this.moveProgressbarTo(0);
          } else {
            this.moveProgressbarTo(100);
          }
        }
        this.currLevel = i;
        this.levelElement.innerText = i.toString();
        return;
      }
    }
    this.moveProgressbarTo(100, "linear")
    this.currLevel = this.skill.thresholds.length;
    this.levelElement.innerText = "M";
  }

  addProgressAnimation(seconds, style, width) {
    this.animationQuery.push({ seconds, style, width });
    if (!this.animating) {
      this.animating = true;
      this.nextAnimation();
    }
  }

  nextAnimation() {
    if (this.animationQuery.length) {
      let next = this.animationQuery.shift();
      this.progressElement.style.transition = next.seconds + "s " + (next.style || "");
      this.progressElement.style.width = next.width + "%";
      setTimeout(() => this.nextAnimation(), next.seconds * 1000 + 50);
      // console.log(next);
    } else {
      this.animating = false;
    }
  }
}