import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import 'dayjs/locale/zh-cn';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { FeedingListPage } from './pages/FeedingListPage';
import { FeedingDetailPage } from './pages/FeedingDetailPage';
import { HealthFollowupListPage } from './pages/HealthFollowupListPage';
import { HealthFollowupDetailPage } from './pages/HealthFollowupDetailPage';

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
              <Route path="/" element={<Navigate to="/feeding" replace />} />
              <Route path="/feeding" element={<FeedingListPage />} />
              <Route path="/feeding/:id" element={<FeedingDetailPage />} />
              <Route path="/followup" element={<HealthFollowupListPage />} />
              <Route path="/followup/:id" element={<HealthFollowupDetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DatesProvider>
    </MantineProvider>
  );
}
