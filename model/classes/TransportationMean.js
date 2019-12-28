'use strict'
/**
 * TransportationMan class.
 * An instance of this class represents a transportation mean,
 * with its french name and its embodied damage.
 */
class TransportationMean {
  /**
   * Construct an TransportationMean object form the JSON database.
   * @param transportationMean - A transportation mean from the JSON database.
   * @see transport.js The JSON file.
   */
  constructor (transportationMean) {
    this.french = transportationMean.french
    this.embodied = transportationMean.embodied
  }

  // Getters

  /**
   * Getter of the transportation mean french name.
   */
  get french() {
    return this.french
  }

  /**
   * Getter of the transportation mean embodied impact.
   */
  get embodied () {
    return this.embodied
  }
}

module.exports = TransportationMean
