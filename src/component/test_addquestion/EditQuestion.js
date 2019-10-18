import React from 'react'
import {fromJS} from "immutable";
import {Form, Row, Col, Select, Input, InputNumber,Button,Radio,Checkbox, Modal} from 'antd'
import { Editor } from '@tinymce/tinymce-react';
import {inits} from '../../utils/tinymce/config'
import { connect } from 'react-redux';
import {changeGapAnswer,changeOptionList,changeOptionAnswer,changeAskAnswer,changeCodeAnswer,changeQuestionContent} from '../../redux/reducers/common'
import {changeLittleQuestion} from '../../redux/reducers/test'
import EditQuestionGap from './EditQuestionGap'
import EditQuestionOption from './EditQuestionOption'
import EditQuestionAsk from './EditQuestionAsk';
import EditQuestionCode from './EditQuestionCode'
const { Option } = Select;
const RadioGroup = Radio.Group;

var gapOrder = 0 //填空题key值
@connect(
        state=>({
            gapAnswerList:state.common.get("gapAnswerList"),
            optionAnswerList:state.common.get("optionAnswerList"),
            selectQuestionAnswer:state.common.get("selectQuestionAnswer"),
            askQuestionAnswer:state.common.get("askQuestionAnswer"),
            littleId:state.test.get("littleId"),
            editData:state.test.get("editData"),
            quesContent:state.common.get("quesContent"),
            quizId:state.test.getIn(["paperMessage","quizId"]),
            codeQuestionAnswer:state.common.get("codeQuestionAnswer")
        }),
    {
        changeGapAnswer,
        changeOptionList,
        changeOptionAnswer,
        changeAskAnswer,
        changeLittleQuestion,
        changeCodeAnswer,
        changeQuestionContent
        
    }
)
class EditQuestion extends React.Component{
    constructor(props){
        super(props);
        this.state={
            questionType:'',
            gapCount:[],
        } 
    }
    onRef = (ref) =>{
        this.child = ref
      }
    componentDidMount(){
        const {editData, changeOptionList,changeOptionAnswer,changeAskAnswer,changeCodeAnswer,changeQuestionContent} = this.props
        const {gapCount} = this.state
        this.props.onRef(this)
        let answer = editData.get("answer")
        let options = editData.get("options")
        let type =editData.get("type")
        if(type==="shortanswer"){
            for(let i =0;i<answer.size;i++){
                gapCount.push( <EditQuestionGap key={++gapOrder} order={i}/>)
            }
            this.setState({
                gapCount
            })
        }else if(type==="multichoice"){
            changeOptionList(options)
            changeOptionAnswer(answer)
        }else if(type==="essay"){
            changeAskAnswer(answer)
        }else if(type==="coderunner"){
            changeCodeAnswer(answer)
        }
        changeQuestionContent(editData.get("quesContent"))
        this.setState({
            questionType:type===undefined?'multichoice':type,
        })
        
    }
    //题型改变
    selectChange(value){
        this.setState({
            questionType:value
        })
    }

    //增加选择题选项
    handleAddOption(){
        const {optionAnswerList,changeOptionList} = this.props
        changeOptionList(optionAnswerList.merge(''))
    }
    //减少选择题选项
    handleDeleteOption(){
        const {optionAnswerList,changeOptionList,selectQuestionAnswer, changeOptionAnswer} = this.props
        let readyRemove = String.fromCharCode(64+optionAnswerList.size)
        changeOptionList(optionAnswerList.butLast())
        changeOptionAnswer(selectQuestionAnswer.filter((item)=>item!==readyRemove))
    }

    //增加填空
    handleAddGap(){
        const {gapCount} = this.state
         const {changeGapAnswer,gapAnswerList} = this.props
        let order = gapCount.length
        gapCount.push( <EditQuestionGap key={++gapOrder} order={order}/>)
        changeGapAnswer(gapAnswerList.merge(fromJS([])))
        this.setState({
            gapCount
        })
    }

   
    //减少填空
    handleDeleteGap(){
        const {gapCount} = this.state
        const {changeGapAnswer,gapAnswerList} = this.props
        changeGapAnswer(gapAnswerList.butLast()) //immutable
        gapCount.pop()  //js
        gapCount.length>0&& this.setState({
            gapCount
        })
    }

    //更改试题内容
    handleChangeContent(e){
        const {changeQuestionContent} = this.props
        changeQuestionContent(e.target.getContent())
    }
    submitChange = (id)=>{
        const {changeLittleQuestion,littleId,quesContent,askQuestionAnswer,codeQuestionAnswer,selectQuestionAnswer,optionAnswerList,gapAnswerList,quizId} = this.props
       return new Promise((resolve,reject)=>{
            this.props.form.validateFields((err, values) => {
            let result
            if (!err&&quesContent!==""&&quesContent!==undefined){
                values.quesContent=quesContent
                        switch(values.type){
                            case "multichoice":
                            if(optionAnswerList.toJS().indexOf('')===-1){
                                if(selectQuestionAnswer.toJS().length===0){
                                    Modal.info({
                                        title:"请设置答案~"
                                    })
                                }else{
                                    result = {
                                        ...values,
                                        options:optionAnswerList,
                                        answer:selectQuestionAnswer,
                                    }
                                    changeLittleQuestion({quizId,id,littleId,result})
                                    resolve()
                                }
                        }else{
                            Modal.info({
                                title:"选项内容不能为空~"
                            })
                        }
                        break
                    case "shortanswer":
                    if(gapAnswerList.size!==0&&(gapAnswerList.toJS().findIndex((value)=>value.length===0)===-1)){
                        result = {
                            ...values,
                            answer:gapAnswerList,
                        }
                        changeLittleQuestion({quizId,id,littleId,result})
                        resolve()
                    }else{
                        Modal.info({
                            title: "请设置填空答案~"
                        })
                    }
                    break
                    case "essay":
                    if(askQuestionAnswer!==""){
                        result = {
                            ...values,
                            answer:askQuestionAnswer,
                        }
                        changeLittleQuestion({quizId,id,littleId,result})
                        resolve()
                    }else{
                        Modal.info({
                            title:"请设置正确答案~"
                        })
                    }
                        break
                    case "truefalse":
                        result = {
                            ...values,
                        }
                        changeLittleQuestion({quizId,id,littleId,result})
                        resolve()
                        break
                    case "coderunner":
                    if(codeQuestionAnswer!==""){
                        result = {
                            ...values,
                            answer:codeQuestionAnswer,
                        }
                        changeLittleQuestion({quizId,id,littleId,result})
                        resolve()
                    }else{
                        Modal.info({
                           title:"请设置编程题答案"
                        })
                    }
                        break
                    default :return null
                }
            }else if(quesContent===""||quesContent===undefined){
                Modal.info({
                    title: "试题内容不能为空~"
                })
            }
            });
       })
        
    }
    render(){
        const {editData} = this.props
        const { getFieldDecorator} = this.props.form;
        const {questionType, gapCount } = this.state
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 3 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
          };
        const dynamicInputGroup=(questionType)=>{
            switch(questionType){
                case 'multichoice':{
                    return (
                        <Form.Item label="设置正确答案">
                            <EditQuestionOption onRef={this.onRef} form={this.props.form}/>
                            <Button
                                     onClick={()=>this.handleAddOption()}
                                     type="primary"
                                     size="small">新增
                                 </Button> 
                             <Button 
                                     onClick={()=>this.handleDeleteOption()}
                                     type="danger" 
                                     size="small">删除
                                 </Button>
                        </Form.Item>
                    )
                }
                case 'truefalse':{
                    return (
                        <Form.Item label="选项">
                            {getFieldDecorator('answer', {
                                initialValue:editData.get("answer")||"正确",
                                rules: [{
                                required: true, message: '请设置正确答案',
                            }],
                            })(
                                <RadioGroup name="radiogroup">
                                    <Radio value="正确">正确</Radio>
                                    <Radio value="错误">错误</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                    )
                }
                case 'shortanswer':{
                    return (
                        <div>
                            <Form.Item
                                label="正确答案"
                            >
                                <div>
                                    {gapCount}
                                </div>
                                <Button
                                    onClick={()=>this.handleAddGap()}
                                    size="small" 
                                    type="primary">添加答案</Button>
                                <Button
                                    onClick={()=>this.handleDeleteGap()}
                                    size="small" 
                                    type="danger">删除答案</Button>
                            </Form.Item>
                        </div>
                    )
                }
                case 'essay':{
                    return (
                        <Form.Item label="标准答案">
                            <EditQuestionAsk />
                        </Form.Item>
                    )
                }
                case 'coderunner':{
                    return (
                        <Form.Item label="标准答案">
                            <EditQuestionCode />
                        </Form.Item>
                    )
                }
                default: return null
            }
        }
    //设置判断题选项
        return (
            <Form
                className="edit-form"
                {...formItemLayout}
                >
                <Row>
                    <Col span={24}>
                    <Form.Item
                        label="试题类型"
                        >
                        {getFieldDecorator('type', {
                            initialValue:editData.get("type")||'multichoice',
                            rules: [{
                            required: true, message: '请选择试题类型',
                            }],
                        })(
                            <Select style={{width:150}}
                                onSelect={(value)=>this.selectChange(value)}
                            >
                            <Option value="multichoice">选择题</Option>
                            <Option value="shortanswer">填空题</Option>
                            <Option value="truefalse">判断题</Option>
                            <Option value="essay">简答题</Option>
                            <Option value="coderunner">编程题</Option>
                        </Select>
                        )}
                    </Form.Item>
                    </Col>
                    <Col 
                        span={24}>
                        <Form.Item
                            label="试题名称"
                        >
                            {getFieldDecorator('questionName', {
                                initialValue:editData.get("questionName")||'',
                                rules: [{
                                required: true, message: '请输入试题名称',
                            }],
                            })(
                                <Input />
                        )}
                        </Form.Item>
                    </Col>
                    <Col 
                        span={24}>
                        <Form.Item
                            label="试题内容"
                        >
                            <Editor
                                apiKey='hw55h0in2ukehmyghv9ckevrizr57j7ua0hxj8qfbpqvf4u9'
                                init={{...inits}}
                                initialValue={editData.get("quesContent")}
                                onChange={(e)=>this.handleChangeContent(e)}
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        span={24}>
                        {/* 动态生成 */}
                        {dynamicInputGroup(questionType)}
                    </Col>
                    <Col 
                        span={24}>
                        <Form.Item
                            label="分值"
                        >
                            {getFieldDecorator('score', {
                                initialValue:editData.get("score")||'',
                                rules: [{
                                required: true, message: '请设置分值',
                            }],
                            })(
                            <InputNumber />
                        )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            
        )
    }
}
export default Form.create()(EditQuestion);