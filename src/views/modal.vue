<template>
    <div v-if="needModal">
        <div class="modal-bg"></div>
        <div class="modal" v-if="errorCode!=1000">
            <div class="text" v-text="txtInfo"></div>
            <p class="btn-box">
                <button class="btn" @click="closeModal">确 定</button>
            </p>
        </div>
        <div class="modal" v-if="errorCode==1000 && this.srctype == 4">
            <div class="bindForm">
                <table>
                    <tr>
                        <td class="icon"><img src="../assets/username1.png" alt=""></td>
                        <td><input type="text" id="username" v-model="username" placeholder="请输入用户名"></td>
                    </tr>
                    <tr>
                        <td class="icon"><img src="../assets/password1.png" alt=""></td>
                        <td><input type="password" id="password" v-model="password" placeholder="请输入密码"></td>
                    </tr>
                </table>
            </div>
            <div class="bindBtn-box">
                <button class="cancelBtn" @click="cancelUser" v-if="navToModal">取消</button>
                <button class="bindBtn" @click="bindUser">绑定NC用户</button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        props: {
            needModal: {
                type: Boolean,
                required: true,
                default: function () {
                    return false;
                }
            },
            txtInfo: {
                type: String,
                required: true
            },
            navToModal: {
                type: Boolean,
                required: true
            },
        },
        data(){
            return{
                username:'',
                password:'',
                srctype:''
            }
        },
        computed:{
            errorCode(){
                return this.$store.getters.errorCode;
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeModal');
            },
            bindUser(){
                console.log(this.srctype)
                let url ='';
                if(this.srctype == '2'){
                    url = this.$store.getters.weChatBindNcUserUrl+ '/' + this.txtInfo + '/' + this.username+'/'+this.password;
                }else if(this.srctype == '4'){
                    url = this.$store.getters.qingtuiBingNcUser + '/' + this.txtInfo +'/' + this.username+'/'+this.password;
                }
                this.ajax.get(url, {}, (data) => {
                    this.$emit('token',data);
                }, (data) => {
                    this.$toast(data.error_msg);
                    this.$emit('cancel');
                }, (error) => {

                });
            },
            cancelUser(){
                this.$emit('cancel');
            },

        },
        created(){
            this.srctype = this.$store.getters.srctype
        }
    }
</script>

<style scoped>
    .modal-bg,
    .modal {
        position: fixed;
    }

    .modal-bg {
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 98;
        background: rgba(0, 0, 0, .3);
        overflow: auto;
    }

    .modal {
        top: 50%;
        left: 50%;
        margin: -100px 0 0 -40%;
        z-index: 99;
        border-radius: 4px;
        background-color: #fff;
        width: 80%;
        height: 200px;
        text-align: center;
        padding: 10px;
        box-sizing: border-box;
    }
    .modal .text {
        height: 75%;
        overflow: auto;
    }
    .modal .btn-box {
        padding-top: 10px;
        height: 25%;
        box-sizing: border-box;
    }
    .modal .btn {
        height: 100%;
        width: 100px;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 15px;
        background-color: #2db7f5;
    }
    .modal .bindForm{
        display: flex;
       justify-content: center;
    }
    .modal .icon{
        width: 20%;
        padding-left:5%;
        border-bottom: 1px solid #FE821E;
    }
    .modal .icon + td{
        padding-right:8%;
        border-bottom: 1px solid #FE821E;
    }
    .modal .icon img{
        padding-top: 7px;
        width: 50%;
    }
    .modal .bindForm table{
        border-collapse:separate;
        border-spacing:0 20px;
        margin:0 20px;
    }
    .modal .bindForm td{
        font-size: 0.8rem;
        color:#000000;
    }
    .modal .bindForm td input{
        height: 30px;
        border-radius: 3px;
        border:none;
        padding-left: 10px;
        width: 100%;
        /*font-size: 0.85rem;*/
    }
    .modal .bindBtn-box {
        height: 15%;
        box-sizing: border-box;
    }
    .modal .cancelBtn{
        padding: 4px 0;
        height: 100%;
        width: 20%;
        color: #fff;
        border: none;
        border-radius: 2px;
        font-size: 0.9rem;
        background-color: #4F77AB;
        margin-right: 10%;
        font-family: song;
    }
    .modal .bindBtn{
        padding: 3px 0;
        height: 100%;
        width: 50%;
        color: #fff;
        border: none;
        border-radius: 2px;
        font-size: 0.9rem;
        font-weight: 100 !important;
        background-color: #4F77AB;
        font-family: song;
    }
</style>