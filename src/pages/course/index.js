import React from 'react'
import { Steps,Row, Col, Card, } from 'antd';
import CourseMessage from '../../component/course_message'
import { connect } from 'react-redux';
const Step = Steps.Step;

const steps = [{
  title: '添加课程',
  content: <CourseMessage />,
}];

@connect(
  state=>({
    current:state.test.get("current")
  }),
  null
)
class Course extends React.Component {

  render() {
    return (
      <Row className="test-wrap">
        <Col span={3} className="steps">
          <Steps
            direction="vertical" 
            current={0}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
        </Col>
        <Col span={21} className="content">
        <Card>
        <div className="steps-content">{steps[0].content}</div>
        </Card>
          
        </Col>
      </Row>
    );
  }
}

export default Course
