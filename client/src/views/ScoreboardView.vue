<template>
    <div class="min-h-screen flex flex-col items-center px-6 text-gray-700 dark:text-gray-300">
        <div class="max-w-xl w-full min-h-screen flex flex-col justify-center py-6 lg:py-20">
            <h1 class="mb-7 text-center font-semibold tracking-tight text-3xl text-black dark:text-white">Scores</h1>
            <TableSkeleton v-if="isLoading" />
            <div v-else-if="retrieveError.length > 0" class="border rounded-md border-gray-300 flex flex-col items-center justify-center px-5 mx-auto py-10 space-y-8 text-center dark:border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-40 h-40 text-gray-400 dark:text-gray-600">
                    <path fill="currentColor" d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"></path><rect width="176" height="32" x="168" y="320" fill="currentColor"></rect><polygon fill="currentColor" points="210.63 228.042 186.588 206.671 207.958 182.63 184.042 161.37 162.671 185.412 138.63 164.042 117.37 187.958 141.412 209.329 120.042 233.37 143.958 254.63 165.329 230.588 189.37 251.958 210.63 228.042"></polygon><polygon fill="currentColor" points="383.958 182.63 360.042 161.37 338.671 185.412 314.63 164.042 293.37 187.958 317.412 209.329 296.042 233.37 319.958 254.63 341.329 230.588 365.37 251.958 386.63 228.042 362.588 206.671 383.958 182.63"></polygon>
                </svg>
                <p class="text-3xl">{{retrieveError}}</p>
            </div>
            <div v-else id="scoreboard" class="overflow-auto rounded-md border border-gray-300 dark:border-gray-700">
                <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead class="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th v-for="(k, index) in Object.keys(scores[0])" class="whitespace-nowrap px-4 py-2.5 text-left font-normal text-sm capitalize text-gray-500 dark:text-gray-400" :key="index">{{ k }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-300 dark:divide-gray-700">
                        <tr v-for="(s, index) in scores" :key="index">
                            <td v-for="(v, index) in Object.values(s)" class="whitespace-nowrap px-4 py-3" :class="index === 1 && 'font-semibold'" :key="index">{{ v }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="mt-6 flex items-center justify-center gap-2.5">
                <router-link to="/">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :stroke-width="1.25" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                    </svg>
                </router-link>
                <ThemeButton />
                <a href="https://github.com/victor891263/unboom" target="_blank" rel="noreferrer">
                    <svg class="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z"></path></svg>
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Score {
    _id: string,
    name: string,
    duration: string,
    created: string
}

import { onMounted, ref } from "vue";
import axios from "axios"
import ThemeButton from "@/components/ThemeButton.vue"
import TableSkeleton from "@/components/TableSkeleton.vue"
import handleError from "@/logic/handleError";

const scores = ref([])
const retrieveError = ref('')
const isLoading = ref(true)

onMounted(() => {
    axios.get(process.env.VUE_APP_API_URL)
    .then(response => {
        const newArray = response.data.map(({ _id, name, duration, created }: Score) => ({ name, duration, grid: '20x20', created }));
        scores.value = newArray
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