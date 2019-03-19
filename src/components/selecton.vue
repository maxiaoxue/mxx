<template>
    <div class="wrap-box">
        <nav-bar
            :nowMsg="msg"
            :nowItems="titItems"
            :isShow="false"
            v-on:swipedA="switchNavA"
            v-on:swipedB="switchNavB"
            v-on:search="searchLs"
            :hasBottomBar="whichNav"
            :selectBack="1"
         />
        <selectonInfo style="animation: bounceInRight 1s cubic-bezier(0.215, 0.610, 0.355, 1.000)"/>
    </div>
</template>

<script>
import navBar from '../views/navBar';
import selectonInfo from '../views/selectonInfo';

export default {
    data () {
        return {
            msg: '我审批的',
            titles: [
                {text:"我审批的", checked:true, href:'/myApprove'},
                {text:"我提交的", checked:false, href:'/myPut'}
            ],
            titItems: [
                {text:"待办任务", tab:"A"},
                {text:"已办任务", tab:"B"}
            ],
            bottomBar: false,
            whichNav: '',
            transitionName: 'transitionLeft'
        }
    },
    computed: {
        condition () {
            return this.$store.getters.condition
        },
        currentTab () {    // 当前标签页
            return this.$store.getters.getTaskCount.now
        }
    },
    methods: {
        switchNavA () {    // 待办任务
            if(this.whichNav !== 'A') {
                this.bottomBar = true;
                this.$store.commit('alterRefresh');
                this.$store.commit("setLsParams", {
                    "startline":"0",
                    "statuskey":"ishandled",
                    "statuscode":"unhandled",
                    "condition":this.condition
                });
                // 详情页审批按钮（只有待办任务详情页才显示）
                this.$store.commit('alterAction', "unhandled");
                this.whichNav = 'A';
                // 通知列表当前选项卡
                this.$store.commit("setTaskCount", {
                    "now":"A"
                });
            }
        },
        switchNavB () {    // 已办任务
            if(this.whichNav !== 'B') {
                this.bottomBar = false;
                this.$store.commit('alterRefresh');
                this.$store.commit("setLsParams", {
                    "startline":"0",
                    "statuskey":"ishandled",
                    "statuscode":"handled",
                    "condition":this.condition
                });
                this.$store.commit('alterAction', "handled");
                this.whichNav = 'B';
                // 通知列表当前选项卡
                this.$store.commit("setTaskCount", {
                    "now":"B"
                });
            }
        },
        searchLs () {
            this.$store.commit('alterRefresh');
        }
    },
    mounted () {
        // 默认加载第一个列表，详情页返回到对应列表
        switch(this.currentTab)
        {
            case 'A':
                this.switchNavA();
                break;
            case 'B':
                this.switchNavB();
                break;
            default:
                this.switchNavA();
        }
    },
    components: {
        navBar,
        selectonInfo
    },
}
</script>
<style>
    @keyframes bounceInRight {
        0% {
            opacity: 0;
            -webkit-transform: translateX(200px);
        }

        100% {
            transform: none;
        }
    }
</style>
