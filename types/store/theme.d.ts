type Theme = 'light' | 'dark' | 'default';

interface ThemeStoreActions {
  toggleTheme: (theme: Theme) => void;
}
interface ThemeStoreState {
  theme: Theme;
}
export type ThemeStore = ThemeStoreState & ThemeStoreActions;

export { Theme, ThemeStore, ThemeStoreActions, ThemeStoreState };
