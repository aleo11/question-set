import {fromJS} from "immutable";
import {createAction,handleActions} from 'redux-actions'
import axios from '../../utils/axios'
import * as address from '../../utils/api/address'
const SUBMIT_COURSE_MESSAGE = "SUBMIT_COURSE_MESSAGE"
const initState = fromJS({
 
})

export default handleActions({
    SUBMIT_COURSE_MESSAGE:(state,action)=>({
         ...state
     }),
},initState)
//提交课程信息
export const submitCourseMessage = createAction(SUBMIT_COURSE_MESSAGE,function(id,value){
    const {courseInfo,courseName,beginTime,courseNickName,courseType,studentInfo} = value
    return new Promise((resolve,reject)=>{
        axios.ajax({
            isShowLoading:true,
            url:address.submit_course_message,
            data:{
                courseInfo,
                courseName,
                beginTime,
                courseNickName,
                courseType,
                studentInfo,
                teacherId:id,
            }
        }).then((res)=>{
            resolve()
        })
    })
})