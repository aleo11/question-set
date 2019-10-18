import React from 'react'
import { Checkbox, Row, Col, Input } from 'antd'
import {changeOptionList, changeOptionAnswer } from '../../redux/reducers/common'
import { Editor } from '@tinymce/tinymce-react';
import {inits} from '../../utils/tinymce/config'
import {connect} from 'react-redux'

@connect(
    state=>({
        optionAnswerList:state.common.get("optionAnswerList"),
        selectQuestionAnswer:state.common.get("selectQuestionAnswer")
    }),
    {
        changeOptionList,
        changeOptionAnswer
    }
)
class EditQuestionOption extends React.Component{

    componentDidMount(){
        this.props.onRef(this)
    }

    handleChangeOption(e,index){
        e.preventDefault()
        const {optionAnswerList,changeOptionList} = this.props
        changeOptionList(optionAnswerList.set(index,e.target.getContent()))
    }

    handleChangeCheckBox(checkedValue){
       const {changeOptionAnswer} = this.props
       changeOptionAnswer(checkedValue)
    }
    render(){
        const {optionAnswerList,selectQuestionAnswer} = this.props
        return (
            <Checkbox.Group
                ref="checkbox"
                value={selectQuestionAnswer.toJS()}
                // value={this.state.checked}
                onChange={(checkedValue)=>this.handleChangeCheckBox(checkedValue)}
                style={{ width: '100%' }}>
                {optionAnswerList.map((item,index)=>(
                    <Row key={index} className="answer-options">
                        <Col span={2}>
                            <Checkbox value={String.fromCharCode(65+index)}>{String.fromCharCode(65+index)}</Checkbox>
                        </Col>
                        <Col span={20}>
                            {/* <Input value={item} onChange={(e)=>this.handleChangeOption(e.target.value,index)}/> */}
                            <Editor
                                apiKey='hw55h0in2ukehmyghv9ckevrizr57j7ua0hxj8qfbpqvf4u9'
                                initialValue={item}
                                init={{...inits}}
                                onChange={(e)=>this.handleChangeOption(e,index)}
                            />
                        </Col>
                    </Row>
                ))}
            </Checkbox.Group>
        )
    }
}

export default EditQuestionOption