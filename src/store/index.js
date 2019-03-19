import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isWorkFlow:"N",   //判断单据走的是任务流，默认走审批流
        isImage:"N",   //判断单据是否启用影像系统，默认不启用
        maskStatus:false,  //mask显示隐藏
        orgmodel:'',        //筛选组织
        makermodel:'',      //筛选制单人
        needLocker: false,    // 是否禁止用户操作
        needPopup: false,    // 是否弹窗
        isSignature: false,    // 是否开启电子签名
        isGetToken: false,    // 是否已获取jwtToken
        popupInput: true,    // 弹窗内显示输入框，false显示电子签名
        needConfirm: false,    // 弹窗内显示提示信息
        listBackBtn: true,    // 是否显示列表页返回按钮
        actionBtns: false,    // 详情页审批按钮（只有待办任务详情页才显示）
        approvalUrl: "",
        modalPopup: "",
        errorCode: "",
        srctype: "",
        nowAttachLs: false,
        canCpySend: false,  // 是否能抄送
        host: "/jzmobile-approve",    // http://10.4.21.25:8080（同一服务器可不设置，方便移植）
        tokenUrl: '/jwt/authen',    // 获取token
        weChatTokenUrl: '/jwt/wechat/authen',    // 微信获取token
        weChatBindNcUserUrl: '/jwt/wechat/useridfo',    // 微信获取token
        qingtuiuser: '/jwt/qingtui/user',    // 微信获取token
        qingtuiTokenUrl: '/jwt/qingtui/authen',    // 微信获取token
        qingtuiBingNcUser: '/jwt/qingtui/useridfo',    // 微信获取token
        lsUrl: '/task/getTaskList',    // 列表页接口
        selectConUrl:'/task/getTasksMakerAndOrg', //或者筛选条件
        lsCount: '/task/getTaskListCount',    // 列表页总条数接口
        atLsUrl: '/attachment/attachList',    // 附件列表接口
        imageLsUrl: '/ncimage/imageList',    // 影像列表接口
        atUrl: '/attachment/attachInfo',    // 打开附件接口
        imageUrl: '/ncimage/imageContent',    // 打开附件接口
        chartUrl: '/workflow/getWorkflowChart',    // 打开流程图接口
        personLsUrl: '/task/taskUserList',    // 分页人员列表
        requestNoteUrl:'/deploy/note', //生成License申请单接口
        easyConfigUrl:'/deploy/easyConfig', //生成部署配置文件
        lsParams: {    // 列表/详情请求参数
            "startline": "0",
            "count": "10",
            "statuskey": "",
            "statuscode": "",
            "condition": "",
            "taskid": '',
            "billmaker":null,
            "pkOrg":null,
            "moudle":null,
            "datetype":null,
            "isWechat":false,//是否是企业微信
            'isMessage':false,//是否从详情页进入
        },
        isRefresh: false,    // 切换标签刷新列表
        queryUserLs: false,    // 查询分页用户列表
        //审批接口
        approveUrl: '/workflow/doAction',
        //发送消息提醒接口
        sendMessagewarnUrl: '/workflow/sendMessagewarn',
        //详情接口
        taskInfoUrl: '/task/getTaskInfo',
        //判断是否是代办任务
        isTaskUnhandled: '/task/isTaskUnhandled',
        //流程接口
        workflowUrl: '/workflow/history',
        //流程节点
        activityList: [],
        //审批操作
        activeFlag: '',
        //改派人员
        assignList: [],
        //指派人员
        agreeAssignableUserList: [],
        disagreeAssignableUserList: [],
        cpySendUserList:[],  //抄送人
        addassignList:[],   //加签人
        canWhenAgree: false,    // 同意动作是否有指派
        canWhenDisagree: false,    // 不同意动作是否有指派
        //审批参数
        approvalParams: {
            "key": "", "value": []
        },
        selectedInfo: {  // 抄送已选人员
            "key": "", "value": []
        },
        taskCount: {    // 列表总条数
            'now': '',
            'A': '',
            'B': '',
            'C': '',
            'D': '',
            'E': ''
        },
        currentAction: '',
        billId: '',
        billType: '',
        billTs: '',
        selectAll: false,
        batchTask: [],
        openid:'',
        reLoad:false,
    },
    getters: {
        isWorkFlow:state => state.isWorkFlow,
        maskStatus:state => state.maskStatus,
        orgmodel:state => state.orgmodel,
        makermodel:state => state.makermodel,
        isLocker: state => state.needLocker,
        isPopup: state => state.needPopup,
        isPopupInp: state => state.popupInput,
        isSignature: state => state.isSignature,
        isGetToken: state => state.isGetToken,
        needConfirm: state => state.needConfirm,
        listBackBtn: state => state.listBackBtn,
        taskid: state => state.lsParams.taskid,
        actionBtns: state => state.actionBtns,
        modalPopup: state => state.modalPopup,
        errorCode: state => state.errorCode,
        srctype: state => state.srctype,
        nowAttachLs: state => state.nowAttachLs,
        canCpySend: state => state.canCpySend,
        host: state => state.host,
        approvalUrl: state => state.host + state.approvalUrl,
        tokenUrl: state => state.host + state.tokenUrl,
        weChatTokenUrl: state => state.host + state.weChatTokenUrl,
        weChatBindNcUserUrl: state => state.host + state.weChatBindNcUserUrl,
        qingtuiTokenUrl: state => state.host + state.qingtuiTokenUrl,
        qingtuiuser: state => state.host + state.qingtuiuser,
        qingtuiNcUser: state => state.host + state.qingtuiNcUser,
        qingtuiBingNcUser: state => state.host + state.qingtuiBingNcUser,
        unQingtuiBingNcUser: state => state.host + state.unQingtuiBingNcUser,
        lsUrl: state => state.host + state.lsUrl,
        selectConUrl: state => state.host+state.selectConUrl,
        lsCount: state => state.host + state.lsCount,
        atLsUrl: state => state.host + state.atLsUrl,
        imageLsUrl: state => state.host + state.imageLsUrl,
        atUrl: state => state.host + state.atUrl,
        imageUrl: state => state.host + state.imageUrl,
        requestNoteUrl:state => state.host+state.requestNoteUrl,
        easyConfigUrl:state => state.host+state.easyConfigUrl,
        chartUrl: state => state.host + state.chartUrl,
        personLsUrl: state => state.host + state.personLsUrl,
        lsParams: state => state.lsParams,
        isRefresh: state => state.isRefresh,
        queryUserLs: state => state.queryUserLs,
        condition: state => state.lsParams.condition,
        approveUrl: state => state.host + state.approveUrl,
        sendMessagewarnUrl:state => state.host + state.sendMessagewarnUrl,
        taskInfoUrl: state => state.host + state.taskInfoUrl,
        isTaskUnhandled: state => state.host + state.isTaskUnhandled,
        workflowUrl: state => state.host + state.workflowUrl,
        activityList: state => state.activityList,
        activeFlag: state => state.activeFlag,
        agreeAssignableUserList: state => state.agreeAssignableUserList,
        disagreeAssignableUserList: state => state.disagreeAssignableUserList,
        cpySendUserList: state => state.cpySendUserList,
        addassignList: state => state.addassignList,
        canWhenAgree: state => state.canWhenAgree,
        canWhenDisagree: state => state.canWhenDisagree,
        activeAssignList: state => state.assignList,
        approvalParams: state => state.approvalParams,
        selectedInfo: state => state.selectedInfo,
        currentAction:state => state.currentAction,
        billId:state => state.billId,
        billType:state => state.billType,
        billTs:state => state.billTs,
        selectAll:state => state.selectAll,
        batchTask:state => state.batchTask,
        getTaskCount:state => state.taskCount,
        openid: state => state.openid,
        reLoad: state => state.reLoad,
    },
    mutations: {
        maskStatus(state, val) {
            state.maskStatus = val;
        },
        isWorkFlow(state, val) {
            state.isWorkFlow = val;
        },
        orgmodel (state,val){
            state.orgmodel = val;
        },
        makermodel (state,val){
            state.makermodel = val;
        },
        lockTrue (state) {
            state.needLocker = true;
        },
        lockFalse (state) {
            state.needLocker = false;
        },
        openPopup (state) {
            state.needPopup = true;
        },
        closePopup (state) {
            state.needPopup = false;
        },
        isSignature (state, val) {
            state.isSignature = eval(val);
        },
        needConfirm (state, val) {
            state.needConfirm = val;
        },
        isGetToken (state, val) {
            state.isGetToken = val;
        },
        queryUserLs (state) {
            state.queryUserLs = !state.queryUserLs;
        },
        listBackBtn (state, val) {
            state.listBackBtn = val;
        },
        errorCode (state, val) {
            state.errorCode = val;
        },
        modalPopup (state, val) {
            state.modalPopup = val + '_*$*_' + new Date().getTime();
        },
        srctype (state, val) {
            state.srctype = val;
        },
        nowAttachLs (state) {
            state.nowAttachLs = !state.nowAttachLs;
        },
        canCpySend (state, val) {
            state.canCpySend = eval(val);
        },
        showPopupInfo (state) {
            state.popupInput = false;
        },
        hidePopupInfo (state) {
            state.popupInput = true;
        },
        saveTaskid (state, nowTaskid) {
            state.lsParams.taskid = nowTaskid;
        },
        alterAction (state, nowAction) {
            state.actionBtns = nowAction;
        },
        approvalAction(state, approvalUrl){
            state.approvalUrl = approvalUrl;
        },
        setLsParams (state, obj) {
            for(let key in obj){
                state.lsParams[key] = obj[key];
            }
        },
        addStartLine (state) {
            state.lsParams.startline = String(Math.floor(state.lsParams.startline) + Math.floor(state.lsParams.count));
        },
        resetStartLine (state) {
            state.lsParams.startline = "0";
        },
        alterRefresh (state) {
            state.isRefresh = !state.isRefresh;
        },
        alterCondition (state, val) {
            state.lsParams.condition = val;
        },
        saveActivityList (state, val) {
            state.activityList = val;
        },
        saveActiveFlag (state, val) {
            state.activeFlag = val;
        },
        agreeAssignableUserList (state, val) {
            state.agreeAssignableUserList = val;
        },
        disagreeAssignableUserList (state, val) {
            state.disagreeAssignableUserList = val;
        },
        saveAddassignList (state, val) {
            state.addassignList = val;
        },
        saveCpySendUserList (state, val) {
            state.cpySendUserList = val;
        },
        canWhenAgree (state, val) {
            state.canWhenAgree = val;
        },
        canWhenDisagree (state, val) {
            state.canWhenDisagree = val;
        },
        saveAssignList (state, val) {
            state.assignList = val;
        },
        saveApprovalParams(state, obj){
            for(let key in obj){
                state.approvalParams[key] = obj[key];
            }
        },
        selectedInfo(state, obj){
            for(let key in obj){
                state.selectedInfo[key] = obj[key];
            }
        },
        currentAction(state, val) {
            state.currentAction = val;
        },
        setBillId(state, val) {
            state.billId = val;
        },
        setBillType(state, val) {
            state.billType = val;
        },
        setBillTs(state, val) {
            state.billTs = val;
        },
        selectAll(state) {
            state.selectAll = !state.selectAll;
        },
        batchTask(state, val) {
            state.batchTask = val;
        },
        setTaskCount (state, obj) {
            for(let key in obj){
                state.taskCount[key] = obj[key];
            }
        },
        openid(state, val) {
            state.openid = val;
        },
        reLoad(state, val) {
            state.reLoad = val;
        },
    }
})

export default store
