import React from 'react'
import Header from '../common/header'
import '../css/viewMessage.css'
export default class ViewMessage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className="view-message-container">
                <Header {...this.props} />
            </div>
        )
    }
}