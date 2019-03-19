<template>
    <div class="screenInfo1" v-if="scrollPage">
        <!--<scroller :on-refresh="refresh" :on-infinite="infinite" ref="user_scroll">-->
        <userList :lists="items"></userList>
        <!--</scroller>-->
    </div>
    <div class="userInfos" v-else>
        <userList></userList>
    </div>
</template>

<script>
    import Scroller from 'vue-scroller'
    import userList from './user-list'

    export default {
        components: {
            Scroller,
            userList
        },
        data() {
            return {
                isNoMore: true,
                params: {},
                items: [{
                    desc: false,
                    assignableUserList: []
                }]
            }
        },
        mounted() {
            for (let key in this.$store.getters.lsParams) {
                this.params[key] = this.$store.getters.lsParams[key];
            }

            this.params.startline = '1';
            this.params.condition = '';

            setTimeout(() => {
                this.$refs.user_scroll && this.$refs.user_scroll.resize();
            }, 10)
        },
        computed: {
            personLsUrl() {    // 列表接口
                return this.$store.getters.personLsUrl
            },
            queryUserLs() {    // 查询分页用户列表
                return this.$store.getters.queryUserLs
            },
            scrollPage() {
                const action = this.$route.query.action;

                if (action == "transfer" || action == "addassign" || this.$route.query.cpySend) {
                    //改派、加签、抄送
                    return true;
                } else {
                    return false;
                }
            }
        },
        methods: {
            refresh() {
                // 开启遮罩层
                this.$store.commit('lockTrue');
                this.isNoMore = true;

                this.params.startline = '1';
                this.params.count = '10';
                this.items = [{
                    desc: false,
                    assignableUserList: []
                }];
                this.$refs.user_scroll.finishPullToRefresh();
                this.$refs.user_scroll.finishInfinite();
            },
            infinite() {
                if (this.isNoMore) {
                    var selectedItem = this.$store.getters.approvalParams.value;

                    if (this.$route.query.cpySend) {
                        selectedItem = this.$store.getters.selectedInfo.value;
                    }

                    setTimeout(() => {
                        this.ajax.get(this.personLsUrl, this.params, (data) => {
                            const uItem = data.data.userlist;

                            for (let i = 0; i < uItem.length; i++) {
                                this.items[0].assignableUserList.push({
                                    "title": uItem[i].user_name,
                                    "key": uItem[i].cuserid,
                                    "isSwiped": false,
                                    "isShow": true
                                });

                                for (let j = 0; j < selectedItem.length; j++) {
                                    if (selectedItem[j].key == uItem[i].cuserid) {
                                        this.items[0].assignableUserList[i].isSwiped = true;
                                        break;
                                    }
                                }

                            }

                            setTimeout(() => {
                                if (uItem.length < 10) {
                                    this.isNoMore = false;
                                    this.$refs.user_scroll.finishInfinite({isNoMoreData: true});
                                } else {
                                    this.$refs.user_scroll.finishInfinite();

                                    this.params.count = data.data.count - 10 < 10 ? data.data.count - 10 : 10;
                                    this.params.startline = String(Math.floor(this.params.startline) + 10);
                                }
                            }, 10);

                            if (uItem.length != 0) {
                                var action = this.$route.query.action;
                                if (action == "transfer") {
                                    this.$store.commit("saveAssignList", this.items[0].assignableUserList);
                                } else if (action == "cpySend") {
                                    this.$store.commit("saveCpySendUserList", this.items[0].assignableUserList);
                                } else if (action == "addassign") {
                                    this.$store.commit("saveAddassignList", this.items[0].assignableUserList);
                                }
                            }

                            // 解除遮罩层
                            this.$store.commit('lockFalse');
                        }, () => {
                            // 解除遮罩层
                            this.$store.commit('lockFalse');
                        });

                    }, 10)

                } else {
                    // 解除遮罩层
                    this.$store.commit('lockFalse');
                    this.$refs.user_scroll.finishInfinite({isNoMoreData: true});
                }
            }
        },
        watch: {
            queryUserLs() {
                this.params.condition = this.$store.getters.condition;
                this.refresh();
            }
        },
        created() {
            this.infinite()
        }
    }
</script>

<style scoped>
    .screenInfo1 {
        position: absolute;
        top: 90px;
        bottom: 10px;
        left: 0;
        right: 0;
    }

    .userInfos {
        padding: 90px 0 10px;
        position: relative;
        z-index: 10;
        background: #fff;
    }


</style>
