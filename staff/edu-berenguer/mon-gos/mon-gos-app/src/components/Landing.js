import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { logic } from '../logic'
import swal from 'sweetalert2'

class Landing extends Component {

    state = {
        dogs: [],
    }

    componentDidMount() {
        logic.listDogsByShelter(this.props.id, this.props.token)
            .then(dogs => {
                this.setState({
                    dogs
                })
            })
    }

    handleLogout = (e) => {
        e.preventDefault()
        this.props.handleLogout(e)
    }

    deleteDog(id) {
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.value) {
                swal(
                    'Removed!',
                    'Dog has been remove.',
                    'success'
                )
                logic.removeDog(this.props.id, id, this.props.token)
                    .then(() => this.listDogs())
            }
        })

    }

    listDogs = () => {
        logic.listDogsByShelter(this.props.id, this.props.token)
            .then(dogs => {
                this.setState({
                    dogs
                })
            })
    }

    adopted(id) {
        logic.dogAdopted(this.props.id, id, this.props.token)
            .then(() => this.listDogs())
    }

    notAdopted(id) {
        logic.dogNotAdopted(this.props.id, id, this.props.token)
            .then(() => this.listDogs())
    }
    render() {
        const { open } = this.state;
        return <div>
            <nav class="navbar nav">
                <div class="navbar-item">
                    <a href="/" onClick={this.handleLogout}><button class="button is-dark">Logout</button></a>
                </div>
            </nav>
            <div className="container-landing">
                <div className="container-list">
                    <div className="container-title-landing">
                        <h2 className="titleLanding">LIST OF DOGS</h2>
                        <a href="/#/insertDog"><button class="button is-success">Add dog</button></a>
                    </div>
                    <ul>
                        {this.state.dogs.map(dog => {
                            if (dog.adopted === false) {
                                return <li>
                                    <div className="element-list">
                                        <img class="image-list" src={dog.photo}></img>
                                        <p className="landing-label">{dog.name}</p>
                                        <a href="" onClick={(e) => {
                                            e.preventDefault();
                                            this.deleteDog(dog._id)
                                        }}>
                                            <button class="button is-danger is-small button-landing">X</button></a>
                                        <Link to={`/updateDog/${dog._id}`} class="button is-light is-small button-landing"> Update/Information</Link>
                                        <a href="" onClick={(e) => {
                                            e.preventDefault()
                                            this.adopted(dog._id)
                                        }}
                                        ><button class="button is-light is-small button-landing">Not adopted</button></a>
                                    </div>
                                </li>
                            } else {
                                return <li>
                                    <div className="element-list">
                                        <img class="image-list" src={dog.photo}></img>
                                        <p className="landing-label">{dog.name} </p><a href="" onClick={(e) => {
                                            e.preventDefault(); this.deleteDog(dog._id)
                                        }}><button class="button is-danger is-small button-landing">X</button></a>
                                        <a href="" onClick={(e) => {
                                            e.preventDefault()
                                            this.notAdopted(dog._id)
                                        }}>
                                            <button class="button is-light is-small button-landing adopted" >Adopted</button></a>
                                    </div>
                                </li>
                            }
                        })}
                    </ul>
                </div>
            </div>
        </div>
    }
}


export default withRouter(Landing)