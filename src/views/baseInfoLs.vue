<template>
	<div class="list">
		<table>
			<tr class="list-one" v-for="(item,index) in items">
				<td>
				<div class="list-num">
					{{index+1}}
				</div>
				<table class="list-two">
					<tr v-for="obj in item.infos">
						<div>
							<span>{{obj.name}}</span>
							<span>{{obj.value}}</span>
						</div>
					</tr>
				</table>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
export default {
    data () {
        return {
            items: [{
					infos: [{
						name: '是否同意：',
						value: '同意'
					}, {
						name: '姓名：',
						value: '张三'
					}, {
						name: '部门：',
						value: '移动应用部'
					}]
				},
				{
					infos: [{
						name: '是否同意：',
						value: '同意'
					}, {
						name: '姓名：',
						value: '张三'
					}, {
						name: '部门：',
						value: '移动应用部'
					}]
				},
				{
					infos: [{
						name: '是否同意：',
						value: '同意'
					}, {
						name: '姓名：',
						value: '张三'
					}, {
						name: '部门：',
						value: '移动应用部'
					}]
				},
				{
					infos: [{
						name: '是否同意：',
						value: '同意'
					}, {
						name: '姓名：',
						value: '张三'
					}, {
						name: '部门：',
						value: '移动应用部'
					}]
				}
			]
        }
    }
}
</script>

<style scoped>
.list {
	width: 100%;
    padding-top: 44px;
}
.list-num {
	width: 40px;
	height: 20px;
	background: #FE821E;
	text-align: center;
	line-height: 20px;
	color: #FFF;
	font-size: 11px;
}
.list table{
	width: 100%;
}
.list-one td{
	width: 100%;
	height: 140px;
	border-bottom: 1px solid #F8F8F8;
}
.list-two {
	padding-left: 40px;
	height: 99px;
}
.list-two tr {
	width: 100%;
	height: 33px;
	line-height: 33px;
}
.list-two span:nth-child(1){
	color: #abaca6;
}
.list-two span:nth-child(2){
	color: #1d1d26;
}
</style>