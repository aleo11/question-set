import React from 'react'
import {Card,Button, Row, Col,Modal,Upload,message,Icon} from 'antd'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {setSteps, submitMessage, addBigQuestion,submitResultData, getDownloadData} from '../../redux/reducers/test'
import AddQuestion from '../../component/test_addquestion'
import * as address from '../../utils/api/address'
import './style.less'
const Dragger = Upload.Dragger;

@withRouter
  @connect(
      state=>({
          current:state.test.get("current"),
          paperData:state.test.get("paperData"),
          quizId:state.test.getIn(["paperMessage","quizId"])
      }),
      {
        setSteps,
        submitMessage,
        addBigQuestion,
        submitResultData,
        getDownloadData
      }
  )
class TestPaper extends React.Component{
    state = {
        visibleDownload:false
    }
    prev() {
        const {current,setSteps} = this.props
        setSteps({current:current-1})
      }
      handleNext(){
        const {current,setSteps,paperData,submitResultData,quizId} = this.props
        let _paperData = paperData.toJS()
        let resultData =[]
        let i = 1
        for(let j in _paperData){
            _paperData[j].order = i++
            let child = _paperData[j].children
            let x = 1
            Object.keys(child).forEach(function(key){
                child[x++] = child[key]
                delete child[key]
            })
            resultData.push( _paperData[j])
        }
        submitResultData(quizId,resultData).then(()=>{
            setSteps({current:current+1})
        })
      }
    allDone(){
        const {paperData,submitResultData,quizId} = this.props
        let _paperData = paperData.toJS()
        let resultData =[]
        let i = 1
        for(let j in _paperData){
            _paperData[j].order = i++
            let child = _paperData[j].children
            let x = 1
            Object.keys(child).forEach(function(key){
                child[x++] = child[key]
                delete child[key]
            })
            resultData.push( _paperData[j])
        }
        submitResultData(quizId,resultData).then(()=>{
            this.props.history.push('/')
        })
    }

    handleDownload(which){
        this.setState({
            [which]:true
        })
    }

    hideModal(which){
        this.setState({
            [which]:false
        })
    }


    handleClickAdd(){
        const {addBigQuestion,quizId} = this.props
        addBigQuestion(quizId)
    }
    addedQuestion(){
        let getQuestionType = (originType)=>{
            switch(originType){
                case "multichoice" :
                    return "选择题"
                case "truefalse" :
                    return "判断题"
                case "shortanswer" :
                    return "填空题"
                case "essay" :
                    return "简答题"
                case "coderunner" :
                    return "编程题"
                default :
                    return null
            }
        }
        const {paperData} = this.props
        let _paperData = paperData.toJS()
        let questionList = []
        for(let key in _paperData){
            let c_slot = 1
            let dataSource = []
            let item = _paperData[key]
           let children =  _paperData[key].children
           for(let j in children){
               dataSource.push(
                {
                    key: j,
                    slot: c_slot++,
                    type: getQuestionType(children[j].type),
                    content: children[j].quesContent,
                    answer:children[j].answer,
                    score:children[j].score
                }
            )
           }
            questionList.push(
                <AddQuestion id={key} key={key} order={item.order} name={item.name} description={item.description} dataSource={dataSource} />
            )
        }
        return questionList
    }

    render(){
        const {quizId,getDownloadData} = this.props
        const questionNum = ()=>{
            const {paperData} = this.props
            return paperData.size
            // return Object.keys(paperData).length
        }
        const sumScore = () =>{
            const {paperData} = this.props
            let _paperData = paperData.toJS()
            let score = 0
            for(let key in _paperData){
               let children =  _paperData[key].children
               for(let j in children){
                   score += children[j].score
            }
        }
        return score
    }
    const props = {
        name: quizId.toString(),
        multiple: false,
        action: address.upload_big_question,
        onChange:(info)=> {
          const status = info.file.status;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
              getDownloadData(info.file.response.data).then(()=>{
                message.success(`${info.file.name} 文件上传成功`);
              })
              console.log(info)
              // this.setState({
              //   // ableAdd:false,
              //   fileId:info.file.response.id
              // })
          } else if (status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
          }
        },
      };

        return(
            <div className="design-paper">
                <Card title={
                    <Row>
                        <Col span={2}>
                            <span style={{fontSize:"1.5rem", fontWeight:600}}>设计试卷</span> 
                        </Col>
                        <Col push={14}  span={4}>
                        <div>共{questionNum()}大题，共{sumScore()}分</div>
                        </Col>
                        <Col push={14} span={2}>
                        <Button
                            onClick={()=>this.handleDownload("visibleDownload")} 
                            style={{float:"right"}}>导入大题</Button>
                            <Modal
                                footer={
                                    <div>
                                        <Button onClick={()=>this.hideModal("visibleDownload")}>关闭</Button>
                                        {/* <Button type="primary" loading={loading} disabled={ableAdd} onClick={this.getUploadFileData}>开始导入</Button> */}
                                    </div>
                                }
                                onCancel={()=>this.hideModal("visibleDownload")}
                                title="大题导入"
                                visible={this.state.visibleDownload}
                                >
                                <Dragger {...props}>
                                    <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                    </p>
                                        上传试题文件
                                </Dragger>
                            </Modal>
                       </Col>
                       <Col push={14} span={2}>
                        <Button
                            onClick={()=>this.handleClickAdd()}
                            type="primary" 
                            style={{float:"right"}}>新增大题</Button>
                       </Col>
                    </Row>}>
                    {
                        this.addedQuestion()
                    }
                </Card>
                <Button style={{marginTop:8, marginLeft: 8 }} type="primary" onClick={()=>this.allDone()}>保存</Button>
                <Button style={{marginTop:8, marginLeft: 8 }} type="primary" onClick={()=>this.handleNext()}>继续生成试卷</Button>
                <Button style={{marginTop:8, marginLeft: 8 }} onClick={() => this.prev()}>
                    上一步
                </Button>
            </div>
        )
    }
}
export default TestPaper