import fs from "fs";

const board = {};

const resource = ["WOOD", "HAY", "BRICK", "SHEEP", "ROCK", "DESERT"];
const hexColor = [
  "green",
  "tan",
  "orange",
  "lightgreen",
  "lightgray",
  "yellow",
];
for (let r = 0; r < resource.length; r++) {
  const mat = resource[r];
  for (let i = 0; i < 5; i++) {
    board[`ITEM-${mat}${i}`] = {
      sides: 6,
      rotate: 45,
      color: hexColor[r],
      id: `ITEM-${mat}${i}`,
      name: mat,
      parent: "BOARD",
      zIndex: 1,
      width: 150,
      height: 150,
      top: 0,
      left: 150 * r,
      disabled: false,
      isHidden: false,
    };
  }
  if (r < resource.length - 1) {
    board[`STACK-${mat}`] = {
      id: `STACK-${mat}`,
      name: `${mat}Stack`,
      parent: "BOARD",
      rotate: 0,
      zIndex: 1,
      width: 80,
      height: 100,
      top: 150 + 100 * r,
      left: 0,
      disabled: false,
      data: [],
    };

    for (let i = 0; i < 18; i++) {
      board[`STACK-${mat}`].data.push({
        sides: 4,
        rotate: 0,
        color: hexColor[r],
        id: `ITEM-${mat}-CARD${i}`,
        name: mat,
        parent: `STACK-${mat}`,
        zIndex: 1,
        width: 80,
        height: 100,
        top: 0,
        left: 0,
        disabled: false,
        isHidden: false,
      });
    }
  }
}

// numbers
for (let i = 1; i < 13; i++) {
  for (let numOfNum = 0; numOfNum < 3; numOfNum++) {
    board[`ITEM-NUMBER${i},${numOfNum}`] = {
      id: `ITEM-NUMBER${i},${numOfNum}`,
      sides: 15,
      color: "burlywood",
      width: 30,
      height: 30,
      name: `${i}`,
      isHidden: false,
      left: 150 + (30 * i - 1),
      top: 170,
      zIndex: 0,
      rotate: 0,
      disabled: false,
      parent: "BOARD",
    };
  }
}

const colors = ["blue", "red", "green", "pink", "white", "yellow"];
// houses and road
for (let c = 0; c < colors.length; c++) {
  const color = colors[c];
  // houses
  for (let i = 0; i < 5; i++) {
    board[`ITEM-HOUSE${color},${i}`] = {
      id: `ITEM-HOUSE${color},${i}`,
      sides: 5,
      color: color,
      width: 40,
      height: 40,
      name: "",
      isHidden: false,
      left: 150 + 50 * c,
      top: 210,
      zIndex: 0,
      rotate: 10,
      disabled: false,
      parent: "BOARD",
    };
  }
  // roads
  for (let i = 0; i < 15; i++) {
    board[`ITEM-ROADS${color},${i}`] = {
      id: `ITEM-ROADS${color},${i}`,
      sides: 4,
      color: color,
      width: 20,
      height: 65,
      name: "",
      isHidden: false,
      left: 150 + 50 * c,
      top: 260,
      zIndex: 0,
      rotate: 45,
      disabled: false,
      parent: "BOARD",
    };
  }
}

// robber
board[`ITEM-ROBBER`] = {
  id: "ITEM-ROBBER",
  sides: 3,
  color: "gray",
  width: 50,
  height: 50,
  name: "",
  isHidden: false,
  left: 150,
  top: 320,
  zIndex: 0,
  rotate: 45,
  disabled: false,
  parent: "BOARD",
};

// console.log(JSON.stringify(board, null, 2))
fs.writeFile(
  "./src/presetGame/catan.json",
  JSON.stringify(board, null, 2),
  (err) => {
    if (err) console.log("error");
    else console.log("success");
  }
);
