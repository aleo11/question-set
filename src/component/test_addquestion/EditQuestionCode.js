import React from 'react'
import {changeCodeAnswer } from '../../redux/reducers/common'
import { Editor } from '@tinymce/tinymce-react';
import {inits} from '../../utils/tinymce/config'
import {connect} from 'react-redux'

@connect(
    state=>({
        codeQuestionAnswer:state.common.get("codeQuestionAnswer")
    }),
    {
        changeCodeAnswer
    }
)
class EditQuestionCode extends React.Component{
    handleChangeAnswer(e){
        const {changeCodeAnswer} = this.props
        changeCodeAnswer(e.target.getContent())
    }
    render(){
        const {codeQuestionAnswer} = this.props
        return (
            <Editor
                apiKey='hw55h0in2ukehmyghv9ckevrizr57j7ua0hxj8qfbpqvf4u9'
                initialValue={codeQuestionAnswer}
                init={{...inits}}
                onChange={(e)=>this.handleChangeAnswer(e)}
            />
        )
    }
}

export default EditQuestionCode