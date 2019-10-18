import {fromJS} from "immutable";
import {createAction,handleActions} from 'redux-actions'
import axios from '../../utils/axios'
import * as address from '../../utils/api/address'
const GET_COURSE_LIST = "GET_COURSE_LIST"
const initState = fromJS({
    courseList:[]
})

export default handleActions({
    GET_COURSE_LIST:(state,action)=>(
        state.set("courseList",action.payload)
     ),
    
},initState)

//获取课程列表
export const getCourseList = createAction(GET_COURSE_LIST,function(teacherId){
    return new Promise((resolve,reject)=>{
        axios.ajax({
            isShowLoading:true,
            url:address.get_course_list,
            data:{
                teacherId
            }
        }).then((res)=>{
            resolve(fromJS(res))
        })
    })
})
