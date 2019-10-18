import React from 'react'
import {changeGapAnswer} from '../../redux/reducers/common'
import {
    Tag, Input, Tooltip, Icon, Row, Col
  } from 'antd';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
  
  @connect(
      state=>({
        gapAnswerList:state.common.get("gapAnswerList"),
        editData:state.test.get("editData"),
      }),
      {
        changeGapAnswer,
      }
  )
  class EditableTagGroup extends React.Component {
    state = {
        inputVisible: false,
        inputValue: '',
    };
    componentWillMount(){
          const {editData,order} = this.props
          let _answer =  editData.get("answer")
          if(editData.get("type")==="shortanswer"){
               this.changeGapAnswerList(_answer.get(order)||[])
          }
        
    }
    handleClose = (removedTag) => {
        const {gapAnswerList,order} = this.props
        let tags = gapAnswerList.get(order).filter(tag => tag !== removedTag);
        this.changeGapAnswerList(tags)
    }
  
    showInput = () => {
      this.setState({ inputVisible: true }, () => this.input.focus());
    }
  
    handleInputChange = (e) => {
      this.setState({ inputValue: e.target.value });
    }
  
    handleInputConfirm = () => {
      const { inputValue } = this.state;
    let { gapAnswerList,order } = this.props;
    let tags = gapAnswerList.get(order)||fromJS([])
      if (inputValue && !tags.includes(inputValue)) {
        tags = [...tags, inputValue];
      }
    this.changeGapAnswerList(tags)
      this.setState({
        // gapAnswerList,
        inputVisible: false,
        inputValue: '',
      });
    }
  
    //改变填空题答案
     changeGapAnswerList(tags){
       console.log(tags)
         const {changeGapAnswer,gapAnswerList,order} = this.props
         changeGapAnswer( gapAnswerList.set(order,tags))
     }
    saveInputRef = input => this.input = input
  
    render() {
      const { inputVisible, inputValue } = this.state;
      const {gapAnswerList,order} = this.props
     let _gapAnswerList = gapAnswerList.get(order)
      return (
            <Row>
                <Col span={2}>
                    填空{this.props.order+1}答案
                </Col>
                <Col span={20} style={{borderBottom:"1px solid black"}}>
                {/* 根据题型设置答案内容，当前选择题切换为填空题，答案内容为字符串，无map方法 */}
                    {_gapAnswerList &&_gapAnswerList.map((tag, index) => {
                        const isLongTag = tag.length > 50;
                        const tagElem = (
                        <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 50)}...` : tag}
                        </Tag>
                        );
                        return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                    })}
                    {inputVisible && 
                        <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={()=>this.handleInputConfirm()}
                        onPressEnter={()=>this.handleInputConfirm()}
                        />
                    }
                    {!inputVisible && (
                        <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                        >
                        <Icon type="plus" /> 新增
                        </Tag>
                    )}
                </Col>
            </Row>

      );
    }
  }
  export default EditableTagGroup