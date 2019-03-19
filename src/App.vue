<template>
    <div id="app" class="wrap-box">
        <router-view></router-view>
        <modal
                :needModal="needModal"
                :txtInfo="txtInfo"
                @closeModal="closeModal"
                @token="getToken"
                :navToModal="navToModal"
        />
    </div>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import modal from './views/modal';
    import {Alert,Confirm,Toast} from 'wc-messagebox';
    import 'wc-messagebox/style.css';
    Vue.use(Confirm);
    Vue.use(Alert);
    Vue.use(Toast);
    export default {
        name: 'app',
        data() {
            return {
                needModal: false,
                txtInfo: '',
                srcType: '',
                qt_code:'',
                navToModal:false
            }
        },
        methods: {
            closeModal() {
                if(this.errorCode == 401 && this.srcType != '1' && this.srcType != '2') {
                    YYPlugin.call("CommonPlugin", "closewindow");
                } else {
                    this.needModal = false;
                    this.txtInfo = '';
                    this.$store.commit('errorCode', '');
                }
            },
            getToken(data){
                // 设置jwtToken
                axios.defaults.headers.common['jwtToken'] = data.data;
                // 是否开启电子签名
                this.$store.commit('isSignature', data.isSignature);
                // 已获取到jwtToken
                this.$store.commit('isGetToken', true);
                this.$store.commit('openid', data.openId);
                this.needModal = false;
                this.txtInfo = '';
                this.$store.commit('errorCode', '');
                this.$toast('绑定NC用户成功');
            }
        },
        components: {
            modal
        },
        computed: {
            modalPopup() {
                return this.$store.getters.modalPopup;
            },
            errorCode() {
                return this.$store.getters.errorCode;
            },
        },
        watch: {
            modalPopup (val) {
                this.needModal = true;
                this.txtInfo = val.slice(0, val.indexOf('_*$*_'));
            },
        },
        created() {
            // cordova
            var yonyou = yonyou || {};

            /*function initplus(callfun) {
                document.addEventListener('deviceready', function () {
                    callfun(navigator)
                }, false);
            };*/

            function addPlus() {
                var oHead = document.getElementsByTagName('HEAD').item(0);
                var oScript = document.createElement("script");
                oScript.type = "text/javascript";

                if (yonyou.browser.versions.mobile) {
                    if (yonyou.browser.versions.ios) {
                        oScript.src = "./cordova/ios/cordova.js";
                        oHead.appendChild(oScript);
                    } else if (yonyou.browser.versions.android) {
                        oScript.src = "./cordova/android/cordova.js";
                        oHead.appendChild(oScript);
                    }
                }
            };
            yonyou.browser = {
                versions: function () {
                    var u = navigator.userAgent, app = navigator.appVersion;
                    return {//移动终端浏览器版本信息
                        trident: u.indexOf('Trident') > -1, //IE内核
                        presto: u.indexOf('Presto') > -1, //opera内核
                        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                        mobile: !!u.match(/AppleWebKit.*Mobile/) || !!u.match(/Windows Phone/) || !!u.match(/Android/) || !!u.match(/MQQBrowser/), //是否为移动终端
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                        iPad: u.indexOf('iPad') > -1, //是否iPad
                        microMessenger: u.indexOf('MicroMessenger') > -1,   //是否为微信内置浏览器
                        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                    };
                }(),
                language: (navigator.browserLanguage || navigator.language).toLowerCase()
            };

            // 获取平台参数
            var url = location.search,
                theRequest = new Object();

            // 参数转换成对象
            /*if (url.indexOf("?") != -1) {
                var str = url.substr(1),
                    strs = str.split("&");

                for (let i = 0; i < strs.length; i++) {
                    theRequest[strs[i].slice(0, strs[i].indexOf("="))] = decodeURI(strs[i].slice(strs[i].indexOf("=") + 1));
                }
            }*/
            if (url.indexOf("?") != -1) {
                var str = url.split('?')[1];
                str = str.split('#')[0];
                if (url.split('?').length > 2) {
                    var str2 = url.split('?')[2];
                    str = str + '&' + str2;
                }
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    var eqIndex = strs[i].indexOf("=");
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].substr(eqIndex + 1));
                }
            }
            var jwtTokenUrl = this.$store.getters.tokenUrl + '/' + encodeURIComponent(theRequest.token)+ '/' + theRequest.appid;

            this.srcType = theRequest.srctype;
            //微信公众号或者企业微信
            if(theRequest.state){
                theRequest.srctype = '2';
            }
            switch (theRequest.srctype) {
                case '1':
                    // 简版App
                    // 隐藏列表页的后退按钮
                    this.$store.commit('listBackBtn', false);
                    addPlus();
                    break;
                case '2':
                    // 微信// theRequest.state + '/' + theRequest.code
                    jwtTokenUrl = this.$store.getters.weChatTokenUrl + '/' + theRequest.state + '/' + theRequest.code;
                    // 隐藏列表页的后退按钮
                    this.$store.commit('listBackBtn', false);
                    // 用于判断打开附件
                    this.$store.commit('srctype', '2');
                    this.$store.commit("setLsParams", {"isWechat":true});
                    break;
                case '3':
                    // icop
                    this.$store.commit('listBackBtn', true);
                    addPlus();
                    break;
                case '4':
                    // 微信// theRequest.state + '/' + theRequest.code
                    jwtTokenUrl = this.$store.getters.qingtuiTokenUrl + '/' + theRequest.qt_code
                    // 隐藏列表页的后退按钮
                    this.$store.commit('listBackBtn', false);
                    // 用于判断打开附件
                    this.$store.commit('srctype', '4');
                    break;
                default:
                    addPlus();
            };


            // 获取jwtToken
            if("/properties"!=this.$route.path && "/requestNote"!=this.$route.path && "/deploy"!=this.$route.path &&"/login"!=this.$route.path ){

                if (!axios.defaults.headers.common['jwtToken']) {
                    this.ajax.get(jwtTokenUrl, {}, (data) => {
                        // 设置jwtToken
                        axios.defaults.headers.common['jwtToken'] = data.data;
                        // 是否开启电子签名
                        this.$store.commit('isSignature', data.isSignature);
                        this.$store.commit('openid', data.openId);
                        // 已获取到jwtToken
                        this.$store.commit('isGetToken', true);
                    }, (data) => {
                        this.$store.commit('errorCode', data.error_code);
                        this.needModal = true;
                        this.txtInfo = data.error_msg;
                    }, (error) => {
                        this.needModal = true;
                        this.txtInfo = String(error);
                    });
                }
            }

            //企业微信直接打开详情
            if(theRequest.taskid && theRequest.srctype == '2'){

                this.$store.commit("setLsParams", {
                    "statuskey": "ishandled",
                    "statuscode": "unhandled",
                    "isMessage":true,
                    "taskid": theRequest.taskid,
                    "mark" : theRequest.mark

                });
                location.hash = '/detail';
                this.$store.commit('alterAction', 'unhandled');
            }

            // 支持直接打开详情页
            if (theRequest.taskid && theRequest.srctype != '2') {
                this.$store.commit("setLsParams", {
                    "statuskey": "ishandled",
                    "statuscode": "unhandled",
                    "taskid": theRequest.taskid,
                    "mark" : theRequest.mark
                });
                // 详情页审批按钮（只有待办任务详情页才显示）
                this.$store.commit('alterAction', 'unhandled');
            };

        }
    }
</script>
