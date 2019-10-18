import {fromJS} from "immutable";
import {createAction,handleActions} from 'redux-actions'
import axios from '../../utils/axios'
import * as address from '../../utils/api/address'
const SUBMIT_MESSAGE = "SUBMIT_MESSAGE"
const SET_STEPS = "SET_STEPS"
const GET_FILE_DATA = "GET_FILE_DATA"
const ADD_BIG_QUESTION = "ADD_BIG_QUESTION"
const DELETE_BIG_QUESTION = "DELETE_BIG_QUESTION"
const DELETE_LITTLE_QUESTION = "DELETE_LITTLE_QUESTION"
const SET_LITTLE_ID = "SET_LITTLE_ID"
const CHANGE_LITTLE_QUESTION = "CHANGE_LITTLE_QUESTION"
const GET_FULL_PAPER = "GET_FULL_PAPER"
const CHANGE_QUESTION_TITLE = "CHANGE_QUESTION_TITLE"
const RESET_PAPER = "RESET_PAPER"
const SUBMIT_RESULT_DATA = "SUBMIT_RESULT_DATA"
const GET_DOWNLOAD_DATA = "GET_DOWNLOAD_DATA"
const initState = fromJS({
    current: 0, //当前步骤
    littleId:null,//当前修改的小题，若没有则为新增
    paperMessage:{},
    paperData:{},//试卷信息
    editData:{}//正在修改的题目数据
})

export default handleActions({
    SUBMIT_MESSAGE:(state,action)=>(
        state.set("paperMessage",action.payload)
     ),
    SET_STEPS:(state,action)=>(
        state.merge(action.payload)
    ),
    GET_FILE_DATA:(state,action)=>(
        state.mergeDeep({"paperData":{[action.payload.id]:{"children":action.payload.children}}})
    ),
    ADD_BIG_QUESTION:(state,action)=>(
        state.mergeDeep({"paperData":action.payload})
    ),
    DELETE_BIG_QUESTION:(state,action)=>(
        state.set("paperData",action.payload)
    ),
    DELETE_LITTLE_QUESTION:(state,action)=>{
        return state.deleteIn(["paperData",action.payload.bigId,"children",action.payload.littleId])
    },
    SET_LITTLE_ID:(state,action)=>{
        if(action.payload.littleId){
            let _editData = state.getIn(["paperData",action.payload.bigId,"children",action.payload.littleId])
            console.log(_editData)
            return state.set("editData",_editData).set("littleId",action.payload.littleId)
        }else{
            console.log("no")
            return state.set("littleId",null).set("editData",fromJS({}))
        }
    },
    CHANGE_LITTLE_QUESTION:(state,action)=>(
        state.setIn(["paperData",action.payload.bigId,"children",action.payload.littleId],action.payload.result)
    ),
     GET_FULL_PAPER:(state,action)=>(
        state.merge(action.payload)
     ),
     RESET_PAPER:(state,action)=>(
        state.set("paperMessage",action.payload).set("paperData",action.payload)
     ),
     CHANGE_QUESTION_TITLE:(state,action)=>(
        state.setIn(["paperData",action.payload.order,"name"],action.payload.name)
     ),
     GET_DOWNLOAD_DATA:(state,action)=>(
         state.mergeDeep({"paperData":action.payload})
     )
},initState)

//提交试卷信息
export const submitMessage = createAction(SUBMIT_MESSAGE,function(value){
    const {testName,quizId,whichCourse,quizTime,begin,end} = value
    return new Promise((resolve,reject)=>{
        axios.ajax({
            isShowLoading:true,
            url:address.submit_quiz_message,
            data:{
                quizId,  //判断quizId是否为null 为null则新增
                testName,
                whichCourse,
                quizTime,
                begin,
                end

            }
        }).then((res)=>{
            resolve(fromJS({...value,quizId:res.quizId}))
        })
    })
})

//设置当前步骤
export const setSteps = createAction(SET_STEPS,function(data){
    return fromJS(data)
})

//获取上传的文件题目
export const getFileData = createAction(GET_FILE_DATA,function(id,questionData){
    return new Promise((resolve,reject)=>{
            let children = {}
            questionData.map((item)=>{
                children[item.questionId]={
                    ...item
                }
                return children
            })
            resolve({
                id,
                children:fromJS(children)
            })
    })
})

//增加大题
export const addBigQuestion = createAction(ADD_BIG_QUESTION,function(quizId){
    return new Promise((resolve,reject)=>{
        axios.ajax({
            isShowLoading:true,
            url:address.add_big_question,
            data:{
                quizId
            }
        }).then((res)=>{
            const {slot} = res
            resolve(fromJS({
                [slot]:{
                    order:slot,
                    name:"",
                    description:'',
                    children:{}
                }
            }))
        })
    })
})

//删除大题
export const deleteBigQuestion = createAction(DELETE_BIG_QUESTION,function(data){
    const {paperData,quizId,id} =data
    return new Promise((resolve,reject)=>{
        axios.ajax({
            isShowLoading:true,
            url:address.delete_big_question,
            data:{
                quizId,
                slot:Number(id)
            }
        }).then((res)=>{
            resolve(paperData.delete(id))
        })
    })
})

//删除小题

export const deleteLittleQuestion = createAction(DELETE_LITTLE_QUESTION,function(data){
    const {quizId,id,littleId} = data
    return new Promise((resolve,reject)=>{
        axios.ajax({
            isShowLoading:true,
            url:address.delete_little_question,
            data:{
                quizId,
                slot:Number(id),
                questionId:Number(littleId)
            }
        }).then((res)=>{
            resolve({
                littleId,
                bigId:id,
            })
        })
    })
})

//设置小题id判断当前修改的小题
export const setlittleId = createAction(SET_LITTLE_ID,function(bigId,littleId){
    return {
        bigId,
        littleId
    }
})

//新增&&编辑小题
export const changeLittleQuestion = createAction(CHANGE_LITTLE_QUESTION,function(data){
    const {quizId,id,littleId,result} = data
    return new Promise((resolve,reject)=>{
        axios.ajax({
            isShowLoading:true,
            url:address.ass_little_question,
            data:{
                quizId,
                result,
                slot:Number(id),
                questionId:littleId,//为null新增，否则更新
            }
        }).then((res)=>{
            const _littleId = res.questionId
            result.questionId=(littleId||_littleId).toString()
            resolve({
                littleId:(littleId||_littleId).toString(),//判断littleId是否有值，没有则用全局变量
                bigId:id,
                result:fromJS(result)
            })
        })
    })
})


//获取已存考试信息
export const editAndGetFullPaper = createAction(GET_FULL_PAPER,function(quizId){
    return new Promise((resolve,reject)=>{
        axios.ajax({
            isShowLoading:true,
            url:address.get_a_quiz,
            data:{
                quizId
            }
        }).then((res)=>{
            console.log(res)
            const getChildren=(children)=>{
                let data = {}
                children.map((child)=>(
                    data[child.questionId]={
                        ...child
                    }
                ))
                return data
            }
            // res  testName, whichCourse, paperData:[],
            let paperMessage = {
                quizId,
                testName:res.testName,
                whichCourse:res.whichCourse,
                begin:res.quizLastTime[0],
                end:res.quizLastTime[1],
                quizTime:res.quizTime
            }
            let paperData ={}
            res.paperData.map((item,index)=>{
                  return paperData[item.slot]={
                        order:item.slot,
                        name:item.name,
                        description:item.descript,
                        children:getChildren(item.children)
                    }
            })
            resolve({
                paperMessage:fromJS(paperMessage),
                paperData:fromJS(paperData)
            })
        })
    })
})

//回首页重置考试信息

export const resetPaper = createAction(RESET_PAPER,function(){
    return fromJS({})
})

//设置大题标题
export const changeQuestionTitle = createAction(CHANGE_QUESTION_TITLE,function(data){
    const {quizId,order,name} = data
    return new Promise((resolve,reject)=>{
        axios.ajax({
            isShowLoading:true,
            url:address.edit_big_title,
            data:{
                quizId,
                name,
                slot:order
            }
        }).then((res)=>{
            resolve({
                name,
                order:order.toString(),
            })
        })
    })
})

//提交完整的试题
export const submitResultData = createAction(SUBMIT_RESULT_DATA,function(quizId,resultData){
    return new Promise((resolve,reject)=>{
        axios.ajax({
            isShowLoading:true,
            url:address.submit_whole_paper,
            data:{
                quizId,
                resultData
            }
        }).then((res)=>{
            resolve(res)
        })
    })
})

//下载大题数据
export const getDownloadData = createAction(GET_DOWNLOAD_DATA,function(downloadData){
    return new Promise((resolve,reject)=>{
        const getChildren=(children)=>{
            let data = {}
            children.map((child)=>(
                data[child.questionId]={
                    ...child
                }
            ))
            return data
        }
        let paperData ={}
        downloadData.map((item,index)=>{
            return paperData[item.slot]={
                order:item.slot,
                name:item.name,
                children:getChildren(item.children)
            }
        })
        resolve(fromJS(paperData))
    })
})