const defaultUrl = "180.201.143.230"

//1获取课程列表
export const get_course_list = "http://"+defaultUrl+":8080/v2/assignCourse/getCourse"
//2获取考试信息加题目
export const get_a_quiz = "http://"+defaultUrl+":8080/v2/assignQuiz/getQuiz"
//3提交考试信息
export const submit_quiz_message = "http://"+defaultUrl+":8080/v2/assignQuiz/assQuiz"
//4上传word题目文档
export const upload_little_question = "http://"+defaultUrl+":8080/v2/uploadFile/upload"

//5新增大题
export const add_big_question = "http://"+defaultUrl+":8080/v2/assignOrder/addOrder"
//6删除大题
export const delete_big_question = "http://"+defaultUrl+":8080/v2/assignOrder/delOrder"
//7删除小题
export const delete_little_question = "http://"+defaultUrl+":8080/v2/assignQues/delQues"
//8编辑或者新增小题
export const ass_little_question = "http://"+defaultUrl+":8080/v2/assignQues/assQues"
//9编辑答题的标题
export const edit_big_title = "http://"+defaultUrl+":8080/v2/assignOrder/updateOrder"
//10提交课程信息
export const submit_course_message = "http://"+defaultUrl+":8080/v2/assignCourse/addCourse"
//11提交完整试卷
export const submit_whole_paper = "http://"+defaultUrl+":8080/v2/assignPaper/assPaper"
//12上传word大题文档
export const upload_big_question = 'https://www.easy-mock.com/mock/5cbe8576c4e7d723ae95588d/set_test/get_big_question'