import React from 'react'
import {changeAskAnswer } from '../../redux/reducers/common'
import { Editor } from '@tinymce/tinymce-react';
import {inits} from '../../utils/tinymce/config'
import {connect} from 'react-redux'
@connect(
    state=>({
        askQuestionAnswer:state.common.get("askQuestionAnswer")
    }),
    {
        changeAskAnswer
    }
)
class EditQuestionAsk extends React.Component{
    handleChangeAnswer=(e)=>{
      console.log(e.target.getContent())
        const {changeAskAnswer} = this.props
        changeAskAnswer(e.target.getContent())
    }
    render(){
        const {askQuestionAnswer} = this.props
        return (
            <Editor
            apiKey='hw55h0in2ukehmyghv9ckevrizr57j7ua0hxj8qfbpqvf4u9'
            initialValue={askQuestionAnswer}
            init={{...inits}}
            onChange={this.handleChangeAnswer}
          />
        )
    }
}

export default EditQuestionAsk