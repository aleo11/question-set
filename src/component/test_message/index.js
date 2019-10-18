import React from 'react'
import { Card, Button, Form, Input,  Select, DatePicker,InputNumber} from 'antd';
import {setSteps, submitMessage} from '../../redux/reducers/test'
import {connect} from 'react-redux'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Option } = Select;
const {TextArea} = Input
const { RangePicker } = DatePicker;
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

@connect(
    state=>({
        current:state.test.get("current"),
        courseList:state.main.get("courseList"),
        quizId:state.test.getIn(["paperMessage","quizId"]),
        testName:state.test.getIn(["paperMessage","testName"]),
        whichCourse:state.test.getIn(["paperMessage","whichCourse"]),
        begin:state.test.getIn(["paperMessage","begin"]),
        end:state.test.getIn(["paperMessage","end"]),
        quizTime:state.test.getIn(["paperMessage","quizTime"]),
    }),
    {
        setSteps,
        submitMessage
    }
)
class TestMessage extends React.Component{
    handleNext(){
        const {setSteps,current,submitMessage,quizId} = this.props
        this.props.form.validateFields((err, values) => {
         if (!err) {
            values.begin = values.quizLastTime[0].format()
            values.end = values.quizLastTime[1].format()
            delete(values.quizLastTime)
            let _quizId=quizId||null
            submitMessage({...values,quizId:_quizId}).then(()=>{
            setSteps({current:current +1})
        })
     }
    });
        
        
    }

    handleSave(){
        const {submitMessage,quizId} = this.props
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.begin = values.quizLastTime[0].format()
                values.end = values.quizLastTime[1].format()
                delete(values.quizLastTime)
                let _quizId=quizId||null
                submitMessage({...values,quizId:_quizId}).then(()=>{
            })
            }
        })
    }
    render(){
        const { getFieldDecorator,  } = this.props.form;
        const {courseList,testName,whichCourse,begin,end,quizTime} =this.props
        let defaultSelect = courseList.getIn([0,"courseName"])||""
        let beginEndTime = [moment(begin),moment(end)]
        return (
            <div>
            <Card title={<span style={{fontSize:"1.5rem", fontWeight:600}}>基本信息</span>}>
                 <Form
                    {...formItemLayout}
                    layout={"horizontal"}
                 >
                    <Form.Item
                        label="考试名称"
                        >
                        {getFieldDecorator('testName', {
                            initialValue:testName,
                            rules: [{
                            type: 'string', message: 'The input is not valid E-mail!',
                            }, {
                            required: true, message: '请输入考试名称',
                            }],
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="所属课程"
                        >
                        {getFieldDecorator('whichCourse', {
                            initialValue:whichCourse||defaultSelect,
                            rules: [{
                            required: true, message: '请选择课程',
                            }],
                        })(
                            <Select>
                                {
                                    courseList.map((item,index)=>
                                        <Option key = {index} value={item.get("courseId")}>{item.get("courseName")}</Option>
                                    )
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="起止时间"
                        >
                        {getFieldDecorator('quizLastTime', {
                            initialValue:beginEndTime||[moment(),moment()],
                            rules: [{
                                required: true, message: '请设置起止时间',
                            }],
                        })(
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                placeholder={['开始时间', '结束时间']}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="限制时间"
                        >
                        {getFieldDecorator('quizTime', {
                            initialValue:quizTime,
                            rules: [{
                                required: true, message: '请设置考试时间',
                            }],
                        })(
                            <InputNumber />
                        )}  分钟
                    </Form.Item>
                    <Form.Item
                        label="考试须知"
                        >
                        {getFieldDecorator('testInfo', {
                            rules: [{
                            type: 'string', message: '输入格式有误',
                            }],
                        })(
                            <TextArea
                                autosize={{minRows:4,maxRows:10}}
                                 />
                        )}
                    </Form.Item>
                </Form>
            </Card>
            <Button style={{marginLeft:8,marginTop:8}} type="primary" onClick={()=>this.handleNext()}>继续设计试卷</Button>
            <Button style={{marginLeft:8,marginTop:8}} onClick={()=>this.handleSave()}>保存</Button>
            </div>
        )
    }
}

export default Form.create()(TestMessage) 