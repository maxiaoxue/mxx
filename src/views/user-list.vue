<template>
    <div class="user_list">
        <table v-for="(list, i) in lists">
            <tr v-if="list.desc">
                <td v-text="list.desc" class="groupTitle" colspan="2"></td>
            </tr>
            <tr class="screen_check" v-for="(item, index) in list.assignableUserList"
                @click="turnChecked(i, index)" v-show="item.isShow">
                <td class="screen_title">{{item.title}}</td>
                <!-- <td class="screen_text">{{item.text}}</td> -->
                <td class="checkBtn">
                    <i v-show="!item.isSwiped" class="iconfont icon-icon163"></i>
                    <i v-show="item.isSwiped" class="iconfont icon-gou"></i>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        props: {
            lists: {
                type: Array,
                default: function () {
                    var action = this.$route.query.action,
                        list = [],
                        selectedItem = this.$store.getters.approvalParams.value;

                    if(action == "reject"){
                        list = this.$store.getters.activityList;
                    }
                    else if(action == "disagree"){
                        list = this.$store.getters.disagreeAssignableUserList;
                    }
                    else if(action == "agree"){
                        list = this.$store.getters.agreeAssignableUserList;

                    }else if(action == "addassign"){
                        list = this.$store.getters.addassignList;
                    }
                    else{
                        list = this.$store.getters.activeAssignList;
                    };

                    if(this.$route.query.cpySend){
                        list = this.$store.getters.activeAssignList;
                        selectedItem = this.$store.getters.selectedInfo.value;
                    }

                    if (selectedItem.length) {
                        for (let i = 0; i < selectedItem.length; i++){
                            for (let k = 0; k < list.length; k++) {
                                for (let j = 0; j < list[k].assignableUserList.length; j++) {

                                    if (selectedItem[i].key == list[k].assignableUserList[j].key) {
                                        list[k].assignableUserList[j].isSwiped = true;
                                        break;
                                    }
                                }

                            }
                        }
                    }
                    return list;
                }
            }
        },
        methods: {
            turnChecked (i, index) {
                var action = this.$route.query.action,
                    listItem = this.lists,
                    toSelectItem = [];

                for (let k = 0; k < listItem.length; k++) {
                    for (let j = 0; j < listItem[k].assignableUserList.length; j++) {

                        let a = listItem[k].assignableUserList[j];

                        if (k !== i) {
                            a.isSwiped = false;
                        }

                        if (i === k && index === j) {
                            a.isSwiped = !a.isSwiped;
                        }
                        else if (action == "reject" || action == "transfer") {
                            a.isSwiped = false;
                        }

                        if (a.isSwiped) {
                            toSelectItem.push({"key": a.key, "value": a.title});
                        }

                    }
                }

                if(this.$route.query.cpySend) {
                    this.$store.commit("selectedInfo", {"key": action, "value": toSelectItem});
                } else {
                    this.$store.commit('saveApprovalParams', {"key": action, "value": toSelectItem});
                }

            }
        }
    }
</script>

<style scoped>
    .user_list{
        position: relative;
        z-index: 10;
        background: #fff;
    }
    .user_list table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
    }

    .user_list tr {
        border-bottom: 1px solid #F8F8F8;
    }

    .screen_check {
        width: 100%;
        height: 55px;
        line-height: 55px;
    }

    .groupTitle{
        background: #f9f9f9;
        line-height: 30px;
        text-indent: 20px;
        color: #777;
    }

    .screen_title {
        padding-left:10%;
    }

    .screen_text {
        color: #abaca6;
    }

    .checkBtn {
        width: 50px;
        text-align: center;
        color: #FE821E;
    }
</style>
