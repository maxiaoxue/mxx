import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/myApprove',
            component: require('../components/myApprove.vue')
        },
        {
            path: '/requestNote',
            component: require('../components/requestNote.vue')
        },
        {
            path: '/deploy',
            component: require('../components/deploy.vue')
        },
        {
            path: '/selecton',
            component: require('../components/selecton.vue')
        },
        {
            path: '/selectonMyput',
            component: require('../components/selectonMyput.vue')
        },
        {
            path: '/myPut',
            component:  resolve => require(['../components/myPut.vue'], resolve)
        },
        {
            path: '/detail',
            component:  resolve => require(['../components/detail.vue'], resolve)
        },
        {
            path: '/screen',
            component: resolve => require(['../components/screen.vue'], resolve)
        },
        {
            path:'*',
            redirect:'/myApprove'
        }
    ]
})
