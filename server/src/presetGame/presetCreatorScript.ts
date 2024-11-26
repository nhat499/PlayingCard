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

// boards
// const boardStart = {x: 300, y:300 }

// 6 player boards
// row 1
// row 2
// row 3

// additional elements
for (let r = 0; r < resource.length; r++) {
  const mat = resource[r];

  // hex
  for (let i = 0; i < 5; i++) {
    board[`ITEM-${mat}${i}`] = {
      sides: 6,
      rotate: 45,
      color: hexColor[r],
      id: `ITEM-${mat}${i}`,
      name: mat,
      parent: "BOARD",
      zIndex: 0,
      width: 150,
      height: 150,
      top: 0,
      left: 150 * r,
      disabled: false,
      isHidden: false,
    };
  }

  // stack
  if (r < resource.length - 1) {
    board[`STACK-${mat}`] = {
      id: `STACK-${mat}`,
      name: `${mat}Stack`,
      parent: "BOARD",
      rotate: 0,
      zIndex: 0,
      width: 80,
      height: 100,
      top: 160,
      left: 90 * r + 10,
      disabled: false,
      data: [],
    };

    // item in stack
    for (let i = 0; i < 18; i++) {
      board[`STACK-${mat}`].data.push({
        sides: 4,
        rotate: 0,
        color: hexColor[r],
        id: `ITEM-${mat}-CARD${i}`,
        name: mat,
        parent: `STACK-${mat}`,
        zIndex: 0,
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

// dev cards
board[`STACK-DEV`] = {
  id: `STACK-DEV`,
  name: `DEVStack`,
  parent: "BOARD",
  rotate: 0,
  zIndex: 0,
  width: 80,
  height: 100,
  top: 160,
  left: 90 * 5 + 10,
  disabled: false,
  data: [],
};

// item in stack
// knights
for (let i = 0; i < 14; i++) {
  board[`STACK-DEV`].data.push({
    sides: 4,
    rotate: 0,
    color: "white",
    id: `ITEM-DEV-KNIGHTS-CARD${i}`,
    name: "Knights",
    parent: `STACK-DEV`,
    zIndex: 0,
    width: 80,
    height: 100,
    top: 0,
    left: 0,
    disabled: false,
    isHidden: false,
  });
}

// victory points
for (let i = 0; i < 5; i++) {
  board[`STACK-DEV`].data.push({
    sides: 4,
    rotate: 0,
    color: "white",
    id: `ITEM-DEV-VICTORY-CARD${i}`,
    name: "1 Victory Point",
    parent: `STACK-DEV`,
    zIndex: 0,
    width: 80,
    height: 100,
    top: 0,
    left: 0,
    disabled: false,
    isHidden: false,
  });
}

// road building
for (let i = 0; i < 2; i++) {
  board[`STACK-DEV`].data.push({
    sides: 4,
    rotate: 0,
    color: "white",
    id: `ITEM-DEV-ROAD-CARD${i}`,
    name: "Road Building",
    parent: `STACK-DEV`,
    zIndex: 0,
    width: 80,
    height: 100,
    top: 0,
    left: 0,
    disabled: false,
    isHidden: false,
  });
}

// year of plenty
for (let i = 0; i < 2; i++) {
  board[`STACK-DEV`].data.push({
    sides: 4,
    rotate: 0,
    color: "white",
    id: `ITEM-DEV-PLENTY-CARD${i}`,
    name: "Any 2 Resources",
    parent: `STACK-DEV`,
    zIndex: 0,
    width: 80,
    height: 100,
    top: 0,
    left: 0,
    disabled: false,
    isHidden: false,
  });
}

// monopoly
for (let i = 0; i < 2; i++) {
  board[`STACK-DEV`].data.push({
    sides: 4,
    rotate: 0,
    color: "white",
    id: `ITEM-DEV-MONOPOLY-CARD${i}`,
    name: "Monopoly",
    parent: `STACK-DEV`,
    zIndex: 0,
    width: 80,
    height: 100,
    top: 0,
    left: 0,
    disabled: false,
    isHidden: false,
  });
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
      left: 10 + 35 * (i - 1),
      top: 310,
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
      left: 50 * c + 10,
      top: 350,
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
      width: 25,
      height: 70,
      name: "",
      isHidden: false,
      left: 50 * c + 10,
      top: 400,
      zIndex: 0,
      rotate: 30,
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
  left: 10,
  top: 460,
  zIndex: 0,
  rotate: 45,
  disabled: false,
  parent: "BOARD",
};

// ports
//4, ? 3:1
for (let i = 0; i < 4; i++) {
  board[`ITEM-QUEST-PORT-${i}`] = {
    id: `ITEM-QUEST-PORT-${i}`,
    color: "white",
    disabled: false,
    height: 50,
    width: 50,
    left: 70,
    top: 460,
    name: "? \n 3:1",
    parent: "BOARD",
    sides: 4,
    rotate: 0,
    isHidden: false,
    zIndex: 0,
  };
}

// sheep, rock, hay, brick
for (let i = 0; i < resource.length - 1; i++) {
  const r = resource[i];
  board[`ITEM-${r}-PORT`] = {
    id: `ITEM-${r}-PORT`,
    color: "white",
    disabled: false,
    height: 50,
    width: 50,
    left: 130,
    top: 460,
    name: `${r} \n 2:1`,
    parent: "BOARD",
    sides: 4,
    rotate: 0,
    isHidden: false,
    zIndex: 0,
  };
}

// console.log(JSON.stringify(board, null, 2))
fs.writeFile(
  "./src/presetGame/catan.json",
  JSON.stringify(board, null, 2),
  (err) => {
    if (err) console.log("error");
    else console.log("success");
  }
);
