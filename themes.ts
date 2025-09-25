export interface Theme {
  key: string;
  name: string;
  colors: {
    'brand-primary': string;
    'brand-secondary': string;
    'brand-bg-dark': string;
    'brand-bg-light': string;
    'brand-text': string;
    'brand-text-secondary': string;
    'brand-border': string;
  };
  fontFamily?: string;
}

export const themes: Record<string, Theme> = {
  dark: {
    key: 'dark',
    name: '深色 (預設)',
    colors: {
      'brand-primary': '#107C41',
      'brand-secondary': '#1E4620',
      'brand-bg-dark': '#1A1A1A',
      'brand-bg-light': '#2D2D2D',
      'brand-text': '#E0E0E0',
      'brand-text-secondary': '#A0A0A0',
      'brand-border': '#444444',
    },
  },
  light: {
    key: 'light',
    name: 'Material 淺色',
    colors: {
      'brand-primary': '#1E88E5',
      'brand-secondary': '#1565C0',
      'brand-bg-dark': '#FFFFFF',
      'brand-bg-light': '#F5F5F5',
      'brand-text': '#212121',
      'brand-text-secondary': '#757575',
      'brand-border': '#E0E0E0',
    },
  },
  amoled: {
    key: 'amoled',
    name: 'AMOLED 黑色',
    colors: {
      'brand-primary': '#BB86FC',
      'brand-secondary': '#3700B3',
      'brand-bg-dark': '#000000',
      'brand-bg-light': '#121212',
      'brand-text': '#FFFFFF',
      'brand-text-secondary': '#B0B0B0',
      'brand-border': '#272727',
    },
  },
  retro: {
    key: 'retro',
    name: '復古 90年代',
    colors: {
      'brand-primary': '#008080',
      'brand-secondary': '#000080',
      'brand-bg-dark': '#C0C0C0',
      'brand-bg-light': '#E0E0E0',
      'brand-text': '#000000',
      'brand-text-secondary': '#404040',
      'brand-border': '#808080',
    },
    fontFamily: '"Courier New", Courier, monospace',
  },
};
