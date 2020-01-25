'use strict'

class Damage {
  /**
   * Create an object that represents the damage caused by a component of the meeting,
   * a group of components or the meeting itself.
   * @param {Number} humanHealth - The damage value on Human Health.
   * @param {Number} ecosystemQuality - The damage value on Ecosystem Quality.
   * @param {Number} climateChange - The damage value on Climate Change.
   * @param {Number} resources - The damage value on Resources.
   */
  constructor ({ humanHealth = 0, ecosystemQuality = 0, climateChange = 0, resources = 0 } = {}) {
    this._humanHealth = humanHealth
    this._ecosystemQuality = ecosystemQuality
    this._climateChange = climateChange
    this._resources = resources
  }

  // Getters

  get humanHealth () {
    return this._humanHealth
  }

  get ecosystemQuality () {
    return this._ecosystemQuality
  }

  get climateChange () {
    return this._climateChange
  }

  get resources () {
    return this._resources
  }

  // Setters

  set humanHealth (humanHealth) {
    this._humanHealth = humanHealth
  }

  set ecosystemQuality (ecosystemQuality) {
    this._ecosystemQuality = ecosystemQuality
  }

  set climateChange (climateChange) {
    this._climateChange = climateChange
  }

  set resources (resources) {
    this._resources = resources
  }

  // Other methods

  /**
   * Apply the given function on the four
   * damage values.
   * @param {Function} mutation - The function to apply.
   * @returns {Damage} This mutated damage.
   */
  mutate (mutation) {
    Object.keys(this).map(category => {
      mutation(category)
    })

    return this
  }

  /**
   * Return a new damage that is the addition between this damage and an other one.
   * @param {Damage} - The damage we want to add.
   * @returns {Damage} This bigger damage.
   */
  add (damage) {
    return new Damage({
      humanHealth: this.humanHealth + damage.humanHealth,
      ecosystemQuality: this.ecosystemQuality + damage.ecosystemQuality,
      climateChange: this.climateChange + damage.climateChange,
      resources: this.resources + damage.resources
    })
  }
}

module.exports = Damage