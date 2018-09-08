import React, { Component } from 'react'
import EditProfile from "../components/EditProfile"
import { withRouter } from 'react-router-dom'
import logic from '../logic'
import EditAvatar from '../components/EditAvatar';

class EditProfilePage extends Component {

  state = {
    user: null
  }

  componentDidMount() {
    const { loggedInUsername, token } = this.props

    logic.retrieveUser(loggedInUsername, undefined, token)
      .then(user => {
        this.setState({ user })
      })
      .catch(err => console.log(err))
  }

  handleEditProfileSubmit = (newEmail, name, website, phoneNumber, gender, biography, privateAccount) => {
    const { loggedInUsername, token } = this.props

    logic.updateUser(loggedInUsername, newEmail, name, website, phoneNumber, gender, biography, privateAccount, token)
      .then(() => console.log('actualizado!!!'))
      .catch(error => {
        console.log(error);
      })
  }

  handleEditAvatarSubmit = file => {
    const { loggedInUsername, token } = this.props

    logic.updateUserAvatar(loggedInUsername, file, token)
      .then(() => console.log('avatar actualizado!!!'))
      .catch(error => {
        console.log(error);
      })
  }

  goToChangePassword = event => {
    event.preventDefault()
    this.props.history.push('/accounts/password/change')
  }

  render() {
    const { user } = this.state
    return (
      <div>
        <div>
          <a href="#/" onClick={this.goToChangePassword}>Change password</a>
        </div>
        <div>
          <h2>Avatar</h2>
          {this.state.user && <EditAvatar imageUrl={user.imageUrl} onSubmit={this.handleEditAvatarSubmit} />}
          <h2>Profile</h2>
          {this.state.user && <EditProfile user={this.state.user} onSubmit={this.handleEditProfileSubmit} />}
        </div>
      </div>
    )
  }
}

export default withRouter(EditProfilePage)