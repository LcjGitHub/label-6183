import { AppShell, Container, Group, Tabs, Text, Title } from '@mantine/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

/** 应用整体布局 */
export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.startsWith('/followup') ? 'followup' : 'feeding';

  return (
    <AppShell header={{ height: 110 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h={60} justify="space-between">
            <Title order={3}>🐱 社区流浪猫管理系统</Title>
            <Text size="sm" c="dimmed">
              记录每一次爱心投喂与健康随访
            </Text>
          </Group>
          <Tabs value={activeTab} onChange={(v) => navigate(v === 'followup' ? '/followup' : '/feeding')}>
            <Tabs.List>
              <Tabs.Tab value="feeding">🍽️ 投喂记录</Tabs.Tab>
              <Tabs.Tab value="followup">🏥 健康随访</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
