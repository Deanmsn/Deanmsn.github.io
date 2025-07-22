<template>
  <div class="game-container" @keydown="handleKeydown" tabindex="0" ref="gameArea">
    <div class="header">
      <h1>贪吃蛇</h1>
      <div class="stats">
        <span>分数: {{ score }}</span>
        <button @click="startGame" :disabled="isGameRunning">
          {{ isGameOver ? '重新开始' : '开始游戏' }}
        </button>
      </div>
    </div>
    <div class="game-board">
      <div
        v-for="(_, y) in boardSize"
        :key="y"
        class="row"
      >
        <div
          v-for="(_, x) in boardSize"
          :key="x"
          :class="getCellClass(x, y)"
          class="cell"
        >
<!--          <template v-if="getCellClass(x, y).includes('snake-head')">-->
<!--            <div class="eye left"><div class="pupil"></div></div>-->
<!--            <div class="eye right"><div class="pupil"></div></div>-->
<!--            <div class="tongue"></div>-->
<!--          </template>-->
        </div>
      </div>
      <div v-if="isGameOver" class="game-over-overlay">
        <h2>游戏结束</h2>
        <p>你的分数: {{ score }}</p>
      </div>
    </div>
    <div class="controls">
      <p>使用方向键或 W/A/S/D 控制方向</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

interface Position {
  x: number;
  y: number;
}

const boardSize = 20;
const gameSpeed = ref(200); // ms

const snake = ref<Position[]>([{ x: 10, y: 10 }]);
const food = ref<Position>({ x: 15, y: 15 });
const direction = ref<Position>({ x: 0, y: -1 }); // 'up'
const score = ref(0);
const isGameRunning = ref(false);
const isGameOver = ref(false);
const gameArea = ref<HTMLElement | null>(null);

let gameLoop: number;

function startGame() {
  if (isGameRunning.value) return;
  
  snake.value = [{ x: 10, y: 10 }];
  direction.value = { x: 0, y: -1 };
  score.value = 0;
  isGameOver.value = false;
  isGameRunning.value = true;
  generateFood();

  gameLoop = setInterval(moveSnake, gameSpeed.value);
  
  nextTick(() => {
    gameArea.value?.focus();
  });
}

function moveSnake() {
  if (!isGameRunning.value) return;

  const head: Position = { ...snake.value[0] };
  head.x += direction.value.x;
  head.y += direction.value.y;

  // Check for wall collision
  if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
    endGame();
    return;
  }
  
  // Check for self collision
  if (snake.value.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  snake.value.unshift(head);

  // Check for food collision
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value++;
    // speed up
    if(gameSpeed.value > 80) gameSpeed.value -= 5;
    clearInterval(gameLoop)
    gameLoop = setInterval(moveSnake, gameSpeed.value);
    generateFood();
  } else {
    snake.value.pop();
  }
}

function generateFood() {
  let newFoodPosition: Position;
  do {
    newFoodPosition = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
  } while (snake.value.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
  
  food.value = newFoodPosition;
}

function endGame() {
  isGameRunning.value = false;
  isGameOver.value = true;
  clearInterval(gameLoop);
}

function getCellClass(x: number, y: number) {
  if (!snake.value || snake.value.length === 0) return '';

  const isHead = snake.value[0].x === x && snake.value[0].y === y;

  if (isHead) {
    if (direction.value.y === -1) return 'snake-head dir-up';
    if (direction.value.y === 1) return 'snake-head dir-down';
    if (direction.value.x === -1) return 'snake-head dir-left';
    if (direction.value.x === 1) return 'snake-head dir-right';
    return 'snake-head';
  }

  if (snake.value.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y)) {
    return 'snake';
  }
  if (food.value.x === x && food.value.y === y) {
    return 'food';
  }
  return '';
}

function handleKeydown(e: KeyboardEvent) {
  e.preventDefault();
  const keyMap: { [key: string]: { x: number; y: number } } = {
    ArrowUp: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    d: { x: 1, y: 0 },
  };

  const newDirection = keyMap[e.key];
  if (newDirection) {
    // Prevent snake from reversing
    const isOppositeDirection =
      newDirection.x === -direction.value.x && newDirection.y === -direction.value.y;
    if (!isOppositeDirection) {
      direction.value = newDirection;
    }
  }
}

onMounted(() => {
  gameArea.value?.focus();
});

onUnmounted(() => {
  clearInterval(gameLoop);
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  outline: none;
}

.header {
  width: 90vmin;
  max-width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 1rem;
}

h1 {
  font-size: 1.8rem;
  color: #333;
}

.stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stats span {
  font-size: 1.2rem;
  font-weight: 500;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  background-color: #4c6ef5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #3b5bdb;
}

button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

.game-board {
  position: relative;
  width: 90vmin;
  height: 90vmin;
  max-width: 500px;
  max-height: 500px;
  display: grid;
  grid-template-rows: repeat(v-bind(boardSize), 1fr);
  border: 2px solid #ccc;
  background-color: #fff;
}

.row {
  display: grid;
  grid-template-columns: repeat(v-bind(boardSize), 1fr);
}

.cell {
  width: 100%;
  height: 100%;
}

.snake-head {
  background: #ff6a6a;
  border-radius: 50% 50% 40% 40%;
  position: relative;
  z-index: 2;
}
.eye {
  position: absolute;
  width: 38%;
  height: 38%;
  background: #fff;
  border-radius: 50%;
  border: 2px solid #333;
  top: 18%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}
.eye.left { left: 6%; }
.eye.right { right: 6%; }
.pupil {
  width: 50%;
  height: 50%;
  background: #222;
  border-radius: 50%;
}
.tongue {
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
  width: 30%;
  height: 18%;
  background: #ffb3b3;
  border-radius: 0 0 50% 50%;
  z-index: 2;
}

/* Eye positioning based on direction */
.dir-up .eye.left    { top: 20%; left: 20%; }
.dir-up .eye.right   { top: 20%; right: 20%; }

.dir-down .eye.left  { bottom: 20%; left: 20%; }
.dir-down .eye.right { bottom: 20%; right: 20%; }

.dir-left .eye.left  { top: 20%; left: 20%; }
.dir-left .eye.right { bottom: 20%; left: 20%; }

.dir-right .eye.left { top: 20%; right: 20%; }
.dir-right .eye.right{ bottom: 20%; right: 20%; }

.snake {
  background-color: #34c759;
  border-radius: 20%;
}

.food {
  background-color: #ff3b30;
  border-radius: 50%;
}

.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.game-over-overlay h2 {
  font-size: 2.5rem;
  color: #ff3b30;
  margin: 0;
}
.game-over-overlay p {
  font-size: 1.5rem;
  color: #333;
}

.controls {
  margin-top: 1rem;
  color: #6c757d;
}
</style> 