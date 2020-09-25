import React from "react";
import "./App.css";

const playerHeightMultiplier = 2;
const yPlayerStart = 1 + playerHeightMultiplier;

const MOVE_ACTION = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

const BLOCK_SIZE = 50;
const BLOCK_SPEED = 5;
const BLOCK_ITEM_WIDTH = BLOCK_SIZE * 3;

const player = {
  size: {
    height: playerHeightMultiplier * BLOCK_SIZE,
    width: BLOCK_ITEM_WIDTH,
  },
  pos: 0,
};

const normalizePosition = (x, width, itemWidth) => {
  console.log("normalize", x, width);
  const maxRightPos = width - itemWidth;
  const xPos = x < 0 ? 0 : x > maxRightPos ? maxRightPos : x;

  const numOfRows = Math.trunc(width / player.size.width);
  const curRow = Math.trunc(numOfRows / (width / xPos));
  const newPos = Math.trunc(width / numOfRows) * curRow;
  return newPos;
};

const isPointBetweenPoints = (x1, x2, xPoint) => {
  return x1 <= xPoint && xPoint <= x2;
};

const isCrossPlayerWithBlock = (xPlayer, yPlayer, xBlock, yBlock) => {
  const xLastPlayer = xPlayer + player.size.width;
  const xLastBlock = xBlock + BLOCK_SIZE;
  const yLastPlayer = yPlayer + player.size.height;
  const yLastBlock = yBlock + BLOCK_SIZE;

  return (
    (isPointBetweenPoints(xPlayer, xLastPlayer, xBlock) ||
      isPointBetweenPoints(xPlayer, xLastPlayer, xLastBlock)) &&
    (isPointBetweenPoints(yPlayer, yLastPlayer, yBlock) ||
      isPointBetweenPoints(yPlayer, yLastPlayer, yLastBlock))
  );
};

function App() {
  const canvasRef = React.useRef(null);
  const [moveAction, setMoveAction] = React.useState();

  React.useLayoutEffect(() => {
    const moveAction = (function (width, height, speed, strength) {
      console.log("init");
      var canvas = canvasRef.current,
        ctx = canvas.getContext("2d"),
        blocks = [];
      player.pos = 0;
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = "black";
      var game = setInterval(function () {
        if (Math.random() < strength) {
          let newPos =
            normalizePosition(
              Math.random() * (width - BLOCK_ITEM_WIDTH),
              width,
              BLOCK_ITEM_WIDTH
            ) +
            /// center block relative to player
            player.size.width / 2 -
            BLOCK_SIZE / 2;
          blocks.push([newPos, -BLOCK_SIZE]);
        }
        ctx.clearRect(0, 0, width, height);
        ctx.fillRect(
          player.pos,
          height - yPlayerStart * BLOCK_SIZE,
          player.size.width,
          player.size.height
        );
        for (var i = 0; i < blocks.length; i++) {
          ctx.fillRect(blocks[i][0], blocks[i][1], BLOCK_SIZE, BLOCK_SIZE);
          if (
            isCrossPlayerWithBlock(
              player.pos,
              height - yPlayerStart * BLOCK_SIZE,
              blocks[i][0],
              blocks[i][1]
            )
          ) {
            clearInterval(game);
            alert(
              "Game over. You have " + Math.floor(1000 * strength) + " points."
            );
          }
          if (blocks[i][1] > height - BLOCK_SPEED) {
            blocks.splice(i, 1);
            i--;
          } else {
            blocks[i][1] += BLOCK_SPEED;
          }
        }
        strength += 0.0001;
      }, speed);
      // document.addEventListener(
      //   "mousemove",
      //   function (e) {
      //     player.pos = normalizePosition(e.pageX, width);
      //   },
      //   false
      // );
      return (move) => {
        console.log("move", move);
        switch (move) {
          case MOVE_ACTION.LEFT: {
            player.pos = normalizePosition(
              player.pos - 1.5 * player.size.width,
              width,
              player.size.width
            );
            break;
          }
          case MOVE_ACTION.RIGHT: {
            player.pos = normalizePosition(
              player.pos + 1.5 * player.size.width,
              width,
              player.size.width
            );
            break;
          }
          default: {
            break;
          }
        }
      };
    })(700, 800, 33, 0.001);
    setMoveAction(() => moveAction);
  }, [canvasRef]);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{ background: "#eeeeee" }}
      ></canvas>
      <br></br>
      <button onClick={() => moveAction(MOVE_ACTION.LEFT)}>{"<="}</button>
      <button onClick={() => moveAction(MOVE_ACTION.RIGHT)}>{"=>"}</button>
    </>
  );
}

export default App;
