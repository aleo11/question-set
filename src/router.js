import React from 'react'
import {HashRouter, Route} from 'react-router-dom'
import Main from './pages/main'
import App from './App'
import Test from './pages/test'
import Course from './pages/course'
import './style/index.less'
export default class Router extends React.Component{
    render(){
        return (
            <HashRouter>
                <div>
                    <Route render={()=>
                        <App>
                            <Route exact path="/" component={Main} />
                            <Route exact path="/new_test" component={Test} />
                            <Route exact path="/new_course" component={Course} />
                        </App>
                    } />
                </div>
            </HashRouter>
        )
    }
}