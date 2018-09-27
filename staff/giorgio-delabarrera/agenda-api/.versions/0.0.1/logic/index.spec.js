'use strict'

require('dotenv').config()

const { logic } = require('.')
const { expect } = require('chai')
const fs = require('fs')
const { MongoClient } = require('mongodb')

const { MONGO_URL } = process.env

describe('logic', () => {

  const username = 'jhon@me.com', password = '123'
  let _conn, _db, _users

  before(done => {
    MongoClient.connect(MONGO_URL, { useNewUrlParser: true }, (err, conn) => {

      if (err) return done(err)

      _conn = conn

      const db = _db = conn.db()

      logic._users = _users = db.collection('users')

      done()
    })
  })

  beforeEach(() => {
    _users.deleteMany()
  })

  describe('user', () => {

    describe('register', () => {

      it('should register on valid credentials', () => {

        _users.findOne({ username })
          .then(user => {
            expect(user).to.be.null

            return logic.register(username, password)
          })
          .then(() => _users.findOne({ username }))
          .then(user => {
            expect(user).to.be.exist

            expect(user.username).to.equal(username)
            expect(user.password).to.equal(password)
          })
      })

      it('should fail on trying to register an already registered user', () => {
        _users.insertOne({ username, password })
          .then(() => logic.register({ username, password }))
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`user ${username} already exists`))
      })

      it('should fail on trying to register with an undefined username', () => {
        logic.register(undefined, password)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid username`))
      })

      it('should fail on trying to register with an empty username', () =>
        logic.register('', password)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid username`))
      )

      it('should fail on trying to register with a numeric username', () =>
        logic.register(123, password)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid username`))
      )

      it('should fail on trying to register with an undefined password', () =>
        logic.register(username)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid password`))
      )

      it('should fail on trying to register with an empty password', () =>
        logic.register(username, '')
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid password`))
      )

      it('should fail on trying to register with a numeric password', () =>
        logic.register(username, 123)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid password`))
      )
    })

    describe('authenticate', () => {

      beforeEach(() =>
        _users.insertOne({ username, password })
      )

      it('should authenticate on correct credentials', () => {
        return logic.authenticate(username, password)
          .then(res => expect(res).to.be.true)
      })

      it('should fail on wrong credentials', () => {
        return logic.authenticate('pepito', 'grillo')
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal('user pepito does not exist'))
      })

      it('should fail on wrong password', () => {
        return logic.authenticate(username, '456')
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal('wrong credentials'))
      })

      it('should fail on trying to authenticate with an undefined username', () => {
        return logic.authenticate(undefined, password)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal('invalid username'))
      })

      it('should fail on trying to authenticate with an empty username', () => {
        return logic.authenticate('', password)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal('invalid username'))
      })

      it('should fail on trying to authenticate with a numeric username', () => {
        return logic.authenticate(123, password)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal('invalid username'))
      })

      it('should fail on trying to authenticate with an undefined password', () => {
        return logic.authenticate(username, undefined)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal('invalid password'))
      })

      it('should fail on trying to authenticate with an empty password', () => {
        return logic.authenticate(username, '')
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal('invalid password'))
      })

      it('should fail on trying to authenticate with a numeric password', () => {
        return logic.authenticate(username, 123)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal('invalid password'))
      })

    })

    describe('update password', () => {
      const newPassword = `${password}-${Math.random()}`

      beforeEach(() =>
        _users.insertOne({ username, password })
      )

      it('should succeed on correct passwords', () => {
        logic.updatePassword(username, password, newPassword)
          .then(res => {
            expect(res).to.be.true

            return _users.findOne({ username })
          })
          .then(user => {
            expect(user).to.exist
            expect(user.username).to.equal(username)
            expect(user.password).to.equal(newPassword)
          })
      })

      it('should fail on empty username', () => {
        logic.updatePassword('', password, newPassword)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid username`))
      })

      it('should fail on empty password', () => {
        logic.updatePassword(username, '', newPassword)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid password`))
      })

      it('should fail on empty new password', () =>
        logic.updatePassword(username, password, '')
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid new password`))
      )

      it('should fail on numeric username', () => {
        logic.updatePassword(123, password, newPassword)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid username`))
      })

      it('should fail on numeric password', () => {
        logic.updatePassword(username, 123, newPassword)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid password`))
      })

      it('should fail on numeric new password', () =>
        logic.updatePassword(username, password, 123)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid new password`))
      )

      it('should fail on undefined username', () => {
        logic.updatePassword(undefined, password, newPassword)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid username`))
      })

      it('should fail on undefined password', () => {
        logic.updatePassword(username, undefined, newPassword)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid password`))
      })

      it('should fail on undefined new password', () =>
        logic.updatePassword(username, password, undefined)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid new password`))
      )

      it('should fail on numeric username', () => {
        logic.updatePassword(123, password, newPassword)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid username`))
      })

      it('should fail on numeric password', () => {
        logic.updatePassword(username, 123, newPassword)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid password`))
      })

      it('should fail on numeric new password', () =>
        logic.updatePassword(username, password, 123)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid new password`))
      )

      it('should fail on new password same as current password', () =>
        logic.updatePassword(username, password, password)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`new password cannot be same as current password`))
      )
    })

    describe('update', () => {

      beforeEach(() => {
        _users.insertOne({ username }, { password })
      })

      it('should update the user profile correctly', () => {

        const fields = { name: 'Jhon', surname: 'Doe', age: 27 }

        logic.update(username, password, fields)
          .then(res => expect(res).to.be.true)
          .then(() => _users.findOne({ username }))
          .then(user => {
            expect(user).to.be.exist

            expect(user.name).to.equal(fields.name)
            expect(user.surname).to.equal(fields.surname)
            expect(user.age).to.equal(fields.age)
          })
      })

      it('should fail on empty username', () => {
        logic.update('', password)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid username`))
      })

      it('should fail on empty password', () => {
        logic.update(username, '')
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid password`))
      })

      it('should fail on numeric fields', () => {
        logic.update(username, password, 123)
          .catch(err => err)
          .then(({ message }) => expect(message).to.equal(`invalid fields`))
      })
    })
  })

  describe('user note', () => {

    beforeEach(() =>
      _users.insertOne({ username, password })
    )

    describe('create', () => {

      it('should create a note correctly', () => {
        const note = { date: new Date(), title: 'Test', description: 'Lorem ipsum' }
        logic.createNote({ username }, note)
          .then(res => expect(res).to.be.true)
          .then(() => {
            // _users.
          })
      })

    })


  })




  after(() => {
    return _users.deleteMany()
      .then(() => _conn.close())
  })

})