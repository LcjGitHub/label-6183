import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import 'dayjs/locale/zh-cn';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { FeedingListPage } from './pages/FeedingListPage';
import { FeedingDetailPage } from './pages/FeedingDetailPage';

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
              <Route path="/" element={<FeedingListPage />} />
              <Route path="/feeding/:id" element={<FeedingDetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DatesProvider>
    </MantineProvider>
  );
}
