import { AppShell, Container, Group, Tabs, Text, Title } from '@mantine/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

/** 应用整体布局 */
export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  let activeTab = 'feeding';
  if (location.pathname.startsWith('/followup')) activeTab = 'followup';
  else if (location.pathname.startsWith('/sightings')) activeTab = 'sightings';
  else if (location.pathname.startsWith('/adoption')) activeTab = 'adoption';
  else if (location.pathname.startsWith('/volunteer')) activeTab = 'volunteer';

  const handleTabChange = (v: string | null) => {
    if (v === 'followup') navigate('/followup');
    else if (v === 'sightings') navigate('/sightings');
    else if (v === 'adoption') navigate('/adoption');
    else if (v === 'volunteer') navigate('/volunteer');
    else navigate('/feeding');
  };

  return (
    <AppShell header={{ height: 110 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h={60} justify="space-between">
            <Title order={3}>🐱 社区流浪猫管理系统</Title>
            <Text size="sm" c="dimmed">
              记录每一次爱心投喂、健康随访与目击标注
            </Text>
          </Group>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tabs.List>
              <Tabs.Tab value="feeding">🍽️ 投喂记录</Tabs.Tab>
              <Tabs.Tab value="followup">🏥 健康随访</Tabs.Tab>
              <Tabs.Tab value="sightings">🗺️ 目击地图</Tabs.Tab>
              <Tabs.Tab value="adoption">🏠 领养意向</Tabs.Tab>
              <Tabs.Tab value="volunteer">👥 志愿者排班</Tabs.Tab>
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
