export const lightColors = {
  brand: {
    primary: '#3D7A52',
    primaryLight: '#EAF4EE',
    primaryDark: '#2D5A3D',
  },
  text: {
    primary: '#111111',
    secondary: '#555555',
    muted: '#888888',
    inverse: '#FFFFFF',
    danger: '#EF4444',
    link: '#3D7A52',
  },
  ui: {
    background: '#FFFFFF',
    inputBorder: '#E5E5E5',
    divider: '#DDDDDD',
    cardBg: '#F5F5F5',
    playerCard: '#FFFDE7',
    playerCardDark: '#2C2C2C',
    pageBgDark: '#1A1A1A',
  },
  tool: {
    tts: '#C5CAE9',
    reading: '#C5CAE9',
    studybuddy: '#D1C4E9',
    writing: '#FFCDD2',
    quiz: '#E07B6A',
    flashcards: '#F5A623',
  },
  confidence: {
    low: '#F97316',
    high: '#10B981',
    lowHighlight: '#FED7AA',
    selectedHighlight: '#CFFAFE',
  },
  highlight: {
    word: '#B39DDB',
  },
} as const;

export const darkColors = {
  brand: {
    primary: '#3D7A52',
    primaryLight: '#EAF4EE',
    primaryDark: '#2D5A3D',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    muted: '#888888',
    inverse: '#111111',
    danger: '#EF4444',
    link: '#3D7A52',
  },
  ui: {
    background: '#1A1A1A',
    inputBorder: '#444444',
    divider: '#444444',
    cardBg: '#2C2C2C',
    playerCard: '#2C2C2C',
    playerCardDark: '#2C2C2C',
    pageBgDark: '#1A1A1A',
  },
  tool: {
    tts: '#C5CAE9',
    reading: '#C5CAE9',
    studybuddy: '#D1C4E9',
    writing: '#FFCDD2',
    quiz: '#E07B6A',
    flashcards: '#F5A623',
  },
  confidence: {
    low: '#F97316',
    high: '#10B981',
    lowHighlight: '#FED7AA',
    selectedHighlight: '#CFFAFE',
  },
  highlight: {
    word: '#B39DDB',
  },
} as const;

export type Colors = typeof lightColors;
