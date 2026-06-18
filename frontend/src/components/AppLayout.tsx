import { AppShell, Container, Group, Text, Title } from '@mantine/core';
import { Outlet } from 'react-router-dom';

/** 应用整体布局 */
export function AppLayout() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Title order={3}>🐱 社区流浪猫投喂登记</Title>
            <Text size="sm" c="dimmed">
              记录每一次爱心投喂
            </Text>
          </Group>
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
