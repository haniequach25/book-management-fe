import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import AppLocale from './lngProvider';
import RoutesApp from './routes';
import { RootState, useAppDispatch } from './store';
import { updateWindowWidth } from './store/settingSlice';

const App: React.FC = () => {
  const { locale, isDarkMode } = useSelector((state: RootState) => state.setting);
  const dispatch = useAppDispatch();
  const currentAppLocale = (AppLocale as any)[locale.locale];
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  useEffect(() => {
    window.addEventListener('resize', () => {
      dispatch(updateWindowWidth(window.innerWidth));
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
        locale={currentAppLocale.antd}
      >
        <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
          <RoutesApp />
        </IntlProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
