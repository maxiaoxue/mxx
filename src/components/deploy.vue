center<template>
    <div class="layout">
        <Layout>
            <Header :style="{width: '100%'}">
                <Menu mode="horizontal" theme="dark" active-name="deploy" @on-select="menuSelectChange">
                    <div class="layout-logo">欢迎来到用友建筑NC移动产品部署界面</div>
                    <div class="layout-nav">
                        <MenuItem name="deploy" >
                            <Icon type="ios-briefcase-outline"></Icon>
                            部署配置
                        </MenuItem>
                        <MenuItem name="licenseApplication">
                            <Icon type="ios-compose-outline"></Icon>
                            MLICENSE申请
                        </MenuItem>

                    </div>
                </Menu>
            </Header>
            <Content :style="{margin: '10px 20px 0', background: '#fff', minHeight: '500px'}">
                <deploy-form v-show="curMenu=='deploy'" class="nav-deploy"/>
                <license-application-form v-show="curMenu=='licenseApplication'" class="nav-license"/>
            </Content>
            <Footer class="layout-footer-center">Copyright © 2016 用友建筑云服务有限公司 . All Rights Reserved</Footer>
        </Layout>
    </div>
</template>
<script>
    import deployForm from '../views/deployForm';
    import licenseApplicationForm from '../views/licenseApplicationForm';
    export default {
        data(){
            return {
                curMenu: 'deploy',
            }
        },
        methods: {
            menuSelectChange: function (name) {
                this.curMenu = name;

            }
        },
        components: {
            deployForm,
            licenseApplicationForm
        }
    }
</script>
<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
        width: 30%;
        height: 30px;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 5px;
        left: 20px;
        color: white;
    }
    .layout-nav{
        width: 420px;
        margin: 0 auto;
        margin-right: 20px;
    }
    .layout-footer-center{
        text-align: center;
    }
    .nav-deploy{
        width: 30%;
        margin: 2% auto;
    }
    .nav-license{
        width: 50%;
        margin: 2% auto;
    }
</style>