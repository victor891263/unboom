<template>
    <div class="h-screen flex flex-col items-center justify-center py-10 px-6">
        <div class="max-w-full">
            <div class="flex items-center justify-between mb-4">
                <div><span class="font-semibold">{{ flagsLeft }}</span> flags left</div>
                <div class="font-semibold">{{ timeString }}</div>
            </div>
            <div
                :style="{ 'gridTemplateColumns': `repeat(${columnCount}, auto)` }"
                class="max-w-full overflow-auto grid gap-1 p-2 bg-gray-100 border border-gray-400 rounded-lg"
                :class="(gameStatus === 'lost' && 'border-red-500') || (gameStatus === 'won' && 'border-green-500')"
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
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, defineProps, reactive, ref} from 'vue'
import { checkLose, checkWin, createBoard, markTile, revealTile } from '@/logic/game'
import {Tile} from "@/types"

const props = defineProps<{
    rowCount: number,
    columnCount: number,
    bombCount: number
}>()

const classes = {
    hidden: 'bg-gray-300',
    bomb: 'bg-gray-200',
    number: 'bg-gray-200',
    marked: 'bg-gray-300',
    detonated: 'bg-red-300'
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