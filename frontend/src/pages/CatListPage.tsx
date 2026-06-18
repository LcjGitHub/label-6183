import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCatStore } from '../store';

/** 猫咪档案列表页 */
export function CatListPage() {
  const { cats, loading, error, fetchCats, createCat, deleteCat, clearError } = useCatStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({
    nickname: '',
    fur_color: '',
    location: '',
    personality: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCats();
  }, [fetchCats]);

  const handleCreate = async () => {
    if (!form.nickname || !form.fur_color || !form.location || !form.personality) return;
    setSubmitting(true);
    try {
      await createCat(form);
      setForm({ nickname: '', fur_color: '', location: '', personality: '' });
      close();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, nickname: string) => {
    if (!window.confirm(`确定删除「${nickname}」及其全部观察日志？`)) return;
    await deleteCat(id);
  };

  if (loading && cats.length === 0) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={2}>猫咪档案</Title>
        <Button onClick={open}>新增猫咪</Button>
      </Group>

      {error && (
        <Alert color="red" withCloseButton onClose={clearError}>
          {error}
        </Alert>
      )}

      {cats.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          暂无猫咪档案，点击「新增猫咪」开始记录
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {cats.map((cat) => (
            <Card key={cat.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={700} size="lg" component={Link} to={`/cats/${cat.id}`} c="orange">
                  {cat.nickname}
                </Text>
                <Badge variant="light">{cat.log_count ?? 0} 条日志</Badge>
              </Group>
              <Stack gap={4}>
                <Text size="sm">
                  <Text span c="dimmed">
                    毛色：
                  </Text>
                  {cat.fur_color}
                </Text>
                <Text size="sm">
                  <Text span c="dimmed">
                    地点：
                  </Text>
                  {cat.location}
                </Text>
                <Text size="sm" lineClamp={2}>
                  <Text span c="dimmed">
                    性格：
                  </Text>
                  {cat.personality}
                </Text>
              </Stack>
              <Group mt="md" justify="space-between">
                <Button component={Link} to={`/cats/${cat.id}`} variant="light" size="xs">
                  查看详情
                </Button>
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => handleDelete(cat.id, cat.nickname)}
                  aria-label="删除"
                >
                  ✕
                </ActionIcon>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Modal opened={opened} onClose={close} title="新增猫咪" centered>
        <Stack>
          <TextInput
            label="昵称"
            placeholder="给 TA 起个名字"
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            required
          />
          <TextInput
            label="毛色"
            placeholder="如：橘色虎斑"
            value={form.fur_color}
            onChange={(e) => setForm({ ...form, fur_color: e.target.value })}
            required
          />
          <TextInput
            label="常出没地点"
            placeholder="如：社区南门花坛"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <Textarea
            label="性格"
            placeholder="描述 TA 的性格特点"
            value={form.personality}
            onChange={(e) => setForm({ ...form, personality: e.target.value })}
            required
            minRows={2}
          />
          <Button onClick={handleCreate} loading={submitting} disabled={!form.nickname}>
            保存
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
