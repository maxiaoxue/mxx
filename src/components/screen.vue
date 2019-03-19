<template>
    <div class="wrap-box">
        <nav-bar
            :nowMsg="msg"
            :nowBarLocation="barLocation"
            :nowShowMsg="showMsg"
            v-on:searchPerson="searchLs"
            v-on:search="queryFromSql"
            :nowSpecialView="true"
            :ishowSelect="false"
         />

        <screen-info />
    </div>
</template>

<script>
import navBar from '../views/navBar';
import screenInfo from '../views/screenInfo';

export default {
    data () {
        return {
            //设置navBar组件
            msg:this.$route.query.navTitle,
            showMsg:'确定',
            barLocation: false
        }
    },
    methods:{
        queryFromSql() {
            const action = this.$route.query.action;

            if (action == "transfer" || action == "addassign" || this.$route.query.cpySend) {
                //改派、加签、抄送
                this.$store.commit('queryUserLs');
            }
        },
        searchLs () {
            var action = this.$route.query.action,
                keywords = this.$store.getters.condition,
                listItems = [];

            if (action == "reject") {
                //驳回
                listItems = this.$store.getters.activityList;
                searchPerson(keywords, listItems);
                this.$store.commit('saveActivityList', listItems);
            }
            else if (action == "agree") {
                //同意
                listItems = this.$store.getters.agreeAssignableUserList;
                searchPerson(keywords, listItems);
                this.$store.commit('agreeAssignableUserList', listItems);
            }
            else if (action == "disagree") {
                //不同意
                listItems = this.$store.getters.disagreeAssignableUserList;
                searchPerson(keywords, listItems);
                this.$store.commit('disagreeAssignableUserList', listItems);
            }else if(action == "transfer"){
                //改派
                listItems = this.$store.getters.activeAssignList;
                searchPerson2(keywords, listItems);
                this.$store.commit('saveAssignList', listItems);
            }else if(action == "cpySend"){
                //抄送人
                listItems = this.$store.getters.cpySendUserList;
                searchPerson2(keywords, listItems);
                this.$store.commit('saveCpySendUserList', listItems);
            }else if(action == "addassign"){
                //加簦人
                listItems = this.$store.getters.addassignList;
                searchPerson2(keywords, listItems);
                /* alert(JSON.stringify(listItems));*/
                this.$store.commit('saveAddassignList', listItems);
            };

            function searchPerson2(keywords, listItems){
                if(keywords.length > 0)
                {
                    for (let k = listItems.length - 1; k >= 0; k--)
                    {
                        var sItem = listItems[k].title.toLowerCase(),
                            code = listItems[k].key.toLowerCase(),
                            sTxt = keywords.toLowerCase(),
                            arr = sTxt.split(' ');
                        listItems[k].isShow = false;
                        for (let j = arr.length - 1; j >= 0; j--)
                        {
                            if(sItem.search(arr[j]) != -1 )
                            {
                                listItems[k].isShow = true;
                            }
                        };
                    };
                }
                else
                {
                    for (let k = listItems.length - 1; k >= 0; k--)
                    {
                        listItems[k].isShow = true;
                    }
                }
            };

            function searchPerson(keywords, listItems){
                if(keywords.length > 0)
                {
                    for (let k = listItems.length - 1; k >= 0; k--)
                    {
                        for (let i = listItems[k].assignableUserList.length - 1; i >= 0; i--)
                        {
                            var sItem = listItems[k].assignableUserList[i].title.toLowerCase(),
                                sTxt = keywords.toLowerCase(),
                                arr = sTxt.split(' ');

                            listItems[k].assignableUserList[i].isShow = false;

                            for (let j = arr.length - 1; j >= 0; j--)
                            {
                                if(sItem.search(arr[j]) != -1)
                                {
                                    listItems[k].assignableUserList[i].isShow = true;
                                }
                            };
                        };
                    };
                }
                else
                {
                    for (let k = listItems.length - 1; k >= 0; k--)
                    {
                        for (let i = listItems[k].assignableUserList.length - 1; i >= 0; i--)
                        {
                            listItems[k].assignableUserList[i].isShow = true;
                        };
                    }
                }
            };

        }
    },
    components: {
        navBar,
        screenInfo,
    }
}
</script>