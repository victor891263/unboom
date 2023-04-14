import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import ScoreboardView from '../views/ScoreboardView.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/play',
        name: 'play',
        component: GameView,
        props: (route) => ({ difficulty: route.query.difficulty })
    },
    {
        path: '/score',
        name: 'scoreboard',
        component: ScoreboardView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
