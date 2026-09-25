/**
 * Municipal Corporation Faridabad (MCF)
 * Government Enterprise Configuration
 */

export const GOVT_CONFIG = {
  APP_NAME: 'MCF CITIZEN',
  APP_HINDI_NAME: 'एमसीएफ सिटीजन पोर्टल',
  APP_VERSION: '1.0.0',
  BUILD_NUMBER: 104,
  STATE_GOVT: 'Government of Haryana',
  STATE_GOVT_HINDI: 'हरियाणा सरकार',
  DEPARTMENT: 'Directorate of Urban Local Bodies (DULB)',
  MUNICIPAL_BODY: 'Municipal Corporation Faridabad',

  HEADQUARTERS: {
    NAME: 'MCF Headquarters',
    ADDRESS: 'Near BK Chowk, New Industrial Town (NIT), Faridabad, Haryana - 121001',
    OFFICE_HOURS: '09:00 AM to 05:00 PM (Monday to Friday)',
    CONTROL_ROOM_PHONE: '0129-2415549',
    TOLL_FREE: '18001802013',
    EMAIL: 'commissioner@mcfaridabad.org',
    WEBSITE: 'https://www.mcfaridabad.org',
  },

  SLA_HOURS: {
    STREET_LIGHT: 24,
    GARBAGE_COLLECTION: 24,
    SEWERAGE_OVERFLOW: 48,
    WATER_LEAKAGE: 48,
    ROAD_POTHOLES: 120, // 5 days
    ENCROACHMENT: 72,
  },

  EXTERNAL_LINKS: {
    PORTAL: 'https://www.mcfaridabad.org',
    SARAL_HARYANA: 'https://saralharyana.gov.in',
    ULB_HARYANA: 'https://ulbharyana.gov.in',
    SBM_URBAN: 'https://swachhbharatmission.gov.in',
    JEEVAN_PRAMAAN: 'https://jeevanpramaan.gov.in',
    PRIVACY_POLICY: 'https://www.mcfaridabad.org/privacy-policy',
    CITIZEN_CHARTER: 'https://www.mcfaridabad.org/citizen-charter',
  },

  STORAGE_KEYS: {
    CITIZEN_USER: '@mcf_citizen_user',
    LANGUAGE: '@mcf_citizen_language',
    COMPLAINTS: '@mcf_citizen_complaints',
    NOTIFICATIONS: '@mcf_citizen_notifications',
  },
} as const;
