<template>
    <div>
        <ul class="bottomBtn">
            <li v-for="(item, index) in footerItem" v-if="item.show" :style="{width: itemWidth}" @click="batchApprove(item.flag)">
                <p :class="['iconfont', item.bgImg]"></p>
                <p>{{item.text}}</p>
            </li>
        </ul>

        <div class="mask" v-if="batchApp">
            <div class="batch">
                <div class="batch-list">
                    <table class="list">
                        <tr v-for="cItem in batchTask">
                            <td class="brief">
                                <div v-text="cItem.title" class="title"></div>
                                <div class="info">
                                    发送人：<span v-text="cItem.sendman"></span>
                                    <span v-text="cItem.senddate" class="marLeft"></span>
                                </div>
                            </td>
                            <td class="status-box">
                                <i v-if="cItem.loading" class="loading"></i>
                                <i v-else :class="[{success:cItem.isSuccess && !cItem.isAssign},{assign:cItem.isSuccess && cItem.isAssign},{failed:!cItem.isSuccess}]"></i>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="handle">
                    <p class="handle-txt" v-show="waitClose">现在关闭？已审批的不会还原，未审批的保留原状态</p>
                    <p style="padding-top: 25px;">
                        <span style="float:left;padding-left: 11%;position: relative;">
                            <img src="../assets/small_success.png" class="img-state img-success"/>提交成功
                        </span>
                        <span style="position: relative;">
                            <img src="../assets/small_failed.png" class="img-state img-fail"/>提交失败
                        </span>
                        <span style="float:right;padding-right: 6%;position: relative;">
                            <img src="../assets/small_assign.png" class="img-state img-person"/>需要选择审批人
                        </span>
                    </p>
                    <p class="handle-btn" v-text="handleBtn" @click="handleBatch"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                batchApp: false,
                finishNum: 0,
                timer: null,
                failHandle: null,
                waitClose: false,
                handleBtn: '关 闭'
            }
        },
        props: {
            footerItem: {
                type: Array
            }
        },
        computed: {
            itemWidth () {
                var itemsLength = this.footerItem.length;

                this.footerItem.map(item => {
                    if(item.show===false){
                    itemsLength--;
                }
            });
                return (100/itemsLength).toFixed(2)+'%';
            },
            batchTask () {    // 已选Task
                return this.$store.getters.batchTask
            }
        },
        methods: {
            batchApprove(flag) {
                switch(flag) {
                    case 'all':
                        this.$store.commit('selectAll');
                        break;
                    case 'messageWarn':
                        this.sendApproveWar(flag);
                        break;
                    default:
                        this.approveAll(flag);
                }
            },

            sendApproveWar(){
                if(!this.batchTask.length) {
                    this.$store.commit('modalPopup', '请选择！');
                } else{
                    const sendMessageUrl = this.$store.getters.sendMessagewarnUrl;
                    var taskids="";
                    for (let i = 0; i < this.batchTask.length; i++) {
                        taskids = taskids + this.batchTask[i].taskid+",";
                    }
                    this.ajax.silentPost(sendMessageUrl, {
                        taskid: taskids.substr(0,taskids.length-1),
                        statuscode:this.$store.getters.lsParams.statuscode
                    }, (data) => {
                        this.$Modal.success({
                        title: '成功',
                        content: data.data
                    });
                    },() => {
                        this.$Message.success('消息发送失败');
                    });

                }
            },

            approveAll(flag) {
                if(!this.batchTask.length) {
                    this.$store.commit('modalPopup', '请选择！');
                } else {
                    this.batchApp = true;
                    const approvalUrl = this.$store.getters.approveUrl, nTimeout = 200;

                    for (let i = 0; i < this.batchTask.length; i++) {
                        setTimeout(() => {
                            this.ajax.silentPost2(approvalUrl, {
                            taskid: this.batchTask[i].taskid,
                            action: flag,
                            note: flag === 'agree' ? '同意' : '不同意',
                            signContent: ''
                        }, (data) => {
                            if(this.batchApp === false) {
                                // 弹窗已关闭，刷新列表
                                this.$store.commit('alterRefresh');
                             } else {
                                for (let j = this.batchTask.length - 1; j >= 0; j--) {
                                    if(1000 === data.error_code){
                                        this.batchTask[i].loading = false;
                                        this.batchTask[i].isSuccess = true;
                                        this.batchTask[i].isAssign = true;
                                    }else{
                                        this.batchTask[i].isAssign = false;
                                    }
                                    if(this.batchTask[j].taskid === data.data) {
                                        this.batchTask[j].loading = false;
                                        this.batchTask[j].isSuccess = true;
                                        break;
                                    }
                                };
                                this.finishNum++;
                            }
                    }, () => {
                            if(this.batchApp === false) {
                                this.$store.commit('alterRefresh');
                            } else {
                                this.finishNum++;
                            }
                        });
                    }, );
                    }

                    this.timer = setInterval(() => {
                                if(this.finishNum === this.batchTask.length) {
                        clearInterval(this.timer);nTimeout
                        this.handleBtn = '确 定';
                    }
                }, nTimeout * 2);

                    this.failHandle = setTimeout( () => {
                        for (let j = this.batchTask.length - 1; j >= 0; j--) {
                        if(this.batchTask[j].loading === true && this.batchTask[j].isAssign === false) {
                            this.batchTask[j].loading = false;
                            this.batchTask[j].isSuccess = false;
                        }
                    }
                }, nTimeout * 6 * this.batchTask.length);
                }
            },
            handleBatch() {
                if(this.handleBtn === '确 定') {
                    this.batchApp = false;
                    this.$store.commit('batchTask', []);
                    clearTimeout(this.failHandle);
                    this.$store.commit('alterRefresh');
                    this.waitClose = false;
                    this.handleBtn = '关 闭';
                    this.finishNum = 0;
                    this.timer = null;
                    this.failHandle = null;
                } else {
                    this.waitClose = true;
                    this.handleBtn = '确 定';
                    clearInterval(this.timer);
                }
            }
        }
    }
</script>

<style scoped>
    @import "../assets/list.css";
    .batch {
        position: absolute;
        background: #fff;
        bottom: 50px;
        top: 50px;
        left: 10px;
        right: 10px;
    }
    .batch-list {
        position: absolute;
        bottom: 76px;
        top: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
        padding: 10px;
        box-sizing: border-box;
    }
    .batch .handle {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 110px;
        text-align: center;
        border-top: 1px solid #f6f6f6;
    }
    .handle-btn {
        height: 40px;
        line-height: 40px;
        color: #7b9ff5;
        border: 1px solid #7b9ff5;
        font-size: 16px;
        width: 90%;
        margin: 10px auto 0;
    }
    .handle-txt {
        position: absolute;
        top: 2px;
        width: 100%;
        font-size: 12px;
        color: #666;
    }
    .batch .status-box {
        width: 40px;
        text-align: right;
        vertical-align: middle;
    }
    .status-box > i {
        display: inline-block;
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: 100%;
    }
    .status-box .loading {
        background-image: url('../assets/loading.gif');
    }
    .status-box .success {
        background-image: url('../assets/success.png');
    }
    .status-box .failed {
        background-image: url('../assets/failed.png');
    }
    .status-box .assign {
        background-image: url('../assets/assign.png');
    }
    .bottomBtn {
        position: fixed;
        width: 100%;
        bottom: 0;
        height: 56px;
        box-shadow: 0 -3px 5px #f6f6f6;
        background-color: #fbfbfb;
        text-align: center;
        overflow: hidden;
        z-index: 5;
    }
    .bottomBtn > li {
        position: relative;
        float: left;
        height: 56px;
        padding-top: 4px;
        box-sizing: border-box;
    }
    .bottomBtn > li::after {
        content: '';
        position: absolute;
        top: 17px;
        right: 0;
        width: 1px;
        height: 22px;
        background-color: #f1f1f1;
    }
    .bottomBtn > li:last-child::after{
        display: none;
    }
    .bottomBtn .btn-img{
        height: 18px;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: auto 100%;
        margin: 3px 0;
    }
    .bottomBtn .all{
        background-image: url('../assets/all.png');
    }
    .bottomBtn .agree{
        background-image: url('../assets/agree.png');
    }
    .bottomBtn .disagree{
        background-image: url('../assets/disagree.png');
    }
    .img-state{
        width: 16px;
        height: 16px;
        position: absolute;
    }
    .img-success{
        left: 20px;
    }
    .img-person{
        left: -20px;
    }
    .img-fail{
        left: -20px;
    }
</style>