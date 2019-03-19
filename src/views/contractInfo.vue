<template>
    <div>
        <!--选项卡菜单-->
        <div class="menu">
            <ul :style="{width: menuWidth}">
                <li v-for="(title,index) in heads" :class="{swiped:title.currentTab}" @click="changeTabData(index)">
                    {{title.tabTitle}}
                </li>
                <li v-if="isShow" @click="showAttachList">
                    <span ><i class="iconfont icon-fujian"></i></span>
                    <em>附{{listCount}}</em>
                </li>

                <li  v-if="isImage == 'Y'" @click="showImageList">
                    <span ><img src="../assets/image.png" alt=""></span>
                    <em>影像{{imageListCount}}</em>
                </li>
            </ul>
        </div>
        <div class="attachList" v-show="attachList" @click="hideAttachList">
            <ol>
                <li v-for="atItem in attachItems" @click="openAttach(atItem)">
                    {{atItem.name}}（{{atItem.size}}）
                </li>
            </ol>
        </div>

        <div class="attachList" v-show="imageList" @click="hideImageList">
            <ol>
                <li v-for="atItem in imagesItems" @click="openImage(atItem)">
                    {{atItem.fileName}}（{{atItem.fileSize}}）
                </li>
            </ol>
        </div>

        <!--图片查看-->
        <photos
                :pkImageLs="pkImageLs"
                :pkAttachLs="pkAttachLs"
                :swipeItems="swipeItems"
                :swipeIndex="swipeIndex"
        />
        <!--选项卡内容-->
        <div class="Essential-information" v-if="!showTable">
            <ul>
                <li v-for="item in tabdata[0]" class="detail-li">
                    <span class="info_name" >
                        {{item.colname}}：
                    </span>
                    <div class="info_value" v-if="isMoney(item.colvalue)"
                         :style="{'margin-left': wInfoName}" >{{item.colvalue | money}}</div>
                    <div class="info_value" v-else
                         :style="{'margin-left': wInfoName}" >{{item.colvalue}}</div>
                </li>
            </ul>
        </div>

        <div class="another-info" v-else-if="tabdata.length!==0">
            <table>
                <tr v-for="(data, index) in tabdata">
                    <td v-if="index === 0" v-for="item in data">{{item.colname}}</td>
                </tr>
                <tr v-for="data in tabdata">
                    <td v-for="item in data">
                        <span v-if="isMoney(item.colvalue)">{{item.colvalue | money}}</span>
                        <span v-else>{{item.colvalue}}</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import router from '../router'
    import photos from './photos'

    import Vue from 'vue'

    Vue.filter('money',function (val) {
        if(typeof(val)!=="undefined" && val!="undefined" && val!=0){
            val = val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,'$1,');
        }
        return val;
    })
    export default {
        data() {
            return {
                listCount: '',
                imageListCount: '',
                attachList: false,
                imageList:false,
                attachItems: [],
                imagesItems: [],
                pkAttachLs: [],
                pkImageLs:[],
                swipeItems: [],
                swipeIndex: '',
            }
        },
        computed: {
            srctype() {
                return this.$store.getters.srctype
            },
            nowAttachLs() {
                return this.$store.getters.nowAttachLs
            },

            tabdata: function () {
                return this.defaultTabdata;
            },
            menuWidth() {
                var chartLen = 0;
                this.heads.map(title => {
                    chartLen += title.tabTitle.length;
                });
                return (chartLen+6)*25 + 55 + 'px';
            },
            wInfoName() {
                var chartLen = this.tabdata[0][0].colname.length;
                this.tabdata[0].forEach((item) => {
                    chartLen = (item.colname.length > chartLen) ? item.colname.length : chartLen;
                });
                /*var fontSize =  Math.floor(document.documentElement.clientWidth*100000/45)/100000+"px";*/
                /*return (chartLen*fontSize + 8) + 'px';*/
                if(chartLen<10){
                    return (10*10) + 'px';
                }else{
                    return (chartLen*10) + 'px';
                }
            }
        },
        props: {
            heads: {
                type: Array,
                required: true
            },
            defaultTabdata: {
                type: Array,
                required: true
            },
            showTable: {
                type: Boolean,
                default: false
            },
            isShow: {
                type: Boolean,
                default: false
            },
            isImage: {
                type: String,
                default: "N"
            },
        },
        methods: {
            isMoney(key){
                if(typeof key == "number"){
                    return true;
                }
                /*  var conditionArray = ["mny","sum","ney","tal","bje","_de","_cr"];
                  for (var i = 0; i < conditionArray.length; i++){
                      if (key.substring(key.length-3,key.length) == conditionArray[i]){
                          return true;
                      }
                  }
                  return false;*/
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

            openImage(atItem) {
                if (this.isPicture(atItem.fileName)) {
                    // 确定图片索引
                    var pkImageLs = this.pkImageLs,
                        imgIndex = 0;
                    for (let i = 0, len = pkImageLs.length; i < len; i++) {
                        if (atItem.fileName === pkImageLs[i].fileName) {
                            imgIndex = i;
                            break;
                        }
                    }
                    // 打开图片连续查看
                    this.openGallery(imgIndex);
                }
            },

            showAttachList() {
                if (this.listCount.match(/\d+/g)[0] !== '0') {
                    this.attachList = true;
                }
            },

            showImageList() {
                if (this.imageListCount.match(/\d+/g)[0] !== '0') {
                    this.imageList = true;
                }
            },

            hideAttachList() {
                this.attachList = false;
            },

            hideImageList() {
                this.imageList = false;
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

            /**获取影像个数*/
            getImageLs(){
                const params = {
                    "busiserailno": this.$store.getters.billId
                };
                this.ajax.get(this.$store.getters.imageLsUrl, params, (data) => {

                   this.imagesItems = data.data;
                   this.imageListCount = '(' + this.imagesItems.length + ')';

                    this.imagesItems.forEach((item) => {
                        if (this.isPicture(item.fileName)) {
                            let file = {};
                            file.docname = item.docname;
                            file.fileName = item.fileName;
                            file.busiserailno = item.busiserailno;
                            this.pkImageLs.push(file);
                            this.swipeItems.push({
                                src: '',
                                w: 0,
                                h: 0,
                                title: item.fileName
                            });
                        }
                    });
                });
            },

            getAttachLs() {
                const params = {
                    "billid": this.$store.getters.billId,
                    "billtype": this.$store.getters.billType
                };

                this.ajax.get(this.$store.getters.atLsUrl, params, (data) => {
                    this.attachItems = data.data;
                    this.listCount = '(' + this.attachItems.length + ')';

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
            changeTabData(index){
                this.heads.map((hItem, hIndex)=> {
                    if (index == hIndex) {
                        hItem.currentTab = true;
                    } else {
                        hItem.currentTab = false;
                    }
                });
                this.defaultTabdata = this.heads[index].tabdata;
            }
        },
        created () {
            var clientWidth = document.documentElement.clientWidth;
            //var aaaa = document.getElementsByClassName("Essential-information")[0];
            //aaaa.style.fontSize=fontSize
            if(clientWidth>700){
                var fontSize =  Math.floor(document.documentElement.clientWidth*100000/40)/100000+"px";
                document.body.style.fontSize=fontSize;
            }
        },
        components: {
            photos
        },
        watch: {

            nowAttachLs() {
                this.getAttachLs();
                if(this.isImage == 'Y'){
                    this.getImageLs();
                }
            },
        }
    }
</script>

<style scoped>
    .menu {
        width: 100%;
        text-align: center;
        line-height: 46px;
        overflow: auto;
        font-size: 15px;
        white-space: nowrap;
    }
    .menu > ul{
        overflow: auto;
    }
    .menu li{
        float: left;
        padding: 0 20px;
    }

    .menu .swiped {
        color: #fe821e;
        border-bottom: 1px solid #fe821e;
    }

    .Essential-information,
    .another-info{
        width: 100%;
        height: 100%;
        border-top: 1px solid #F8F8F8;
        border-bottom: 8px solid #F8F8F8;
        padding: 10px;
        box-sizing: border-box;
        line-height: 34px;
    }

    .Essential-information li{
        overflow: hidden;
    }
    .info_name {
        float: left;
        width: auto;
        color: #888;
        box-sizing: border-box;
        margin-left: 5%;
        font-size:15px;
    }
    .info_value{
        font-size:15px;
    }

    .another-info{
        overflow: auto;
    }

    .another-info table{
        border-collapse:collapse;
        border-spacing:0;
    }

    .another-info table tr td{
        padding: 0 10px;
        text-align: center;
        white-space: nowrap;
        border: 1px solid #808080;
    }


    .attachList > ol > li {
        height: 50px;
        line-height: 50px;
        box-sizing: border-box;
    }



    .attachList > ol > li {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }


    .attachList > ol > li {
        border-bottom: 1px solid #e2e2e2;
    }

    .attachList > ol > li:last-child {
        border: none;
    }

    .attachList {
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
    .detail-li{
        background-color:rgba(245,245,245,0.99);
        margin: 4px 0;
    }

</style>
