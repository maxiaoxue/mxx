<template>
    <div>
        <div class="nav-bar">
            <div class="top-bar">
                <span class="back-btn" @click="closeView" v-if="listBackBtn">
                    <i class="iconfont icon-llmainpageback"></i>
                </span>

                <span class="top-title" @click="showTitle">
                    <em v-text="nowMsg"></em>
                    <i v-if="barLocation" class="iconfont icon-xiala"></i>
                </span>

                <div class="turn-tit" v-if="barLocation" v-show="titleList" @click="showTitle">
                    <ul class="tit-list">
                        <li v-for="title in titles" @click="selectIt(title)">
                            <router-link :to="title.href" class="option" tag="span">
                                <em v-text="title.text"></em>
                                <i v-if="title.checked" class="iconfont icon-zhengque"></i>
                            </router-link>
                        </li>
                    </ul>
                </div>

                <div class="adjunct" v-if="adjunct">
                    <div class="more">
                        <!--<p @click="toggleAttach"><i class="iconfont icon-gengduo"></i></p>-->
                        <!--<p @click="showChart"><i class="iconfont icon-gongzuoliuchengtu"></i></p>-->

                        <ul class="attach1">
                            <li style = "padding-left: 140px" v-if="adjunct=='detail'">
                                <p @click="showChart"><i class="iconfont icon-gongzuoliuchengtu"></i></p>
                            </li>
                            <li class="personImg" @click="changePerson" v-if="srctype == '4' ">
                                <img src="../assets/person.png" alt="">
                            </li>
                            <!--<li >
                                <span ><i class="iconfont icon-fujian"></i></span>
                                <em>附件{{listCount}}</em>
                            </li>-->
                        </ul>
                        <!--<ul class="attach" v-show="attachBtn" @click="toggleAttach">
                            <li class="line" @click="showAttachList">
                                <span><i class="iconfont icon-fujian"></i></span>
                                <em>附件{{listCount}}</em>
                            </li>
                            &lt;!&ndash;<li @click="showChart">
                                <span><i class="iconfont icon-gongzuoliuchengtu"></i></span>
                                <em>流程图</em>
                            </li>&ndash;&gt;
                        </ul>-->
                    </div>

                    <div class="attachList" v-show="attachList" @click="hideAttachList">
                        <ol>
                            <li v-for="atItem in attachItems" @click="openAttach(atItem)">
                                {{atItem.name}}({{atItem.size}})
                            </li>
                        </ol>
                    </div>

                    <!--图片查看-->
                    <photos
                            :pkAttachLs="pkAttachLs"
                            :swipeItems="swipeItems"
                            :swipeIndex="swipeIndex"
                    />
                </div>

                <span class="enter-btn" v-if="nowShowMsg" v-text="nowShowMsg" @click="approvalHandler"></span>
            </div>

            <ul class="tab-list" v-if="barLocation">
                <li v-for="(item, index) in items" @click="swiped(item, index)" :class="{swiped:item.isSwiped}"
                    :style="{width: (100/items.length).toFixed(2)+'%'}">
                    <span v-text="item.text"></span>
                    <em v-text="item.num"></em>
                </li>
            </ul>
            <div class="search" v-if="specialView" v-show="isShow">
                <input v-model="condition" v-on:input="onSearch($event)"
                       placeholder="请搜索"
                       @keyup.enter="onEnter" class="searchBox"
                       type="text" id="search_box">
                <label for="search_box" v-show="hasImg" class="searchBg" >
                    <i class="iconfont icon-sousuo-sousuo"></i>
                </label>
            </div>
            <div class="search"  v-if="specialView" v-show="isShow">
                <label  class="searchBg1"  @click="selecton">
                    <i class="iconfont icon-shaixuan"></i> 筛选
                </label>
            </div>
        </div>

        <div v-if="specialView">
            <ul v-show="isShow" class="date-wrap">
                <li v-for="(item, index) in dateList"
                    @click="selectdata(index)"
                    class="orgButton"
                    :class="{'active':ind === index,'orgButton':ind !== index}">
                    {{item}}
                </li>
            </ul>
        </div>

        <div class="locker" v-show="needLocker">
            <img src="../assets/loading.gif" v-if="actionBtns && hashDatail" class="loadingImg"/>
        </div>
        <a href="#" id="we_chat_skip" style="display:none"></a>
        <div class="wechatimg"  v-show="wechatFlag && this.srctype == '2'"><span  @click="hideImage">X</span><img id="we_chat_img"  /></div>

        <modal
                :needModal="needModal"
                :txtInfo="txtInfo"
                :navToModal="navToModal"
                @token="getToken"
                @cancel="cancelModal"
        />
    </div>
</template>

<script>
    import Vue from 'vue';
    import router from '../router';
    import photos from './photos';
    import modal from './modal';
    import axios from 'axios';
    import {Alert,Confirm,Toast} from 'wc-messagebox';
    import 'wc-messagebox/style.css';
    Vue.use(Confirm);
    Vue.use(Alert);
    Vue.use(Toast);

    export default {
        data() {
            return {
                srctype : '',
                dateList: ['当日', '一周内', '一月内', '三月内','全部'],
                titleList: false,
                hasImg: true,
                msg: this.nowMsg,
                titles: this.nowTitles,
                barLocation: this.nowBarLocation,
                specialView: this.nowSpecialView,
                adjunct: this.nowAdjunct,
                attachBtn: true,
                attachList: false,
                attachItems: [],
                listCount: '',
                condition: '',
                actionBtns: this.$store.getters.actionBtns,
                pkAttachLs: [],
                swipeItems: [],
                swipeIndex: '',
                isShowDate:false,
                needModal: false,
                txtInfo: '',
                navToModal:true,
                wechatFlag:false,
            }
        },
        computed: {
            setTaskCount(){
                return this.$store.getters.setTaskCount
            },
            needLocker() {
                return this.$store.getters.isLocker
            },
            srctype() {
                return this.$store.getters.srctype
            },
            nowAttachLs() {
                return this.$store.getters.nowAttachLs
            },
            listBackBtn() {

                if(this.$route.path == '/detail' && this.$store.getters.lsParams.isMessage){
                    return false;
                }

                if (this.$route.path != '/detail'&&(this.$route.path == '/myApprove' || this.$route.path == '/myPut') && !this.$store.getters.listBackBtn) {
                    return false;
                } else {
                    return true;
                }
            },
            hashDatail() {
                if (location.hash.match(/\w+/g)[0] == 'detail') {
                    return true;
                } else {
                    return false;
                }
            },
            items() {
                const taskCount = this.$store.getters.getTaskCount;
                this.nowItems.map(item => {
                    item.num = taskCount[item.tab];
                    if (item.tab === taskCount.now) {
                        item.isSwiped = true;
                    } else {
                        item.isSwiped = false;
                    }
                });
                return this.nowItems;
            }
        },
        props: {
            ind: {
                type: String,
                required: ''
            },
            nowMsg: {    // 表头名称
                type: String,
                required: true
            },
            nowShowMsg: {
                type: String,
                required: false
            },
            nowTitles: {    // 可选表头
                type: Array,
                default: function () {
                    return [];
                }
            },
            nowItems: {    // 子表头名称
                type: Array,
                default: function () {
                    return [];
                }
            },
            nowBarLocation: {    // 表头是否显示下拉项
                type: Boolean,
                default: true
            },
            selectBack: {    // 就否反回，在筛选页面
                type: String,
                required: true
            },
            nowSpecialView: {    // 是否显示搜索框
                type: Boolean,
                default: true
            },
            nowAdjunct: {    // 是否显示更多
                type: String,
                default: false
            },
            isShow: {    // 是否筛选和搜索
                type: Boolean,
                default: true
            },
            hasBottomBar: {
                type: [String,Boolean],  // 双类型
                default: false
            }
        },
        methods: {
            selecton(){
                // if(this.$route.path=='/myApprove'){
                //     router.push({
                //         path: "/selecton",
                //         query: {hasBottomBar1:this.hasBottomBar}
                //     });
                // }
                // if(this.$route.path=='/myPut'){
                //     router.push({
                //         path: "/selectonMyput",
                //         query: {hasBottomBar1:this.hasBottomBar}
                //     });
                // }

                this.$store.commit('maskStatus',true);
            },
            closeView() {
                //我审批的列表，从筛选返回
                if(this.selectBack == '1' && this.$route.path=='/selecton'){
                    location.hash = '/myApprove';
                }else if(this.selectBack == '1' && this.$route.path=='/selectonMyput'){   //我提交的审批列表，从筛选返回
                    location.hash = '/myPut';
                }else  if (this.barLocation === true) {
                    YYPlugin.call("CommonPlugin", "closewindow")
                } else if (this.$store.getters.actionBtns && location.hash.match(/\w+/g)[0] == 'detail') {  //我审批的列表，详情返回
                    //location.hash = '/myApprove';
                    router.push({
                        path: "/myApprove",
                        query: {selectSign:true}
                    });
                } else { //我提交的列表，详情返回会走这里
                    history.back();
                }
            },
            swiped(item, index) {
                var navName = ['A', 'B', 'C'];
                this.items.map(function (itm, i) {
                    if (index === i) {
                        itm.isSwiped = true;
                    } else {
                        itm.isSwiped = false;
                    }
                });

                this.saveCondition();
                //向父组件传事件
                this.$emit('swiped' + navName[index]);
            },
            showTitle() {
                if (this.barLocation === true) {
                    this.titleList = !this.titleList;
                }
                this.$store.commit('maskStatus',false);
            },
            selectIt(title) {
                this.titles.map(function (title) {
                    title.checked = false;
                });
                title.checked = true;
                this.msg = title.text;
            },
            toggleAttach(e) {
                e.stopPropagation();
                this.attachBtn = !this.attachBtn;
            },
            getAttachLs() {
                const params = {
                    "billid": this.$store.getters.billId,
                    "billtype": this.$store.getters.billType
                };

                this.ajax.get(this.$store.getters.atLsUrl, params, (data) => {
                    this.attachItems = data.data;
                    this.listCount = '（' + this.attachItems.length + '）';

                    this.attachItems.forEach((item) => {
                        if (this.isPicture(item.name)) {
                            this.pkAttachLs.push(item.pk);
                            this.swipeItems.push({
                                src: '',
                                w: 0,
                                h: 0,
                                title: item.name
                            });
                        }
                    });
                });
            },
            showAttachList() {
                if (this.listCount.match(/\d+/g)[0] !== '0') {
                    this.attachList = true;
                }
            },
            hideAttachList() {
                this.attachList = false;
            },
            isPicture(name) {
                if (name.indexOf(".") > -1) {
                    // 判断是否是图片 - strFilter必须是小写列举
                    var strFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic|";
                    var strPostfix = name.substring(name.lastIndexOf("."), name.length).toLowerCase() + '|';

                    if (strFilter.indexOf(strPostfix) > -1) {
                        return true;
                    }
                }
                return false;
            },
            openGallery(index, isFlowPic) {
                index = index ? index : 0;
                isFlowPic = isFlowPic ? '$*$_' + isFlowPic : '';
                this.swipeIndex = index + '_*$*_' + new Date() * 1 + isFlowPic;
            },
            openAttach(atItem) {
                if (this.isPicture(atItem.name)) {
                    // 确定图片索引
                    var pkAttachLs = this.pkAttachLs,
                        imgIndex = 0;
                    for (let i = 0, len = pkAttachLs.length; i < len; i++) {
                        if (atItem.pk === pkAttachLs[i]) {
                            imgIndex = i;
                            break;
                        }
                    }
                    // 打开图片连续查看
                    this.openGallery(imgIndex);
                } else {
                    const params = {
                            "billtype": this.$store.getters.billType,
                            "pk_attachment": atItem.pk
                        },
                        host = location.protocol + '//' + location.host;

                    this.ajax.get(this.$store.getters.atUrl, params, (data) => {
                        var data = data.data;

                        if (this.srctype == '2') {
                            var weChatSkip = document.getElementById("we_chat_skip");

                            weChatSkip.href = host + data.url;

                            setTimeout(() => {
                                weChatSkip.click();
                            }, 10);
                        } else {
                            YYPlugin.call("CommonPlugin", "openAttach", {
                                "url": host + data.url,
                                "filename": data.filename
                            });
                        }
                    });
                }
            },
            showChart() {
                if (this.srctype == '2') {
                    const params = {
                        "billid": this.$store.getters.billId,
                        "billtype": this.$store.getters.billType,
                        "ts": this.$store.getters.billTs
                    };
                    this.ajax.get(this.$store.getters.chartUrl, params, (data) => {
                        this.wechatFlag = true;
                        var url = data.data.imgurl,
                            host = location.protocol + '//' + location.host;

                        var weChatSkip = document.getElementById("we_chat_img");

                        weChatSkip.src = host + url;

                        setTimeout(() => {
                            weChatSkip.click();
                        }, 10);
                    });
                } else {
                    // 打开图片查看
                    this.openGallery(0, true);
                }
            },
            changePerson(){
                this.$store.commit('errorCode', 1000);
                this.needModal = true;
                this.txtInfo = this.$store.getters.openid;
            },
            getToken(data){
                // 设置jwtToken
                axios.defaults.headers.common['jwtToken'] = data.data;
                // 是否开启电子签名
                this.$store.commit('isSignature', data.isSignature);
                // 已获取到jwtToken
                this.$store.commit('isGetToken', true);
                this.needModal = false;
                this.txtInfo = '';
                this.$store.commit('errorCode', '');
                this.$toast('绑定NC用户成功');
                if(this.$store.getters.srctype == '4'){
                    if(this.$route.path == '/myApprove'){
                        this.$emit('msg-from-child')
                    }else{
                        router.push({path: '/myApprove'})
                    }
                }else{
                    location.reload();
                }
            },
            cancelModal(){
                this.$store.commit('errorCode', '');
                this.needModal = false;
                this.txtInfo = '';
            },
            saveCondition() {
                this.$store.commit('alterCondition', this.condition);
            },
            onEnter() {
                this.saveCondition();
                //向父组件传事件
                this.$emit('search');
            },
            selectdata(i){
                this.ind = i;
                this.$store.commit("setLsParams", {
                    "datetype": i
                });
                //向父组件传事件
                this.$emit('selectdate');
            },
            onSearch(e) {
                if (e.target.value.length > 0) {
                    this.hasImg = false;
                } else {
                    this.hasImg = true;
                }
                this.saveCondition();
                //向父组件传事件
                this.$emit('searchPerson');
            },
            //审批处理
            approvalHandler() {
                var approvalParams = this.$store.getters.approvalParams;

                if (this.$route.query.cpySend || approvalParams.value.length > 0) {
                    this.$store.commit('openPopup');
                    router.push({path: '/detail', query: {action: this.$store.getters.currentAction}});
                } else {
                    this.$store.commit('modalPopup', '请至少选择一个！');
                    this.$store.commit('closePopup');
                    this.$store.commit('hidePopupInfo');
                }
            },
            hideImage(){
                this.wechatFlag = false
            }
        },
        created () {
            if(this.$route.path=='/myApprove'){
                this.isShowDate=true;
            }
            this.srctype = this.$store.getters.srctype
        },
        mounted() {
            document.addEventListener("click", () => {
                this.attachBtn && (this.attachBtn = false);
            }, false);
        },
        components: {
            photos,
            modal
        },
        watch: {
            nowAttachLs() {
                this.getAttachLs();
            }
        }
    }
</script>

<style scoped>
    .nav-bar {
        position: fixed;
        width: 100%;
        z-index: 20;
        background-color: #fff;
    }

    .top-bar {
        position: relative;
        background-color: #4F77AB;
    }

    .top-bar,
    .tit-list {
        text-align: center;
    }

    .turn-tit {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 44px;
        z-index: 23;
        background: rgba(189, 189, 189, 0.6);
    }

    .top-bar,
    .tit-list > li {
        display: table;
        height: 44px;
        width: 100%;
    }

    .tit-list > li {
        border-top: 1px solid #f1f1f1;
    }

    .back-btn {
        position: absolute;
        left: 0;
        line-height: 44px;
        padding: 0 20px 0 15px;
        z-index: 3;
        color:white;
    }

    .top-title,
    .tit-list .option {
        vertical-align: middle;
        display: table-cell;
        font-size: 16px;
        color:#fff;
    }
   .tit-list{
    background: #fff;
   }

   .option em{
       color: #000;
   }

   .tit-list .option{
       position: relative;
   }

    .tit-list .option em{
        position: absolute;
        left: 38%;
        top: 10px;
    }

    .icon-zhengque{
        position: absolute;
        left: 55%;
        top: 11px;
    }


    .tit-list .option .iconfont {
        color: #fe821e;
        padding-left: 14px;
    }

    .search {
        height: 30px;
        width: 50%;
        padding: 8px 0;
        position: relative;
        float: left;
    }

    .searchBox {
        display: block;
        height: 30px;
        width: 130%;
        border: 0;
        border-radius: 20px;
        margin: 0 auto;
        background-color: #f8f8f8;
        text-indent: 2em;
        margin-left: 6px;
        padding: 0 10px;
    }

    .searchBg {
        position: absolute;
        width: 100px;
        height: 30px;
        text-align: center;
        left: 50%;
        top: 8px;
        margin-left: -65%;
        line-height: 30px;
        color: #979a9f;
        -webkit-user-select: none;
        user-select: none;
    }
    .searchBg1 {
        position: absolute;
        width: 100px;
        height: 30px;
        text-align: center;
        top: 8px;
        margin-left: 35%;
        line-height: 30px;
        color: #979a9f;
        -webkit-user-select: none;
        user-select: none;
    }

    .tab-list {
        width: 100%;
        overflow: hidden;
    }

    .tab-list > li {
        height: 38px;
        line-height: 38px;
        color: #797979;
        text-align: center;
        box-sizing: border-box;
        border-bottom: 1px solid #f8f8f8;
        position: relative;
        float: left;
        font-size: 14px;
    }

    .tab-list > li::after {
        content: '';
        position: absolute;
        top: 8px;
        right: 0;
        width: 1px;
        height: 22px;
        background-color: #f8f8f8;
    }

    .tab-list > li:last-child::after {
        display: none;
    }

    .tab-list > .swiped {
        color: #fe821e;
        border-bottom: 1px solid #fe821e;
    }

    .enter-btn {
        position: absolute;
        right: 0;
        line-height: 44px;
        padding: 0 20px 0 15px;
        z-index: 2;
        color: #fff;
        font-size: 16px;
    }

    .adjunct .more {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 8;
        width: 60px;
        height: 44px;
    }

    .adjunct .more > p {
        width: 60px;
        height: 44px;
        line-height: 44px;
        position: absolute;
        right: 0;
        top: 0;
    }
    .attach1 {
        position: absolute;
        right: 0;
        width: 160px;
        height: 44px;
    }
    .attach1 .personImg{
        position: absolute;
        left:100px;
        right:20px;
        top: 3px;
    }
    .attach1 .personImg img{
        width: 40%;
    }
    .adjunct .attach {
        z-index: 6;
        top: 90%;
        right: 10px;
        background: #fff;
        width: 150px;
        height: 100px;
        box-shadow: 0 0 30px #ececec;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 0 12px;
    }

    .adjunct .attach::before {
        content: '';
        position: absolute;
        z-index: 6;
        top: -8px;
        right: 14px;
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 9px solid #fff;
    }

    .adjunct .attach li,
    .adjunct .attach1 li,
    .attachList > ol > li {
        height: 42px;
        line-height: 42px;
        box-sizing: border-box;
    }

    .adjunct .attach li,
    .adjunct .attach li em,
    .attachList > ol > li {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .adjunct .attach li span,
    .adjunct .attach li em {
        float: left;
    }

    .adjunct .attach li span {
        width: 30%;
        text-align: right;
    }

    .adjunct .attach li em {
        width: 70%;
        text-align: left;
        text-indent: 10px;
    }

    .adjunct .attach .line,
    .attachList > ol > li {
        border-bottom: 1px solid #e2e2e2;
    }

    .attachList > ol > li:last-child {
        border: none;
    }

    .adjunct .attachList {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9;
        box-sizing: border-box;
        overflow: auto;
        background: rgba(0, 0, 0, .3);
        padding: 44px 20px 20px;
    }

    .attachList > ol {
        background: #fff;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 0 20px;
    }

    .icon-gongzuoliuchengtu{
        color: #fff;
    }
    .icon-xiala{
        font-size: 22px;
    }
    .icon-shaixuan{
        font-size: 14px;
    }

    .orgButton{
        background: #F5F5F5;
        margin-top: 4px;
        border: none;
        outline: none;
        border-radius: 8px;
        padding-left: 3%;
        padding-right: 3%;
        margin-right: 3px;
        display: inline-block;
        line-height: 24px;
    }

    .orgButton:nth-child(1){
        margin-left: 10%;
    }

    .active{
        background: #E0FFFF;
        margin-bottom:10px;
        border:none;
        outline: none;
        border-radius: 8px;
        padding-left: 4%;
        padding-right: 4%;
        margin-right: 3px;
        display:inline-block;;
    }
    .date-wrap{
        width: 100%;
        height: 30px;
        background: #fff;
        position: absolute;
        z-index: 10;
        top: 126px;
    }
    .wechatimg{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height:100%;
        background-color: #333;
        z-index: 100;
    }
    .wechatimg> span{
        color: #fff;
        position: absolute;
        top: 20px;
        right: 15px;
        font-size: 20px;
        opacity: 0.5;
    }
    #we_chat_img{
        position: absolute;
        top:35%;
        width: 100%;
        display: block;
    }

</style>
