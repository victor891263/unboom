<template>
    <ErrorPopup v-if="submitError.length > 0" :msg="submitError" />
    <div class="max-w-full h-screen flex flex-col justify-center py-6 lg:py-20">
        <div class="grid grid-cols-3 items-center mb-3">
            <div class="justify-self-start"><span class="font-semibold">{{ flagsLeft }}</span> left</div>
            <div class="justify-self-center">
                <PrizeIcon class="w-5 h-5" v-if="gameStatus === 'won'" />
                <SadIcon class="w-5 h-5" v-else-if="gameStatus === 'lost'" />
                <HappyIcon class="w-5 h-5" v-else />
            </div>
            <div class="justify-self-end font-semibold">{{ timeString }}</div>
        </div>
        <div
            id="game-board"
            :style="{ 'gridTemplateColumns': `repeat(${columnCount}, auto)` }"
            class="max-w-full overflow-auto grid gap-1 p-2 bg-gray-100 border border-gray-400 rounded-lg dark:bg-gray-800 dark:border-gray-600"
            :class="(gameStatus === 'lost' && 'border-red-500 dark:border-red-500') || (gameStatus === 'won' && 'border-green-500 dark:border-green-500')"
        >
            <template v-for="(row, i) in board" :key="i">
                <button
                    v-for="(tile, j) in row"
                    @click="() => checkForBomb(board, tile)"
                    @contextmenu="e => placeFlag(e, tile)"
                    :disabled="gameStatus !== 'playing'"
                    :class="'h-9 w-9 rounded flex items-center justify-center ' + classes[tile.status]"
                    :key="`${i}${j}`"
                >
                    <span v-if="typeof getLabel(tile) === 'number'" >{{ getLabel(tile) }}</span>
                    <span v-if="getLabel(tile) === 'hidden'" ></span>
                    <BombIcon class="w-4 h-4" v-if="getLabel(tile) === 'bomb'" />
                    <FlagIcon class="w-3.5 h-3.5" v-if="getLabel(tile) === 'marked'" />
                    <ExplosionIcon class="w-5 h-5" v-if="getLabel(tile) === 'detonated'" />
                </button>
            </template>
        </div>
        <div class="mt-5 flex items-center justify-center gap-3">
            <button @click="() => router.go(0)">
                <ReplayIcon class="w-[22px] h-[22px] dark:w-6 dark:h-6" />
            </button>
            <ThemeButton />
            <a href="https://github.com/victor891263/unboom" target="_blank" rel="noreferrer">
                <GitHubIcon class="w-6 h-6" />
            </a>
        </div>
        <div v-if="isSubmitInputVisible" class="sm:w-80 mx-auto flex flex-col w-full mt-5">
            <div class="flex gap-2">
                <input :disabled="isSubmitting" v-model="player" class="disabled:text-gray-400 dark:disabled:text-gray-600 bg-transparent w-full rounded-md outline-0 border border-gray-300 px-3 py-2 pr-9 dark:border-gray-700 dark:placeholder:text-gray-600" type="text" name="player" placeholder="What's your name?" />
                <button @click="submitScore" :disabled="isSubmitting" class="bg-gray-300 rounded-md w-28 h-full flex items-center justify-center dark:bg-gray-700">
                    <div v-if="isSubmitting" class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <div v-else>Submit</div>
                </button>
            </div>
            <div v-if="inputError.length > 0" class="mt-1.5 text-sm text-red-600 dark:text-red-400">{{ inputError }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, defineProps, reactive, ref} from 'vue'
import {useRouter} from "vue-router";
import axios from "axios";
import { checkLose, checkWin, createBoard, markTile, revealTile } from '@/logic/game'
import ThemeButton from "@/components/ThemeButton.vue"
import ErrorPopup from '@/components/ErrorPopup.vue';
import BombIcon from '@/icons/BombIcon.vue'
import FlagIcon from '@/icons/FlagIcon.vue'
import ExplosionIcon from '@/icons/ExplosionIcon.vue'
import HappyIcon from '@/icons/HappyIcon.vue'
import SadIcon from '@/icons/SadIcon.vue'
import PrizeIcon from '@/icons/PrizeIcon.vue'
import GitHubIcon from '@/icons/GitHubIcon.vue'
import handleError from '@/logic/handleError';
import {Tile} from "@/types"
import ReplayIcon from "@/icons/ReplayIcon.vue";

const props = defineProps<{
    rowCount: number,
    columnCount: number,
    bombCount: number
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
        return tile.status
    }
}

const isSubmitInputVisible = computed(() => {
    if ((props.rowCount === 20) && (props.columnCount === 20) && (props.bombCount === 66)) {
        return true
    }
    return false
})

// create the board array of arrays
const board = reactive(createBoard(props.rowCount, props.columnCount, props.bombCount))
const flagsLeft = ref(props.bombCount)
const gameStatus = ref<'playing' | 'won' | 'lost'>('playing')
const inputError = ref('')
const player = ref('')
const isSubmitting = ref(false)
const submitError = ref('')

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

function checkForBomb(board: Tile[][], tile: Tile) {
    // start timer
    startTimer()

    revealTile(board, tile)
    checkGameEnd(tile)
}

function placeFlag(e: any, tile: Tile) {
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

function submitScore() {
    // check if the game has been beaten
    if (gameStatus.value != 'won') {
        submitError.value = 'Beat the game first to submit your score';
        setTimeout(() => {
            submitError.value = '';
        }, 5000);
        return
    }

    // input validation
    inputError.value = ''
    if (player.value.length < 1) {
        inputError.value = 'Name cannot be blank'
        return
    }
    if (player.value.length > 50) {
        inputError.value = 'Name is too long'
        return
    }

    isSubmitting.value = true
    axios.post(process.env.VUE_APP_API_URL, {
        name: player.value,
        duration: timeString.value,
        created: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    })
    .then(() => {
        router.push('/score')
    })
    .catch(error => {
        handleError(error, (msg: string) => {
            submitError.value = msg;
            setTimeout(() => {
                submitError.value = '';
            }, 5000);
        });
        isSubmitting.value = false
    })
}
</script>

<style>
#game-board::-webkit-scrollbar {
    height: 0;
    width: 0;
}
</style>

<!--

ALTERNATE INPUT STYLES

<div v-if="isSubmitInputVisible" class="sm:w-80 relative mx-auto w-full flex mt-5" :class="!isSubmitPossible && 'opacity-50 cursor-not-allowed'" :title="!isSubmitPossible && 'Win the game first to submit your score!'">
    <input :disabled="!isSubmitPossible" class="disabled:cursor-not-allowed w-full bg-gray-100 rounded outline-0 border border-gray-300 px-3 py-2 pr-9 focus:border-indigo-600 dark:bg-gray-800 dark:focus:border-indigo-400 dark:border-gray-700 dark:placeholder:text-gray-600" type="text" name="name" placeholder="What's your name?" />
    <button :disabled="!isSubmitPossible" class="disabled:cursor-not-allowed absolute right-2 h-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
        </svg>
    </button>
</div>

<div v-if="isSubmitInputVisible" class="sm:w-80 mx-auto w-full flex gap-2 mt-5" :class="!isSubmitPossible && 'opacity-50 cursor-not-allowed'" :title="!isSubmitPossible && 'Win the game first to submit your score!'">
    <input :disabled="!isSubmitPossible" class="disabled:cursor-not-allowed w-full bg-gray-100 rounded outline-0 border border-gray-300 px-3 py-2 pr-9 focus:border-indigo-600 dark:bg-gray-800 dark:focus:border-indigo-400 dark:border-gray-700 dark:placeholder:text-gray-600" type="text" name="name" placeholder="What's your name?" />
    <button :disabled="!isSubmitPossible" class="disabled:cursor-not-allowed bg-gray-300 rounded px-3 h-full flex items-center justify-center dark:bg-gray-700">Submit</button>
</div>

-->