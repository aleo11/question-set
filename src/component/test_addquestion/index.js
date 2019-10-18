import React from 'react'
import {Table,Row,Button, Modal,Col,InputNumber,Upload, Icon,Input, message, Popconfirm} from 'antd'
import {getFileData,deleteBigQuestion,deleteLittleQuestion,setlittleId,changeQuestionTitle} from '../../redux/reducers/test'
import {clearInputAnswer} from '../../redux/reducers/common'
import EditQuestion from './EditQuestion'
import { connect } from 'react-redux';
import './style.less'
import * as address from '../../utils/api/address'
const Dragger = Upload.Dragger;

@connect(
    state=>({
      paperData:state.test.get("paperData"),
      quizId:state.test.getIn(["paperMessage","quizId"])
    }),
    {
        getFileData,
        deleteBigQuestion,
        deleteLittleQuestion,
        setlittleId,
        clearInputAnswer,
        changeQuestionTitle
    }
)

class AddQuestion extends React.Component{
    state = {
         visibleEdit: false,
         visibleUpload: false,
         ableAdd:true,
         fileId:'',
         visibleEditTitle:false,
         name:''
        }
    onRef = (ref) =>{
      this.child = ref
    }

    showModal(visible,littleId) {
      const {id,setlittleId} = this.props
      console.log(id,littleId)
      setlittleId(id,littleId)//根据传过来的小题id是否有值来判断是新增还是编辑
      this.setState({
        [visible]: true, 
      });
    }
    hideModal(visible){
     if(visible==="visibleEdit"){
       this.props.clearInputAnswer()
     } 
       this.setState({
         [visible]: false,
       });
    }
    handleClickDelete(id){
      const {deleteBigQuestion,paperData,quizId} = this.props
      deleteBigQuestion({paperData,quizId,id}).then(()=>{
        message.info("已删除")
      })
    }

    DeleteLittleQuestion=(littleId)=>{
      const {deleteLittleQuestion,id,quizId} = this.props
      deleteLittleQuestion({quizId,id,littleId})
    }

    // getUploadFileData = ()=>{
    //   // this.setState({
    //   //   loading:true
    //   // })
    //     const {getFileData,id} = this.props
    //     const {fileId} = this.state
    //     getFileData(fileId,id).then(()=>{
    //       message.info("导入成功")
    //       this.setState({
    //         loading:false
    //       })
    //     })
    // }
    //编辑小题
    
    confirm=()=>{
      this.handleClickDelete(this.props.id)
    }

    //新增试题,根据大题id判断是那一道大题
    handClickAdd(){
      const {id} = this.props
      this.child.submitChange(id).then(()=>{
        this.hideModal("visibleEdit")
      }) 
    }
    //编辑标题
    editQuestionTitle(){
      const {name} = this.props
      this.setState({
        name,
        visibleEditTitle:true
      })
    }
    handleConfirm(){
      const {changeQuestionTitle,quizId,order} = this.props
      const {name} = this.state
      changeQuestionTitle({quizId,order,name}).then(()=>{
          this.setState({
          visibleEditTitle:false
        })
      })  
    }
    handleCancel(){
      this.setState({
        visibleEditTitle:false
      })
    }
    handleChangeQuestionTitle(e){
      this.setState({
        name:e.target.value
      })
    }

    render(){
      const {quizId,getFileData,id,paperData} = this.props
      const sumScore = ()=>{
        let score = 0
        console.log()
        paperData.getIn([id,"children"]).map((item,index)=>{
          return score += item.get("score") 
        })
        console.log(score)
        return score
      }
        // const {ableAdd,loading} = this.state
        const columns = [{
          title: '题号',
          dataIndex: 'slot',
          key: 'slot',
          width:50
        }, {
          title: '试题类型',
          dataIndex: 'type',
          key: 'type',
          width:110
        }, {
          title: '试题内容',
          width:500,
          dataIndex: 'content',
          key: 'content',
        }, {
          title: '标准答案',
          dataIndex: 'answer',
          key: 'answer',
        }, {
          title: '分数',
          dataIndex: 'score',
          key: 'score',
          width:100,
          render:(record)=>{
              return (
                  <InputNumber disabled value={record} />
              )
          }
        },{
          title: '操作',
          key: 'action',
          width:100,
          render:(record)=>{
              return (
                  <div className={"do-actions"}>
                      <svg className="icon table-action" aria-hidden="true"
                        onClick={()=>this.showModal("visibleEdit",record.key)}
                      >
                          <use xlinkHref="#icon-bianji1"></use>
                      </svg>
                      <Popconfirm title="确定删除本道小题吗？" onConfirm={()=>this.DeleteLittleQuestion(record.key)}  okText="确认" cancelText="取消">
                      <svg className="icon table-action" aria-hidden="true"
                      >
                          <use xlinkHref="#icon-shanchu"></use>
                      </svg>
                      </Popconfirm>
                  </div>   
              )
          }
        }];
        const props = {
            multiple: false,
            action: address.upload_little_question,
            onChange:(info)=> {
              const status = info.file.status;
              if (status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (status === 'done') {
                console.log(info.file.response.data.size)
                if(info.file.response.data){
                  message.info("题目格式不正确！")
                }else{
                  getFileData(id,info.file.response.data).then(()=>{
                    message.success(`${info.file.name} 文件上传成功`);
                  })
                }
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
            <Table
                pagination={{pageSize:5,hideOnSinglePage:true}}
                className="question-table"
                title={(currentPageData)=>(
                    <div>
                    <Row type="flex" align="bottom">
                        <Col span={12}>
                          <div className="table-title">
                            <Popconfirm
                              placement="bottom"
                              onConfirm={()=>this.handleConfirm()}
                              onCancel={()=>this.handleCancel()}
                              visible={this.state.visibleEditTitle}
                              title={<Input value={this.state.name} onChange={(e)=>this.handleChangeQuestionTitle(e)}/>}
                              icon={''}
                              okText="确定" 
                              cancelText="取消">
                              {this.props.name}
                            </Popconfirm>
                            (共<span style={{color:"red"}}>
                                {paperData.getIn([id,"children"]).size}
                              </span>
                                道试题，共
                              <span style={{color:"red"}}>
                                {sumScore()}
                            </span>分)
                            <svg className="icon edit-title" aria-hidden="true"
                              onClick={()=>this.editQuestionTitle()}
                            >
                              <use xlinkHref="#icon-ziyuan1"></use>
                            </svg>
                          </div>
                        </Col>
                        <Col span={12}>
                        <Popconfirm title="确定删除本道大题吗？" onConfirm={this.confirm}  okText="确认" cancelText="取消">
                            <Button
                                className="table-button"
                                size="small"
                            >
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-xingzhuanggongnengtubiao-"></use>
                                </svg>
                                删除大题</Button>
                        </Popconfirm>
                            <Button
                                className="table-button"
                                size="small"
                                onClick={()=>this.showModal("visibleUpload")}
                            >
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-upload"></use>
                                </svg>
                                导入试题</Button>
                                <Modal
                                    footer={
                                        <div>
                                            <Button onClick={()=>this.hideModal("visibleUpload")}>关闭</Button>
                                            {/* <Button type="primary" loading={loading} disabled={ableAdd} onClick={this.getUploadFileData}>开始导入</Button> */}
                                        </div>
                                    }
                                    onCancel={()=>this.hideModal("visibleUpload")}
                                    title="试题导入"
                                    visible={this.state.visibleUpload}
                                    >
                                    <Dragger {...props}>
                                    <p className="ant-upload-drag-icon">
                                    <Icon type="inbox"/>
                                    </p>
                                        上传试题文件
                                    </Dragger>
                                </Modal>
                            <Button
                              onClick={()=>this.showModal("visibleEdit")}
                                className="table-button"
                                size="small"
                            >
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-zengjia"></use>
                                </svg>
                                新增试题</Button>
                                <Modal
                                    destroyOnClose={true}
                                    centered={true}
                                    width="80vw"
                                    footer={
                                        <div>
                                            <Button onClick={()=>this.hideModal("visibleEdit")}>取消</Button>
                                            <Button type="primary" onClick={()=>this.handClickAdd()}>新增</Button>
                                        </div>
                                    }
                                    onCancel={()=>this.hideModal("visibleEdit")}
                                    title="编辑试题"
                                    visible={this.state.visibleEdit}
                                    >
                                  <EditQuestion hideModal={()=>this.hideModal()} onRef={this.onRef}/>
                                </Modal>
                        </Col>
                    </Row>
                    {this.props.description===''?null:<Row>{this.props.description}</Row>}
                    </div>
                )}
                size="small"
                bordered={true}
                dataSource={this.props.dataSource}
                columns={columns} />
        )
    }
}
export default AddQuestion