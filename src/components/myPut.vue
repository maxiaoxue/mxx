<template>
    <div class="wrap-box">
        <nav-bar
            :nowMsg="msg"
            :nowTitles="titles"
            :nowItems="titItems"
            v-on:swipedA="switchNavA"
            v-on:swipedB="switchNavB"
            v-on:swipedC="switchNavC"
            v-on:search="searchLs"
            v-on:selectdate="searchDate"
            :hasBottomBar="whichNav"
            :nowAdjunct="adjunct"
         />

        <list :hasBottomBar="bottomBar"  :maker="billmaker" :moudle="moudle" :pkOrg="pkOrg" :selectCountSign="selectCountSign"/>

        <list-btn  v-if="bottomBar" :footerItem="footItem" />
        <div class="screen-page" v-show="maskStatus">
            <div class="screen-inner-page"  style="width: 100%;animation: bounceInRight 1s cubic-bezier(0.215, 0.610, 0.355, 1.000)">
                <div class="close-wrap" @click="closeMask()"></div>
                <div class="screen-area">
                    <div class="my-submit">
                       <selectonInfoMyput/>
                    </div>
                    <!--我的提交-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import navBar from '../views/navBar';
import list from '../views/list';
import listBtn from '../views/listBtn';
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
            // 自有属性
            whichNav: '',
            selectSign:false,
            selectCountSign:false,
            billmaker:null,
            pkOrg:null,
            moudle:null,
            footItem: [
                {text: '全选', bgImg: "icon-quanxuan", flag: "all", show: true },
                {text: '提醒审批', bgImg: "icon-tixing", flag: "messageWarn", show: true},
            ],
            bottomBar: false,
            // adjunct:'list'
        }
    },
    computed: {
        condition () {
            return this.$store.getters.condition
        },
        currentTab () {    //  当前标签页
            return this.$store.getters.getTaskCount.now
        },
        maskStatus(){  // mask弹出框
            return this.$store.getters.maskStatus
        },
        adjunct(){
            if(this.$store.getters.lsParams.isWechat == true){
                return 'list';
            }else{
                return '';
            }
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
                    "condition":this.condition,
                    "datetype":null
                });
                if(!this.selectSign){
                    this.selectCountSign=false;
                    this.$store.commit("setLsParams", {
                        "billmaker":null,
                        "pkOrg":null,
                        "moudle":null,
                        "datetype":null
                    });
                }else{
                    this.selectCountSign=true;
                }
                this.whichNav = 'C';
                this.selectSign=false;
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
                    "condition":this.condition,
                    "datetype":null
                });
                if(!this.selectSign){
                    this.selectCountSign=false;
                    this.$store.commit("setLsParams", {
                        "billmaker":null,
                        "pkOrg":null,
                        "moudle":null,
                        "datetype":null
                    });
                }else{
                    this.selectCountSign=true;
                }
                this.whichNav = 'D';
                this.selectSign=false;
                // 通知列表当前选项卡
                this.$store.commit({
                    "type": "setTaskCount",
                    "now":"D"
                });
            }
        },
        switchNavC () {
            if(this.whichNav !== 'E'){
                this.bottomBar = false;
                this.$store.commit('alterRefresh');
                this.$store.commit("setLsParams", {
                    "startline":"0",
                    "statuskey":"submit",
                    "statuscode":"finished",
                    "condition":this.condition,
                    "datetype":null
                });
                if(!this.selectSign){
                    this.selectCountSign=false;
                    this.$store.commit("setLsParams", {
                        "billmaker":null,
                        "pkOrg":null,
                        "moudle":null,
                        "datetype":null
                    });
                }else{
                    this.selectCountSign=true;
                }
                this.whichNav = 'E';
                this.selectSign=false;
                // 通知列表当前选项卡
                this.$store.commit({
                    "type": "setTaskCount",
                    "now":"E"
                });
            }
        },
        searchLs () {
            this.$store.commit('alterRefresh');
        },
        searchDate(){
            this.$store.commit('alterRefresh');
        },
        closeMask(){
            this.$store.commit('maskStatus',false);
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

    created () {
        this.selectSign = this.$route.query.selectSign;
        this.billmaker = this.$route.query.billmaker;
        this.pkOrg = this.$route.query.pkOrg;
        this.moudle = this.$route.query.moudle;
        this.$store.commit('alterCondition', null);
    },
    components: {
        navBar,
        list,
        listBtn,
        selectonInfoMyput
    }
}
</script>
