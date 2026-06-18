import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Anchor,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  NumberInput,
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

/** 流浪猫目击标注详情页 */
export function CatSightingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recordId = Number(id);
  const {
    currentRecord,
    detailLoading,
    error,
    fetchRecord,
    updateRecord,
    deleteRecord,
    clearError,
  } = useCatSightingStore();

  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [form, setForm] = useState({
    cat_nickname: '',
    latitude: 0,
    longitude: 0,
    sighting_time: new Date(),
    location_description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (recordId) fetchRecord(recordId);
  }, [recordId, fetchRecord]);

  useEffect(() => {
    if (currentRecord) {
      setForm({
        cat_nickname: currentRecord.cat_nickname,
        latitude: currentRecord.latitude,
        longitude: currentRecord.longitude,
        sighting_time: dayjs(currentRecord.sighting_time).toDate(),
        location_description: currentRecord.location_description,
      });
    }
  }, [currentRecord]);

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await updateRecord(recordId, {
        cat_nickname: form.cat_nickname,
        latitude: form.latitude,
        longitude: form.longitude,
        sighting_time: dayjs(form.sighting_time).format('YYYY-MM-DD HH:mm:ss'),
        location_description: form.location_description,
      });
      closeEdit();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('确定删除这条目击标注？')) return;
    await deleteRecord(recordId);
    navigate('/sightings');
  };

  if (detailLoading) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  if (!currentRecord) {
    return (
      <Stack>
        <Anchor component={Link} to="/sightings">
          ← 返回列表
        </Anchor>
        <Text c="dimmed">目击标注不存在或已被删除</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Anchor component={Link} to="/sightings" size="sm">
          ← 返回列表
        </Anchor>
        <Group>
          <Button variant="light" size="xs" onClick={openEdit}>
            编辑
          </Button>
          <Button color="red" variant="light" size="xs" onClick={handleDelete}>
            删除
          </Button>
        </Group>
      </Group>

      {error && (
        <Alert color="red" withCloseButton onClose={clearError}>
          {error}
        </Alert>
      )}

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={2}>🐱 {currentRecord.cat_nickname}</Title>
          <Text size="sm" c="dimmed">
            标注编号 #{currentRecord.id}
          </Text>
        </Group>
        <Stack gap="md">
          <Group>
            <Text w={120} fw={500} c="dimmed">
              猫咪昵称
            </Text>
            <Text>{currentRecord.cat_nickname}</Text>
          </Group>
          <Group>
            <Text w={120} fw={500} c="dimmed">
              纬度
            </Text>
            <Text>{currentRecord.latitude}</Text>
          </Group>
          <Group>
            <Text w={120} fw={500} c="dimmed">
              经度
            </Text>
            <Text>{currentRecord.longitude}</Text>
          </Group>
          <Group>
            <Text w={120} fw={500} c="dimmed">
              坐标
            </Text>
            <Text>
              <Anchor
                href={`https://www.openstreetmap.org/?mlat=${currentRecord.latitude}&mlon=${currentRecord.longitude}#map=18/${currentRecord.latitude}/${currentRecord.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                📍 在地图中查看 ({currentRecord.latitude.toFixed(6)}, {currentRecord.longitude.toFixed(6)})
              </Anchor>
            </Text>
          </Group>
          <Group>
            <Text w={120} fw={500} c="dimmed">
              发现时间
            </Text>
            <Text>{currentRecord.sighting_time}</Text>
          </Group>
          <Stack gap={4}>
            <Text fw={500} c="dimmed">
              地点描述
            </Text>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{currentRecord.location_description}</Text>
          </Stack>
          {currentRecord.created_at && (
            <Text size="xs" c="dimmed" mt="md">
              创建时间：{currentRecord.created_at}
            </Text>
          )}
        </Stack>
      </Card>

      <Modal opened={editOpened} onClose={closeEdit} title="编辑目击标注" centered>
        <Stack>
          <TextInput
            label="猫咪昵称"
            value={form.cat_nickname}
            onChange={(e) => setForm({ ...form, cat_nickname: e.target.value })}
            required
          />
          <Group grow>
            <NumberInput
              label="纬度"
              value={form.latitude}
              onChange={(v) => setForm({ ...form, latitude: Number(v) || 0 })}
              decimalScale={6}
              required
            />
            <NumberInput
              label="经度"
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
            value={form.location_description}
            onChange={(e) => setForm({ ...form, location_description: e.target.value })}
            minRows={2}
            required
          />
          <Button
            onClick={handleUpdate}
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
