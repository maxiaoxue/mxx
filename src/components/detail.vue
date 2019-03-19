<template>
    <div class="wrap-box">
        <nav-bar
            :nowMsg="title"
            :nowBarLocation="barLocation"
            :nowSpecialView="specialView"
            :nowAdjunct="adjunct"
         />

        <contract-info
            style="padding-top:44px;"
            :heads="heads"
            :defaultTabdata="defaultTabDataForHead" :isShow="true"
            :isImage="isImage"
         />

        <contract-info
            :heads="body"
            :defaultTabdata="defaultTabDataForBody" :isShow="false"
            :showTable="table"
         />

        <approval-record
            :flowData="flowData"
         />

        <bottom-btn
            v-if="actionBtns"
            :footerItem="newFooters"
            :nextApprover="nextApprover"
            :isWorkFlow="isWorkFlow"
        />
    </div>
</template>

<script>
    import navBar from '../views/navBar';
    import contractInfo from '../views/contractInfo';
    import approvalRecord from '../views/approvalRecord';
    import bottomBtn from '../views/bottomBtn';

    export default {
        data () {
            return {
                //设置navBar组件
                title: '',
                barLocation: false,
                specialView: false,
                adjunct: 'detail',
                nextApprover:"",
                //设置bottomBtn组件
                nowFooter: [
                    {text: '驳回', bgImg: "icon-rejected", flag: "reject", show: false},
                    {text: '不同意', bgImg: "icon-disagree", flag: "disagree", show: false},
                    {text: '同意', bgImg: "icon-tongyi", flag: "agree", show: false},
                    {text: '改派', bgImg: "icon-renwugaipai", flag: "transfer", show: false},
                    {text: '加签', bgImg: "icon-jiaqian", flag: "addassign", show: false}
                ],
                handledFooter: [
                    {text: '弃审', bgImg: "icon-rejected", flag: "unapprove", show: true}
                ],
                table: true,
                heads: [],
                body: [],
                flowData: [],
                isImage:"",
                isWorkFlow:"",
            }
        },
        computed: {
            actionBtns: function () {
                return this.$store.getters.actionBtns
            },
            newFooters: function () {
                switch(this.actionBtns){
                    case 'unhandled':
                        // 待办
                        return this.nowFooter;
                        break;
                    case 'handled':
                        // 已办
                        return this.handledFooter;
                        break;
                }
            },
            billInfos: function () {
                return this.$store.getters.billInfos
            },
            defaultTabDataForBody: function () {
                if (this.body.length > 0) {
                    return this.body[0].tabdata;
                } else {
                    return [];
                }
            },
            defaultTabDataForHead: function () {
                if (this.heads.length > 0) {
                    return this.heads[0].tabdata;
                } else {
                    return [];
                }
            },
            isGetToken () {    // 是否已获取jwtToken
                return this.$store.getters.isGetToken
            }
        },
        methods: {

            isTaskUnhandled(){
                //获取任务是否是代办任务
                var isTaskUnhandled = this.$store.getters.isTaskUnhandled;
                var params = this.$store.getters.lsParams;
                //判断单据但否是代办任务
                this.ajax.get(isTaskUnhandled, params, (data) => {
                    if(data.data == true){
                        this.$store.commit("setLsParams", {
                            "statuskey": "ishandled",
                            "statuscode": "unhandled",
                            "taskid": this.$store.getters.lsParams.taskid
                        });
                        this.$store.commit('alterAction', 'unhandled');
                    }else if(data.data == false){
                        this.$store.commit("setLsParams", {
                            "statuskey": "ishandled",
                            "statuscode": "handled",
                            "taskid": this.$store.getters.lsParams.taskid
                        });
                        this.$store.commit('alterAction', 'handled');
                    }
                    this.getTaskInfo();
                }, (data) => {
                    this.$store.commit('errorCode', data.error_code);
                    this.$store.commit('modalPopup', data.error_msg);
                }, (error) => {
                    this.$store.commit('modalPopup', error);
                });
            },

            getTaskInfo() {
                var taskInfoUrl = this.$store.getters.taskInfoUrl,
                    params = this.$store.getters.lsParams;
                //alert(JSON.stringify(params));
                //抄送的用户从消息页面查看详情隐藏底端按钮
                // if(params.mark === "copy"){
                //     this.$store.commit('alterAction', 'no')
                // }
                this.ajax.get(taskInfoUrl, params, (data) => {
                    //下一个审批人
                    this.$store.commit('lockFalse');
                    this.nextApprover = data.data.nextApprover;

                   //是否是工作流
                    this.isWorkFlow = data.data.isWorkFlow;
                    //是否开启影像查看模块

                    this.isImage = data.data.isImage;


                    // 是否开启抄送
                    this.$store.commit('canCpySend', data.data.canCpySend);

                    this.heads = this.heads.concat(data.data.taskbill.data.head);
                    this.heads.map((item, index) => {
                        if (index == 0) {
                            item.currentTab = true;
                        } else {
                            item.currentTab = false;
                        }
                    })

                    //审批流程放入store
                    if(data.data.activityList){
                        let aList = [],
                            obj = {};

                        obj.desc = "";
                        obj.assignableUserList = [];

                        for(let i=0, items=data.data.activityList; i<items.length; i++){
                            if(items[i]) {
                                obj.assignableUserList.push({
                                    "title": items[i].activityName || '',
                                    "key": items[i].activityID || '',
                                    "isSwiped": false,
                                    "isShow": true
                                })
                            }
                        }

                        aList.push(obj);
                        this.$store.commit('saveActivityList', aList);
                    };

                    //改派人员放入store
                    if(data.data.userList){
                        let uList = [],
                            obj = {};

                        obj.desc = "";
                        obj.assignableUserList = [];

                        for(let i=0, items=data.data.userList; i<items.length; i++){
                            obj.assignableUserList.push({"title": items[i].user_name, "key": items[i].cuserid, "isSwiped": false, "isShow": true})
                        }

                        uList.push(obj);
                        this.$store.commit('saveAssignList', uList);
                    };

                    // 同意/不同意动作是否允许指派
                    this.$store.commit('canWhenAgree', data.data.canAssignableWhenAgree);
                    this.$store.commit('canWhenDisagree', data.data.canAssignableWhenDisagree);

                    // 同意指派人员放入store
                    if(data.data.agreeAssignableUserList){
                        let ableUser = this.hasTitleList(data.data.agreeAssignableUserList);
                        this.$store.commit('agreeAssignableUserList', ableUser);
                    };

                    // 不同意指派人员放入store
                    if(data.data.disagreeAssignableUserList){
                        let disAbleUser = this.hasTitleList(data.data.disagreeAssignableUserList);
                        this.$store.commit('disagreeAssignableUserList', disAbleUser);
                    };

                    this.body = this.body.concat(data.data.taskbill.data.body);
                    this.body.map((item, index) => {
                        if (index == 0) {
                            item.currentTab = true;
                        } else {
                            item.currentTab = false;
                        }
                    })
                    this.title = data.data.billtypename;

                    this.nowFooter.map((item)=> {
                        if (item.flag == "reject" && !data.data.canReject) {
                            item.show = false;
                        }
                        else if (item.flag == "transfer" && !data.data.canTransfer) {
                            item.show = false;
                        }
                        else if (item.flag == "addassign" && !data.data.canAddApprover) {
                            item.show = false;
                        }
                        else {
                            item.show = true;
                        }
                    });

                    //获取历史审批节点
                    var billid = data.data.billid,    // billid
                        billtype = data.data.billtype,    // billtype
                        workflowUrl = this.$store.getters.workflowUrl,
                        hisParams = {
                            "billid": billid,
                            "billtype": billtype
                        };
                    // 为打开附件存储
                    this.$store.commit('setBillId', billid);
                    this.$store.commit('setBillType', billtype);
                    this.$store.commit('setBillTs', data.data.taskbill.ts);

                    // 获取附件
                    this.$store.commit('nowAttachLs');

                    this.ajax.get(workflowUrl, hisParams, (data) => {
                        this.flowData = this.flowData.concat(data.data);
                    }, (data) => {
                        this.$store.commit('modalPopup', data.error_msg);
                    }, (error) => {
                        this.$store.commit('modalPopup', error);
                    });
                }, (data) => {
                    this.$store.commit('errorCode', data.error_code);
                    this.$store.commit('modalPopup', data.error_msg);
                }, (error) => {
                    this.$store.commit('modalPopup', error);
                });
            },
            hasTitleList(list) {
                let arr = [];

                for(let i=0, len=list.length; i<len; i++){
                    let obj = {};
                    obj.desc = list[i].desc;
                    obj.assignableUserList = [];

                    for(let j=0, item=list[i].assignableUserList; j<item.length; j++){
                        obj.assignableUserList.push({"title": item[j].user_name, "key": item[j].cuserid, "isSwiped": false, "isShow": true})
                    }
                    arr.push(obj);
                }

                return arr;
            }
        },
        created () {
            if(this.isGetToken){
                if(this.$store.getters.lsParams.isMessage){
                    this.isTaskUnhandled();
                }else{
                    this.getTaskInfo();
                }
                this.$store.commit('listBackBtn', false);
            };
           var fontSize =  Math.floor(document.documentElement.clientWidth*100000/36)/100000+"px";
            //document.body.style.fontSize=fontSize;
        },
        watch: {
            isGetToken (val) {
                if(val === true) {
                    if(this.$store.getters.lsParams.isMessage){
                        this.isTaskUnhandled();
                    }else{
                        this.getTaskInfo();
                    }

                }
            }
        },
        components: {
            navBar,
            contractInfo,
            approvalRecord,
            bottomBtn
        }
    }
</script>
<style>
</style>