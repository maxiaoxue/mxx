<template>
    <div class="screenInfo">
        <div class="optItem" style="float: left">
            <span class="lb">项目（合称）</span>
            <input class="info_value" style="width: 200px"/>
        </div>
        <div class="optItem" >
            <span class="lb"  style="padding-left: 4%">申请人&nbsp;&nbsp;&nbsp;</span>
            <input class="info_value" style="width:200px"/>
        </div>
        <div class="optItem" style="float: left">
            <span class="lb">电话&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <input class="info_value" style="width: 200px"/>
        </div>
        <div class="optItem" >
            <span class="lb"  style="padding-left: 4%">NC版本&nbsp;&nbsp;</span>
            <input class="info_value" style="width:200px"/>
        </div>
        <div class="optItem" style="float: left">
            <span class="lb">NC部署环境&nbsp;&nbsp;</span>
            <input class="info_value" style="width: 200px"/>
        </div>
        <div class="optItem" >
            <span class="lb"  style="padding-left: 4%">申请类型</span>
            <input class="info_value" style="width:200px"/>
        </div>
        <!--<div class="optItem" style="float: left">
            <span class="lb">Mac地址&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <input class="info_value" style="width: 200px"/>
        </div>
        <div class="optItem" >
            <span class="lb"  style="padding-left: 4%">Ip地址&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <input class="info_value" style="width:200px"/>
        </div>-->
        <div class="optItem" style="float: left">
            <span class="lb">开始日期&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <input class="info_value" style="width: 200px" type="date"/>
        </div>
        <div class="optItem" >
            <span class="lb"  style="padding-left: 4%">结束日期&nbsp;</span>
            <input class="info_value" style="width:200px" type="date"/>
        </div>
        <div class="optItem" style="float: left">
            <span class="lb">移动服务&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <input class="info_value" style="width: 200px"/>
        </div>
        <div class="optItem" >
            <span class="lb"  style="padding-left: 4%">备注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <input class="info_value" style="width:200px"/>
        </div>
        <div >
            <Button  class="bottomBtn"  @click="getList(true)">确&nbsp;&nbsp;定</Button>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                billmakerlist: [],
                orglist:[],
                moudleslist:[],
                maker: null,
                orgmodel:null,
                moudles:null,
                whichNav: '',
                hasBottomBar1:''
                }
            }
    }
</script>

<style scoped>
    .screenInfo {
        top: 20px;
        bottom: 10px;
        padding-left: 20%;
    }
    .lb {
    }
    .info_value{
        height: 30px;
        margin-left:15px;
    }
    .bottomBtn {
        width: 100%;
        height: 60px;
        background-color: #668cff;
        position:absolute;
        left:0;
        bottom:0;
        font-size: 25px;
        color:white;
    }
    .optItem{
        padding-top: 10px;
    }
</style>