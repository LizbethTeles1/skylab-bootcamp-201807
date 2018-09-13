import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../logic'

class DeleteUnregister extends Component {

    state = {
        changePas: false,
        delete: false,
        oldPassword: '',
        newPassword: ''
    }

    handleChangePas = () => this.setState({ changePas: true })

    handleUnregister = () => this.setState({ delete: true })

    handleNo = event => {
        event.preventDefault()

        this.setState({ changePas: false, delete: false })
    }

    handleYes = event => {
        event.preventDefault()

        logic.unregisterHostess(this.props.email, this.state.oldPassword, this.props.token)

            .then(() => this.props.onLogout(event))
    }

    handleOld = event => this.setState({ oldPassword: event.target.value })

    handleNew = event => this.setState({ newPassword: event.target.value })

    handleTheChange = event => {
        event.preventDefault()

        const { oldPassword, newPassword } = this.state

        logic.updatePasswordHostess(this.props.email, oldPassword, newPassword, this.props.token)

        this.setState({ changePas: false, delete: false })
    }


    render() {
        return (
            <div>
                {
                    !this.state.changePas && !this.state.delete && (
                        <div className="buttons">
                            <button type="button" onClick={this.handleChangePas} className="deletes-button">CHANGE PASSWORD</button>
                            <button type="button" onClick={this.handleUnregister} className="deletes-button">DELETE ACOUNT</button>
                        </div>
                    )
                }
                {
                    !this.state.changePas && this.state.delete && (
                        <div className="buttons">
                            <p>Are you sure you wana delete the acount for ever?</p>
                            <input type="password" onChange={this.handleOld} placeholder="Insert password to delete the acount"></input>
                            <button type="button" onClick={this.handleNo} className="deletes-button">NO</button>
                            <button type="button" onClick={this.handleYes} className="deletes-button">YES</button>
                        </div>
                    )
                }
                {
                    this.state.changePas && !this.state.delete && (
                        <div className="buttons">
                            <input type="password" placeholder="Password" onChange={this.handleOld}></input>
                            <input type="text" placeholder="New password" onChange={this.handleNew}></input>
                            <button type="button" onClick={this.handleTheChange} className="deletes-button">CHANGE PASSWORD</button>
                        </div>
                    )
                }

            </div>
        )
    }
}

export default withRouter(DeleteUnregister)