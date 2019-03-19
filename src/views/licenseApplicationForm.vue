<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <FormItem label="项目（全称）：" prop="orgName">
            <Input v-model="formValidate.orgName" placeholder="请输入项目名称"></Input>
        </FormItem>
        <FormItem label="申请人：" prop="applyName" >
            <Input v-model="formValidate.applyName" placeholder="请输入申请人"></Input>
        </FormItem>
        <FormItem label="电话：" prop="applyPhone">
            <Input v-model="formValidate.applyPhone" placeholder="请输入电话"></Input>
        </FormItem>
        <FormItem label="NC版本：" prop="ncVersionModel">
            <RadioGroup v-model="formValidate.ncVersionModel">
                <Radio label="NC57">NC57</Radio>
                <Radio label="NC63">NC63</Radio>
                <Radio label="NC65">NC65</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="NC部署环境：" prop="environmentModel">
            <RadioGroup v-model="formValidate.environmentModel">
                <Radio label="windows系统">windows系统</Radio>
                <Radio label="linux系统">linux系统</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="申请类型：" prop="applyTypeModel">
            <RadioGroup v-model="formValidate.applyTypeModel">
                <Radio label="临时license">临时license(1月)</Radio>
                <Radio label="正式license新申请">正式license新申请(1年)</Radio>
                <Radio label="正式license再申请">正式license再申请(1年)</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="生效日期：" style="float: left">
            <Row>
                <FormItem prop="startData">
                    <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择生效日期" v-model="formValidate.startData"></DatePicker>
                </FormItem>
            </Row>
        </FormItem>
        <FormItem label="失效日期：">
            <Row>
                <FormItem prop="endData">
                    <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择失效日期" v-model="formValidate.endData"></DatePicker>
                </FormItem>
            </Row>
        </FormItem>
        <FormItem label="移动服务：" prop="hostName">
            <CheckboxGroup v-model="formValidate.hostName">
                <Checkbox label="审批"></Checkbox>
                <Checkbox label="报表"></Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="备注：" prop="vmemo">
            <Input v-model="formValidate.vmemo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">生成MLICENSE申请单</Button>
        </FormItem>
    </Form>
</template>
<script>
    import axios from 'axios';
    export default {
        data () {
            return {
                formValidate: {
                    orgName: '',
                    applyName: '',
                    applyPhone: '',
                    ncVersionModel: 'NC57',
                    environmentModel:'windows系统',
                    applyTypeModel:"临时license",
                    startData: '',
                    endData: '',
                    hostName: ['审批'],
                    vmemo:''
                },
                ruleValidate: {
                    orgName: [
                        { required: true, message: '项目名称不能为空！', trigger: 'blur' }
                    ],
                    applyName: [
                        { required: true, message: '申请人不能为空！', trigger: 'blur' }
                    ],
                    applyPhone: [
                        { required: true, message: '电话不能为空！', trigger: 'change' }
                    ],
                    ncVersionModel: [
                        { required: true, message: '请选择NC版本！', trigger: 'change' }
                    ],
                    environmentModel: [
                        { required: true, message: '请选择NC部署环境！', trigger: 'change' }
                    ],
                    applyTypeModel: [
                        { required: true, message: '请选择申请类型！', trigger: 'change' }
                    ],
                    hostName: [
                        { required: true, type: 'array', min: 1, message: '请至少选择一个移动服务！', trigger: 'change' },
                    ],
                    startData: [
                        { required: true, type: 'date', message: '请输入license有效期！', trigger: 'change' }
                    ],
                    endData: [
                        { required: true, type: 'date', message: '请输入license有效期！', trigger: 'change' }
                    ],
                },
                options2: {
                    shortcuts: [
                        {
                            text: '临时(1月)',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '正式(1年)',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                end.setTime(start.getTime() + 3600 * 1000 * 24 * 365);
                                return [start, end];
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        axios({
                            method: 'post',
                            url: this.$store.getters.requestNoteUrl,
                            data: this.formValidate,
                            responseType: 'blob'
                        }).then(res  => {
                            this.download(res.data);
                        });
                    }
                });
            },
            download (data) {
                if (!data) {
                    return
                }
                let url = window.URL.createObjectURL(new Blob([data]))
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', this.formValidate.orgName+'('+ this.formValidate.applyName +')'+'-MLICENSE申请单.doc');
                document.body.appendChild(link);
                link.click();
            }
        }
    }
</script>