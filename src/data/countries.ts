import type { Country } from '@/types/worldCup'

/**
 * Datos maestros de los 48 países del Mundial 2026.
 * Indexado por código ISO 3166-1 alpha-2.
 */
export const COUNTRIES: Record<string, Country> = {
  // ── Grupo A ──────────────────────────────────────────────────
  MX:       { code: 'MX',     name: 'México',               flag: '🇲🇽', flagIcon: 'mx',     confederation: 'CONCACAF' },
  ZA:       { code: 'ZA',     name: 'Sudáfrica',            flag: '🇿🇦', flagIcon: 'za',     confederation: 'CAF'      },
  KR:       { code: 'KR',     name: 'Corea del Sur',        flag: '🇰🇷', flagIcon: 'kr',     confederation: 'AFC'      },
  CZ:       { code: 'CZ',     name: 'República Checa',      flag: '🇨🇿', flagIcon: 'cz',     confederation: 'UEFA'     },
  // ── Grupo B ──────────────────────────────────────────────────
  CA:       { code: 'CA',     name: 'Canadá',               flag: '🇨🇦', flagIcon: 'ca',     confederation: 'CONCACAF' },
  BA:       { code: 'BA',     name: 'Bosnia y Herzegovina', flag: '🇧🇦', flagIcon: 'ba',     confederation: 'UEFA'     },
  QA:       { code: 'QA',     name: 'Qatar',                flag: '🇶🇦', flagIcon: 'qa',     confederation: 'AFC'      },
  CH:       { code: 'CH',     name: 'Suiza',                flag: '🇨🇭', flagIcon: 'ch',     confederation: 'UEFA'     },
  // ── Grupo C ──────────────────────────────────────────────────
  BR:       { code: 'BR',     name: 'Brasil',               flag: '🇧🇷', flagIcon: 'br',     confederation: 'CONMEBOL' },
  MA:       { code: 'MA',     name: 'Marruecos',            flag: '🇲🇦', flagIcon: 'ma',     confederation: 'CAF'      },
  HT:       { code: 'HT',     name: 'Haití',                flag: '🇭🇹', flagIcon: 'ht',     confederation: 'CONCACAF' },
  'GB-SCT': { code: 'GB-SCT', name: 'Escocia',              flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', flagIcon: 'gb-sct', confederation: 'UEFA'     },
  // ── Grupo D ──────────────────────────────────────────────────
  US:       { code: 'US',     name: 'Estados Unidos',       flag: '🇺🇸', flagIcon: 'us',     confederation: 'CONCACAF' },
  PY:       { code: 'PY',     name: 'Paraguay',             flag: '🇵🇾', flagIcon: 'py',     confederation: 'CONMEBOL' },
  AU:       { code: 'AU',     name: 'Australia',            flag: '🇦🇺', flagIcon: 'au',     confederation: 'AFC'      },
  TR:       { code: 'TR',     name: 'Turquía',              flag: '🇹🇷', flagIcon: 'tr',     confederation: 'UEFA'     },
  // ── Grupo E ──────────────────────────────────────────────────
  DE:       { code: 'DE',     name: 'Alemania',             flag: '🇩🇪', flagIcon: 'de',     confederation: 'UEFA'     },
  CW:       { code: 'CW',     name: 'Curazao',              flag: '🇨🇼', flagIcon: 'cw',     confederation: 'CONCACAF' },
  CI:       { code: 'CI',     name: 'Costa de Marfil',      flag: '🇨🇮', flagIcon: 'ci',     confederation: 'CAF'      },
  EC:       { code: 'EC',     name: 'Ecuador',              flag: '🇪🇨', flagIcon: 'ec',     confederation: 'CONMEBOL' },
  // ── Grupo F ──────────────────────────────────────────────────
  NL:       { code: 'NL',     name: 'Países Bajos',         flag: '🇳🇱', flagIcon: 'nl',     confederation: 'UEFA'     },
  JP:       { code: 'JP',     name: 'Japón',                flag: '🇯🇵', flagIcon: 'jp',     confederation: 'AFC'      },
  SE:       { code: 'SE',     name: 'Suecia',               flag: '🇸🇪', flagIcon: 'se',     confederation: 'UEFA'     },
  TN:       { code: 'TN',     name: 'Túnez',                flag: '🇹🇳', flagIcon: 'tn',     confederation: 'CAF'      },
  // ── Grupo G ──────────────────────────────────────────────────
  BE:       { code: 'BE',     name: 'Bélgica',              flag: '🇧🇪', flagIcon: 'be',     confederation: 'UEFA'     },
  EG:       { code: 'EG',     name: 'Egipto',               flag: '🇪🇬', flagIcon: 'eg',     confederation: 'CAF'      },
  IR:       { code: 'IR',     name: 'Irán',                 flag: '🇮🇷', flagIcon: 'ir',     confederation: 'AFC'      },
  NZ:       { code: 'NZ',     name: 'Nueva Zelanda',        flag: '🇳🇿', flagIcon: 'nz',     confederation: 'OFC'      },
  // ── Grupo H ──────────────────────────────────────────────────
  ES:       { code: 'ES',     name: 'España',               flag: '🇪🇸', flagIcon: 'es',     confederation: 'UEFA'     },
  CV:       { code: 'CV',     name: 'Cabo Verde',           flag: '🇨🇻', flagIcon: 'cv',     confederation: 'CAF'      },
  SA:       { code: 'SA',     name: 'Arabia Saudita',       flag: '🇸🇦', flagIcon: 'sa',     confederation: 'AFC'      },
  UY:       { code: 'UY',     name: 'Uruguay',              flag: '🇺🇾', flagIcon: 'uy',     confederation: 'CONMEBOL' },
  // ── Grupo I ──────────────────────────────────────────────────
  FR:       { code: 'FR',     name: 'Francia',              flag: '🇫🇷', flagIcon: 'fr',     confederation: 'UEFA'     },
  SN:       { code: 'SN',     name: 'Senegal',              flag: '🇸🇳', flagIcon: 'sn',     confederation: 'CAF'      },
  IQ:       { code: 'IQ',     name: 'Irak',                 flag: '🇮🇶', flagIcon: 'iq',     confederation: 'AFC'      },
  NO:       { code: 'NO',     name: 'Noruega',              flag: '🇳🇴', flagIcon: 'no',     confederation: 'UEFA'     },
  // ── Grupo J ──────────────────────────────────────────────────
  AR:       { code: 'AR',     name: 'Argentina',            flag: '🇦🇷', flagIcon: 'ar',     confederation: 'CONMEBOL' },
  DZ:       { code: 'DZ',     name: 'Argelia',              flag: '🇩🇿', flagIcon: 'dz',     confederation: 'CAF'      },
  AT:       { code: 'AT',     name: 'Austria',              flag: '🇦🇹', flagIcon: 'at',     confederation: 'UEFA'     },
  JO:       { code: 'JO',     name: 'Jordania',             flag: '🇯🇴', flagIcon: 'jo',     confederation: 'AFC'      },
  // ── Grupo K ──────────────────────────────────────────────────
  PT:       { code: 'PT',     name: 'Portugal',             flag: '🇵🇹', flagIcon: 'pt',     confederation: 'UEFA'     },
  CD:       { code: 'CD',     name: 'RD Congo',             flag: '🇨🇩', flagIcon: 'cd',     confederation: 'CAF'      },
  UZ:       { code: 'UZ',     name: 'Uzbekistán',           flag: '🇺🇿', flagIcon: 'uz',     confederation: 'AFC'      },
  CO:       { code: 'CO',     name: 'Colombia',             flag: '🇨🇴', flagIcon: 'co',     confederation: 'CONMEBOL' },
  // ── Grupo L ──────────────────────────────────────────────────
  'GB-ENG': { code: 'GB-ENG', name: 'Inglaterra',           flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagIcon: 'gb-eng', confederation: 'UEFA'     },
  HR:       { code: 'HR',     name: 'Croacia',              flag: '🇭🇷', flagIcon: 'hr',     confederation: 'UEFA'     },
  GH:       { code: 'GH',     name: 'Ghana',                flag: '🇬🇭', flagIcon: 'gh',     confederation: 'CAF'      },
  PA:       { code: 'PA',     name: 'Panamá',               flag: '🇵🇦', flagIcon: 'pa',     confederation: 'CONCACAF' },
}
