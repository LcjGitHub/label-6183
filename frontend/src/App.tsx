import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import 'dayjs/locale/zh-cn';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { CatListPage } from './pages/CatListPage';
import { CatDetailPage } from './pages/CatDetailPage';

const theme = createTheme({
  primaryColor: 'orange',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
});

export function App() {
  return (
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: 'zh-cn', firstDayOfWeek: 1 }}>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<CatListPage />} />
              <Route path="/cats/:id" element={<CatDetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DatesProvider>
    </MantineProvider>
  );
}
