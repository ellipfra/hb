import { meleeAttack } from '../actions/meleeAttack'
import { IUnitType } from '../unit'

export default {
  name: 'Knight',
  description: 'The knight descends into battle to bring justice and '
    + 'freedom from evil. His heavy armor and his unwavering discipline make '
    + 'him very resistant to wounds and blows. His endurance in the '
    + 'battlefield is legenday',

  hp: 12,
  mp: 2,
  mana: 0,
  resistance: 1,
  actions: [meleeAttack({ damage: 3 })],

  cost: 6,
} as IUnitType
