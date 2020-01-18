'use strict'

const assert = require('assert')
const CategoryDamage = require('../../../../model/classes/meeting/CategoryDamage')
const Journey = require('../../../../model/classes/meeting/Journey')
const TransportationMean = require('../../../../model/classes/meeting/TransportationMean')
const Software = require('../../../../model/classes/meeting/Software')
const Hardware = require('../../../../model/classes/meeting/Hardware')
const MeetingDamage = require('../../../../model/classes/meeting/MeetingDamage')
const constants = require('../../../../constants/meeting')
const transportDatabase = require('../../../../model/database/meeting/transportationMean')
const hardwareDatabase = require('../../../../model/database/meeting/hardware')
const softwareDatabase = require('../../../../model/database/meeting/software')
describe('MeetingDamage class', () => {
  describe('#constructor()', () => {
    // Transport damage object creation
    const electricCar = new TransportationMean({ name: transportDatabase.CAR_ELECTRIC_ONE_KM.name })
    const journeyElectricCar3People = new Journey({
      passenger: 'Passenger 1',
      mean: electricCar,
      distance: 100,
      numberOfPeople: 3
    })
    const journeyElectricCar3PeopleDamage = journeyElectricCar3People.damage
    const journeyElectricCar5People = new Journey({
      passenger: 'Passenger 1',
      mean: electricCar,
      distance: 100,
      numberOfPeople: 5
    })
    const journeyElectricCar5PeopleDamage = journeyElectricCar5People.damage
    const journeyElectricCar2People = new Journey({
      passenger: 'Passenger 1',
      mean: electricCar,
      distance: 100,
      numberOfPeople: 2
    })
    const journeyElectricCar2PeopleDamage = journeyElectricCar2People.damage
    const heatCar = new TransportationMean({ name: transportDatabase.CAR_HEAT_ENGINE_ONE_KM.name })
    const journeyHeatCar2People = new Journey({
      passenger: 'Passenger 1',
      mean: heatCar,
      distance: 100,
      numberOfPeople: 2
    })
    const journeyHeatCar2PeopleDamage = journeyHeatCar2People.damage
    const transportDamageArray = [journeyElectricCar3PeopleDamage, journeyElectricCar2PeopleDamage, journeyElectricCar5PeopleDamage, journeyHeatCar2PeopleDamage]
    const transportCategory = constants.meetingCategoryDamage.TRANSPORT
    const transportDamage = new CategoryDamage({ damage: transportDamageArray, category: transportCategory })
    // Hardware damage object creation
    const desktop1 = new Hardware({ name: hardwareDatabase.DESKTOP.name, size: 1, shareForVisio: 1 })
    const desktop2 = new Hardware({ name: hardwareDatabase.DESKTOP.name, size: 1, shareForVisio: 1 })
    const laptop = new Hardware({ name: hardwareDatabase.LAPTOP.name, size: 1, shareForVisio: 1 })
    const desktop1Damage = desktop1.computeDamage()
    const desktop2Damage = desktop2.computeDamage()
    const laptopDamage = laptop.computeDamage()
    const hardwareCategory = constants.meetingCategoryDamage.HARDWARE
    const hardwareDamageArray = [desktop1Damage, desktop2Damage, laptopDamage]
    const hardwareDamage = new CategoryDamage({ damage: hardwareDamageArray, category: hardwareCategory })
    // Software damage object creation
    const skype = new Software({ name: softwareDatabase.SKYPE.name })
    const skypeDamage = skype.computeDamage({
      instancesNumber: 5,
      bandwithBound: constants.bounds.UPPER,
      networkBound: constants.bounds.UPPER,
      meetingDuration: 120
    })
    const softwareCategory = constants.meetingCategoryDamage.SOFTWARE
    const softwareDamageArray = [skypeDamage]
    const softwareDamage = new CategoryDamage({ damage: softwareDamageArray, category: softwareCategory })
    // MeetingDamage object creation
    const meetingDamage = new MeetingDamage({ hardwareDamage, softwareDamage, transportDamage })
    it('the total damage of a meeting should be the sum of the total damage of each category (hardware, software and transport', () => {
      assert.deepStrictEqual(
        meetingDamage.totalDamage,
        hardwareDamage.totalDamage.add(softwareDamage.totalDamage).add(transportDamage.totalDamage)
      )
    })
  })
})
