<template>
    <div class="wrap-box">
        <nav-bar
            :nowMsg="msg"
            :nowItems="titItems"
            :isShow="false"
            v-on:swipedA="switchNavA"
            v-on:swipedB="switchNavB"
            v-on:swipedC="switchNavC"
            v-on:search="searchLs"
            :hasBottomBar="whichNav"
            :selectBack="1"
         />
        <selectonInfoMyput style="animation: bounceInRight 1s cubic-bezier(0.215, 0.610, 0.355, 1.000)"/>
    </div>
</template>

<script>
import navBar from '../views/navBar';
import selectonInfoMyput from '../views/selectonInfoMyput';

export default {
    data () {
        return {
            //设置navBar组件
            msg: '我提交的',
            titles: [
                {text:"我提交的", checked:true, href:'/myPut'},
                {text:"我审批的", checked:false, href:'/myApprove'}
            ],
            titItems: [
                {text:"未办", tab:"C"},
                {text:"已办", tab:"D"},
                {text:"办结", tab:"E"}
            ],
            bottomBar: false,
            whichNav: ''
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
        switchNavA () {
            if(this.whichNav !== 'C'){
                this.bottomBar = true;
                this.$store.commit('alterRefresh');
                this.$store.commit("setLsParams", {
                    "startline":"0",
                    "statuskey":"submit",
                    "statuscode":"unhandled",
                    "condition":this.condition
                });
                this.whichNav = 'C';
                // 通知列表当前选项卡
                this.$store.commit({
                    "type": "setTaskCount",
                    "now":"C"
                });
            }
        },
        switchNavB () {
            if(this.whichNav !== 'D'){
                this.bottomBar = true;
                this.$store.commit('alterRefresh');
                this.$store.commit("setLsParams", {
                    "startline":"0",
                    "statuskey":"submit",
                    "statuscode":"handling",
                    "condition":this.condition
                });
                this.whichNav = 'D';
                // 通知列表当前选项卡
                this.$store.commit({
                    "type": "setTaskCount",
                    "now":"D"
                });
            }
        },
        switchNavC () {
            if(this.whichNav !== 'E'){
                this.bottomBar = true;
                this.$store.commit('alterRefresh');
                this.$store.commit("setLsParams", {
                    "startline":"0",
                    "statuskey":"submit",
                    "statuscode":"finished",
                    "condition":this.condition
                });
                this.whichNav = 'E';
                // 通知列表当前选项卡
                this.$store.commit({
                    "type": "setTaskCount",
                    "now":"E"
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
            case 'C':
                this.switchNavA();
                break;
            case 'D':
                this.switchNavB();
                break;
            case 'E':
                this.switchNavC();
                break;
            default:
                this.switchNavA();
        }
        this.$store.commit('alterAction', false);
    },
    components: {
        navBar,
        selectonInfoMyput
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
