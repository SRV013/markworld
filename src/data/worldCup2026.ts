import { COUNTRIES } from './countries'
import type { Group } from '@/types/worldCup'

const c = (code: string) => COUNTRIES[code]

export const GROUPS: Group[] = [
  { id: 'A', teams: [c('MX'),     c('ZA'),  c('KR'),  c('CZ')]     },
  { id: 'B', teams: [c('CA'),     c('BA'),  c('QA'),  c('CH')]     },
  { id: 'C', teams: [c('BR'),     c('MA'),  c('HT'),  c('GB-SCT')] },
  { id: 'D', teams: [c('US'),     c('PY'),  c('AU'),  c('TR')]     },
  { id: 'E', teams: [c('DE'),     c('CW'),  c('CI'),  c('EC')]     },
  { id: 'F', teams: [c('NL'),     c('JP'),  c('SE'),  c('TN')]     },
  { id: 'G', teams: [c('BE'),     c('EG'),  c('IR'),  c('NZ')]     },
  { id: 'H', teams: [c('ES'),     c('CV'),  c('SA'),  c('UY')]     },
  { id: 'I', teams: [c('FR'),     c('SN'),  c('IQ'),  c('NO')]     },
  { id: 'J', teams: [c('AR'),     c('DZ'),  c('AT'),  c('JO')]     },
  { id: 'K', teams: [c('PT'),     c('CD'),  c('UZ'),  c('CO')]     },
  { id: 'L', teams: [c('GB-ENG'), c('HR'),  c('GH'),  c('PA')]     },
]
