<template>
    <div>
        <ul class="bottomBtn">
            <li v-for="(item, index) in footerItem" v-if="item.show" @click="approveActions(item.flag, true)" :style="{width: itemWidth}">
                <i :class="['iconfont', item.bgImg]"></i>
                <p>{{item.text}}</p>
            </li>
        </ul>

        <div class="mask" v-show="needMask">
            <div class="dialog" v-show="needDialog">
                <div class="titleAndSelectItem" v-if="showSelectItem">
                    <div class="dialogTitle" v-text="title"></div>
                    <div class="selectItem">
                        <span v-for="(item,index) in selectedItem">
                            {{item.value}}<i v-if="showDelete" class="iconfont icon-iconfontcolor93" @click="removeSelectedItem(selectedItem, item.key)"></i>
                        </span>
                        <span v-show="selectedItem.length<=0" v-text="errorMessage" class="errorMessage"></span>
                        <div class="gotoSelect" @click="gotoSelect">
                            <i class="iconfont icon-right"></i>
                        </div>
                    </div>
                </div>

                <div class="titleAndSelectItem" v-if="canCpySend && showSelectInfo">
                    <div class="dialogTitle" style="color:#666;" v-text="inform"></div>
                    <div class="selectItem">
                        <span v-for="(item, index) in selectedInfo">
                            {{item.value}}<i class="iconfont icon-iconfontcolor93" @click="removeSelectedItem(selectedInfo, item.key)"></i>
                        </span>
                        <span v-show="selectedInfo.length<=0" v-text="infoMessage" style="color:#bbb;"></span>
                        <div class="gotoSelect" @click="toSelectInfo">
                            <i class="iconfont icon-right"></i>
                        </div>
                    </div>
                </div>

                <div class="dialog_main">
                    <textarea id="dialog_text" v-model="dialogText" placeholder="请输入审批意见"></textarea>
                    <!--<label for="dialog_text">(请输入审批意见)</label>-->
                </div>
                <div class="info-person">
                    <label style="color: #b1b1b1;font-size: 14px;" v-show="isShow">{{nextApprover}}</label>
                </div>
                <ul class="dialog_btn">
                    <li class="line" @click="closeMask">取消</li>
                    <li @click="isSubmitIdea">提交</li>
                </ul>
            </div>

            <!-- 电子签名 -->
            <div class="dialog" style="margin:0px;width:100%;height:100%;" v-if="isSignature" v-show="!needDialog && hideSelf">
                <div class="dialog_main" :style="{height: canvasHeight+'px'}">
                    <label>(请签名)</label>
                    <div class="draw">
                        <canvas id="canvas" @mousedown="canvasDown($event)" @mouseup="canvasUp($event)" @mousemove="canvasMove($event)" @touchstart="canvasDown($event)" @touchend="canvasUp($event)" @touchmove="canvasMove($event)"></canvas>
                    </div>
                </div>
                <ul class="dialog_btn">
                    <li class="spelNum line" @click="closeMask">取消</li>
                    <li class="spelNum line" @click="controlCanvas">重写</li>
                    <li class="spelNum" @click="getImage">提交</li>
                </ul>
            </div>

            <div class="confirm" v-show="needConfirm">
                <!-- <div class="close_img" @click="closeMask">
                    <i class="iconfont icon-cuo"></i>
                </div> -->
                <div class="confirm_img"></div>
                <p><span v-show="currentAct !== '不同意'">已</span>{{ currentAct }}！</p>
                <div class="confirm_btn" @click="closeMask($event)">
                    确定
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from '../router';

export default {
    data () {
        return {
            isShow:true,    //是否显示下一审批人
            dialogText: '',
            currentAct: '',
            inform: '已选择的抄送人',
            hideSelf: true,
            action: "",
            canvasImgUrl: "",
            hasDrawIamge: false,
            context: {},
            canvasMoveUse: false,
            // 配置参数
            config: {
                lineWidth: 1,
                lineColor: '#000',
                shadowBlur: 2
            },
            errorMessage: "请至少选择一个！",
            infoMessage: "选择抄送人"
        }
    },
    computed: {
        needMask () {
            return this.$store.getters.isPopup;
        },
        canCpySend () {
            return this.$store.getters.canCpySend;
        },
        selectedItem () {
            return this.$store.getters.approvalParams.value;
        },
        selectedInfo () {
            return this.$store.getters.selectedInfo.value;
        },
        needDialog () {
            return this.$store.getters.isPopupInp;
        },
        itemWidth () {
            var itemsLength = this.footerItem.length;

            this.footerItem.map(item => {
                if(item.show===false){
                    itemsLength--;
                }
            });
            return (100/itemsLength).toFixed(2)+'%';
        },
        isSignature () {
            return this.$store.getters.isSignature;
        },
        needConfirm () {
            return this.$store.getters.needConfirm;
        },
        canvasHeight () {
            var clientH = document.documentElement.clientHeight;
            return clientH-76;
        },
        canvasWidth () {
            var clientW = document.documentElement.clientWidth;
            return clientW-30;
        },
        showSelectItem(){
            if (this.action == "disagree" && !this.$store.getters.canWhenDisagree) {
                return false;
            }
            else if (this.action == "agree" && !this.$store.getters.canWhenAgree) {
                return false;
            }
            else if (this.action == "reject" && this.$store.getters.activityList.length == 0) {
                return false;
            }
            else {
                return true;
            }
        },
        showSelectInfo() {
            if (this.action == "disagree" || this.action == "agree" || this.action == "reject") {
                return true;
            }
            else {
                return false;
            }
        },
        title(){
            var action = this.$route.query.action;
            if (action == "reject") {
                return "已选择的驳回节点";
            }
            if (action == "addassign") {
                return "已选择的加签人" + "(" + this.selectedItem.length + ")"
            }
            if (action == "transfer") {
                return "已选择的改派人"
            }
            if (action == "disagree" || action == "agree") {
                this.isShow = false;
                return "已选择的指派人"
            }
        },
        //是否显示移除人员按钮
        showDelete(){
            var action = this.$route.query.action;
            if (action == "reject" || action == "transfer") {
                return false;
            } else {
                return true;
            }
        }
    },
    props: {
        footerItem: {
            type: Array
        },
        nextApprover: {
            type: null,
            required: true
        },
        isWorkFlow:{
            type: String,
            required: "N"
        }
    },
    created(){
        this.action = this.$route.query.action;
        if (this.action) {
            if (this.action == "reject") {
                this.dialogText = "驳回";
                this.currentAct = "驳回";
            }
        } //改派
        if (this.action == "transfer") {
            this.dialogText = "改派";
            this.currentAct = "改派";
        }  //加签
        if (this.action == "addassign") {
            this.dialogText = "加签";
            this.currentAct = "加签";
        }
        if (this.action == "disagree") {
            this.dialogText = "不同意";
            this.currentAct = "不同意";
        }
        if (this.action == "agree") {
            this.dialogText = "同意";
            this.currentAct = "同意";
        }
        if (!this.action) {
            this.$store.commit('closePopup');
        }
    },
    mounted() {
        if(this.isSignature){
            this.initCanvas();
        }
    },
    watch: {
        isSignature(val) {
            if(val === true) {
                this.initCanvas();
            }
        }
    },
    methods: {
        initCanvas() {
            setTimeout(() => {
                const canvas = document.querySelector('#canvas');
                this.context = canvas.getContext('2d');
                canvas.height = this.canvasHeight;
                canvas.width = this.canvasWidth;
                this.setCanvasStyle();
            }, 10);
        },
        approveActions (flag, resetStore) {

            if (resetStore) {
                this.$store.commit('saveApprovalParams', {"key": "", "value": []});
            }

            //弃审
            if(flag == "unapprove"){
                // 开启遮罩层
                this.$store.commit('lockTrue');
                this.currentAct = "弃审";

                var taskId = this.$store.getters.taskid,
                    approvalUrl = this.$store.getters.approveUrl,
                    approvalParams = {};
                approvalParams.taskid = taskId;
                approvalParams.action = flag;
                approvalParams.isWorkFlow = this.isWorkFlow;
                this.ajax.post(approvalUrl, approvalParams, (data) => {
                    this.hideSelf = false;
                    this.$store.commit('openPopup');
                    this.$store.commit('showPopupInfo');
                    this.$store.commit('needConfirm', true);
                    // 解除遮罩层
                    this.$store.commit('lockFalse');
                }, () => {
                    // 解除遮罩层
                    this.$store.commit('lockFalse');
                });
            }

            //驳回
            if (flag == "reject") {
                if(this.$store.getters.activityList.length){
                    router.push({path: '/screen', query: {action: 'reject', navTitle: "选择驳回节点"}});
                } else {
                    this.action = flag;
                    this.$store.commit('openPopup');
                }
                this.dialogText = "驳回";
                this.currentAct = "驳回";
            }
            //不同意
            if (flag == "disagree") {
                if(this.$store.getters.canWhenDisagree){
                    router.push({path: '/screen', query: {action: 'disagree', navTitle: "选择指派人员"}});
                } else {
                    this.action = flag;
                    this.$store.commit('openPopup');
                }
                this.dialogText = "不同意";
                this.currentAct = "不同意";
            }
            //同意
            if (flag == "agree") {
                if(this.$store.getters.canWhenAgree){
                    router.push({path: '/screen', query: {action: 'agree', navTitle: "选择指派人员"}});
                } else {
                    this.action = flag;
                    this.$store.commit('openPopup');
                }
                this.dialogText = "同意";
                this.currentAct = "同意";
            }
            //改派
            if (flag == "transfer") {
                router.push({path: '/screen', query: {action: 'transfer', navTitle: "选择改派人员"}});
                this.dialogText = "改派";
                this.currentAct = "改派";
            }
            //加签
            if (flag == "addassign") {
                router.push({path: '/screen', query: {action: 'addassign', navTitle: "选择加签人员"}});
                this.dialogText = "加签";
                this.currentAct = "加签";
            }

            // 记录当前动作
            this.$store.commit('currentAction', flag);
        },
        closeMask (e) {
            this.$store.commit('closePopup');
            this.$store.commit('hidePopupInfo');
            this.$store.commit('needConfirm', false);
            if(this.isSignature) {
                this.controlCanvas();
                this.hideSelf = true;
            }

            // 把已选人列表清空
            if(this.showSelectItem){
                this.$store.commit('saveApprovalParams', {"value": []});
            }

            // 把已选抄送人清空
            this.$store.commit('selectedInfo', {"value": []});
            // 清空当前动作
            this.$store.commit('currentAction', '');

            document.body.style.overflow = "";

            if(e.target.className === 'confirm_btn'){
                location.hash = '/myApprove';
            }
        },
        isSubmitIdea() {
            if(this.showSelectItem && this.selectedItem.length === 0){
                return;
            }
            if(this.isSignature){
                this.$store.commit('showPopupInfo');
                document.body.style.overflow = "hidden";
            } else {
                this.submitIdea();
            }
        },
        submitIdea () {
            // 开启遮罩层
            this.$store.commit('lockTrue');

            var taskId = this.$store.getters.taskid,
                approvalUrl = this.$store.getters.approveUrl,
                approvalParams = {};
            approvalParams.taskid = taskId;
            approvalParams.note = this.dialogText+'(来自移动端)';
            approvalParams.action = this.action;
            approvalParams.signContent = this.canvasImgUrl;
            approvalParams.isWorkFlow = this.isWorkFlow;
            //加签、改派
            if(this.action == "addassign" || this.action == "transfer" || this.action == "agree" || this.action == "disagree"){
                var userList = this.$store.getters.approvalParams.value, userListToServer = [];

                userList.map(user => {
                    userListToServer.push(user.key);
                });
                approvalParams.targetUserlist = userListToServer.join(";");
            }

            //驳回
            if(this.action == "reject"){
                var noteParams = this.$store.getters.approvalParams.value,
                    rejectNode = noteParams.length > 0 ? noteParams[0].key : "";

                approvalParams.nodeid = rejectNode;
            }

            // 抄送
            if(this.showSelectInfo) {
                var uList = this.$store.getters.selectedInfo.value, uListSend = [];

                uList.map(user => {
                    uListSend.push(user.key);
                });

                approvalParams.msgSenders = uListSend.join(';');
            }

            this.ajax.post(approvalUrl, approvalParams, (data) => {
                this.isSignature ? this.hideSelf = false : this.$store.commit('showPopupInfo');
                this.$store.commit('needConfirm', true);
                // 解除遮罩层
                this.$store.commit('lockFalse');
            }, () => {
                // 解除遮罩层
                this.$store.commit('lockFalse');
            });
        },
        gotoSelect(){
            var action = this.$route.query.action;
            this.approveActions(action, false);
        },
        toSelectInfo(){
            router.push({path: '/screen', query: {action: 'cpySend',cpySend: 'true', navTitle: "选择抄送人员"}});
        },
        //移除已选项
        removeSelectedItem(selectedItem, key){
            for (var i = 0; i < selectedItem.length; i++) {
                if (selectedItem[i].key == key) {
                    // splice改变原数组
                    selectedItem.splice(i, 1);
                    break;
                }
            }
        },
        // 电子签名
        isPc() {
            const userAgentInfo = navigator.userAgent
            const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
            let flag = true
            for(let v = 0; v < Agents.length; v++) {
                if(userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false
                    break
                }
            }
            return flag
        },
        canvasMove(e) {
            if(this.canvasMoveUse) {
                const t = e.target;
                let canvasX = 0,
                    canvasY = 0,
                    parentLeft = t.offsetParent.offsetLeft || t.parentNode.offsetLeft,
                    parentTop = t.offsetParent.offsetTop || t.parentNode.offsetTop;

                if(this.isPc()) {
                    canvasX = e.clientX - parentLeft;
                    canvasY = e.clientY - parentTop;
                } else {
                    canvasX = e.changedTouches[0].clientX - parentLeft;
                    canvasY = e.changedTouches[0].clientY - parentTop;
                }
                this.context.lineTo(canvasX, canvasY);
                this.context.stroke();
                this.hasDrawIamge = true;
            }
        },
        canvasUp(e) {
            this.canvasMoveUse = false;
        },
        canvasDown(e) {
            this.canvasMoveUse = true;
            // offset是cavas距离顶部以及左边的距离
            const canvasX = e.clientX - (e.target.offsetParent.offsetLeft || e.target.parentNode.offsetLeft);
            const canvasY = e.clientY - (e.target.offsetParent.offsetTop || e.target.parentNode.offsetTop);
            this.setCanvasStyle();
            // 清除子路径
            this.context.beginPath();
            this.context.moveTo(canvasX, canvasY);
        },
        controlCanvas() {
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.canvasImgUrl = '';
            this.hasDrawIamge = false;
        },
        getImage() {
            if(this.hasDrawIamge === true){
                this.canvasImgUrl = document.querySelector('#canvas').toDataURL('image/png');
                this.submitIdea();
            }
        },
        // 设置绘画配置
        setCanvasStyle() {
            this.context.lineWidth = this.config.lineWidth;
            this.context.shadowBlur = this.config.shadowBlur;
            this.context.shadowColor = this.config.lineColor;
            this.context.strokeStyle = this.config.lineColor;
        }
    }
}
</script>

<style scoped>
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

    .dialog,
    .confirm {
        width: 300px;
        margin: 150px auto 0;
        border-radius: 6px;
        background-color: #fff;
        box-sizing: border-box;
        overflow: hidden;
    }

    .dialog {
        height: auto;
        padding: 0 15px;
    }

    .dialog_main {
        width: 100%;
        height: 120px;
        margin: 15px auto 10px;
        position: relative;
    }

    #dialog_text {
        width: 100%;
        height: 100%;
        padding: 5px 10px;
        box-sizing: border-box;
        font-size: 15px;
        background: #f5f5f5;
        border: 1px solid #e9e9e9;
        resize: none;
    }

    .dialog_main > label {
        position: absolute;
        right: 10px;
        bottom: 10px;
        color: #b1b1b1;
    }

    .dialog_btn {
        width: 100%;
        border-top: 1px solid #ececec;
        overflow: hidden;
    }

    .dialog_btn li {
        float: left;
        width: 50%;
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .dialog_btn .spelNum{
        width: 33.33%;
    }

    .line {
        position: relative;
    }

    .line::after {
        content: "";
        width: 1px;
        height: 20px;
        background-color: #ececec;
        position: absolute;
        right: 0;
        top: 15px;
    }
    .draw {
        background: #f5f5f5;
        height: 100%;
    }

    #canvas {
        cursor: crosshair;
        display: block;
    }

    .dialog_btn li:last-child {
        color: #fc8230;
    }

    .confirm {
        height: 210px;
        padding: 8px;
    }

    .close_img {
        position: absolute;
        top: 0;
        right: 0;
        width: 36px;
        height: 36px;
        padding: 5px;
        color: #fc8230;
    }

    .confirm_img {
        height: 92px;
        background-image: url('../assets/confirm.png');
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-size: auto 92px;
    }

    .confirm > p {
        text-align: center;
        font-size: 15px;
        color: #5F5F5F;
        height: 52px;
        line-height: 52px;
    }

    .confirm_btn {
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 100%;
        border-top: 1px solid #ececec;
        color: #fc8230;
    }

    .dialogTitle {
        font-size: 16px;
        padding: 10px 0;
        border-bottom: 1px solid #ccc;
    }

    .selectItem {
        margin-top: 10px;
        padding-right: 30px;
        position: relative;
    }

    .selectItem span {
        display: inline-block;
        line-height: 40px;
        margin-right: 30px;
        position: relative;
    }

    .selectItem > span i {
        position: absolute;
        top: -8px;
        color: #FF7A7A;
    }

    .gotoSelect {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        padding-left: 20px;
        height: 100%;
        width: 30px;
        cursor: pointer;
    }

    .gotoSelect i {
        position: absolute;
        top: 50%;
        margin-top: -12px;
    }
    .errorMessage{
        color:#FF7A7A;
    }

    .info-person{
        margin: 10px 0;
    }
</style>