<template>
  <div class="idle-game">
    <h2>挂机游戏</h2>
    <p>金币: {{ coins }}</p>
    <button @click="collectCoins">领取金币</button>
    <p>每秒产出: {{ coinsPerSecond }}</p>
    <button @click="upgrade" :disabled="coins < upgradeCost">
      升级（花费 {{ upgradeCost }} 金币）
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const coins = ref(Number(localStorage.getItem('idleCoins') || 0));
const coinsPerSecond = ref(Number(localStorage.getItem('idleCPS') || 1));
const upgradeCost = ref(coinsPerSecond.value * 10);

let idleTimer: number;

function collectCoins() {
  coins.value += coinsPerSecond.value;
  saveIdleData();
}

function upgrade() {
  if (coins.value >= upgradeCost.value) {
    coins.value -= upgradeCost.value;
    coinsPerSecond.value += 1;
    upgradeCost.value = coinsPerSecond.value * 10;
    saveIdleData();
  }
}

function saveIdleData() {
  localStorage.setItem('idleCoins', String(coins.value));
  localStorage.setItem('idleCPS', String(coinsPerSecond.value));
}

onMounted(() => {
  idleTimer = setInterval(() => {
    coins.value += coinsPerSecond.value;
    saveIdleData();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(idleTimer);
});
</script>

<style scoped>
.idle-game {
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
  width: 300px;
  text-align: center;
}
.idle-game button {
  margin: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  background: #4c6ef5;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.idle-game button:disabled {
  background: #adb5bd;
  cursor: not-allowed;
}
.idle-game button:not(:disabled):hover {
  background: #3b5bdb;
}
</style> 