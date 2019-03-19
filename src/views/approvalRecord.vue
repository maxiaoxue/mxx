<template>
	<div>
		<div class="approvalRecord">
			<span>审批记录</span>
		</div>
		<div class="approvalList">
			<ul>
				<li v-for="(item,index) in flowDatas" v-show="!(item.checknote==''&&item.approveresult=='作废')">
					<div class="line" v-if="index!==0"></div>
					<div class="approvalPic"></div>
					<div class="approvalInfo">
						<div class="approvalLeft">
							<div class="approvalName">
								<span class="person-name">{{item.checkman}}</span>
								<span :class="['btn', item.bg]">{{item.approveresult}}</span>
							</div>
							<div class="approvalState">
								{{item.checknote}}
							</div>
						</div>
					</div>
					<div class="approvalDate">
						<p class="signP">
							<span class="signImgBtn" v-if="item.signatureurl" @click="lookSignImg(item.signatureurl)">查看签名</span>
						</p>
						<p>{{item.dealdate}}</p>
					</div>
				</li>
			</ul>
			<div class="mask" v-show="showSignImg" @click="hideSignImg">
				<p class="signImg"><img :src="signImgUrl" alt="签名" /></p>
			</div>
		</div>
	</div>

</template>

<script>
    export default {
        data() {
            return {
                showSignImg: false,
                signImgUrl: ''
            }
        },
        props: {
            flowData: {
                type: Array,
                required: true
            }
        },
        computed: {
            flowDatas () {
                this.flowData.map(item => {
                    switch(item.approveresult)
                    {
                        case "S":
                            item.approveresult = "提交";
                            item.bg = 'btn1';
                            break;
                        case "Y":
                            item.approveresult = "同意";
                            item.bg = 'btn2';
                            break;
                        case "N":
                            item.approveresult = "不批";
                            item.bg = 'btn3';
                            break;
                        case "R":
                            item.approveresult = "驳回";
                            item.bg = 'btn4';
                            break;
                        case "Q":
                            item.approveresult = "未审批";
                            item.bg = 'btn4';
                            break;
                        case "D":
                            item.approveresult = "作废";
                            item.bg = 'btn3';
                            break;
                    }
                });
                return this.flowData;
            }
        },
        methods: {
            lookSignImg(imgUrl) {
                this.signImgUrl = this.$store.getters.host+imgUrl;
                this.showSignImg = true;
            },
            hideSignImg() {
                this.showSignImg = false;
                this.signImgUrl = '';
            }
        }
    }
</script>

<style scoped>
	.approvalRecord {
		width: 100%;
		height: 60px;
		line-height: 60px;
		border-top: 1px solid #F8F8F8;
		background: #FFFFFF;
	}

	.approvalRecord span {
		margin-left: 15px;
		font-size: 17px;
		color: #1d1d26;
	}

	.approvalList {
		width: 100%;
		height: 100%;
		padding-bottom: 66px;
	}

	.approvalList li {
		width: 100%;
		min-height: 100px;
		overflow: hidden;
	}

	.approvalPic {
		margin-left: 25px;
		margin-top: 25px;
		float: left;
		width: 10px;
		height: 10px;
		background: #FE821E;
		border-radius: 15px;
	}


	.approvalInfo {
		margin-left: 5%;
		float: left;
		width: 46%;
	}

	.approvalLeft {
		float: left;
		margin-top: 15px;
	}

	.approvalName {
		float: left;
		margin-bottom: 6px;
	}
	.approvalName span:nth-child(1){
		font-size: 15px;
		color: #1d1d26;
	}
	.approvalName .btn {
		border-radius: 10px;
		width: 50px;
		height: 20px;
		display: inline-block;
		color: #FFF;
		text-align: center;
		line-height: 20px;
		margin-left: 2px;
	}

	.approvalName .btn1 {
		background: #0073E6;
	}

	.approvalName .btn2 {
		background: #47B36B;
	}

	.approvalName .btn3 {
		background: #FE821E;
	}

	.approvalName .btn4 {
		background: #E6454D;
	}
	.approvalState{
		color: #979a9f;
		clear: both;
	}
	.approvalDate {
		float: right;
		margin-right: 10px;
		color: #979a9f;
		padding-top: 15px;
		text-align: center;
		width: 36%;
	}
	.signImgBtn{
		display: inline-block;
		border: 1px solid #FE821E;
		color: #FE821E;
		border-radius: 10px;
		padding: 0 10px;
	}
	.signImg{
		background: #fff;
		margin: 38px 20px 0;
		border-radius: 6px;
		text-align: center;
	}
	.signImg img{
		max-width: 100%;
	}
	.signP{
		height: 22px;
		margin-bottom: 6px;
	}

	.line {
		width: 1px;
		height: 90px;
		background: #ccc;
		margin-left: 30px;
		position: absolute;
		margin-top: -65px;
	}
	.person-name{
		width: 60px;
		display: inline-block;
	}
</style>
