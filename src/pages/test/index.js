import React from 'react'
import { Steps,Row, Col, Card, } from 'antd';
import TestMessage from '../../component/test_message'
import TestPaper from '../../component/test_paper'
import TestDone from '../../component/test_done'
import {setSteps} from '../../redux/reducers/test'
import './style.less'
import { connect } from 'react-redux';
const Step = Steps.Step;

const steps = [{
  title: '考试信息',
  content: <TestMessage />,
}, {
  title: '设计试卷',
  content: <TestPaper/>,
},{
  title:'生成试卷',
  content:<TestDone />
}];

@connect(
  state=>({
    current:state.test.get("current")
  }),
  {
    setSteps,
  } 
)
class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  render() {
    const { current } = this.props;
    return (
      <Row className="test-wrap">
        <Col span={3} className="steps">
          <Steps
            direction="vertical"
            current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
        </Col>
        <Col span={21} className="content">
        <Card>
        <div className="steps-content">{steps[current].content}</div>
        </Card>
          
        </Col>
      </Row>
    );
  }
}

export default Test