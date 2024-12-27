import {
  GameStates,
  Item,
  Player,
  Stack,
} from "./interfaces/gameStateInterface";

export const removeFromStack = ({
  gameStates,
  roomId,
  item,
}: {
  gameStates: GameStates;
  roomId: string;
  item: Item | Stack;
}) => {
  const stack = gameStates[roomId].board[item.parent];

  if (stack && "data" in stack && Array.isArray(stack.data)) {
    if (stack.data[stack.data.length - 1].id === item.id) {
      stack.data.pop();
      return true;
    } else {
      return false;
    }
  }
  return false;
};

export const removeFromHand = ({
  gameStates,
  roomId,
  player,
  item,
}: {
  gameStates: GameStates;
  roomId: string;
  item: Item | Stack;
  player: Player;
}) => {
  const currPlayers = gameStates[roomId].players;
  const index = currPlayers.findIndex(
    (currPlayer) => currPlayer.socketId === player.socketId
  );
  if (index !== -1) {
    delete currPlayers[index].hand[item.id]; // Remove the item from the hand
    return true;
  } else {
    return false;
  }
};

export const removeFromBoard = ({
  gameStates,
  roomId,
  item,
}: {
  gameStates: GameStates;
  roomId: string;
  item: Item | Stack;
}) => {
  const board = gameStates[roomId].board;
  if (board[item.id]) {
    delete board[item.id];
    return true;
  } else {
    return false;
  }
};

export const shuffle = (array: Item[]) => {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
};

export const flipAll = (array: Item[], isHidden: boolean) => {
  for (const item of array) {
    item.isHidden = isHidden;
  }
};


