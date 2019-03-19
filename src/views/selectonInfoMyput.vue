<template>
    <Collapse v-model="value1">
        <div class="screenInfo">
            <div name="1" style="padding-left: 16px;padding-right: 10px;font-size: 17px;padding-top: 15px;border-bottom:1px solid #f5f5f5">
                <span style="color:#4F77AB;font-size: 14px; ">●</span>
                <span class="select-name">项目组织</span>
                <div class = "orgClass" slot="content">
                    <ul style="width: 100%">
                        <li v-for="(item,$index) in orglist"  @click="getOrg(item,$index)" class="orgLb">
                    <span class="orgButton" :id="item.id"  :class="{'active':item.active,'unactive':!item.active}">{{item.name}}
                    </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div name="2" style="padding-left: 16px;padding-right: 10px;font-size: 17px;padding-top: 16px;border-bottom:1px solid #f5f5f5">
                <span style="color:#4F77AB;font-size: 14px; ">●</span>
                <span class="select-name">发起人</span>
                <div class = "orgClass" slot="content">
                    <ul style="width: 100%">
                        <li v-for="(item,$index) in billmakerlist"  @click="getMaker(item,$index)" class="orgLb">
                    <span class="orgButton"  :id="item.id" :class="{'active':item.active,'unactive':!item.active}">{{item.name}}
                    </span>
                        </li>
                    </ul>
                </div>
            </div>


                <ul class="bottomBtn-mask">
                    <li @click="clearCond()">
                        重置
                    </li>
                    <li @click="getList()">
                        确定
                    </li>
                </ul>
        </div>
    </Collapse>
</template>

<script>
    import router from '../router';
    import Vue from 'vue'
    export default {
        data () {
            return {
                value1: '1',
                active: false,
                billmakerlist: [],
                orglist:[],
                moudleslist:[],
                maker: null,
                orgmodel:null,
                moudles:null,
                whichNav: '',
                hasBottomBar1:'',
                orglistSelect:[],
                makerlistSelect:[],
                isClickOrg:0,
                isClickMaker:0,
                orgmodelhistory:'',
                makermodelhistory:''
            }
        },
        props: {
            hasBottomBar: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            selectConUrl () {    // 筛选列表参数
                return this.$store.getters.selectConUrl
            },
            lsReq () {    // 列表参数
                return this.$store.getters.lsParams
            },
            lsUrl () {    // 列表接口
                return this.$store.getters.lsUrl
            },
            isRefresh () {    // 切换标签刷新列表
                return this.$store.getters.isRefresh
            },
            isGetToken () {    // 是否已获取jwtToken
                return this.$store.getters.isGetToken
            },
        },
        methods: {
            getMaker(item,index){
                this.isClickMaker = 1;
                var maker = item.id;
                if(this.makermodelhistory!=null && this.makermodelhistory.length!=0){
                    for(i=0;i<this.makermodelhistory.split(",").length;i++){
                        this.makerlistSelect.push(this.makermodelhistory.split(",")[i]);
                    }
                }
                var i = this.makerlistSelect.indexOf(maker);
                if(i==-1){
                    this.makerlistSelect.push(maker);
                    var obj = document.getElementById(item.id);
                    obj.setAttribute("class", "orgButton active");
                    // Vue.set(item, 'active', true);
                }else{
                    this.makerlistSelect.splice(i,1);
                    // Vue.set(item, 'active', false);
                    var obj = document.getElementById(item.id);
                    obj.setAttribute("class", "orgButton unactive");
                }
                var tempMakergmodel=''; //发起人
                for(var i = 0;i<this.makerlistSelect.length;i++) {
                    var maker = this.makerlistSelect[i];
                    tempMakergmodel = tempMakergmodel + maker + ",";
                }
                tempMakergmodel = tempMakergmodel.substr(0,tempMakergmodel.length-1);
                this.maker = tempMakergmodel;
                this.makermodelhistory = '';
            },

            getOrg(item,index){
                this.isClickOrg = 1;
                var org = item.id;
                if(this.orgmodelhistory.length!=0){
                    for(i=0;i<this.orgmodelhistory.split(",").length;i++){
                        this.orglistSelect.push(this.orgmodelhistory.split(",")[i]);
                    }
                }
                var i = this.orglistSelect.indexOf(org);
                if(i==-1){
                    this.orglistSelect.push(org);
                    // Vue.set(item, 'active', true);
                    var obj = document.getElementById(item.id);
                    obj.setAttribute("class", "orgButton active");
                }else{
                    this.orglistSelect.splice(i,1);
                    // Vue.set(item, 'active', false);
                    var obj = document.getElementById(item.id);
                    obj.setAttribute("class", "orgButton unactive");
                }
                var tempOrgmodel=''; // 项目组织
                for(var i = 0;i<this.orglistSelect.length;i++) {
                    var org = this.orglistSelect[i];
                    tempOrgmodel = tempOrgmodel + org + ",";
                }
                tempOrgmodel = tempOrgmodel.substr(0,tempOrgmodel.length-1);
                this.orgmodel = tempOrgmodel;
                this.orgmodelhistory = '';
            },
            clearCond(){
                this.isClickOrg = 1;
                this.orglist.forEach(function (item) {
                    Vue.set(item, 'active', false);
                    var obj = document.getElementById(item.id);
                    obj.setAttribute("class", "orgButton unactive");
                });
                this.orgmodel = null;
                this.orglistSelect = [];
                this.orgmodelhistory='';


                this.isClickMaker = 1;
                this.billmakerlist.forEach(function (item) {
                    Vue.set(item, 'active', false);
                    var obj = document.getElementById(item.id);
                    obj.setAttribute("class", "orgButton unactive");
                });
                this.maker = null;
                this.makerlistSelect=[];
                this.makermodelhistory = '';

            },
            getBillMaker(){
                if(this.isGetToken) {
                    this.hasBottomBar1 = this.$route.query.hasBottomBar1;
                    this.ajax.get(this.selectConUrl, this.lsReq, (data) => {
                        if(data.data!=null){
                            this.billmakerlist = data.data.billmaker;
                            this.orglist = data.data.org;
                            this.moudleslist = data.data.moudles;
                        }
                    });
                }
            },

            getCount(){
                if(this.isGetToken) {
                    var setCount=[];
                    var params = {
                        "statuskey":"submit",
                        "statuscode":"unhandled",
                        "condition":this.$store.getters.condition,
                        "pkOrg":null
                    };
                    this.ajax.get(this.$store.getters.lsCount, params, (data1) => {
                        setCount["C"] = data1.data;
                        this.$store.commit("setTaskCount", setCount);
                    });
                    var params = {
                        "statuskey":"submit",
                        "statuscode":"handling",
                        "condition":this.$store.getters.condition,
                        "pkOrg":null
                    };
                    this.ajax.get(this.$store.getters.lsCount, params, (data2) => {
                        setCount["D"] = data2.data;
                        this.$store.commit("setTaskCount", setCount);
                    });
                    var params = {
                        "statuskey":"submit",
                        "statuscode":"finished",
                        "condition":this.$store.getters.condition,
                        "pkOrg":null
                    };
                    this.ajax.get(this.$store.getters.lsCount, params, (data3) => {
                        setCount["E"] = data3.data;
                        this.$store.commit("setTaskCount", setCount);
                    });
                }
            },

            getList () {    // 待办任务
                if(this.isClickOrg == 0){
                    this.orgmodel = this.$store.getters.orgmodel;
                }
                this.$store.commit("orgmodel",this.orgmodel);
                if(this.isClickMaker == 0){
                    this.maker = this.$store.getters.makermodel;
                }
                this.$store.commit("makermodel",this.maker);

                if(this.$store.getters.getTaskCount.now === 'C') {
                    this.$store.commit('alterRefresh');
                    this.$store.commit("setLsParams", {
                        "startline":"0",
                        "statuskey":"submit",
                        "statuscode":"unhandled",
                        "condition":this.condition,
                        "billmaker":this.maker,
                        "pkOrg":this.orgmodel,
                        "moudle":this.moudles
                    });
                    router.push({
                        path: "/myPut",
                        query: {selectSign:true,billmaker:this.maker,pkOrg:this.orgmodel,moudle:this.moudles,isSelectCount:true}
                    });
                    // 通知列表当前选项卡
                    this.$store.commit("setTaskCount", {
                        "now":this.$store.getters.getTaskCount.now
                    });
                }
                if(this.$store.getters.getTaskCount.now === 'D') {
                    this.$store.commit('alterRefresh');
                    this.$store.commit("setLsParams", {
                        "startline":"0",
                        "statuskey":"submit",
                        "statuscode":"handling",
                        "condition":this.condition,
                        "billmaker":this.maker,
                        "pkOrg":this.orgmodel,
                        "moudle":this.moudles
                    });
                    router.push({
                        path: "/myPut",
                        query: {selectSign:true,billmaker:this.maker,pkOrg:this.orgmodel,moudle:this.moudles,isSelectCount:true}
                    });
                    // 通知列表当前选项卡
                    this.$store.commit("setTaskCount", {
                        "now":this.$store.getters.getTaskCount.now
                    });
                }
                if(this.$store.getters.getTaskCount.now === 'E') {
                    this.$store.commit('alterRefresh');
                    this.$store.commit("setLsParams", {
                        "startline":"0",
                        "statuskey":"submit",
                        "statuscode":"finished",
                        "condition":this.condition,
                        "billmaker":this.maker,
                        "pkOrg":this.orgmodel,
                        "moudle":this.moudles
                    });
                    router.push({
                        path: "/myPut",
                        query: {selectSign:true,billmaker:this.maker,pkOrg:this.orgmodel,moudle:this.moudles,isSelectCount:true}
                    });
                    // 通知列表当前选项卡
                    this.$store.commit("setTaskCount", {
                        "now":this.$store.getters.getTaskCount.now
                    });
                }
                this.$store.commit('maskStatus',false);
            },
        },

        mounted () {
            this.getBillMaker();
            this.getCount();
        },
        watch: {
            isRefresh (val) {
                this.getBillMaker();
            },

            isGetToken (val) {
                if(val === true) {
                    this.getBillMaker();
                    this.getCount();
                }
            },
            billmakerlist:{
                handler: function (val, oldVal) {

                },
                deep: true
            }
        },
        created () {
            this.orgmodelhistory = this.$store.getters.orgmodel;
            this.makermodelhistory = this.$store.getters.makermodel;
            var orgStyle = this.orgmodelhistory;
            var makerStyle = this.makermodelhistory;
            var interval = setInterval(function () {
                if(document.readyState=="complete"){
                    if(orgStyle!=null){
                        orgStyle.split(",").forEach(function (item) {
                            var obj1 = document.getElementById(item);
                            if(null!==obj1){
                                obj1.setAttribute("class", "orgButton active");
                            }
                        });
                    }
                    if(makerStyle!=null) {
                        makerStyle.split(",").forEach(function (item) {
                            var obj2 = document.getElementById(item);
                            if (null !== obj2) {
                                obj2.setAttribute("class", "orgButton active");
                            }
                        });
                    }
                    clearInterval(interval);
                }
            },500);
        },
    }
</script>

<style scoped>
    @import "../assets/mask.css";
    *{
        margin: 0;
        padding: 0;
        font-size: 100%;
    }
    .orgButton:focus {
        background-color: #E0FFFF;
    }

    .orgButton{
        float: left;
        width: 100%;
        background: #F5F5F5;
        margin-bottom:10px;
        border: 0 solid;
        outline: none;
        border-radius: 5px;
        padding-left: 8px;
        padding-right: 8px;
        text-align: center;
    }
    .orgLb{
        font-size: 14px;
        width: 50%;
        display:inline-block;
        padding-right:2%;
        line-height: 40px;
        align-content: center;
    }
    .active{
        float: left;
        width: 100%;
        background-color:rgba(70,130,180,0.3);
        margin-bottom:10px;
        border: 0 solid;
        outline: none;
        border-radius: 8px;
        color:#4682B4;
    }
    .unactive{
        color:black;
        background: #F5F5F5;
    }

    .lb {
        width: 120px;
        height:40px;
        font-size:18px;
    }
    .info_value{
        width:60%;
        height: 40px;
        margin-left:15px;
        border-radius:8px;
    }
    .allButton{
        width: 150px;
        height:45px;
        background-color:#009000;
        color:white;
        border-radius:8px;
    }
    .optItem{
        width: 100%;
        padding-top: 8%;
        padding-bottom: 10px;
        line-height: 34px;
        text-align: center;
    }
    .optItemB{
        width: 35%;
        padding-top: 8%;
        padding-bottom: 10px;
        line-height: 34px;
        text-align: center;
        color:red;
    }


    .bottomBtn .btn-img{
        height: 18px;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: auto 100%;

    }
    .select-name{
        font-size: 14px;
        color: #797979;
    }
    .orgClass{
        padding-top: 10px;
        height: 173px;
        overflow-y: auto;
    }

    .bottomBtn li{
        font-size: 16px;
    }
</style>
