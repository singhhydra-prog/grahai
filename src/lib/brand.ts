// GrahAI Brand System — Single Source of Truth
export const brand = {
  colors: {
    deepSpaceNavy: '#0A0E27',
    cosmicWhite: '#F8F7F4',
    saffronGold: '#E8A838',
    twilightIndigo: '#2D2B55',
    sageMint: '#7BCAB3',
    // Extended
    goldLight: '#F5D590',
    goldDark: '#C4861E',
    navyLight: '#161B3D',
    mintDark: '#5BA892',
    error: '#E85454',
    success: '#4ADE80',
  },
  gradients: {
    cosmic: 'linear-gradient(135deg, #0A0E27 0%, #2D2B55 50%, #0A0E27 100%)',
    gold: 'linear-gradient(135deg, #E8A838 0%, #F5D590 50%, #E8A838 100%)',
    aurora: 'linear-gradient(180deg, #0A0E27 0%, #2D2B55 40%, #7BCAB3 100%)',
    hero: 'radial-gradient(ellipse at 50% 0%, #2D2B55 0%, #0A0E27 70%)',
  },
  fonts: {
    heading: '"Inter", system-ui, -apple-system, sans-serif',
    body: '"Inter", system-ui, -apple-system, sans-serif',
    hindi: '"Noto Sans Devanagari", sans-serif',
  },
  spacing: {
    section: '120px',
    sectionMobile: '80px',
  },
} as const

export const zodiacSigns = [
  { en: 'Aries', hi: 'मेष', symbol: '♈', element: 'fire' },
  { en: 'Taurus', hi: 'वृषभ', symbol: '♉', element: 'earth' },
  { en: 'Gemini', hi: 'मिथुन', symbol: '♊', element: 'air' },
  { en: 'Cancer', hi: 'कर्क', symbol: '♋', element: 'water' },
  { en: 'Leo', hi: 'सिंह', symbol: '♌', element: 'fire' },
  { en: 'Virgo', hi: 'कन्या', symbol: '♍', element: 'earth' },
  { en: 'Libra', hi: 'तुला', symbol: '♎', element: 'air' },
  { en: 'Scorpio', hi: 'वृश्चिक', symbol: '♏', element: 'water' },
  { en: 'Sagittarius', hi: 'धनु', symbol: '♐', element: 'fire' },
  { en: 'Capricorn', hi: 'मकर', symbol: '♑', element: 'earth' },
  { en: 'Aquarius', hi: 'कुम्भ', symbol: '♒', element: 'air' },
  { en: 'Pisces', hi: 'मीन', symbol: '♓', element: 'water' },
] as const
