import React, { Component } from 'react'

class LogOut extends Component {
    
    // resetCredentials = (props) => {
    //     props
    // }


    render() {
        // return <button onClick={this.resetCredentials}>LogOut</button>
        return <button onClick={this.props.logOutHandler}>LogOut</button>
    }

}

export default LogOut