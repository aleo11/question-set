import { combineReducers} from 'redux'
import test from './test'
import common from './common'
import course from './course'
import main from './main'
export default combineReducers(
    {
        test,
        common,
        course,
        main
    }
)