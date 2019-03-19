<template>
    <div :class="[{lsWrapper:true},{noBottomBar: !hasBottomBar}]">
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller">
            <table class="list">
                <tr v-for="(item, index) in items" @click="billInfos(item)">
                    <td v-if="hasBottomBar" :class="[{checkBtn:true},{swiped:item.isSwiped}]" @click.stop="turnChecked(item)"></td>
                    <td :class="[{brief:true},{padLeft: !hasBottomBar}]">
                        <div v-text="item.title" class="title"></div>
                        <div class="info">
                            <span  v-show="isShowSendman">发送人：<span v-text="item.sendman"></span></span>
                            <span v-text="item.senddate" class="marLeft"></span>
                        </div>
                    </td>
                    <td class="right">
                        <i class="iconfont icon-right"></i>
                    </td>
                </tr>
            </table>
        </scroller>
    </div>
</template>

<script>
import Scroller from 'vue-scroller'

export default {
    components: {
      Scroller
    },
    data () {
        return {
            isNoMore: true,
            items: [],
            isFirstMyApprove:true,
            isFirstMyPut:true,
            isShowSendman:true
        }
    },
    computed: {
        lsUrl () {    // 列表接口
            return this.$store.getters.lsUrl
        },
        lsReq () {    // 列表参数
            return this.$store.getters.lsParams
        },
        isRefresh () {    // 切换标签刷新列表
            return this.$store.getters.isRefresh
        },
        isGetToken () {    // 是否已获取jwtToken
            return this.$store.getters.isGetToken
        },
        selectAll () {    // 是否全选
            return this.$store.getters.selectAll
        },
        batchTask () {    // 已选Task
            return this.$store.getters.batchTask
        }
    },
    props: {
        hasBottomBar: {
            type: Boolean,
            default: false
        },
        selectCountSign: {
            type: Boolean,
            default: false
        },
        maker: {
            type:null,
            required: true
        },
        moudle: {
            type: null,
            required: true
        },
        pkOrg: {
            type: null,
            required: true
        }
    },
    mounted: function () {
        setTimeout(() => {
            this.$refs.my_scroller.resize();
        })
    },
    methods: {
        turnChecked (item) {
            item.isSwiped = !item.isSwiped;
            // 记录taskId
            if(item.isSwiped) {
                this.batchTask.push(item)
            } else {
                for (let i = this.batchTask.length - 1; i >= 0; i--) {
                    if(this.batchTask[i].taskid === item.taskid) {
                        this.batchTask.splice(i, 1);
                        break;
                    }
                }
            }
        },
        getLsCount (nowTab) {
            var params, setCount = {};

            switch(nowTab){
                case 'A':
                    params = {
                        "statuskey":"ishandled",
                        "statuscode":"unhandled",
                        "condition":this.$store.getters.condition,
                        "billmaker":this.$store.getters.lsParams.billmaker,
                        "pkOrg":this.$store.getters.lsParams.pkOrg,
                        "moudle":this.$store.getters.lsParams.moudle,
                        "datetype":this.$store.getters.lsParams.datetype
                    };
                    break;
                case 'B':
                    params = {
                        "statuskey":"ishandled",
                        "statuscode":"handled",
                        "condition":this.$store.getters.condition,
                        "billmaker":this.$store.getters.lsParams.billmaker,
                        "pkOrg":this.$store.getters.lsParams.pkOrg,
                        "moudle":this.$store.getters.lsParams.moudle,
                        "datetype":this.$store.getters.lsParams.datetype
                    };
                    break;
                case 'C':
                    params = {
                        "statuskey":"submit",
                        "statuscode":"unhandled",
                        "condition":this.$store.getters.condition,
                        "billmaker":this.$store.getters.lsParams.billmaker,
                        "pkOrg":this.$store.getters.lsParams.pkOrg,
                        "moudle":this.$store.getters.lsParams.moudle,
                        "datetype":this.$store.getters.lsParams.datetype
                    };
                    break;
                case 'D':
                    params = {
                        "statuskey":"submit",
                        "statuscode":"handling",
                        "condition":this.$store.getters.condition,
                        "billmaker":this.$store.getters.lsParams.billmaker,
                        "pkOrg":this.$store.getters.lsParams.pkOrg,
                        "moudle":this.$store.getters.lsParams.moudle,
                        "datetype":this.$store.getters.lsParams.datetype
                    };
                    break;
                case 'E':
                    params = {
                        "statuskey":"submit",
                        "statuscode":"finished",
                        "condition":this.$store.getters.condition,
                        "billmaker":this.$store.getters.lsParams.billmaker,
                        "pkOrg":this.$store.getters.lsParams.pkOrg,
                        "moudle":this.$store.getters.lsParams.moudle,
                        "datetype":this.$store.getters.lsParams.datetype
                    };
                    break;
                // case 'F':
                //     nowTab = 'A';
                //     params = {
                //         "statuskey":"ishandled",
                //         "statuscode":"unhandled",
                //         "condition":this.$store.getters.condition,
                //         "billmaker":this.$store.getters.lsParams.billmaker,
                //         "pkOrg":this.$store.getters.lsParams.pkOrg,
                //         "moudle":this.$store.getters.lsParams.moudle
                //     };
                //     break;
                // case 'G':
                //     nowTab = 'B';
                //     params = {
                //         "statuskey":"ishandled",
                //         "statuscode":"handled",
                //         "condition":this.$store.getters.condition,
                //         "billmaker":this.$store.getters.lsParams.billmaker,
                //         "pkOrg":this.$store.getters.lsParams.pkOrg,
                //         "moudle":this.$store.getters.lsParams.moudle
                //     };
                //     break;
                // case 'X':
                //     nowTab = 'C';
                //     params = {
                //         "statuskey":"submit",
                //         "statuscode":"unhandled",
                //         "condition":this.$store.getters.condition,
                //         "billmaker":this.maker,
                //         "pkOrg":this.pkOrg,
                //         "moudle":this.moudle
                //     };
                //     break;
                // case 'Y':
                //     nowTab = 'D';
                //     params = {
                //         "statuskey":"submit",
                //         "statuscode":"handling",
                //         "condition":this.$store.getters.condition,
                //         "billmaker":this.maker,
                //         "pkOrg":this.pkOrg,
                //         "moudle":this.moudle
                //     };
                //     break;
                // case 'Z':
                //     nowTab = 'E';
                //     params = {
                //         "statuskey":"submit",
                //         "statuscode":"finished",
                //         "condition":this.$store.getters.condition,
                //         "billmaker":this.maker,
                //         "pkOrg":this.pkOrg,
                //         "moudle":this.moudle
                //     };
                //     break;
                default:
                    return;
            }
            this.ajax.get(this.$store.getters.lsCount, params, (data) => {
                // 储存标签对应列表总条数
                setCount[nowTab] = data.data;
                this.$store.commit("setTaskCount", setCount);
            });
        },
        refresh () {
            // 开启遮罩层
            this.$store.commit('lockTrue');
            this.isNoMore = true;
            // 重置startline
            this.$store.commit('resetStartLine');
            this.items = [];
            this.$refs.my_scroller.finishPullToRefresh();
            this.$refs.my_scroller.finishInfinite();
        },
        infiniteRefresh () {
            this.items =[];
            setTimeout(() => {
                this.ajax.get(this.lsUrl, this.lsReq, (data) => {
                    for(let i = 0; i < data.data.length; i++) {
                        data.data[i].isSwiped = false;
                        data.data[i].loading = true;
                        this.items.push(data.data[i])
                    }

                    setTimeout(() => {
                        if(data.data.length < 10){
                            this.isNoMore = false;
                            this.$refs.my_scroller.finishInfinite({isNoMoreData:true});
                        } else {
                            this.$refs.my_scroller.finishInfinite();
                            // 增加startline,方便下次查询
                            this.$store.commit('addStartLine');
                        }
                    });
                    if(this.$route.path == '/myApprove' && !this.selectCountSign){
                        this.getLsCount('A');
                        this.getLsCount('B');
                    }
                    else if(this.$route.path == '/myPut' && !this.selectCountSign){
                        if(!this.isFirstMyPut){
                            this.getLsCount(this.$store.getters.getTaskCount.now);
                        }else{
                            this.getLsCount('C');
                            this.getLsCount('D');
                            this.getLsCount('E');
                            this.isFirstMyPut = false;
                        }
                    }
                    // 解除遮罩层
                    this.$store.commit('lockFalse');
                }, (data) => {
                    // 解除遮罩层
                    this.$store.commit('lockFalse');
                    this.$store.commit('errorCode', data.error_code);
                    this.$store.commit('modalPopup', data.error_msg);
                }, (error) => {
                    // 解除遮罩层
                    this.$store.commit('lockFalse');
                    this.$store.commit('modalPopup', error);
                });

            })
        },
        infinite () {
            if(this.isGetToken) {
                if(this.isNoMore){
                    setTimeout(() => {
                        this.ajax.get(this.lsUrl, this.lsReq, (data) => {
                            for(let i = 0; i < data.data.length; i++) {
                                data.data[i].isSwiped = false;
                                data.data[i].loading = true;
                                this.items.push(data.data[i])
                            }

                            setTimeout(() => {
                                if(data.data.length < 10){
                                    this.isNoMore = false;
                                    this.$refs.my_scroller.finishInfinite({isNoMoreData:true});
                                } else {
                                    this.$refs.my_scroller.finishInfinite();
                                    // 增加startline,方便下次查询
                                    this.$store.commit('addStartLine');
                                }
                            });
                            if(this.$route.path == '/myApprove' && !this.selectCountSign){
                                if(!this.isFirstMyApprove){
                                    this.getLsCount(this.$store.getters.getTaskCount.now);
                                }else{
                                    this.getLsCount('A');
                                    this.getLsCount('B');
                                    this.isFirstMyApprove = false;
                                }
                            }
                            /*if(this.$route.path == '/myApprove' && this.$store.getters.getTaskCount.now=="A" && this.selectCountSign){
                                //alert(this.$store.getters.lsParams.billmaker);
                                this.getLsCount('F');
                                //this.getLsCount('B');
                            }
                            if(this.$route.path == '/myApprove' && this.$store.getters.getTaskCount.now=="B" && this.selectCountSign){
                                //this.getLsCount('A');
                                this.getLsCount('G');
                            }*/
                            else if(this.$route.path == '/myPut' && !this.selectCountSign){
                                if(!this.isFirstMyPut){
                                    this.getLsCount(this.$store.getters.getTaskCount.now);
                                }else{
                                    this.getLsCount('C');
                                    this.getLsCount('D');
                                    this.getLsCount('E');
                                    this.isFirstMyPut = false;
                                }
                            }

                            // if(this.$route.path == '/myPut' && this.$store.getters.getTaskCount.now=="C" && this.selectCountSign){
                            //     this.getLsCount('X');
                            // }
                            // if(this.$route.path == '/myPut' && this.$store.getters.getTaskCount.now=="D" && this.selectCountSign){
                            //     this.getLsCount('Y');
                            // }
                            // if(this.$route.path == '/myPut' && this.$store.getters.getTaskCount.now=="E" && this.selectCountSign){
                            //     this.getLsCount('Z');
                            // }

                            // 解除遮罩层
                            this.$store.commit('lockFalse');
                        }, (data) => {
                            // 解除遮罩层
                            this.$store.commit('lockFalse');
                            this.$store.commit('errorCode', data.error_code);
                            this.$store.commit('modalPopup', data.error_msg);
                        }, (error) => {
                            // 解除遮罩层
                            this.$store.commit('lockFalse');
                            this.$store.commit('modalPopup', error);
                        });

                    })
                } else {
                    // 解除遮罩层
                    this.$store.commit('lockFalse');
                    this.$refs.my_scroller.finishInfinite({isNoMoreData:true});
                }
            }
        },
        billInfos (item) {
            this.$store.commit('saveTaskid', item.taskid);
            location.hash = '/detail';
        }
    },
    created () {
        var clientWidth = document.documentElement.clientWidth;
        if(this.$route.path == '/myPut'){
            this.isShowSendman=false;
        }
        if(clientWidth>700){
            var fontSize =  Math.floor(document.documentElement.clientWidth*100000/40)/100000+"px";
            document.body.style.fontSize=fontSize;
        }
    },
    watch: {
        isRefresh (val) {
            this.refresh();
        },
        isGetToken (val) {
            if(val === true) {
                this.refresh();
            }
        },
        selectAll () {
            if(this.batchTask.length === this.items.length) {
                for (let i = this.items.length - 1; i >= 0; i--) {
                    this.items[i].isSwiped = false;
                }
                this.$store.commit('batchTask', []);
            } else {
                for (let i = this.items.length - 1; i >= 0; i--) {
                    if(this.items[i].isSwiped === false) {
                        this.items[i].isSwiped = true;
                        this.batchTask.unshift(this.items[i]);
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
@import "../assets/list.css";
</style>
