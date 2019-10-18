import React from 'react'
import {Card,Button, Row, Col} from 'antd'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {setSteps} from '../../redux/reducers/test'
import './style.less'

@withRouter
  @connect(
      state=>({
          current:state.test.get("current"),
          paperData:state.test.get("paperData"),
          quizId:state.test.getIn(["paperMessage","quizId"])
      }),
      {
        setSteps,
      }
  )
class TestDone extends React.Component{
    prev() {
        const {current,setSteps} = this.props
        setSteps({current:current-1})
    }

    generatePaper(){
        const {paperData} = this.props
        const getQues = (children)=>{
            let ques = []
            for(let i in children){
            switch(children[i].type){
                case "multichoice":
                    ques.push(
                        <Col key={i} style={{display:"flex"}}>
                            <span style={{flex:"none",marginRight:8}}>
                                {`${i}(${children[i].score}分)`}
                            </span>
                            <span>
                                <span dangerouslySetInnerHTML={{__html:children[i].quesContent}} />
                                <span>
                                    {children[i].options.map((item,index)=>{
                                        return (
                                            <div key={index} style={{display:"flex"}}>
                                                <span style={{fontSize:"15px",fontWeight:800,marginRight:5}}>{String.fromCharCode(65+index)}.</span>
                                                <span dangerouslySetInnerHTML={{__html:item}}/>
                                            </div>   
                                        )
                                    })}
                                </span>
                            </span>
                        </Col>
                        )
                    break
                case "truefalse":
                    ques.push(
                        <Col key={i} style={{display:"flex"}}><span style={{marginRight:8}}>{`${i}(${children[i].score}分)`}</span><span dangerouslySetInnerHTML={{__html:children[i].quesContent}}></span>( )</Col>
                    )
                    break
                default :
                ques.push(
                    <Col key={i} style={{display:"flex"}}><span style={{marginRight:8}}>{`${i}(${children[i].score}分)`}</span><span dangerouslySetInnerHTML={{__html:children[i].quesContent}}></span></Col>
                )
                }
            }
            return ques
        }
          //- 小写数字转换成大写, 只处理到[0 ~ 99]
        const getScore = (children) =>{
            let sumScore = 0
            for(let i in children){
                sumScore +=children[i].score
            }
            return sumScore
        }
        const order = (num) => {
        num = Number(num);
        let upperCaseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿'];
        let length = String(num).length;
        if (length === 1) {
            return upperCaseNumber[num];
        } else if (length === 2) {
            if (num === 10) {
            return upperCaseNumber[num];
            } else if (num > 10 && num < 20) {
            return '十' + upperCaseNumber[String(num).charAt(1)];
            } else {
            return upperCaseNumber[String(num).charAt(0)] + '十' + upperCaseNumber[String(num).charAt(1)].replace('零', '');
            }
        }
        }
  
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
       return resultData.map((item)=>{
           console.log(item)
            return (
                <Row key={item.order}>
                    <Col><span style={{fontSize:"15px",fontWeight:600}}>{order(item.order)}.{item.name}{`(共${Object.keys(item.children).length}道试题，满分${getScore(item.children)}分)`}</span></Col>
                    {getQues(item.children)}
                </Row>
            )
        })
        
    }
    render(){
        return(
            <div className="paper-done">
                <Card title={
                    <Row>
                        <Col span={2}>
                            <span style={{fontSize:"1.5rem", fontWeight:600}}>生成试卷</span> 
                        </Col>
                        <Col push={14}  span={4}>
                        </Col>
                        <Col push={14} span={2}>
                       </Col>
                       <Col push={14} span={2}>
                       </Col>
                    </Row>}>
                        {this.generatePaper()}
                </Card>
                <Button style={{marginTop:8, marginLeft: 8 }} type="primary">保存</Button>
                <Button style={{marginTop:8, marginLeft: 8 }} onClick={() => this.prev()}>
                    上一步
                </Button>
            </div>
        )
    }
}
export default TestDone