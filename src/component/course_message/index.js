import React from 'react'
import { Card, Button, Form, Input, DatePicker,Select, Icon, message,Table,Modal} from 'antd';
import * as XLSX from 'xlsx';
import {withRouter} from 'react-router-dom'
import { submitCourseMessage} from '../../redux/reducers/course'
import {connect} from 'react-redux'
import moment from 'moment';
import 'moment/locale/zh-cn';
import './style.less'
moment.locale('zh-cn');
const {TextArea} = Input
const {MonthPicker} = DatePicker
const Option = Select.Option
const formItemLayout = {
    labelCol: {
      xs: { span: 22,offset:1 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 22,offset:1 },
      sm: { span: 12 },
    },
  };

@withRouter
@connect(
    state=>({
        current:state.test.get("current")
    }),
    {
        submitCourseMessage
    }
)
class CourseMessage extends React.Component{
    state={
        fileName:'',
        studentInfo:[],
        visible:false
    }

    handleSubmit(){
        let id = 1
        const {submitCourseMessage} = this.props
        const {studentInfo} = this.state
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(studentInfo.length===0){
                    Modal.info({
                        title:"请上传学生名单~"
                    })
                    return false
                }
                values.studentInfo=studentInfo
                values.beginTime = values.beginTime.format("YYYY-MM")
                submitCourseMessage(id,values).then(()=>{
                    this.props.history.push('/')
            })
        }
        })
    }
    handleStuInfo(){
        this.setState({
            visible:true
        })
    }
    handleOk(){
        this.setState({
            visible:false
        })
    }
    handleCancel(){
        this.setState({
            visible:false
        })
    }

    onImportExcel = file => {
        // 获取上传的文件对象
        const { files } = file.target;
        // 通过FileReader对象读取文件
       if(files.length===0){
            return false
       }
       const fileName = files[0].name
        const fileReader = new FileReader();
        fileReader.onload = event =>{
          try {
            const { result } = event.target;
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' });
             // 存储获取到的数据
            let data = [];
            // 遍历每张工作表进行读取（这里默认只读取第一张表）
            for (const sheet in workbook.Sheets) {
              // esline-disable-next-line
              if (workbook.Sheets.hasOwnProperty(sheet)) {
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                // break; // 如果只取第一张表，就取消注释这行
              }
            }
            // 最终获取到并且格式化后的 json 数据
            message.success('上传成功！')
            this.setState({
                fileName,
                studentInfo:data,
            })
            console.log(JSON.stringify(data));
          } catch (e) {
            // 这里可以抛出文件类型错误不正确的相关提示
            message.error('文件类型不正确！');
          }
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
      }

    render(){
        const { getFieldDecorator } = this.props.form;
        const {fileName,studentInfo} = this.state
        const info = studentInfo[0]
        let columns=[]
        for(let i in info){
            columns.push(
                {
                    title: i, //固定形式或者自动生成
                    dataIndex: i,
                    key: i,
                }
            )
        }
        let data=[]
        studentInfo.map((item,index)=>{
            data.push({
                ...item,
                key:index,
            })
            return data
        })
          
        return (
            <div>     
            <Card title={<span style={{fontSize:"1.5rem", fontWeight:600}}>课程信息</span>}>
                 <Form
                    {...formItemLayout}
                  layout={"horizontal"}
                 >
                    <Form.Item
                        label="课程名称"
                        >
                        {getFieldDecorator('courseName', {
                            rules: [{
                            type: 'string', message: '输入格式有误!',
                            }, {
                            required: true, message: '请输入课程名称',
                            }],
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="课程简称"
                    >
                    {getFieldDecorator('courseNickName', {
                            rules: [{
                                required: true, message: '请设置课程简称',
                            }],
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="开课时间"
                    >
                    {getFieldDecorator('beginTime', {
                            rules: [{
                            required: true, message: '请输入开课时间',
                            }],
                        })(
                            <MonthPicker
                                placeholder="选择开课时间" />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="课程性质"
                    >
                    {getFieldDecorator('courseType', {
                            initialValue:"elective",
                            rules: [{
                                required: true, message: '请选择课程性质',
                            }],
                        })(
                            <Select style={{ width: 120 }}>
                                <Option value="elective">选修</Option>
                                <Option value="required">必修</Option>
                                <Option value="public">公共课</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="学生名单"
                    >
                        <Button
                            type="primary"
                            className={'upload-wrap'}>
                        <Icon type='upload' />
                        <input className={'file-uploader'} type='file' accept='.xlsx, .xls' onChange={this.onImportExcel} />
                        <span className={'upload-text'}>上传文件</span>
                        </Button>
                        <p className={'upload-tip'}>支持 .xlsx、.xls 格式的文件</p>
                        {
                            fileName===''?null:
                        <div>
                            <svg
                                onClick={()=>this.handleStuInfo()} 
                                className="icon excel-stu" aria-hidden="true">
                                <use xlinkHref="#icon-biaoge"></use>
                            </svg>
                            <span>{fileName}</span>
                        </div>
                        }
                        <Modal
                            width="70%"
                            title="学生信息"
                            visible={this.state.visible}
                            okText="确认"
                            cancelText="返回"
                            onOk={()=>this.handleOk()}
                            onCancel={()=>this.handleCancel()}
                        >
                            <Table
                                size="small"
                                columns={columns}
                                dataSource={data}
                            />
                        </Modal>
                        
                    </Form.Item>
                    <Form.Item
                        label="课程须知"
                        >
                        {getFieldDecorator('courseInfo', {
                            rules: [{
                            type: 'string', message: '输入格式有误!',
                            }],
                        })(
                            <TextArea
                                autosize={{minRows:4,maxRows:10}}
                                 />
                        )}
                    </Form.Item>
                </Form>
            </Card>
            <Button style={{marginLeft:8,marginTop:8}} type="primary" onClick={()=>this.handleSubmit()}>添加</Button>
            </div>
        )
    }
}

export default Form.create()(CourseMessage) 