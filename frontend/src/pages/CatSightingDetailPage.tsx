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

function InlineMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(longitude - 0.005).toFixed(6)}%2C${(latitude - 0.003).toFixed(6)}%2C${(longitude + 0.005).toFixed(6)}%2C${(latitude + 0.003).toFixed(6)}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <Stack gap={4}>
      <Text size="sm" fw={500} c="dimmed">
        坐标位置
      </Text>
      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #dee2e6' }}>
        <iframe
          title="目击位置地图"
          src={mapUrl}
          style={{ border: 0, width: '100%', height: 300 }}
          loading="lazy"
        />
      </div>
      <Anchor
        href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        size="xs"
        c="dimmed"
      >
        在 OpenStreetMap 中打开大图
      </Anchor>
    </Stack>
  );
}

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
  const [form, setForm] = useState<{
    cat_nickname: string;
    latitude: string;
    longitude: string;
    sighting_time: Date;
    location_description: string;
  }>({
    cat_nickname: '',
    latitude: '',
    longitude: '',
    sighting_time: new Date(),
    location_description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (recordId) fetchRecord(recordId);
  }, [recordId, fetchRecord]);

  useEffect(() => {
    if (currentRecord) {
      setForm({
        cat_nickname: currentRecord.cat_nickname,
        latitude: String(currentRecord.latitude),
        longitude: String(currentRecord.longitude),
        sighting_time: dayjs(currentRecord.sighting_time).toDate(),
        location_description: currentRecord.location_description,
      });
    }
  }, [currentRecord]);

  const handleUpdate = async () => {
    if (!form.cat_nickname || !form.location_description) {
      setValidationError('猫咪昵称和地点描述为必填项');
      return;
    }
    if (!form.latitude || !form.longitude) {
      setValidationError('纬度和经度为必填项，请填写坐标后再保存');
      return;
    }
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setValidationError('纬度和经度必须为有效数字');
      return;
    }
    setValidationError(null);
    setSubmitting(true);
    try {
      await updateRecord(recordId, {
        cat_nickname: form.cat_nickname,
        latitude: lat,
        longitude: lng,
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
          <InlineMap latitude={currentRecord.latitude} longitude={currentRecord.longitude} />
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
          {validationError && (
            <Alert color="red" withCloseButton onClose={() => setValidationError(null)}>
              {validationError}
            </Alert>
          )}
          <TextInput
            label="猫咪昵称"
            value={form.cat_nickname}
            onChange={(e) => setForm({ ...form, cat_nickname: e.target.value })}
            required
          />
          <Group grow>
            <NumberInput
              label="纬度"
              value={form.latitude === '' ? undefined : Number(form.latitude)}
              onChange={(v) => setForm({ ...form, latitude: v === undefined ? '' : String(v) })}
              decimalScale={6}
              required
            />
            <NumberInput
              label="经度"
              value={form.longitude === '' ? undefined : Number(form.longitude)}
              onChange={(v) => setForm({ ...form, longitude: v === undefined ? '' : String(v) })}
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
          >
            保存
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
