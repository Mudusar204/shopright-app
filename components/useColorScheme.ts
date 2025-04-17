import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useThemStore } from '@/store/theme.store';

export const useColorScheme = () => {
  const theme = useThemStore((state: any) => state.theme);
  const systemTheme = useSystemColorScheme();
  const appTheme =
    theme === 'default' ? (systemTheme ?? 'light') : theme;

  return appTheme;
};
