<template>
    <div class="h-screen flex flex-col items-center px-6 text-gray-700 dark:text-gray-300">
        <div class="max-w-xs w-full my-auto py-10">
            <h1 class="text-3xl font-black tracking-tight text-center text-black dark:text-white">Menu</h1>
            <div class="mt-7 divide-y divide-gray-400 rounded-lg border border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:divide-gray-600">
                <div class="flex items-center justify-between p-2">
                    <button @click="() => changeColumn(-1)" class="bg-gray-300 rounded-md p-2 dark:bg-gray-700">
                        <ChevronIcon class="w-4 h-4 rotate-180" />
                    </button>
                    <div class="">{{ column }} columns</div>
                    <button @click="() => changeColumn(1)" class="bg-gray-300 rounded-md p-2 dark:bg-gray-700">
                        <ChevronIcon class="w-4 h-4" />
                    </button>
                </div>
                <div class="flex items-center justify-between p-2">
                    <button @click="() => changeRow(-1)" class="bg-gray-300 rounded-md p-2 dark:bg-gray-700">
                        <ChevronIcon class="w-4 h-4 rotate-180" />
                    </button>
                    <div class="">{{ row }} rows</div>
                    <button @click="() => changeRow(1)" class="bg-gray-300 rounded-md p-2 dark:bg-gray-700">
                        <ChevronIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div class="flex items-center gap-1.5 mt-4 mb-4">
                <ExclaimIcon class="mt-0.5 w-5 h-5 text-gray-400 dark:text-gray-600" />
                <p class="text-gray-400 dark:text-gray-600">Beat the 20x20 grid to submit your score</p>
            </div>
            <div class="flex gap-2">
                <router-link :to="{ name: 'play', query: { row, column } }" class="block text-center rounded-md bg-gray-300 p-2 w-full dark:bg-gray-700">Start game</router-link>
                <router-link to="/leaderboard" class="block text-center rounded-md bg-gray-300 p-2 w-full dark:bg-gray-700">View score</router-link>
            </div>
            <div class="mt-6 flex items-center justify-center gap-2.5">
                <ThemeButton />
                <a href="https://github.com/victor891263/unboom" target="_blank" rel="noreferrer">
                    <GitHubIcon class="w-6 h-6" />
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ThemeButton from "@/components/ThemeButton.vue"
import ChevronIcon from '@/icons/ChevronIcon.vue'
import ExclaimIcon from '@/icons/ExclaimIcon.vue'
import GitHubIcon from '@/icons/GitHubIcon.vue'

const row = ref(5)
const column = ref(5)

function changeRow(n: number) {
    if (row.value + n < 5 || row.value + n > 20) return
    row.value += n
}

function changeColumn(n: number) {
    if (column.value + n < 5 || column.value + n > 20) return
    column.value += n
}
</script>

<!--

<div class="mt-14 grid grid-cols-4 rounded border border-gray-300 dark:bg-gray-800">
    <button v-for="(d, index) in difficulties" @click="() => difficulty = index" class="py-3" :class="(index === difficulty) && 'bg-gray-200 dark:bg-gray-50 dark:text-black'" :key="index">{{ d.title }}</button>
</div>

<div class="mt-14 flex items-center justify-between p-2 rounded-md border border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
    <button @click="() => changeDifficulty(-1)" class="bg-gray-300 rounded py-2 px-3 dark:bg-gray-700">Easier</button>
    <div class="text-xl">{{ difficulties[difficulty].title }}</div>
    <button @click="() => changeDifficulty(1)" class="bg-gray-300 rounded py-2 px-3 dark:bg-gray-700">Harder</button>
</div>

-->