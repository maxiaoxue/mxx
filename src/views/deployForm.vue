<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
        <FormItem label="产品名称" prop="appName">
            <Select v-model="formValidate.appName" placeholder="请选择移动产品">
                <Option value="NC57移动产品">NC57移动产品</Option>
                <Option value="NC63移动产品">NC63移动产品</Option>
                <Option value="NC65移动产品">NC65移动产品</Option>
            </Select>
        </FormItem>
        <FormItem label="NC服务地址" prop="ncAddr">
            <Input v-model="formValidate.ncAddr" placeholder="NC服务ip:port，如123.57.14.211:825"></Input>
        </FormItem>
        <FormItem label="NC数据库地址" prop="ncDBAddr">
            <Input v-model="formValidate.ncDBAddr" placeholder="NC数据库ip:port，如123.57.38.18:1521"></Input>
        </FormItem>
        <FormItem label="NC数据库用户名" prop="ncDBUser">
            <Input v-model="formValidate.ncDBUser" placeholder="NC数据库用户名"></Input>
        </FormItem>
        <FormItem label="NC数据库密码" prop="ncDBPwd">
            <Input v-model="formValidate.ncDBPwd" placeholder="NC数据库密码"></Input>
        </FormItem>
        <FormItem label="NC数据源" prop="ncDataSource">
            <Input v-model="formValidate.ncDataSource" placeholder="NC数据源名称"></Input>
        </FormItem>
        <FormItem label="NC57账套ID" prop="nc57AccountId" >
            <Input v-model="formValidate.nc57AccountId" :disabled="formValidate.appName != 'NC57移动产品'" placeholder="NC57使用账套id,可用root登录nc查看"></Input>
        </FormItem>
        <FormItem label="移动服务地址" prop="mobileAddr">
            <Input v-model="formValidate.mobileAddr" placeholder="移动服务外网ip:port，如123.57.14.211:8090(发版包默认8090)"></Input>
        </FormItem>
        <FormItem label="移动审批部署环境" prop="environment">
            <RadioGroup v-model="formValidate.environment">
                <Radio label="windows">windows系统</Radio>
                <Radio label="linux">linux系统</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="服务应用" prop="apps">
            <CheckboxGroup v-model="formValidate.apps">
                <Checkbox label="审批"></Checkbox>
                <Checkbox label="报表"></Checkbox>
            </CheckboxGroup>
        </FormItem>

        <FormItem label="审批启用电子签名" prop="isSignatureEnable">
            <RadioGroup v-model="formValidate.isSignatureEnable">
                <Radio label="true">是</Radio>
                <Radio label="false">否</Radio>
            </RadioGroup>
        </FormItem>

        <FormItem label="报表数据库地址" prop="repDBAddr">
            <Input v-model="formValidate.repDBAddr" :disabled="!isInArray(formValidate.apps,'报表')" placeholder="移动报表数据库ip:port，如123.57.38.18:1521"></Input>
        </FormItem>
        <FormItem label="报表数据库用户名" prop="repDBUser">
            <Input v-model="formValidate.repDBUser" :disabled="!isInArray(formValidate.apps,'报表')" placeholder="移动报表数据库用户名"></Input>
        </FormItem>
        <FormItem label="报表数据库密码" prop="repDBPwd">
            <Input v-model="formValidate.repDBPwd" :disabled="!isInArray(formValidate.apps,'报表')" placeholder="移动报表数据库密码"></Input>
        </FormItem>
        <FormItem label="消息服务类型" prop="messageType">
            <CheckboxGroup v-model="formValidate.messageType" >
                <Checkbox label="platform" ></Checkbox>
                <Checkbox label="WeChat"></Checkbox>
            </CheckboxGroup>
        </FormItem>
      <!--  <FormItem label="微信服务地址" prop="weChatAddr">
            <Input v-model="formValidate.weChatAddr" :disabled="!isInArray(formValidate.messageType,'WeChat')" placeholder="移动服务外网ip:port，如123.57.14.211:8090(发版包默认8090)"></Input>
        </FormItem>-->
        <FormItem label="消息服务OrgName" prop="etpkey">
            <Input v-model="formValidate.etpkey" placeholder="消息服务的企业key"></Input>
        </FormItem>
        <FormItem label="消息服务AppName" prop="appkey">
            <Input v-model="formValidate.appkey" placeholder="消息服务的应用key"></Input>
        </FormItem>
        <FormItem label="消息服务Client ID" prop="clientID">
            <Input v-model="formValidate.clientID" placeholder="消息服务的clientid"></Input>
        </FormItem>
        <FormItem label="消息服务Client Secret" prop="clientSecret">
            <Input v-model="formValidate.clientSecret" placeholder="消息服务的clientsecret"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">一键生成部署配置文件</Button>
        </FormItem>
    </Form>
</template>
<script>
    export default {
        data () {
            return {
                appConFlag:true,
                formValidate: {
                    appName: '',
                    ncAddr:'',
                    /*ncDBAddr: '',
                    ncDBUser: '',
                    ncDBPwd: '',*/
                    ncDataSource:'',
                    repDBAddr:'',
                    repDBUser:'',
                    repDBPwd:'',
                    nc57AccountId: '',
                    mobileAddr: '',
                    environment:'windows',
                    apps: ['审批'],
                    isSignatureEnable:'true',
                    etpkey:'',
                    appkey:'',
                    clientID:'',
                    clientSecret:'',
                    messageType:['platform'],
                    weChatAddr:'',
                },
                ruleValidate: {
                    appName: [
                        { required: true, message: '请选择产品名称！', trigger: 'change' }
                    ],
                    ncAddr: [
                        { required: true, message: '请输入NC服务地址！', trigger: 'blur' }
                    ],
                    ncDBAddr: [
                        { required: true, message: '请输入NC数据库地址！', trigger: 'blur' }
                    ],
                    ncDBUser: [
                        { required: true, message: '请输入NC数据库用户名！', trigger: 'blur' }
                    ],
                    ncDBPwd: [
                        { required: true, message: '请输入NC数据库密码！', trigger: 'blur' }
                    ],
                    ncDataSource: [
                        { required: true, message: '请输入NC数据源！', trigger: 'blur' }
                    ],
                    isSignatureEnable: [
                        { required: true, message: '请选择是否启用电子签名！', trigger: 'blur' }
                    ],
                    mobileAddr: [
                        { required: true, message: '请输入移动服务地址！', trigger: 'blur' }
                    ],
                    apps: [
                        { required: true, type: 'array', min: 1, message: '至少选择一个服务应用', trigger: 'change' },
                        { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
                    ],
                    environment:[
                        { required: true, message: '请选择移动审批部署环境！', trigger: 'blur' }
                    ]

                }
            }
        },
        methods: {
            isInArray(array, obj){
                for (var i = 0; i < array.length; i++){
                    if (array[i] == obj)//如果要求数据类型也一致，这里可使用恒等号===
                        return true;
                }
                return false;
            },
            handleSubmit (name) {
                const url = this.$store.getters.easyConfigUrl;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.ajax.silentPost(url, this.formValidate, (data) => {
                                this.$Modal.success({
                                    title: '成功',
                                    content: '生成目录：'+ data.data
                                });
                            },() => {
                                this.$Message.success('生成失败');
                            }
                        );

                    } else {
                        this.$Message.error('请把表单填写完整!');
                    }
                 })
            }
        }
    }
</script>