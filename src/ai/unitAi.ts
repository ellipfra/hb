import * as actions from '../engine/actions'
import { UnitAction } from '../engine/actions/action'
import Hex from '../engine/hex'
import { ICell, IMap } from '../engine/map'
import Unit from '../engine/unit'
import OpponentAi from './opponentAi'

abstract class UnitAi {
  constructor(
    protected unit: Unit,
    protected map: IMap,
    protected ai: OpponentAi,
  ) { }

  findTarget(actionType: typeof UnitAction, predicate: (c: ICell) => boolean) {
    const action = this.unit.getAction(actionType)
    const targets = action.targets().map(this.map.cellAt)
    const target = targets.find(predicate)

    return target ? () => action.execute(target.pos) : null
  }

  findPathTowardsEnemy() {
    // find nearest unit
    const found = this.map.flood(
      this.unit.pos,
      this.ai.isCellNearEnemyUnit,
      this.unit.canWalkOn,
    ).found

    if (found) {
      const [, , path] = found
      return path
    }

    return []
  }

  abstract findPath(): Hex[]

  abstract getAction(): (() => Promise<any>) | null

  abstract getLastAction(): (() => Promise<any>) | null
}

class WarriorAi extends UnitAi {
  findPath(): Hex[] {
    return this.findPathTowardsEnemy()
  }

  getAction() {
    return this.findTarget(actions.MeleeAttack, this.ai.hasCellEnemyUnit)
  }

  getLastAction() {
    return () => this.unit.getAction(actions.Guard).execute(this.unit.pos)
  }
}

class ArcherAi extends UnitAi {
  findPath(): Hex[] {
    return this.findPathTowardsEnemy()
  }

  getAction() {
    return this.findTarget(actions.RangedAttack, this.ai.hasCellEnemyUnit)
  }

  getLastAction() {
    return this.findTarget(actions.MeleeAttack, this.ai.hasCellEnemyUnit)
  }
}

class MageAi extends UnitAi {
  findPath(): Hex[] {
    return this.findPathTowardsEnemy()
  }

  getAction() {
    return this.findTarget(
      actions.Fireball,
      c => this.ai.hasCellEnemyUnit(c) && !this.unit.pos.isNeighbor(c.pos),
    )
  }

  getLastAction() {
    return this.findTarget(actions.MeleeAttack, this.ai.hasCellEnemyUnit)
  }
}

export default {
  Warrior: WarriorAi,
  Archer: ArcherAi,
  Mage: MageAi,
} as ({
  [idx: string]:
  typeof UnitAi & { new (unit: Unit, map: IMap, ai: OpponentAi) },
})
