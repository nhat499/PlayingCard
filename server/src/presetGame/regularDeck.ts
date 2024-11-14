import { gameObj, Item, Stack } from "../interfaces/gameStateInterface";

const Suite = ["spade", "club", "diamond", "heart"];

const createRegularDeckObject = () => {
  const object: Item[] = [];
  for (let i = 1; i <= 10; i++) {
    for (const s of Suite) {
      const card: Item = {
        sides: 4,
        rotate: 45,
        color: "white",
        id: `${gameObj.ITEM}${i}${s}`,
        name: `${i} ${s}`,
        parent: `${gameObj.STACK}-regularDeck`,
        zIndex: 1,
        width: 50,
        height: 65,
        top: 0,
        left: 0,
        disabled: false,
        isHidden: false,
      };
      object.push(card);
    }
  }
  for (const s of Suite) {
    const card: Item = {
      sides: 4,
      rotate: 45,
      color: "white",
      id: `${gameObj.ITEM}${"jack"}${s}`,
      name: `${"jack"} ${s}`,
      parent: `${gameObj.STACK}-regularDeck`,
      zIndex: 1,
      width: 50,
      height: 65,
      top: 0,
      left: 0,
      disabled: false,
      isHidden: false,
    };
    object.push(card);
  }
  for (const s of Suite) {
    const card: Item = {
      sides: 4,
      rotate: 45,
      color: "white",
      id: `${gameObj.ITEM}${"queen"}${s}`,
      name: `${"queen"} ${s}`,
      parent: `${gameObj.STACK}-regularDeck`,
      zIndex: 1,
      width: 50,
      height: 65,
      top: 0,
      left: 0,
      disabled: false,
      isHidden: false,
    };
    object.push(card);
  }
  for (const s of Suite) {
    const card: Item = {
      sides: 4,
      rotate: 45,
      color: "white",
      id: `${gameObj.ITEM}${"king"}${s}`,
      name: `${"king"} ${s}`,
      parent: `${gameObj.STACK}-regularDeck`,
      zIndex: 1,
      width: 50,
      height: 65,
      top: 0,
      left: 0,
      disabled: false,
      isHidden: false,
    };
    object.push(card);
  }
  return object;
};

const regularDeck: Stack = {
  id: `${gameObj.STACK}-regularDeck`,
  name: "regularDeck",
  parent: gameObj.BOARD,
  rotate: 45,
  zIndex: 1,
  width: 50,
  height: 70,
  top: 50,
  left: 50,
  disabled: false,
  data: [...createRegularDeckObject()],
};

export default regularDeck;
