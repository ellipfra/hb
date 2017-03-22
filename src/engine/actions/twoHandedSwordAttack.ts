import { getItemCircular } from '../../utils'
import Hex, { directions } from '../hex'
import Unit from '../unit'
import { UnitAction } from './action'

interface IParams {
  damage: number
}

export default class TwoHandedSwordAttack extends UnitAction {
  name = 'Two Handed Sword Attack'
  description = 'deals damage to three adjacent units at once'

  params: IParams

  performAction(target: Hex) {
    const targetDir = directions.findIndex(
      d => this.unit.pos.add(d).equals(target),
    )
    const targetCells = [
      target,
      this.unit.pos.add(getItemCircular(directions, targetDir + 1)),
      this.unit.pos.add(getItemCircular(directions, targetDir - 1)),
    ].filter(this.game.map.isIn).map(this.game.map.cellAt)

    console.log(targetCells)
    targetCells.forEach(c => {
      if (c.thing instanceof Unit) {
        c.thing.takeDamage(this.params.damage)
      }
    })

    return {}
  }

  targets() {
    return this.unit.pos.neighbors.filter(this.game.map.isIn)
  }
}

export function twoHandedSwordAttack(params: IParams) {
  return class extends TwoHandedSwordAttack {
    params = params
  }
}
