const fs = require('fs');

const board = {};

// wood;
for (let i = 0; i < 5; i++) {
  board[`ITEM-WOOD${i}`] = {
    "sides": 6,
    "rotate": 0,
    "color": "green",
    "id": `ITEM-WOOD${i}`,
    "name": "Wood",
    "parent": "BOARD",
    "zIndex": 1,
    "width": 150,
    "height": 150,
    "top": 0,
    "left": 0,
    "disabled": false,
    "isHidden": false
  }
}

// wood stack
board["STACK-WOOD"] = {
  "id": "STACK-WOOD",
  "name": "WoodStack",
  "parent": "BOARD",
  "rotate": 45,
  "zIndex": 1,
  "width": 80,
  "height": 100,
  "top": 150,
  "left": 0,
  "disabled": false,
  "data": [],
}

// wood cards
for (let i = 0; i < 18; i++) {
  board["STACK-WOOD"].data.push({
    "sides": 4,
    "rotate": 45,
    "color": "green",
    "id": `ITEM-WOOD-CARD${i}`,
    "name": "Wood",
    "parent": "STACK-WOOD",
    "zIndex": 1,
    "width": 80,
    "height": 100,
    "top": 0,
    "left": 0,
    "disabled": false,
    "isHidden": false
  })
}

// hay
for (let i = 0; i < 5; i++) {
  board[`ITEM-HAY${i}`] = {
    "sides": 6,
    "rotate": 0,
    "color": "yellow",
    "id": `ITEM-HAY${i}`,
    "name": "Hay",
    "parent": "BOARD",
    "zIndex": 1,
    "width": 150,
    "height": 150,
    "top": 0,
    "left": 150,
    "disabled": false,
    "isHidden": false
  }
}

// hay stack
board["STACK-HAY"] = {
  "id": "STACK-HAY",
  "name": "HayStack",
  "parent": "BOARD",
  "rotate": 45,
  "zIndex": 1,
  "width": 80,
  "height": 100,
  "top": 250,
  "left": 0,
  "disabled": false,
  "data": [],
}

// hay cards
for (let i = 0; i < 18; i++) {
  board["STACK-HAY"].data.push({
    "sides": 4,
    "rotate": 45,
    "color": "yellow",
    "id": `ITEM-HAY-CARD${i}`,
    "name": "Hay",
    "parent": "STACK-HAY",
    "zIndex": 1,
    "width": 80,
    "height": 100,
    "top": 0,
    "left": 0,
    "disabled": false,
    "isHidden": false
  })
}

// brick
for (let i = 0; i < 5; i++) {
  board[`ITEM-BRICK${i}`] = {
    "sides": 6,
    "rotate": 0,
    "color": "orange",
    "id": `ITEM-BRICK${i}`,
    "name": "Brick",
    "parent": "BOARD",
    "zIndex": 1,
    "width": 150,
    "height": 150,
    "top": 0,
    "left": 300,
    "disabled": false,
    "isHidden": false
  }
}


// brick stack
board["STACK-BRICK"] = {
  "id": "STACK-BRICK",
  "name": "BrickStack",
  "parent": "BOARD",
  "rotate": 45,
  "zIndex": 1,
  "width": 80,
  "height": 100,
  "top": 350,
  "left": 0,
  "disabled": false,
  "data": [],
}

// brick cards
for (let i = 0; i < 18; i++) {
  board["STACK-BRICK"].data.push({
    "sides": 4,
    "rotate": 45,
    "color": "orange",
    "id": `ITEM-BRICK-CARD${i}`,
    "name": "Brick",
    "parent": "STACK-BRICK",
    "zIndex": 1,
    "width": 80,
    "height": 100,
    "top": 0,
    "left": 0,
    "disabled": false,
    "isHidden": false
  })
}

// sheep
for (let i = 0; i < 5; i++) {
  board[`ITEM-SHEEP${i}`] = {
    "sides": 6,
    "rotate": 0,
    "color": "lightgreen",
    "id": `ITEM-SHEEP${i}`,
    "name": "Sheep",
    "parent": "BOARD",
    "zIndex": 1,
    "width": 150,
    "height": 150,
    "top": 0,
    "left": 450,
    "disabled": false,
    "isHidden": false
  }
}

// sheep stack
board["STACK-SHEEP"] = {
  "id": "STACK-SHEEP",
  "name": "SheepStack",
  "parent": "BOARD",
  "rotate": 45,
  "zIndex": 1,
  "width": 80,
  "height": 100,
  "top": 450,
  "left": 0,
  "disabled": false,
  "data": [],
}

// sheep cards
for (let i = 0; i < 18; i++) {
  board["STACK-SHEEP"].data.push({
    "sides": 4,
    "rotate": 45,
    "color": "lightgreen",
    "id": `ITEM-SHEEP-CARD${i}`,
    "name": "Sheep",
    "parent": "STACK-SHEEP",
    "zIndex": 1,
    "width": 80,
    "height": 100,
    "top": 0,
    "left": 0,
    "disabled": false,
    "isHidden": false
  })
}

// ROCK
for (let i = 0; i < 5; i++) {
  board[`ITEM-ROCK${i}`] = {
    "sides": 6,
    "rotate": 0,
    "color": "lightgray",
    "id": `ITEM-ROCK${i}`,
    "name": "Rock",
    "parent": "BOARD",
    "zIndex": 1,
    "width": 150,
    "height": 150,
    "top": 0,
    "left": 600,
    "disabled": false,
    "isHidden": false
  }
}

// rock stack
board["STACK-ROCK"] = {
  "id": "STACK-ROCK",
  "name": "RockStack",
  "parent": "BOARD",
  "rotate": 45,
  "zIndex": 1,
  "width": 80,
  "height": 100,
  "top": 550,
  "left": 0,
  "disabled": false,
  "data": [],
}

// rock cards
for (let i = 0; i < 18; i++) {
  board["STACK-ROCK"].data.push({
    "sides": 4,
    "rotate": 45,
    "color": "lightgray",
    "id": `ITEM-ROCK-CARD${i}`,
    "name": "Rock",
    "parent": "STACK-ROCK",
    "zIndex": 1,
    "width": 80,
    "height": 100,
    "top": 0,
    "left": 0,
    "disabled": false,
    "isHidden": false
  })
}

// desert
for (let i = 0; i < 5; i++) {
  board[`ITEM-DESERT${i}`] = {
    "sides": 6,
    "rotate": 0,
    "color": "tan",
    "id": `ITEM-DESERT${i}`,
    "name": "DESERT",
    "parent": "BOARD",
    "zIndex": 1,
    "width": 150,
    "height": 150,
    "top": 0,
    "left": 750,
    "disabled": false,
    "isHidden": false
  }
}


// numbers
for (let i = 1; i < 13; i++) {
  for (let numOfNum = 0; numOfNum < 3; numOfNum++) {

    board[`ITEM-NUMBER${i},${numOfNum}`] = {
      "id": `ITEM-NUMBER${i},${numOfNum}`,
      "sides": 15,
      "color": "tan",
      "width": 30,
      "height": 30,
      "name": `${i}`,
      "isHidden": false,
      "left": 150 + (30 * i - 1),
      "top": 170,
      "zIndex": 0,
      "rotate": 0,
      "disabled": false,
      "parent": "BOARD"
    }
  }
}

const colors = ["blue", "red", "green", "pink", "white", "yellow"];

// houses and road
for (let c = 0; c < colors.length; c++) {
  const color = colors[c];
  // houses
  for (let i = 0; i < 5; i++) {
    board[`ITEM-HOUSE${color},${i}`] = {
      "id": `ITEM-HOUSE${color},${i}`,
      "sides": 5,
      "color": color,
      "width": 40,
      "height": 40,
      "name": "",
      "isHidden": false,
      "left": 150 + (50 * c),
      "top": 210,
      "zIndex": 0,
      "rotate": 36,
      "disabled": false,
      "parent": "BOARD"
    }
  }
  // roads
  for (let i = 0; i < 15; i++) {
    board[`ITEM-ROADS${color},${i}`] = {
      "id": `ITEM-ROADS${color},${i}`,
      "sides": 4,
      "color": color,
      "width": 20,
      "height": 65,
      "name": "",
      "isHidden": false,
      "left": 150 + (50 * c),
      "top": 260,
      "zIndex": 0,
      "rotate": 45,
      "disabled": false,
      "parent": "BOARD"
    }
  }

}

// robber
board[`ITEM-ROBBER`] = {
  "id": "ITEM-ROBBER",
  "sides": 3,
  "color": "gray",
  "width": 40,
  "height": 50,
  "name": "",
  "isHidden": false,
  "left": 150,
  "top": 320,
  "zIndex": 0,
  "rotate": 0,
  "disabled": false,
  "parent": "BOARD"
}

// console.log(JSON.stringify(board, null, 2))
fs.writeFile("./src/presetGame/catan.json", JSON.stringify(board, null, 2), err => {
  if (err) console.log("error")
  else console.log("success");
})