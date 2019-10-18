import React from 'react'
import {Layout,Row,Col, BackTop} from 'antd'
import {withRouter} from 'react-router-dom'
const {
    Header, Footer, Content,
  } = Layout;

  @withRouter
class App extends React.Component{
    handleClickHome(){
        this.props.history.push('/')
    }
    render(){
        return (
            <Layout>
                <BackTop/>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <Row type="flex" justify="end">
                        <Col  span={2}>
                            <svg
                                onClick={()=>this.handleClickHome()} 
                                className="icon home" aria-hidden="true">
                                <use xlinkHref="#icon-zhuye--"></use>
                            </svg>
                        </Col>
                        <Col  span={3}>
                            <svg className="icon avator" aria-hidden="true">
                                <use xlinkHref="#icon-touxiang"></use>
                            </svg>
                            欢迎：aleo
                        </Col>
                        <Col  span={1}>退出</Col>
                    </Row>
                </Header>
                    <Content className="route-body">
                        {this.props.children}
                    </Content>
                <Footer></Footer>
            </Layout>
        )
    }
}
export default App