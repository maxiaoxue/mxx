<template>
    <div class="wrap-box">
        <nav-bar :nowMsg="msg" :nowBarLocation="barLocation" :nowSpecialView="specialView"></nav-bar>
        <base-info-ls></base-info-ls>
    </div>
</template>

<script>
import navBar from '../views/navBar';
import baseInfoLs from '../views/baseInfoLs';

export default {
    data () {
        return {
            //设置navBar组件
            msg: '基本信息',
            barLocation: false,
            specialView: false
        }
    },
    components: {
        navBar,
        baseInfoLs
    }
}
</script>