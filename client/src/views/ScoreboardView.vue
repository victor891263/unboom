<template>
    <div class="min-h-screen flex flex-col items-center px-6 text-gray-700 dark:text-gray-300">
        <div class="max-w-lg w-full min-h-screen flex flex-col justify-center py-6 lg:py-20">
            <h1 class="mb-7 text-center font-semibold text-3xl text-black dark:text-white">Score</h1>
            <div class="sm:mb-8 mb-4 relative w-full mx-auto">
                <input v-model="keyword" type="text" name="search" placeholder="Type your name here" class="w-full rounded-md bg-transparent border border-gray-300 py-2 px-3 outline-0 dark:border-gray-700 dark:placeholder:text-gray-600" />
                <div class="absolute top-0 right-3 h-full flex items-center">
                    <GlassIcon class="w-[18px] h-[18px] mt-0.5 text-gray-400 dark:text-gray-600" />
                </div>
            </div>
            <TableSkeleton v-if="isLoading" />
            <div v-else-if="retrieveError.length > 0" class="border rounded-md border-gray-300 flex flex-col items-center justify-center px-5 mx-auto py-10 space-y-8 text-center dark:border-gray-700">
                <FaceIcon class="w-40 h-40 text-gray-400 dark:text-gray-600" />
                <p class="text-3xl">{{retrieveError}}</p>
            </div>
            <div v-else-if="sortedScores.length > 0" id="scoreboard" class="overflow-auto rounded-md border border-gray-300 dark:border-gray-700">
                <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead class="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th class="whitespace-nowrap px-4 py-2.5 text-left font-normal text-sm capitalize text-gray-500 dark:text-gray-400">Rank</th>
                            <th class="whitespace-nowrap px-4 py-2.5 text-left font-normal text-sm capitalize text-gray-500 dark:text-gray-400">Name</th>
                            <th class="whitespace-nowrap px-4 py-2.5 text-left font-normal text-sm capitalize text-gray-500 dark:text-gray-400">
                                <div class="flex items-center">
                                    <span class="mr-0.5" :class="sortBy.title === 'duration' ? 'font-bold' : ''">Duration</span>
                                    <button @click="() => sortBy = { title: 'duration', asc: true }">
                                        <ArrowIcon class="w-4 h-4" :stroke-width="(sortBy.title === 'duration' && sortBy.asc) ? 3 : 1.5" />
                                    </button>
                                    <button @click="() => sortBy = { title: 'duration', asc: false }">
                                        <ArrowIcon class="w-4 h-4 rotate-180" :stroke-width="(sortBy.title === 'duration' && !sortBy.asc) ? 3 : 1.5" />
                                    </button>
                                </div>
                            </th>
                            <th class="whitespace-nowrap px-4 py-2.5 text-left font-normal text-sm capitalize text-gray-500 dark:text-gray-400">
                                <div class="flex items-center">
                                    <span class="mr-0.5" :class="sortBy.title === 'created' ? 'font-bold' : ''">Submitted</span>
                                    <button @click="() => sortBy = { title: 'created', asc: true }">
                                        <ArrowIcon class="w-4 h-4" :stroke-width="(sortBy.title === 'created' && sortBy.asc) ? 3 : 1.5" />
                                    </button>
                                    <button @click="() => sortBy = { title: 'created', asc: false }">
                                        <ArrowIcon class="w-4 h-4 rotate-180" :stroke-width="(sortBy.title === 'created' && !sortBy.asc) ? 3 : 1.5" />
                                    </button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-300 dark:divide-gray-700">
                        <tr v-for="(s, index) in sortedScores" :key="index">
                            <td v-for="(v, index) in Object.values(s)" class="whitespace-nowrap px-4 py-3" :class="index === 2 && 'font-semibold'" :key="index">{{ index === 3 ? `${getTimeLabel(v)} ago` : v }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="border rounded-md border-gray-300 flex flex-col items-center justify-center px-5 mx-auto py-10 space-y-8 text-center dark:border-gray-700">
                <FaceIcon class="w-40 h-40 text-gray-400 dark:text-gray-600" />
                <p class="text-3xl">Looks like you haven't submitted your score.</p>
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
import {computed, onMounted, ref} from "vue";
import axios from "axios"
import ThemeButton from "@/components/ThemeButton.vue"
import TableSkeleton from "@/components/TableSkeleton.vue"
import GlassIcon from '@/icons/GlassIcon.vue'
import ArrowIcon from '@/icons/ArrowIcon.vue'
import FaceIcon from '@/icons/FaceIcon.vue'
import GitHubIcon from '@/icons/GitHubIcon.vue'
import handleError from "@/logic/handleError";
import getTimeLabel from "@/logic/getTimeLabel";
import getElapsedTime from "@/logic/getElaspedTime";
import {Score} from "@/types";

const scores = ref<Score[]>([])
const retrieveError = ref('')
const isLoading = ref(true)
const keyword = ref('')
const sortBy = ref({ title: 'duration', asc: true })

function getSortedScores(allScores: Score[], sortProperties: { title: string, asc: boolean }) {
    if (sortProperties.title === 'created') {
        return allScores.sort((a, b) => {
            if (sortProperties.asc) return getElapsedTime(a.created) - getElapsedTime(b.created)
            return getElapsedTime(b.created) - getElapsedTime(a.created)
        });
    }
    if (sortProperties.title === 'duration') {
        return allScores.sort((a, b) => {
            const durationA = a.duration.split(':');
            const durationB = b.duration.split(':');
            const minutesA = parseInt(durationA[0]);
            const minutesB = parseInt(durationB[0]);
            const secondsA = parseInt(durationA[1]);
            const secondsB = parseInt(durationB[1]);

            if (minutesA === minutesB) {
                if (sortProperties.asc) return secondsA - secondsB;
                return secondsB - secondsA;
            } else {
                if (sortProperties.asc) return minutesA - minutesB;
                return minutesB - minutesA;
            }
        });
    }
    return allScores;
}

const sortedScores = computed(() => {
    const scoresWithId = getSortedScores(scores.value, { title: 'duration', asc: true }).map((s, i) => ({ id: i + 1, ...s }))
    return getSortedScores(scoresWithId.filter(s => s.name.toLowerCase().includes(keyword.value.toLowerCase())), sortBy.value)
})

onMounted(() => {
    axios.get(process.env.VUE_APP_API_URL)
    .then(response => {
        scores.value = response.data.map(({ _id, name, duration, created }: Score) => ({ name, duration, created }));
    })
    .catch(error => {
        handleError(error, (msg: string) => retrieveError.value = msg)
    })
    .finally(() => isLoading.value = false)
})
</script>

<style>
#scoreboard::-webkit-scrollbar {
    height: 0;
    width: 0;
}
</style>