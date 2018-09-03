'use strict'

require('dotenv').config()

require('isomorphic-fetch')
const { expect } = require('chai')
const logic = require('.')
const jwt = require('jsonwebtoken')

describe('logic', () => {

    let code, password, name, surname, age, gender, address, phone, dni, newAddress, newPhone, date, pill, quantity, frequency

    beforeEach(() => { 
        code = `Maider${Math.random()}`
        password = `123-${Math.random()}`
        name = `Pepe${Math.random()}` 
        surname = 'Doe' 
        age = Math.random() 
        gender = 'male' 
        address = 'Barcelona' 
        phone = 123123123
        dni = Math.floor(10000000 + Math.random() * 90000000)
        newAddress = 'Paris'
        newPhone = 789789789
        date = new Date()
        pill = `atarax${Math.random()}`
        quantity = `1-${Math.random()}`
        frequency = 'mondays, fridays'
    })

    true && describe('validate fields', () => {

        it('should succeed on correct value', () => {
            expect(() => logic._validateStringField('code', code)).not.to.throw()
            expect(() => logic._validateStringField('password', password)).not.to.throw()
            expect(() => logic._validateAgeField('age', age)).not.to.throw()
            expect(() => logic._validateDniField('dni', dni)).not.to.throw()
            expect(() => logic._validatePhoneField('phone', phone)).not.to.throw()
            expect(() => logic._validateDateField('date', date)).not.to.throw()
        })

        it('should fail on undefined value', () => {
            expect(() => logic._validateStringField('name', undefined)).to.throw(`invalid name`)
        })

        it('should fail on empty value', () => {
            expect(() => logic._validateStringField('name', '')).to.throw(`invalid name`)
        })

        it('should fail on numeric value', () => {
            expect(() => logic._validateStringField('name', 123)).to.throw(`invalid name`)
        })

        it('should fail on string value', () => {
            expect(() => logic._validateAgeField('age', '123')).to.throw(`invalid age`)
        })

        it('should fail on a value less or equal to 0', () => {
            expect(() => logic._validateAgeField('age', '0')).to.throw(`invalid age`)
        })

        it('should fail on string value', () => {
            expect(() => logic._validateDniField('dni', '12345678')).to.throw(`invalid dni`)
        })

        it('should fail on less than 8 numbers value', () => {
            expect(() => logic._validateDniField('dni', 123466)).to.throw(`invalid dni`)
        })

        it('should fail on more than 8 numbers value', () => {
            expect(() => logic._validateDniField('dni', 12345649894)).to.throw(`invalid dni`)
        })

        it('should fail on string value', () => {
            expect(() => logic._validatePhoneField('phone', '12345678')).to.throw(`invalid phone`)
        })

        it('should fail on less than 9 numbers value', () => {
            expect(() => logic._validatePhoneField('phone', 12345)).to.throw(`invalid phone`)
        })

        it('should fail on more than 9 numbers value', () => {
            expect(() => logic._validatePhoneField('phone', 123456495894)).to.throw(`invalid phone`)
        })

        it('should fail on string date value', () => {
            expect(() => logic._validateDateField('date', '15-08-2018')).to.throw(`invalid date`)
        })

        it('should fail on other date value', () => {
            expect(() => logic._validateDateField('date', 15-5481-15)).to.throw(`invalid date`)
        })
    })

    true && describe('register doctor', () => {

        it('should register doctor correctly', () =>
            logic.registerDoctor(code, password)
                .then(res => expect(res).to.be.true)
        )

        it('should fail on already existing doctor', () =>
            logic.registerDoctor(code, password)
                .then(() => logic.registerDoctor(code, password))
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`${code} doctor already exist`))
        )

        it('should fail on trying to register with an undefined code', () =>
            logic.registerDoctor(undefined, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to register with an empty code', () =>
            logic.registerDoctor('', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to register with a numeric code', () =>
            logic.registerDoctor(123, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to register with an undefined password', () =>
            logic.registerDoctor(code, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))
        )

        it('should fail on trying to register with an empty password', () =>
            logic.registerDoctor(code, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))
        )

        it('should fail on trying to register with a numeric password', () =>
            logic.registerDoctor(code, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))
        )
    })

    true && describe('authenticate doctor', () => {

        it('should authenticate doctor correctly', () => 
            logic.registerDoctor(code, password)
                .then(() => {
                    logic.authenticateDoctor(code, password)
                        .then(({ id, token })=> {
                            expect(id).to.exist
                            expect(token).to.exist
        
                            let payload
        
                            expect(() => payload = jwt.verify(token, jwt_secret)).not.to.throw()
                            expect(payload.sub).to.equal(id)
                        })
                })
        )

        it('should fail on authenticating with a wrong password', () => {
            const falsePass = '123'
        
            logic.registerDoctor(code, password)
                .then(res => {
                    expect(res).to.be.true
                    return logic.authenticateDoctor(code, falsePass)
                })
                .catch(err => err)
                .then(({message}) => expect(message).to.equal(`wrong password`))
        })

        it('should fail on trying to authenticate with an undefined code', () =>
            logic.authenticateDoctor(undefined, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to authenticate with an empty code', () =>
            logic.authenticateDoctor('', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to authenticate with a numeric code', () =>
            logic.authenticateDoctor(123, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to authenticate with an undefined password', () =>
            logic.authenticateDoctor(code, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))
        )

        it('should fail on trying to authenticate with an empty password', () =>
            logic.authenticateDoctor(code, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))
        )

        it('should fail on trying to authenticate with a numeric password', () =>
            logic.authenticateDoctor(code, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))
        )        
    })

    true && describe('add patient', () => {

        it('should add correctly the given patient', () =>
            logic.addPatient(name, dni, surname, age, gender, address, phone)
                .then(res => {
                    expect(res).to.exist
                    expect(res.id).to.exist
                })
        )

        it('should fail on adding an already existing patient', () => {

            const sameDni = dni

            return logic.addPatient(name, dni, surname, age, gender, address, phone)
                .then(foundPatient => {
                    expect(foundPatient).to.exist

                    return logic.addPatient(name, sameDni, surname, age, gender, address, phone)
                })
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`patient with ${sameDni} dni already exist`))
        })

        it('should fail on trying to add patient with an undefined name', () =>
            logic.addPatient(undefined, dni, surname, age, gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )

        it('should fail on trying to add patient with an empty name', () =>
            logic.addPatient('', dni, surname, age, gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )

        it('should fail on trying to add patient with a numeric name', () =>
            logic.addPatient(123, dni, surname, age, gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )

        it('should fail on trying to add patient with an undefined dni', () =>
            logic.addPatient(name, undefined, surname, age, gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to add patient with an empty dni', () =>
            logic.addPatient(name, '', surname, age, gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to add patient with a string dni', () =>
            logic.addPatient(name, '123', surname, age, gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to add patient with an undefined surname', () =>
            logic.addPatient(name, dni, undefined, age, gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid surname`))
        )

        it('should fail on trying to add patient with an empty surname', () =>
            logic.addPatient(name, dni, '', age, gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid surname`))
        )

        it('should fail on trying to add patient with a numeric surname', () =>
            logic.addPatient(name, dni, 123, age, gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid surname`))
        )

        it('should fail on trying to add patient with an undefined age', () =>
            logic.addPatient(name, dni, surname, undefined, gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid age`))
        )

        it('should fail on trying to add patient with an empty age', () =>
            logic.addPatient(name, dni, surname, '', gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid age`))
        )

        it('should fail on trying to add patient with a string age', () =>
            logic.addPatient(name, dni, surname, '123', gender, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid age`))
        )

        it('should fail on trying to add patient with an undefined gender', () =>
            logic.addPatient(name, dni, surname, age, undefined, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid gender`))
        )

        it('should fail on trying to add patient with an empty gender', () =>
            logic.addPatient(name, dni, surname, age, '', address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid gender`))
        )

        it('should fail on trying to add patient with a numeric gender', () =>
            logic.addPatient(name, dni, surname, age, 123, address, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid gender`))
        )

        it('should fail on trying to add patient with an undefined address', () =>
            logic.addPatient(name, dni, surname, age, gender, undefined, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid address`))
        )

        it('should fail on trying to add patient with an empty address', () =>
            logic.addPatient(name, dni, surname, age, gender, '', phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid address`))
        )

        it('should fail on trying to add patient with a numeric address', () =>
            logic.addPatient(name, dni, surname, age, gender, 123, phone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid address`))
        )

        it('should fail on trying to add patient with an undefined phone', () =>
            logic.addPatient(name, dni, surname, age, gender, address, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid phone`))
        )

        it('should fail on trying to add patient with an empty phone', () =>
            logic.addPatient(name, dni, surname, age, gender, address, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid phone`))
        )

        it('should fail on trying to add patient with a string phone', () =>
            logic.addPatient(name, dni, surname, age, gender, address, '123')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid phone`))
        )
    })

    true && describe('remove patient', () => {

        let id
        
        beforeEach(() => 
            logic.addPatient(name, dni, surname, age, gender, address, phone)                
                .then(res => {
                    id = res.id
                    return true
                })
        )

        it('should remove patient correctly', () =>       
            logic.removePatient(id, dni)
                .then(res =>  expect(res).to.be.true)
        )

        it('should throw error on removing an not existing patient', () =>  
            logic.removePatient(id, dni)
                .then(res => {
                    expect(res).to.be.true
                    
                    return logic.removePatient(id, dni)
                })
                .catch(err => err)
                .then(({message}) => expect(message).to.equal(`patient with ${dni} dni does not exist`))
        )
    })

    true && describe('update patient', () => {
        
        let id

        beforeEach(() => 
            logic.addPatient(name, dni, surname, age, gender, address, phone)                
                .then(res => {
                    id = res.id
                    return true
                })
        )

        it('should be update correctly the address or phone', () => 
            logic.updatePatient(id, dni, newAddress, newPhone)
                .then(res => expect(res).to.be.true)
        )

        it('should fail on updating a patient does not exist', () => {
            const falseDni = 10000000

            return logic.updatePatient(id, falseDni, newAddress, newPhone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`patient with ${falseDni} dni does not exist`))
        })

        it('should fail on trying to update a patient with an undefined id', () =>
            logic.updatePatient(undefined, dni, newAddress, newPhone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to update a patient with an empty id', () =>
            logic.updatePatient('', dni, newAddress, newPhone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to update a patient with a numeric id', () =>
            logic.updatePatient(123, dni, newAddress, newPhone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to update a patient with an undefined dni', () =>
            logic.updatePatient(id, undefined, newAddress, newPhone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to update a patient with an empty dni', () =>
            logic.updatePatient(id, '', newAddress, newPhone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to update a patient with a string dni', () =>
            logic.updatePatient(id, '123', newAddress, newPhone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to update a patient with a numeric address', () =>
            logic.updatePatient(id, dni, 123, newPhone)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid newAddress`))
        )

        it('should fail on trying to update a patient with a string phone', () =>
            logic.updatePatient(id, dni, newAddress, '12334546')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid newPhone`))
        )
    })

    true && describe('return patient data', () => {

        it('should be return correctly the patient data', () => 
            logic.addPatient(name, dni, surname, age, gender, address, phone)                
                .then(res => {
                    expect(res).to.exist
                    return logic.patientData(dni)
                })
                .then(patient => {
                    expect(patient).to.exist
                    expect(patient.name).to.equal(name)
                    expect(patient.surname).to.equal(surname)
                    expect(patient.dni).to.equal(dni)
                    expect(patient.age).to.equal(age)
                    expect(patient.gender).to.equal(gender)
                    expect(patient.address).to.equal(address)
                    expect(patient.phone).to.equal(phone)
                })
        )

        it('should fail on trying to return patient data with an undefined dni', () =>
            logic.patientData(undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to return patient data with an empty dni', () =>
            logic.patientData('')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to return patient data with a string dni', () =>
            logic.patientData(123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )
    })

    true && describe('search and list patients by name', () => {

        true && it('should succeed on correct data', () => 
            logic.addPatient(name, dni, surname, age, gender, address, phone)
                .then(res => {
                    expect(res).to.exist

                    return logic.searchPatients(name)
                })
                .then(patients => {
                    expect(patients[0].name).to.equal(name)
                    expect(patients[0].dni).to.equal(dni)
                    expect(patients[0].surname).to.equal(surname)
                    expect(patients[0].age).to.equal(age)
                    expect(patients[0].gender).to.equal(gender)
                    expect(patients[0].address).to.equal(address)
                    expect(patients[0].phone).to.equal(phone)
                })
        )

        it('should fail on trying to search patients with an undefined name', () =>
            logic.searchPatients(undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )

        it('should fail on trying to search patients with an empty name', () =>
            logic.searchPatients('')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )

        it('should fail on trying to search patients with a numeric name', () =>
            logic.searchPatients(123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )
    })

    true && describe('list all patients', () => {

        true && it('should succeed on correct data', () => 
            logic.addPatient(name, dni, surname, age, gender, address, phone)
                .then(res => {
                    expect(res).to.exist

                    return logic.listPatients()
                })
                .then(patients => {
                    expect(patients).to.exist
                })
        )
    })

    true && describe('add treatment', () => {

        let id

        beforeEach(() => 
            logic.addPatient(name, dni, surname, age, gender, address, phone)                
                .then(res => {
                    id = res.id
                    return true
                })
        )

        it('should add treatment correctly', () =>
            logic.addTreatment(id, dni, pill, quantity, frequency)
                .then(res => expect(res).to.exist)
        )

        it('should fail on trying to add treatment with an undefined id', () =>
            logic.addTreatment(undefined, dni, pill, quantity, frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to add treatment with an empty id', () =>
            logic.addTreatment('', dni, pill, quantity, frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to add treatment with a numeric id', () =>
            logic.addTreatment(123, dni, pill, quantity, frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )
        
        it('should fail on trying to add treatment with an undefined dni', () =>
            logic.addTreatment(id, undefined, pill, quantity, frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to add treatment with an empty dni', () =>
            logic.addTreatment(id, '', pill, quantity, frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to add treatment with a string dni', () =>
            logic.addTreatment(id, '123', pill, quantity, frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )
        
        it('should fail on trying to add treatment with an undefined pill', () =>
            logic.addTreatment(id, dni, undefined, quantity, frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid pill`))
        )

        it('should fail on trying to add treatment with an empty pill', () =>
            logic.addTreatment(id, dni, '', quantity, frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid pill`))
        )

        it('should fail on trying to add treatment with a numeric pill', () =>
            logic.addTreatment(id, dni, 123, quantity, frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid pill`))
        )
        
        it('should fail on trying to add treatment with an undefined quantity', () =>
            logic.addTreatment(id, dni, pill, undefined, frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid quantity`))
        )

        it('should fail on trying to add treatment with an empty quantity', () =>
            logic.addTreatment(id, dni, pill, '', frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid quantity`))
        )

        it('should fail on trying to add treatment with a numeric quantity', () =>
            logic.addTreatment(id, dni, pill, 123, frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid quantity`))
        )

        it('should fail on trying to add treatment with a quantity less or equal to 0', () =>
            logic.addTreatment(id, dni, pill, '0', frequency)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`quantity 0 not possible`))
        )
        
        it('should fail on trying to add treatment with an undefined frequency', () =>
            logic.addTreatment(id, dni, pill, quantity, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid frequency`))
        )

        it('should fail on trying to add treatment with an empty frequency', () =>
            logic.addTreatment(id, dni, pill, quantity, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid frequency`))
        )

        it('should fail on trying to add treatment with a numeric frequency', () =>
            logic.addTreatment(id, dni, pill, quantity, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid frequency`))
        )
    })

    true && describe('remove treatment', () => {

        let id

        beforeEach(() => 
            logic.addPatient(name, dni, surname, age, gender, address, phone)                
                .then(res => {
                    id = res.id
                    return logic.addTreatment(id, dni, pill, quantity, frequency)
                })
        )

        it('should remove treatment correctly', () => 
            logic.removeTreatment(id, dni, pill)
                .then(res => expect(res).to.be.true)
        )

        it('should fail on trying to remove treatment with an undefined id', () =>
            logic.removeTreatment(undefined, dni, pill)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to remove treatment with an empty id', () =>
            logic.removeTreatment('', dni, pill)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to remove treatment with a numeric id', () =>
            logic.removeTreatment(123, dni, pill)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )
        
        it('should fail on trying to remove treatment with an undefined dni', () =>
            logic.removeTreatment(id, undefined, pill)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to remove treatment with an empty dni', () =>
            logic.removeTreatment(id, '', pill)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to remove treatment with a string dni', () =>
            logic.removeTreatment(id, '123', pill)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )
        
        it('should fail on trying to remove treatment with an undefined pill', () =>
            logic.removeTreatment(id, dni, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid pill`))
        )

        it('should fail on trying to remove treatment with an empty pill', () =>
            logic.removeTreatment(id, dni, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid pill`))
        )

        it('should fail on trying to remove treatment with a numeric pill', () =>
            logic.removeTreatment(id, dni, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid pill`))
        )
    })

    true && describe('list treatements by patient id', () => {

        let id

        beforeEach(() => 
            logic.addPatient(name, dni, surname, age, gender, address, phone)                
                .then(res => {
                    id = res.id
                    return logic.addTreatment(id, dni, pill, quantity, frequency)
                })
        )

        it('should list treatments correctly', () => 
            logic.listTreatments(id)
                .then(treatments => {
                    expect(treatments).to.exist
                    expect(treatments[0].pill).to.equal(pill)
                    expect(treatments[0].quantity).to.equal(quantity)
                    expect(treatments[0].frequency).to.equal(frequency)
                })
        )

        it('should fail on trying to list treatments with an undefined id', () =>
            logic.listTreatments(undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to list treatments with an empty id', () =>
            logic.listTreatments('')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to list treatments with a numeric id', () =>
            logic.listTreatments(123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )
    })

    true && describe('add cite', () => {

        beforeEach(() => 
            logic.registerDoctor(code, password)
                .then(res => {
                    expect(res).to.be.true

                    return logic.addPatient(name, dni, surname, age, gender, address, phone)                
                })
        )

        it('should add cite correctly', () => 
            logic.addCite(code, dni, name, date)
                .then(res => expect(res).to.exist)
        )

        it('should fail on trying to add a cite with an undefined code', () =>
            logic.addCite(undefined, dni, name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to add a cite with an empty code', () =>
            logic.addCite('', dni, name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to add a cite with a numeric code', () =>
            logic.addCite(123, dni, name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to add a cite with an undefined dni', () =>
            logic.addCite(code, undefined, name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to add a cite with an empty dni', () =>
            logic.addCite(code, '', name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to add a cite with a string dni', () =>
            logic.addCite(code, '123', name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to add a cite with an undefined name', () =>
            logic.addCite(code, dni, undefined, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )

        it('should fail on trying to add a cite with an empty name', () =>
            logic.addCite(code, dni, '', date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )

        it('should fail on trying to add a cite with a numeric name', () =>
            logic.addCite(code, dni, 123, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )

        it('should fail on trying to add a cite with an undefined date', () =>
            logic.addCite(code, dni, name, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to add a cite with an empty date', () =>
            logic.addCite(code, dni, name, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to add a cite with a numeric date', () =>
            logic.addCite(code, dni, name, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to add a cite with a string date', () =>
            logic.addCite(code, dni, name, '123')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )
    })

    true && describe('remove cite', () => {

        beforeEach(() => 
            logic.registerDoctor(code, password)
                .then(res => {
                    expect(res).to.be.true

                    return logic.addPatient(name, dni, surname, age, gender, address, phone)                
                })
                .then(res => {
                    expect(res).to.exist

                    return logic.addCite(code, dni, name, date)
                })
        )

        it('should remove cite correctly', () => 
            logic.removeCite(code, dni, name, date)
                .then(res => expect(res).to.be.true)
        )

        it('should fail on trying to remove a cite with an undefined code', () =>
            logic.removeCite(undefined, dni, name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to remove a cite with an empty code', () =>
            logic.removeCite('', dni, name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to remove a cite with a numeric code', () =>
            logic.removeCite(123, dni, name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid code`))
        )

        it('should fail on trying to remove a cite with an undefined dni', () =>
            logic.removeCite(code, undefined, name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to remove a cite with an empty dni', () =>
            logic.removeCite(code, '', name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to remove a cite with a string dni', () =>
            logic.removeCite(code, '123', name, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid dni`))
        )

        it('should fail on trying to remove a cite with an undefined name', () =>
            logic.removeCite(code, dni, undefined, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )

        it('should fail on trying to remove a cite with an empty name', () =>
            logic.removeCite(code, dni, '', date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )

        it('should fail on trying to remove a cite with a numeric name', () =>
            logic.removeCite(code, dni, 123, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))
        )

        it('should fail on trying to remove a cite with an undefined date', () =>
            logic.removeCite(code, dni, name, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to remove a cite with an empty date', () =>
            logic.removeCite(code, dni, name, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to remove a cite with a numeric date', () =>
            logic.removeCite(code, dni, name, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to remove a cite with a string date', () =>
            logic.removeCite(code, dni, name, '123')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )
    })

    true && describe('list cites by date', () => {

        beforeEach(() => 
            logic.registerDoctor(code, password)
                .then(res => {
                    expect(res).to.be.true

                    return logic.addPatient(name, dni, surname, age, gender, address, phone)                
                })
                .then(res => {
                    expect(res).to.exist

                    return logic.addCite(code, dni, name, date)
                })
        )

        it('should list cites correctly', () => 
            logic.listCites(date)
                .then(cites => {
                    expect(cites).to.exist
                    expect(cites[0].name).to.exist
                    expect(cites[0].date).to.exist
                })
        )

        it('should fail on trying to list cites with an undefined date', () =>
            logic.listCites(undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to list cites with an empty date', () =>
            logic.listCites('')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to list cites with a numeric date', () =>
            logic.listCites(123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to list cites with a string date', () =>
            logic.listCites('123')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )
    })

    true && describe('list a patient cites by date', () => {

        let id

        beforeEach(() => 
            logic.registerDoctor(code, password)
                .then(res => {
                    expect(res).to.be.true

                    return logic.addPatient(name, dni, surname, age, gender, address, phone)                
                })
                .then(res => {
                    expect(res).to.exist

                    id = res.id

                    return logic.addCite(code, dni, name, date)
                })
        )

        it('should list cites correctly', () => 
            logic.listPatientCites(id, date)
                .then(cites => {
                    expect(cites).to.exist
                    expect(cites[0].name).to.exist
                    expect(cites[0].date).to.exist
                })
        )

        it('should fail on trying to list a patient cites with an undefined id', () =>
            logic.listPatientCites(undefined, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to list a patient cites with an empty id', () =>
            logic.listPatientCites('', date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to list a patient cites with a numeric id', () =>
            logic.listPatientCites(123, date)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid id`))
        )

        it('should fail on trying to list a patient cites with an undefined date', () =>
            logic.listPatientCites(id, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to list a patient cites with an empty date', () =>
            logic.listPatientCites(id, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to list a patient cites with a numeric date', () =>
            logic.listPatientCites(id, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )

        it('should fail on trying to list a patient cites with a string date', () =>
            logic.listPatientCites(id, '123')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid date`))
        )
    })
})