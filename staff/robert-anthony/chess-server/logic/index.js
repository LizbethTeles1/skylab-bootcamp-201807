const validateEmail = require('../utils/validate-email')
const {User, Game} = require('../data/models')
const chalk = require('chalk')
const {Chess} = require('chess.js')
const uuidv1 = require('uuid/v1');
var debug = require('debug')('logic')

const logic = {


  _validateStringField(name, value) {
    if (typeof value !== 'string' || !value.length) throw new LogicError(`invalid ${name}`)
  },

  _validateEmail(email) {
    if (!validateEmail(email)) throw new LogicError('invalid email')
  },

  _validateDateField(name, field) {
    if (!(field instanceof Date)) throw new LogicError(`invalid ${name}`)
  },


  register(email, password, nickname) {
    return Promise.resolve()
      .then(() => {
        console.log(email,password,nickname)
        this._validateEmail(email)
        this._validateStringField('password', password)
        this._validateStringField('nickname', nickname)

        return User.findOne({nickname})
      })
      .then(user => {
        if (user) throw new LogicError(`user with ${nickname} nickname already exists`)

        user = new User({email, password, nickname, lastRequest: "", online: false})
        return user.save()
      })
      .then(() => true)

  },

  authenticate(nickname, password) {
    return Promise.resolve()
      .then(() => {
        this._validateStringField('nickname', nickname)
        this._validateStringField('password', password)

        return User.findOne({nickname})
      })
      .then(user => {
        if (!user) throw new LogicError(`user with ${nickname} nickname does not exist`)

        if (user.password !== password) throw new LogicError(`wrong password`)


      })

      .then(() => true)

  },

  updatePassword(nickname, password, newPassword) {
    return Promise.resolve()
      .then(() => {
        this._validateStringField('nickname', nickname)
        this._validateStringField('password', password)
        this._validateStringField('new password', newPassword)

        return User.findOne({nickname})
      })
      .then(user => {
        if (!user) throw new LogicError(`user with ${nickname} nickname does not exist`)

        if (user.password !== password) throw new LogicError(`wrong password`)

        if (password === newPassword) throw new LogicError('new password must be different to old password')

        user.password = newPassword

        return user.save()
      })
      .then(() => true)
  },

  unregisterUser(nickname, password) {
    return Promise.resolve()
      .then(() => {
        this._validateStringField('nickname', nickname)
        this._validateStringField('password', password)
        return User.findOne({email})
      })
      .then(user => {
        if (!user) throw new LogicError(`user with ${nickname} nickname does not exist`)

        if (user.password !== password) throw new LogicError(`wrong password`)

        return User.deleteOne({_id: user._id})
      })
      .then(() => true)
  },

  /****
   *
   *      GAME
   *
   *
   *
   */

  _currentEngines: new Map,


  gamesForUser(nickname) {
    return Promise.resolve()
      .then(_ => {
        this._validateStringField("nickname", nickname)
        debugger
        return Game.find({$or: [{white: nickname}, {black: nickname}]}).lean()
          .then(games => games.filter(game => (!game.terminated)).map(game => {
              const obj = {}
              obj.gameID = game.gameID
              obj.opponent = game.white === nickname ? game.black : game.white
              return obj
            }
          ))
      })
  },

  /* called from sockets */
  userConnected(nickname) {
    return Promise.resolve()
      .then(_ => {
        this._validateStringField("nickname", nickname)
        return User.findOne({nickname})
      })
      .then(user => {
        if (!user) throw new LogicError(`user with ${nickname} nickname does not exist`)
        user.online = true
        return user.save()
      })
      .then(() => true)

  },

  /* called from sockets */
  userDisconnected(nickname) {
    return Promise.resolve()
      .then(_ => {
        this._validateStringField("nickname", nickname)
        return User.findOne({nickname})
      })
      .then(user => {
        if (!user) throw new LogicError(`user with ${nickname} nickname does not exist`)
        user.online = false
        return user.save()
      })
      .then(() => true)
  },

  getOnlineUsers() {
    return User.find({online: true}).lean()
      .then(users => {
        return users.map(user => user.nickname)
      })
  },

  terminateGame(nickname, gameID) {
    return Promise.resolve()
      .then(_ => {
        this._validateStringField("nickname", nickname)
        this._validateStringField("gameID", gameID)
        return Game.findOne({_id: gameID})
      })
      .then(game => {
        if (!game) throw new LogicError(`game with id ${gameID} does not exist`)
        if (game.white !== nickname && game.black !== nickname) throw new LogicError(`game with id ${gameID} does not belong to user ${nickname}`)
        game.terminated = true

        return game.save()
      })
      .then(_ => true)
  },

  _createGame(white, black) {
    let game
    return Promise.resolve()
      .then(_ => {
        this._validateEmail("white", white)
        this._validateEmail("black", black)
        return User.findOne({nickname: white})
      })
      .then(user => {
        if (!user) throw new LogicError(`user with ${white} nickname does not exist`)
        return User.findOne({nickname: white})
      })
      .then(user => {
        if (!user) throw new LogicError(`user with ${black} nickname does not exist`)
        const engine = new Chess()
        const uuid = new uuidv1()
        this._currentEngines.set(uuid, engine)
        game = new Game({
          white,
          black,
          engineID: uuid,
          pgn: "",
          terminated: false,
          winner: null,
          lastMove: ""
        })
        return game.save()
      })
      .then(_ => true)
  },

  move(nickname, gameID, move) {
    let game
    return Game.findOne({_id: gameID})
      .then(_game => {
        if (!_game) throw new LogicError(`game with id ${gameID} does not exist`)
        if (game.white !== nickname && game.black !== nickname) throw new LogicError(`game with id ${gameID} does not belong to user ${nickname}`)
        game = _game
        const engine = this._currentEngines.get(_game.engineID)
        const result = engine.move(move)
        if (!result) throw new LogicError(`move ${move} is not allowed`)
        else {
          return game.save()
            .then(_ => {
              return true
            })
        }
      })
  },

  requestNewGame(requester, destination) {
    return Promise.resolve()
      .then(_ => {
        this._validateStringField("requester", requester)
        this._validateStringField("destination", destination)
        return User.findOne({nickname: destination})
      })
      .then(user => {
        if (!user) throw new LogicError(`user with ${destination} nickname does not exist`)
        if (user.lastRequest !== "") throw new LogicError(`user with ${destination} nickname is waiting to accept another request`)
        user.lastRequest = requester
        return user.save()
      })
      .then(_ => {
        return true
      })
  },

  confirmNewGame(confirmer, destination) {
    return Promise.resolve()
      .then(_ => {
        this._validateStringField("confirmer", confirmer)
        this._validateStringField("destination", destination)
        User.find({nickname: confirmer})
      })
      .then(user => {
        if (!user) throw new LogicError(`user with ${confirmer} nickname does not exist`)
        user.lastRequest = ""
        return user.save()
      })
      .then(_ => this._createGame(destination, confirmer))
  },

  getLastGameRequest(nickname){
    return Promise.resolve()
      .then(_ => {
        this._validateStringField("nickname", nickname)
        User.find({nickname})
      })
      .then(user => {
        if (!user) throw new LogicError(`user with ${nickname} nickname does not exist`)
        return user.lastRequest
      })


  }

}


class LogicError extends Error {
  constructor(message) {
    super(message)
  }
}

module.exports = {logic, LogicError}