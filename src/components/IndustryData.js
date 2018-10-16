import React from 'react'
import Header from '../common/header'
import '../css/industryData.css'
export default class IndustryData extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className="industry-data-container">
                <Header {...this.props} />
            </div>
        )
    }
}