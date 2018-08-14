'use strict'

const {expect} = require('chai')
const logic = require('.')
const path = require('path')
const fs = require('fs')

//const rmDirRecursiveSync = require('../utils/rm-dir-recursive-sync')


describe('logic', () => {

  /* function clean() {
     if (fs.existsSync('data'))
       rmDirRecursiveSync('data')

     fs.mkdirSync('data')

   }*/

  describe('register', () => {
    let username, username2, password

    beforeEach(() => {
      username = 'jack' + Math.random().toString() + Math.random().toString()
      password = '123'
      username2 = "bobo"
    })

    it('should register on valid credentials', () => {
      return logic.register(username, password)
        .then(res => expect(res).to.be.true)
    });

    it('should not register on bad username', () => {
      return logic.register("", password)
        .catch(err => expect(err.response.status).to.equal(500))
    });
    it('should not register on bad password', () => {
      return logic.register(username, "")
        .catch(err => expect(err.response.status).to.equal(500))
    });
    it('should not register on bad username and password', () => {
      return logic.register("", "")
        .catch(err => expect(err.response.status).to.equal(500))
    });
  })

  describe('authenticate', () => {
    let username, username2, password
    beforeEach(() => {
      username = 'jack' + Math.random().toString() + Math.random().toString()
      username2 = 'jill' + Math.random().toString() + Math.random().toString()
      password = '123'
      return logic.register(username, password)
    })

    it('should authenticate on valid credentials', () => {
      return logic.authenticate(username, password)
        .then(res => expect(res).to.be.true)
    });

    it('should not authenticate on invalid username', () => {
      return logic.authenticate(username2, password)
        .catch(err => expect(err.response.status).to.equal(401)})
    });

    it('should not authenticate on invalid password', () => {
      return logic.authenticate(username, "abcdefg")
        .catch(err => expect(err.response.status).to.equal(401))
    });

    it('should not authenticate on invalid username and password', () => {
      return logic.authenticate(username2, "abcdefg")
        .catch(err => expect(err.response.status).to.equal(401))
    });
  })

describe('authenticate', () => {



})

  describe('upload files', () => {
    let username, password
    const textFilePath = "src/logic/files/something.txt"
    const imageFilePath = "src/logic/files/vg.png"
    let imageFileName, imageBuffer
    let textFileName, textBuffer
    beforeEach(() => {
      username = 'uploady' + Math.random().toString() + Math.random().toString()
      password = '123'
      return logic.register(username, password)
        .then(() => logic.authenticate(username, password))
        .then(() => {
          imageFileName = imageFilePath.split(path.sep).pop()
          imageBuffer = fs.readFileSync(imageFilePath)
          textFileName = textFilePath.split(path.sep).pop()
          textBuffer = fs.readFileSync(textFilePath)
        })
    })

    it('should upload image file correctly', () => {
      return logic.uploadFile(username, imageBuffer, imageFileName)
        .then(res => expect(res.message).not.to.equal('file saved'))
    });

    it('should upload text file correctly', () => {
      return logic.uploadFile(username, textBuffer, textFileName)
        .then(res => expect(res.message).not.to.equal('file saved'))
    });


    describe('download files', () => {
      let username, password
      const textFilePath = "src/logic/files/something.txt"
      const imageFilePath = "src/logic/files/vg.png"
      let imageFileName, imageBuffer
      let textFileName, textBuffer
      beforeEach(() => {
        username = 'uploady' + Math.random().toString() + Math.random().toString()
        password = '123'
        return logic.register(username, password)
          .then(() => logic.authenticate(username, password))
          .then(() => {
            imageFileName = imageFilePath.split(path.sep).pop()
            imageBuffer = fs.readFileSync(imageFilePath)
            textFileName = textFilePath.split(path.sep).pop()
            textBuffer = fs.readFileSync(textFilePath)
          })
          .then(() => logic.uploadFile(username, imageBuffer, imageFileName))
          .then(() => logic.uploadFile(username, textBuffer, textFileName))
      })

      it('should download image file correctly', () => {
        return logic.downloadFile(username, filename)
          .then(res => expect(res.message).not.to.equal('file saved'))
      });

      it('should download text file correctly', () => {
        return logic.uploadFile(username, textBuffer, textFileName)
          .then(res => expect(res.message).not.to.equal('file saved'))
      });


    })

    /* after(() => {


       clean()
     })*/
  })
})
