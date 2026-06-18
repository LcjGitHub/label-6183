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
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useCatSightingStore } from '../store';

/** 流浪猫目击标注列表页 */
export function CatSightingListPage() {
  const { records, listLoading, error, fetchRecords, createRecord, deleteRecord, clearError } =
    useCatSightingStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({
    cat_nickname: '',
    latitude: 0,
    longitude: 0,
    sighting_time: new Date(),
    location_description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleCreate = async () => {
    if (!form.cat_nickname || !form.location_description) return;
    setSubmitting(true);
    try {
      await createRecord({
        cat_nickname: form.cat_nickname,
        latitude: form.latitude,
        longitude: form.longitude,
        sighting_time: dayjs(form.sighting_time).format('YYYY-MM-DD HH:mm:ss'),
        location_description: form.location_description,
      });
      setForm({
        cat_nickname: '',
        latitude: 0,
        longitude: 0,
        sighting_time: new Date(),
        location_description: '',
      });
      close();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定删除这条目击标注？')) return;
    await deleteRecord(id);
  };

  if (listLoading && records.length === 0) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={2}>流浪猫目击地图</Title>
        <Button onClick={open}>新增标注</Button>
      </Group>

      {error && (
        <Alert color="red" withCloseButton onClose={clearError}>
          {error}
        </Alert>
      )}

      {records.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          暂无异见标注，点击「新增标注」开始登记
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {records.map((r) => (
            <Card key={r.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={700} size="lg" component={Link} to={`/sightings/${r.id}`} c="orange">
                  {r.cat_nickname}
                </Text>
                <Badge variant="light">📍 {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}</Badge>
              </Group>
              <Stack gap={4}>
                <Text size="sm">
                  <Text span c="dimmed">
                    发现时间：
                  </Text>
                  {r.sighting_time}
                </Text>
                <Text size="sm" lineClamp={3}>
                  <Text span c="dimmed">
                    地点描述：
                  </Text>
                  {r.location_description}
                </Text>
              </Stack>
              <Group mt="md" justify="space-between">
                <Button component={Link} to={`/sightings/${r.id}`} variant="light" size="xs">
                  查看详情
                </Button>
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => handleDelete(r.id)}
                  aria-label="删除"
                >
                  ✕
                </ActionIcon>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Modal opened={opened} onClose={close} title="新增目击标注" centered>
        <Stack>
          <TextInput
            label="猫咪昵称"
            placeholder="如：橘座、小黑、三花"
            value={form.cat_nickname}
            onChange={(e) => setForm({ ...form, cat_nickname: e.target.value })}
            required
          />
          <Group grow>
            <NumberInput
              label="纬度"
              placeholder="如：39.9042"
              value={form.latitude}
              onChange={(v) => setForm({ ...form, latitude: Number(v) || 0 })}
              decimalScale={6}
              required
            />
            <NumberInput
              label="经度"
              placeholder="如：116.4074"
              value={form.longitude}
              onChange={(v) => setForm({ ...form, longitude: Number(v) || 0 })}
              decimalScale={6}
              required
            />
          </Group>
          <DateTimePicker
            label="发现时间"
            value={form.sighting_time}
            onChange={(v) => setForm({ ...form, sighting_time: v ?? new Date() })}
            valueFormat="YYYY-MM-DD HH:mm"
            required
          />
          <Textarea
            label="地点描述"
            placeholder="如：社区东门垃圾桶旁、公园长椅下"
            value={form.location_description}
            onChange={(e) => setForm({ ...form, location_description: e.target.value })}
            minRows={2}
            required
          />
          <Button
            onClick={handleCreate}
            loading={submitting}
            disabled={!form.cat_nickname || !form.location_description}
          >
            保存
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
