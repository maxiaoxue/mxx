<template>
    <div class="wrap-box">
        <nav-bar
                :nowMsg="msg"
                :nowTitles="titles"
                :nowItems="titItems"
                v-on:swipedA="switchNavA"
                v-on:swipedB="switchNavB"
                v-on:search="searchLs"
                :hasBottomBar="whichNav"
                v-on:selectdate="searchDate"
                :ind="ind"
                :nowAdjunct="adjunct"
                @msg-from-child="getMsgFromChild"
        />

        <list :hasBottomBar="bottomBar" :maker="billmaker" :moudle="moudle" :pkOrg="pkOrg" ref="child"
              :selectCountSign="selectCountSign"/>

        <list-btn v-if="bottomBar" :footerItem="footItem"/>
        <div class="screen-page" v-show="maskStatus">
          <div class="screen-inner-page"  style="width: 100%;animation: bounceInRight 1s cubic-bezier(0.215, 0.610, 0.355, 1.000)">
              <div class="close-wrap" @click="closeMask()"></div>
              <div class="screen-area">
                <div class="my-approval">
                   <selectonInfo/>
                </div>
                <!--我的审批-->
            </div>
          </div>
        </div>
    </div>
</template>

<script>
    import navBar from '../views/navBar';
    import list from '../views/list';
    import listBtn from '../views/listBtn';
    import selectonInfo from '../views/selectonInfo';


    export default {
        data() {
            return {
                ind:'',
                msg: '我审批的',
                titles: [
                    {text: "我审批的", checked: true, href: '/myApprove'},
                    {text: "我提交的", checked: false, href: '/myPut'}
                ],
                titItems: [
                    {text: "待办任务", tab: "A"},
                    {text: "已办任务", tab: "B"}
                ],
                footItem: [
                    {text: '全选', bgImg: "icon-quanxuan", flag: "all", show: true},
                    {text: '同意', bgImg: "icon-tongyi", flag: "agree", show: true},
                    {text: '不同意', bgImg: "icon-disagree", flag: "disagree", show: true}
                ],
                bottomBar: false,
                whichNav: '',
                selectSign: false,
                selectCountSign: false,
                billmaker: null,
                pkOrg: null,
                moudle: null,
                 adjunct:'list'
            }
        },
        computed: {
            condition() {
                return this.$store.getters.condition
            },
            currentTab() {    // 当前标签页
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
            getMsgFromChild () {
                this.$refs.child.infiniteRefresh()
            },
            switchNavA() {    // 待办任务
                if (this.whichNav !== 'A') {
                    this.bottomBar = true;
                    this.$store.commit('alterRefresh');
                    this.$store.commit("setLsParams", {
                        "startline": "0",
                        "statuskey": "ishandled",
                        "statuscode": "unhandled",
                        "condition": this.condition,
                        "datetype":null
                    });
                    if (!this.selectSign) {     //如果不是从筛选页面进入的，比如是点击页签时，把筛选条件清零
                        this.selectCountSign = false;
                        this.$store.commit("setLsParams", {
                            "billmaker": null,
                            "pkOrg": null,
                            "moudle": null,
                            "datetype":null
                        });
                    } else {
                        this.selectCountSign = true;
                    }
                    // 详情页审批按钮（只有待办任务详情页才显示）
                    this.$store.commit('alterAction', "unhandled");
                    this.whichNav = 'A';
                    this.selectSign = false;
                    // 通知列表当前选项卡
                    this.$store.commit("setTaskCount", {
                        "now": "A"
                    });
                }
            },
            switchNavB() {    // 已办任务
                if (this.whichNav !== 'B') {
                    this.bottomBar = false;
                    this.$store.commit('alterRefresh');
                    this.$store.commit("setLsParams", {
                        "startline": "0",
                        "statuskey": "ishandled",
                        "statuscode": "handled",
                        "condition": this.condition,
                        "datetype":null
                    });
                    if (!this.selectSign) {   //如果不是从筛选页面进入的，比如是点击页签时，把筛选条件清零
                        this.selectCountSign = false;
                        this.$store.commit("setLsParams", {
                            "billmaker": null,
                            "pkOrg": null,
                            "moudle": null,
                            "datetype":null
                        });
                    } else {
                        this.selectCountSign = true;
                    }
                    this.$store.commit('alterAction', "handled");
                    this.whichNav = 'B';
                    this.selectSign = false;
                    // 通知列表当前选项卡
                    this.$store.commit("setTaskCount", {
                        "now": "B"
                    });
                }
            },
            searchLs() {
                this.$store.commit('alterRefresh');
            },
            closeMask(){
                this.$store.commit('maskStatus',false);
            },
            searchDate(){
                this.$store.commit('alterRefresh');
            }

        },
        mounted() {
            // 默认加载第一个列表，详情页返回到对应列表
            switch (this.currentTab) {
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
        created() {
            this.selectSign = this.$route.query.selectSign;
            /*this.billmaker = this.$route.query.billmaker;
            this.pkOrg = this.$route.query.pkOrg;
            this.moudle = this.$route.query.moudle;*/
            this.billmaker = this.$store.getters.lsParams.billmaker;
            this.pkOrg = this.$store.getters.lsParams.pkOrg;
            this.moudle = this.$store.getters.lsParams.moudle;
            this.$store.commit('alterCondition', null);
        },
        components: {
            navBar,
            list,
            listBtn,
            selectonInfo
        }
    }
</script>
<style>
    .screen-page {
        position: fixed;
        width: 100%;
        height: 88%;
        background: rgba(197, 196, 196, 0.2);
        z-index: 1000;
        margin-top: 22%;
    }

    .screen-inner-page{
        width: 100%;
        height: 100%;
        position: relative;
    }

    .screen-area {
        width: 70%;
        background: #fff;
        height: 100%;
        float: right;
    }

    @keyframes bounceInRight {
        0% {
            opacity: 0;
            -webkit-transform: translateX(200px);
        }

        100% {
            transform: none;
        }
    }

    .ivu-collapse {
        border: 1px solid #fff !important;
    }

    .close-wrap{
        width: 30%;
        height: 100%;
        position: absolute;
        left: 0;
        opacity: 0;
    }
</style>
