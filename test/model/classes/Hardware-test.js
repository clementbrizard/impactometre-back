'use strict'

const assert = require('assert')
const hardwareDatabase = require('../../../model/database/meeting/hardware')
const Hardware = require('../../../model/classes/Hardware')
const ComponentDamage = require('../../../model/classes/ComponentDamage')
const {
  knownHardwareOperatingTime,
  knownHardwareStandbyTime,
  hardwareLifetime,
  hardwareOperatingTimePerDay,
  hardwareBound,
  hardwareDamageTypes,
  minutesInHour
} = require('../../../constants/meeting')

describe('Hardware class', () => {
  describe('#constructor()', () => {
    it('should create an Hardware instance for each non-composite hardware', () => {
      Object.values(hardwareDatabase).filter(json => {
        return !(
          Array.isArray(json.components) &&
          json.components.length
        )
      }).forEach(json => {
        const instance = new Hardware({ name: json.name })
        assert.deepStrictEqual({}, instance._components)
      })
    })
    it('should create an Hardware instance for each composite hardware', () => {
      Object.values(hardwareDatabase).filter(json => {
        return (
          Array.isArray(json.components) &&
          json.components.length
        )
      }).forEach(json => {
        const instance = new Hardware({ name: json.name })

        // Compute expected components
        const expected = {}
        json.components.forEach(name => {
          expected[name] = new Hardware({ name })
        })

        assert.deepStrictEqual(expected, instance._components)
      })
    })
    it('should create a composite hardware instance using components payload', () => {
      const componentsPayload = {}
      componentsPayload[hardwareDatabase.TV_SCREEN.name] = {
        name: hardwareDatabase.TV_SCREEN.name,
        size: 2
      }

      const instance = new Hardware({
        name: hardwareDatabase.TV.name,
        componentsPayload
      })

      // Compute expected components
      const expected = {}
      expected[hardwareDatabase.TV_SCREEN_BASE.name] = new Hardware({
        name: hardwareDatabase.TV_SCREEN_BASE.name
      })

      expected[hardwareDatabase.TV_SCREEN.name] = new Hardware({
        name: hardwareDatabase.TV_SCREEN.name,
        size: 2
      })

      assert.deepStrictEqual(expected, instance._components)
    })
  })
  describe('#computeTime()', () => {
    describe('operating', () => {
      const hardwaresWithKnownOperatingTime = Object.keys(knownHardwareOperatingTime)
      it('should return the known value if exists in constants', () => {
        Object.values(hardwareDamageTypes).filter(damageType => {
          return (
            damageType === hardwareDamageTypes.EMBODIED_VISIO ||
            damageType === hardwareDamageTypes.OPERATING_VISIO
          )
        }).forEach(damageType => {
          Object.values(hardwareDatabase).filter(json => {
            return hardwaresWithKnownOperatingTime.includes(json.name)
          }).forEach(json => {
            const instance = new Hardware({ name: json.name })
            assert.strictEqual(
              knownHardwareOperatingTime[instance._name],
              instance.computeTime(damageType)
            )
          })
        })
      })
      describe('should compute the value if not known', () => {
        it('when lifetime and operatingTimePerDay are based on DESKTOP values', () => {
          Object.values(hardwareDamageTypes).filter(damageType => {
            return (
              damageType === hardwareDamageTypes.EMBODIED_VISIO ||
              damageType === hardwareDamageTypes.OPERATING_VISIO
            )
          }).forEach(damageType => {
            Object.values(hardwareDatabase).filter(json => {
              return (
                !(hardwaresWithKnownOperatingTime.includes(json.name)) &&
                json.lifetime === hardwareLifetime.DESKTOP &&
                json.operatingTimePerDay === hardwareOperatingTimePerDay.DESKTOP
              )
            }).forEach(json => {
              const instance = new Hardware({ name: json.name })
              assert.strictEqual(
                8050,
                instance.computeTime(damageType)
              )
            })
          })
        })
        it('when lifetime is based on DESKTOP value and operatingTimePerDay on LOGITECH_KIT', () => {
          Object.values(hardwareDamageTypes).filter(damageType => {
            return (
              damageType === hardwareDamageTypes.EMBODIED_VISIO ||
              damageType === hardwareDamageTypes.OPERATING_VISIO
            )
          }).forEach(damageType => {
            Object.values(hardwareDatabase).filter(json => {
              return (
                !(hardwaresWithKnownOperatingTime.includes(json.name)) &&
                json.lifetime === hardwareLifetime.DESKTOP &&
                json.operatingTimePerDay === hardwareOperatingTimePerDay.LOGITECH_KIT
              )
            }).forEach(json => {
              const instance = new Hardware({ name: json.name })
              assert.strictEqual(
                690,
                instance.computeTime(damageType)
              )
            })
          })
        })
        it('when lifetime is based on POWER_CABLE_ONE_METER value and operatingTimePerDay on DESKTOP', () => {
          Object.values(hardwareDamageTypes).filter(damageType => {
            return (
              damageType === hardwareDamageTypes.EMBODIED_VISIO ||
              damageType === hardwareDamageTypes.OPERATING_VISIO
            )
          }).forEach(damageType => {
            Object.values(hardwareDatabase).filter(json => {
              return (
                !(hardwaresWithKnownOperatingTime.includes(json.name)) &&
                json.lifetime === hardwareLifetime.POWER_CABLE_ONE_METER &&
                json.operatingTimePerDay === hardwareOperatingTimePerDay.DESKTOP
              )
            }).forEach(json => {
              const instance = new Hardware({ name: json.name })
              assert.strictEqual(
                32200,
                instance.computeTime(damageType)
              )
            })
          })
        })
      })
    })
    describe('standby', () => {
      const hardwaresWithKnownStandbyTime = Object.keys(knownHardwareStandbyTime)
      it('should return the known value if exists in constants', () => {
        Object.values(hardwareDamageTypes).filter(damageType => {
          return (
            damageType === hardwareDamageTypes.EMBODIED_STANDBY ||
            damageType === hardwareDamageTypes.OPERATING_STANDBY
          )
        }).forEach(damageType => {
          Object.values(hardwareDatabase).filter(json => {
            return hardwaresWithKnownStandbyTime.includes(json.name)
          }).forEach(json => {
            const instance = new Hardware({ name: json.name })
            assert.strictEqual(
              knownHardwareStandbyTime[instance._name],
              instance.computeTime(damageType)
            )
          })
        })
      })
      describe('should compute the value if not known', () => {
        it('when lifetime and operatingTimePerDay are based on DESKTOP values', () => {
          Object.values(hardwareDamageTypes).filter(damageType => {
            return (
              damageType === hardwareDamageTypes.EMBODIED_STANDBY ||
              damageType === hardwareDamageTypes.OPERATING_STANDBY
            )
          }).forEach(damageType => {
            Object.values(hardwareDatabase).filter(json => {
              return (
                !(hardwaresWithKnownStandbyTime.includes(json.name)) &&
                json.lifetime === hardwareLifetime.DESKTOP &&
                json.operatingTimePerDay === hardwareOperatingTimePerDay.DESKTOP
              )
            }).forEach(json => {
              const instance = new Hardware({ name: json.name })
              assert.strictEqual(
                19550,
                instance.computeTime(damageType)
              )
            })
          })
        })
        it('when lifetime is based on DESKTOP value and operatingTimePerDay on LOGITECH_KIT', () => {
          Object.values(hardwareDamageTypes).filter(damageType => {
            return (
              damageType === hardwareDamageTypes.EMBODIED_STANDBY ||
              damageType === hardwareDamageTypes.OPERATING_STANDBY
            )
          }).forEach(damageType => {
            Object.values(hardwareDatabase).filter(json => {
              return (
                !(hardwaresWithKnownStandbyTime.includes(json.name)) &&
                json.lifetime === hardwareLifetime.DESKTOP &&
                json.operatingTimePerDay === hardwareOperatingTimePerDay.LOGITECH_KIT
              )
            }).forEach(json => {
              const instance = new Hardware({ name: json.name })
              assert.strictEqual(
                26910,
                instance.computeTime(damageType)
              )
            })
          })
        })
        it('when lifetime is based on POWER_CABLE_ONE_METER value and operatingTimePerDay on DESKTOP', () => {
          Object.values(hardwareDamageTypes).filter(damageType => {
            return (
              damageType === hardwareDamageTypes.EMBODIED_STANDBY ||
              damageType === hardwareDamageTypes.OPERATING_STANDBY
            )
          }).forEach(damageType => {
            Object.values(hardwareDatabase).filter(json => {
              return (
                !(hardwaresWithKnownStandbyTime.includes(json.name)) &&
                json.lifetime === hardwareLifetime.POWER_CABLE_ONE_METER &&
                json.operatingTimePerDay === hardwareOperatingTimePerDay.DESKTOP
              )
            }).forEach(json => {
              const instance = new Hardware({ name: json.name })
              assert.strictEqual(
                78200,
                instance.computeTime(damageType)
              )
            })
          })
        })
      })
    })
  })
  describe('#getTypedDamage()', () => {
    it('should return null if no available value', () => {
      Object.values(hardwareDamageTypes).forEach(damageType => {
        if (
          damageType === hardwareDamageTypes.EMBODIED_VISIO ||
          damageType === hardwareDamageTypes.EMBODIED_STANDBY
        ) {
          damageType = 'embodied'
        }

        Object.values(hardwareDatabase).filter(json => {
          return (!json[damageType])
        }).forEach(json => {
          const instance = new Hardware({ name: json.name })
          assert.strictEqual(
            null,
            instance.getTypedDamage(damageType)
          )
        })
      })
    })
    it('should return the unique available value', () => {
      Object.values(hardwareDamageTypes).forEach(damageType => {
        if (
          damageType === hardwareDamageTypes.EMBODIED_VISIO ||
          damageType === hardwareDamageTypes.EMBODIED_STANDBY
        ) {
          damageType = 'embodied'
        }

        Object.values(hardwareDatabase).filter(json => {
          return (
            json[damageType] != null &&
            !(json[damageType].lower) &&
            !(json[damageType].upper)
          )
        }).forEach(json => {
          const instance = new Hardware({ name: json.name })
          assert.strictEqual(
            json[damageType],
            instance.getTypedDamage(damageType)
          )
        })
      })
    })
    it('should return the matching lower value', () => {
      Object.values(hardwareDamageTypes).forEach(damageType => {
        if (
          damageType === hardwareDamageTypes.EMBODIED_VISIO ||
          damageType === hardwareDamageTypes.EMBODIED_STANDBY
        ) {
          damageType = 'embodied'
        }

        Object.values(hardwareDatabase).filter(json => {
          return (
            json[damageType] != null &&
            json[damageType].lower &&
            json[damageType].upper
          )
        }).forEach(json => {
          const instance = new Hardware({ name: json.name })
          assert.strictEqual(
            json[damageType].lower,
            instance.getTypedDamage(damageType, hardwareBound.LOWER)
          )
        })
      })
    })
    it('should return the matching upper value', () => {
      Object.values(hardwareDamageTypes).forEach(damageType => {
        if (
          damageType === hardwareDamageTypes.EMBODIED_VISIO ||
          damageType === hardwareDamageTypes.EMBODIED_STANDBY
        ) {
          damageType = 'embodied'
        }

        Object.values(hardwareDatabase).filter(json => {
          return (
            json[damageType] != null &&
            json[damageType].lower &&
            json[damageType].upper
          )
        }).forEach(json => {
          const instance = new Hardware({ name: json.name })
          assert.strictEqual(
            json[damageType].upper,
            instance.getTypedDamage(damageType, hardwareBound.UPPER)
          )
        })
      })
    })
    it('should return the upper value by default', () => {
      Object.values(hardwareDamageTypes).forEach(damageType => {
        if (
          damageType === hardwareDamageTypes.EMBODIED_VISIO ||
          damageType === hardwareDamageTypes.EMBODIED_STANDBY
        ) {
          damageType = 'embodied'
        }

        Object.values(hardwareDatabase).filter(json => {
          return (
            json[damageType] != null &&
            json[damageType].lower &&
            json[damageType].upper
          )
        }).forEach(json => {
          const instance = new Hardware({ name: json.name })
          assert.strictEqual(
            json[damageType].upper,
            instance.getTypedDamage(damageType)
          )
        })
      })
    })
  })
  describe('#computeTypedDamage()', () => {
    const meetingDuration = 60
    it('should return damage object with null values if no damage value available', () => {
      Object.values(hardwareDamageTypes).forEach(damageType => {
        if (
          damageType === hardwareDamageTypes.EMBODIED_VISIO ||
          damageType === hardwareDamageTypes.EMBODIED_STANDBY
        ) {
          damageType = 'embodied'
        }

        Object.values(hardwareDatabase)
          .filter(json => {
            return (
              !json[damageType] &&
              !(
                Array.isArray(json.components) &&
                json.components.length
              )
            )
          }).forEach(json => {
            // Compute expected damage
            const expected = new ComponentDamage()

            const instance = new Hardware({ name: json.name })
            assert.deepStrictEqual(expected, instance.computeTypedDamage(damageType, meetingDuration))
          })
      })
    })
    it('should compute the damage of a non size-dependent hardware', () => {
      Object.values(hardwareDamageTypes).forEach(damageType => {
        if (
          damageType === hardwareDamageTypes.EMBODIED_VISIO ||
          damageType === hardwareDamageTypes.EMBODIED_STANDBY
        ) {
          damageType = 'embodied'
        }

        Object.values(hardwareDatabase)
          .filter(json => json[damageType] && !json.isSizeDependent)
          .forEach(json => {
            const instance = new Hardware({ name: json.name })

            // Compute expected damage
            let expected = new ComponentDamage(instance.getTypedDamage(damageType))
            if (
              damageType === hardwareDamageTypes.OPERATING_STANDBY ||
              damageType === hardwareDamageTypes.OPERATING_VISIO
            ) {
              expected = expected.mutate(categoryDamage => {
                return categoryDamage * instance.shareForVisio * instance.getDuration(damageType, meetingDuration)
              })
            } else {
              expected = expected.mutate(categoryDamage => {
                categoryDamage *= instance._shareForVisio
                categoryDamage /= instance.computeTime(damageType)
                categoryDamage /= minutesInHour
                categoryDamage *= instance.getDuration(damageType, meetingDuration)

                return categoryDamage
              })
            }

            assert.deepStrictEqual(expected, instance.computeTypedDamage(damageType, meetingDuration))
          })
      })
    })
    it('should compute the damage of a size-dependent hardware', () => {
      Object.values(hardwareDamageTypes).forEach(damageType => {
        if (
          damageType === hardwareDamageTypes.EMBODIED_VISIO ||
          damageType === hardwareDamageTypes.EMBODIED_STANDBY
        ) {
          damageType = 'embodied'
        }

        Object.values(hardwareDatabase)
          .filter(json => json[damageType] && json.isSizeDependent)
          .forEach(json => {
            const instance = new Hardware({ name: json.name })

            // Compute expected damage
            let expected = new ComponentDamage(instance.getTypedDamage(damageType))
            if (
              damageType === hardwareDamageTypes.OPERATING_STANDBY ||
              damageType === hardwareDamageTypes.OPERATING_VISIO
            ) {
              expected = expected.mutate(categoryDamage => {
                return categoryDamage * instance.shareForVisio * instance.size * instance.getDuration(damageType, meetingDuration)
              })
            } else {
              expected = expected.mutate(categoryDamage => {
                categoryDamage *= instance._shareForVisio * instance.size
                categoryDamage /= instance.computeTime(damageType)
                categoryDamage /= minutesInHour
                categoryDamage *= instance.getDuration(damageType, meetingDuration)

                return categoryDamage
              })
            }

            assert.deepStrictEqual(expected, instance.computeTypedDamage(damageType, meetingDuration))
          })
      })
    })
    it('should compute the damage of a composite hardware', () => {
      Object.values(hardwareDamageTypes).forEach(damageType => {
        Object.values(hardwareDatabase)
          .filter(json => {
            return (
              Array.isArray(json.components) &&
              json.components.length
            )
          }).forEach(json => {
            // Compute expected damage
            const expected = new ComponentDamage()
            json.components.forEach(name => {
              const component = new Hardware({ name })
              const componentDamage = component.computeTypedDamage(damageType, meetingDuration)
              Object.keys(expected).map(category => {
                expected[category] += componentDamage[category]
              })
            })

            const instance = new Hardware({ name: json.name })
            assert.deepStrictEqual(expected, instance.computeTypedDamage(damageType, meetingDuration))
          })
      })
    })
    it('if the meeting is twice longer the damage should be twice bigger', () => {
      Object.values(hardwareDamageTypes).forEach(damageType => {
        Object.values(hardwareDatabase)
          .filter(json => new Hardware(json)[damageType])
          .forEach(json => {
            const instance = new Hardware(json)
            const simple = instance.computeTypedDamage(damageType, meetingDuration)

            // Compute expected
            const double = instance.computeTypedDamage(damageType, meetingDuration * 2)

            Object.keys(double).forEach(category => {
              assert.strictEqual(simple[category] * 2, double[category])
            })
          })
      })
    })
  })
  })
})
