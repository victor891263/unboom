<template>
    <div class="max-w-full h-screen flex flex-col justify-center py-6 lg:py-20">
        <div class="grid grid-cols-3 mb-3">
            <div class="justify-self-start"><span class="font-semibold">{{ flagsLeft }}</span> left</div>
            <div class="justify-self-center">{{ (gameStatus === 'won' && '🏆') || (gameStatus === 'lost' && '☠') || emoji }}</div>
            <div class="justify-self-end font-semibold">{{ timeString }}</div>
        </div>
        <div
            :style="{ 'gridTemplateColumns': `repeat(${columnCount}, auto)` }"
            class="max-w-full overflow-auto grid gap-1 p-2 bg-gray-100 border border-gray-400 rounded-lg dark:bg-gray-800 dark:border-gray-600"
            :class="(gameStatus === 'lost' && 'border-red-500 dark:border-red-500') || (gameStatus === 'won' && 'border-green-500 dark:border-green-500')"
        >
            <template v-for="(row, index) in board" :key="index">
                <button
                    v-for="(tile, index) in row"
                    @click="() => checkForBomb(board, tile)"
                    @contextmenu="e => placeFlag(e, tile)"
                    :disabled="gameStatus !== 'playing'"
                    :class="'h-9 w-9 rounded ' + classes[tile.status]"
                    :key="index"
                >{{ getLabel(tile) }}</button>
            </template>
        </div>
        <div class="mt-5 flex items-center justify-between">
            <button @click="restartGame">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
            <div class="flex items-center justify-center gap-2">
                <ThemeButton />
                <a>
                    <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z"></path></svg>
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, defineProps, reactive, ref} from 'vue'
import {useRouter} from "vue-router";
import { checkLose, checkWin, createBoard, markTile, revealTile } from '@/logic/game'
import ThemeButton from "@/components/ThemeButton"
import {Tile} from "@/types"

const props = defineProps<{
    rowCount: number,
    columnCount: number,
    bombCount: number,
    emoji: string
}>()
const router = useRouter()

const classes = {
    hidden: 'bg-gray-300 dark:bg-gray-600',
    bomb: 'bg-gray-200 dark:bg-gray-700',
    number: 'bg-gray-200 dark:bg-gray-700',
    marked: 'bg-gray-300 dark:bg-gray-600',
    detonated: 'bg-red-300 dark:bg-red-500/50'
}

const labels = {
    hidden: '',
    bomb: '💣',
    marked: '🚩',
    detonated: '💥'
}

function getLabel(tile: Tile) {
    if (tile.status === 'number') {
        if (tile.nearbyBombs > 0) return tile.nearbyBombs
        else return ''
    } else {
        return labels[tile.status]
    }
}

// create the board array of arrays
const board = reactive(createBoard(props.rowCount, props.columnCount, props.bombCount))
const flagsLeft = ref(props.bombCount)
const gameStatus = ref<'playing' | 'won' | 'lost'>('playing')
const totalBombCount = ref(props.bombCount)

// refs for the timer
const time = ref(0)
const isTimerRunning = ref(false)
const timerId = ref<null | number>(null)

function startTimer() {
    if (!isTimerRunning.value) {
        timerId.value = setInterval(() => {
            time.value++
        }, 1000)
        isTimerRunning.value = true
    }
}

function stopTimer() {
    if (isTimerRunning.value && timerId.value !== null) {
        clearInterval(timerId.value)
        timerId.value = null
        isTimerRunning.value = false
    }
}

const timeString = computed(() => {
    // convert the time to minutes and seconds
    const minutes = Math.floor(time.value / 60)
    const seconds = time.value % 60

    // add leading zeros if necessary
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')

    // set the timer text to the formatted time
    return `${formattedMinutes}:${formattedSeconds}`
})

// reset the game
function restartGame() {
    router.go()
}

function checkForBomb(board, tile) {
    // start timer
    startTimer()

    revealTile(board, tile)
    checkGameEnd(tile)
}

function placeFlag(e, tile) {
    e.preventDefault()

    // start timer
    startTimer()

    // only place flag if user still has flags left OR if user has no flags left but user clicked on a tile that already has a flag, remove that flag
    if (flagsLeft.value > 0 || (flagsLeft.value <= 0 && tile.status === 'marked')) {
        markTile(tile) // sets the data-status of the tile to marked (which also changes its style)
        flagsLeft.value = getBombsLeft() // change flag count every time a flag is used to mark a tile
    }
}

// count the number of flags available based on how many are used and how many bombs are there
function getBombsLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === 'marked').length;
    }, 0)
    return props.bombCount - markedTilesCount
}

function checkGameEnd(pressedTile: Tile) {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win) {
        gameStatus.value = 'won'
        stopTimer()
    }

    if (lose) {
        // if the player lost, reveal all bombs and remove all marks
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === 'marked') markTile(tile) // if the tile is marked, then unmark it
                if (tile.bomb) revealTile(board, tile) // if the tile is a bomb, reveal it
            })
        })
        pressedTile.status = 'detonated'
        gameStatus.value = 'lost'
        stopTimer()
    }
}
</script>