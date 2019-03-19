<template>
	<div>
		<!--合同请购清单-->
		<div class="list-menu">
			<table>
				<tr>
					<td v-for="title in titles" :class="{swiped:title.isSwiped}">
						{{title.text}}
						<span>{{title.num}}</span>
					</td>
				</tr>
			</table>
		</div>

		<!--合同请购清单表单-->
		<table class="list-main">
			<tr v-for="listMain in listMains">
				<td v-for="obj in listMain.infos">{{obj.title}}{{obj.value}}</td>
			</tr>
		</table>

		<!--条款-->
		<table class="drop-down-menu">
			<td v-for="itemTitle in itemTitles">
				{{itemTitle.title}}
			</td>
		</table>
		<div class="drop-down">
			<table>
				<tr v-for="item in items">
					<td>
						{{item.title}}
					</td>
					<td>
						{{item.value}}
					</td>
					<td>
						{{item.date}}
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				titles: [
					{ text: '合同采购清单', num: '(3)', isSwiped: true },
					{ text: '结算付款比例', isSwiped: false }
				],
				listMains: [{
						infos: [
							{ title: '计价规则：', value: '算头不算尾' },
							{ title: '单价类型：', value: '固定价格' }
						]
					},
					{
						infos: [
							{ title: '使用税率：', value: '3%' },
							{ title: '租赁类型：', value: '日租' }
						]
					}
				],
				itemTitles: [
					{ title: "条款" },
					{ title: "金额" },
					{ title: "日期" }
				],
				items: [
					{ title: '1.首付款30%', value: '3000000', date: '2017.01.17' },
					{ title: '2.进度款40%', value: '4000000', date: '2017.01.17' },
					{ title: '3.尾款30%', value: '3000000', date: '2017.01.17' }
				]
			}
		}

	}
</script>
<style scoped>
	.list-menu {
		width: 100%;
		height: 45px;
		text-align: center;
		line-height: 45px;
		margin-top: 1px;
		background: #FFF url('../assets/right.png') no-repeat 99% 50%;
		background-size: 10px auto;
	}

	.list-menu table {
		width: 100%;
	}

	.list-menu tr >.swiped {
		color: #fe821e;
		border-bottom: 1px solid #fe821e;
	}

	.list-main {
		width: 100%;
		height: 100%;
		border-top: 1px solid #F8F8F8;
	}

	.list-main tr {
		width: 100%;
		height: 50px;
		line-height: 50px;
	}

	.list-main tr td {
		width: 50%;
		padding-left: 5%;
		border-bottom: 1px solid #F8F8F8;
	}

	.drop-down-menu {
		width: 100%;
		height: 50px;
		line-height: 50px;
		text-align: center;
		background: #FFFFFF url('../assets/up.png') no-repeat 99% 50%;
		background-size: auto 10px;
	}

	.drop-down table {
		width: 100%;
		height: 100%;
	}

	.drop-down tr {
		width: 100%;
		height: 60px;
		line-height: 60px;
		text-align: center;
	}

	.drop-down tr td {
		width: 33.3%;
		border-bottom: 1px solid #F8F8F8;
	}
</style>