import {fromJS} from "immutable";

import {createAction,handleActions} from 'redux-actions'
const CHANGE_GAP_ANSWER = "CHANGE_GAP_ANSWER"
const CLEAR_INPUT_ANSWER = "CLEAR_INPUT_ANSWER"
const CHANGE_OPTION_LIST = "CHANGE_OPTION_LIST"
const CHANGE_OPTION_ANSWER = "CHANGE_OPTION_ANSWER"
const CHANGE_ASK_ANSWER = "CHANGE_ASK_ANSWER"
const CHANGE_CODE_ANSWER = "CHANGE_CODE_ANSWER"
const CHANGE_QUESTION_CONTENT = "CHANGE_QUESTION_CONTENT"
const initState = fromJS({
    quesContent:'',
    gapAnswerList:[],
    optionAnswerList:[],
    selectQuestionAnswer:[],
    askQuestionAnswer:'',
    codeQuestionAnswer:''
})

export default handleActions({
    CHANGE_GAP_ANSWER:(state,action)=>(
        state.set("gapAnswerList",action.payload)
    ),
    CLEAR_INPUT_ANSWER:(state,action)=>(
        state.merge({
            gapAnswerList:action.payload,
            optionAnswerList:action.payload,
            selectQuestionAnswer:action.payload,
            askQuestionAnswer:'',
            codeQuestionAnswer:'',
            quesContent:''
        })
    ),
    CHANGE_OPTION_LIST:(state,action)=>(
        state.set("optionAnswerList",action.payload)
    ),CHANGE_OPTION_ANSWER:(state,action)=>(
        state.set("selectQuestionAnswer",action.payload)
    ),CHANGE_ASK_ANSWER:(state,action)=>(
        state.set("askQuestionAnswer",action.payload)
    ),CHANGE_CODE_ANSWER:(state,action)=>(
        state.set("codeQuestionAnswer",action.payload)
    ),CHANGE_QUESTION_CONTENT:(state,action)=>(
        state.set("quesContent",action.payload)
    )
},initState)


//修改问题内容
export const changeQuestionContent = createAction(CHANGE_QUESTION_CONTENT,function(data){
    console.log(data)
    return fromJS(data)
})
//修改填空题答案
export const changeGapAnswer = createAction(CHANGE_GAP_ANSWER,function(data){
    return fromJS(data)
})
//清除输入数据
export const clearInputAnswer = createAction(CLEAR_INPUT_ANSWER,function(){
    return fromJS([])
})

//修改选择题选项
export const changeOptionList = createAction(CHANGE_OPTION_LIST,function(data){
    return data
})

//修改选择题答案啊
export const changeOptionAnswer = createAction(CHANGE_OPTION_ANSWER,function(data){
    return fromJS(data)
})

//修改问答题答案
export const changeAskAnswer = createAction(CHANGE_ASK_ANSWER,function(data){
    return fromJS(data)
})

//修改编程题答案
export const changeCodeAnswer = createAction(CHANGE_CODE_ANSWER,function(data){
    return fromJS(data)
})