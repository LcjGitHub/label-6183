import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
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
  const { records, listLoading, error, fetchRecords, createRecord, clearError, searchKeyword, setSearchKeyword } =
    useCatSightingStore();
  const [searchInput, setSearchInput] = useState(searchKeyword);
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState<{
    cat_nickname: string;
    latitude: string;
    longitude: string;
    sighting_time: Date;
    location_description: string;
    photo_url: string;
  }>({
    cat_nickname: '',
    latitude: '',
    longitude: '',
    sighting_time: new Date(),
    location_description: '',
    photo_url: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords(searchKeyword);
  }, [fetchRecords, searchKeyword]);

  const handleSearch = () => {
    setSearchKeyword(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchKeyword('');
  };

  const resetForm = () => {
    setForm({
      cat_nickname: '',
      latitude: '',
      longitude: '',
      sighting_time: new Date(),
      location_description: '',
      photo_url: '',
    });
    setValidationError(null);
  };

  const handleCreate = async () => {
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
      await createRecord({
        cat_nickname: form.cat_nickname,
        latitude: lat,
        longitude: lng,
        sighting_time: dayjs(form.sighting_time).format('YYYY-MM-DD HH:mm:ss'),
        location_description: form.location_description,
        photo_url: form.photo_url || null,
      });
      resetForm();
      close();
    } finally {
      setSubmitting(false);
    }
  };

  if (listLoading && records.length === 0) {
    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={2}>流浪猫目击地图</Title>
          <Button onClick={open}>新增标注</Button>
        </Group>
        <Group>
          <TextInput
            placeholder="输入昵称或地点搜索猫咪"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            style={{ flex: 1 }}
            leftSection={<span>🔍</span>}
          />
          <Button onClick={handleSearch} variant="filled">
            搜索
          </Button>
          <Button onClick={handleClearSearch} variant="light">
            清空
          </Button>
        </Group>
        <Group justify="center" py="xl">
          <Loader />
        </Group>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={2}>流浪猫目击地图</Title>
        <Button onClick={open}>新增标注</Button>
      </Group>

      <Group>
        <TextInput
          placeholder="输入昵称或地点搜索猫咪"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          style={{ flex: 1 }}
          leftSection={<span>🔍</span>}
        />
        <Button onClick={handleSearch} variant="filled">
          搜索
        </Button>
        <Button onClick={handleClearSearch} variant="light">
          清空
        </Button>
      </Group>

      {error && (
        <Alert color="red" withCloseButton onClose={clearError}>
          {error}
        </Alert>
      )}

      {listLoading && (
        <Group justify="center" py="sm">
          <Loader size="sm" />
        </Group>
      )}

      {records.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          {searchKeyword ? '未找到匹配的目击标注' : '暂无目击标注，点击「新增标注」开始登记'}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {records.map((r) => (
            <Card key={r.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Group align="flex-start" gap="md">
                <div style={{ flexShrink: 0, width: 80, height: 80 }}>
                  {r.photo_url ? (
                    <img
                      src={r.photo_url}
                      alt={r.cat_nickname}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        const parent = (e.currentTarget as HTMLImageElement).parentElement;
                        if (parent) {
                          parent.innerHTML = `<div style="width:80px;height:80px;border-radius:8px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#999;font-size:24px;">📷</div>`;
                        }
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: 24,
                      }}
                    >
                      📷
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
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
                  <Group mt="md">
                    <Button component={Link} to={`/sightings/${r.id}`} variant="light" size="xs">
                      查看详情
                    </Button>
                  </Group>
                </div>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Modal opened={opened} onClose={close} title="新增目击标注" centered>
        <Stack>
          {validationError && (
            <Alert color="red" withCloseButton onClose={() => setValidationError(null)}>
              {validationError}
            </Alert>
          )}
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
              value={form.latitude === '' ? undefined : Number(form.latitude)}
              onChange={(v) => setForm({ ...form, latitude: v === undefined ? '' : String(v) })}
              decimalScale={6}
              required
            />
            <NumberInput
              label="经度"
              placeholder="如：116.4074"
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
            placeholder="如：社区东门垃圾桶旁、公园长椅下"
            value={form.location_description}
            onChange={(e) => setForm({ ...form, location_description: e.target.value })}
            minRows={2}
            required
          />
          <TextInput
            label="照片地址（选填）"
            placeholder="如：https://example.com/cat.jpg"
            value={form.photo_url}
            onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
          />
          <Button
            onClick={handleCreate}
            loading={submitting}
          >
            保存
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
