import React, { Component } from 'react';
import {Row, Col, Card, Collapse, List, Avatar, Button, Skeleton,} from 'antd'
import {getCourseList,} from '../../redux/reducers/main'
import {editAndGetFullPaper,setSteps, resetPaper} from '../../redux/reducers/test'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import './style.less'

const Panel = Collapse.Panel;
@connect(
    state=>({
        courseList:state.main.get("courseList"),
        current:state.test.get("current")
    }),
    {
        getCourseList,
        editAndGetFullPaper,
        setSteps,
        resetPaper
    }
)
class Main extends Component {
    state={
        data: [],
        list: [],
    }
componentDidMount(){
    // let teacherId = this.props.match.params.teacherId
    let teacherId = 1 //获取一个教师id
    const {getCourseList,setSteps,current,resetPaper} = this.props
   if(current!==0){
       setSteps({current:0})
   }
   resetPaper() //重置考试
    getCourseList(teacherId).then((res)=>{
       let data = res.payload.map((item,index)=>
            <Panel header={item.get("courseName")} key={index}>
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={item.get("quizList").toJS()}
                        renderItem={record => (
                            <List.Item actions={[<Button size="small" onClick={()=>this.handleClickEdit(record.quizId)}>编辑</Button>]}>
                            <Skeleton avatar title={false} loading={record.loading} active>
                                <List.Item.Meta
                                    title={record.name}
                                />
                            </Skeleton>
                            </List.Item>
                    )}
                />
                </Panel>
        )
        this.setState({
            data
        })
    })
}

handleClickEdit(quizId){
    const {editAndGetFullPaper} = this.props
    editAndGetFullPaper(quizId).then(()=>{
        this.props.history.push("/new_test")
    })
}
  render() {
    return (
        <Row
            type="flex" 
            justify="center"
          >
          <Col span={12}>
            <Card className={"card1"}>
                <Row
                    type="flex" 
                    justify="center"
                >
                    <Col className="button-wrap button1" span={11}>
                        <Link
                            to="/new_test"
                            className="link">
                            <svg className="icon logo" aria-hidden="true">
                                <use xlinkHref="#icon-shijuan"></use>
                            </svg>
                            <div className="button-title">
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-jiahao1"></use>
                                </svg>创建考试
                            </div>
                        </Link>
                    </Col>
                    <Col className="button-wrap button2" offset={2} span={11}>
                        <Link
                            to="/new_course" 
                            className="link">
                            <svg className="icon logo" aria-hidden="true">
                                <use xlinkHref="#icon-kecheng"></use>
                            </svg>
                            <div className="button-title">
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-jiahao1"></use>
                                </svg>创建课程 
                            </div>
                        </Link>  
                    </Col>
                </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card className={"card2"} title={<span style={{fontSize:"1.5rem", fontWeight:600}}>已添加考试</span>}>
            <Collapse defaultActiveKey={['1']}>
                {this.state.data}
            </Collapse>
            </Card>
          </Col>
        </Row>
    );
  }
}
export default Main;