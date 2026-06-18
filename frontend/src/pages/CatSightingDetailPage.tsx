import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
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
import { DateInput, DateTimePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useCatSightingStore, useCatFeedingStore } from '../store';

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
  const {
    records: feedingRecords,
    listLoading: feedingListLoading,
    error: feedingError,
    fetchRecords: fetchFeedingRecords,
    createRecord: createFeedingRecord,
    deleteRecord: deleteFeedingRecord,
    clearError: clearFeedingError,
  } = useCatFeedingStore();

  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [form, setForm] = useState<{
    cat_nickname: string;
    latitude: string;
    longitude: string;
    sighting_time: Date;
    location_description: string;
    photo_url: string;
    coat_color: string;
  }>({
    cat_nickname: '',
    latitude: '',
    longitude: '',
    sighting_time: new Date(),
    location_description: '',
    photo_url: '',
    coat_color: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [feedingOpened, { open: openFeeding, close: closeFeeding }] = useDisclosure(false);
  const [feedingForm, setFeedingForm] = useState({
    feeding_date: new Date(),
    food_type: '',
    quantity: '',
    remark: '',
  });
  const [feedingSubmitting, setFeedingSubmitting] = useState(false);
  const [feedingCreateError, setFeedingCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (recordId) fetchRecord(recordId);
  }, [recordId, fetchRecord]);

  useEffect(() => {
    if (recordId) {
      fetchFeedingRecords(recordId);
    }
  }, [recordId, fetchFeedingRecords]);

  useEffect(() => {
    if (currentRecord) {
      setForm({
        cat_nickname: currentRecord.cat_nickname,
        latitude: String(currentRecord.latitude),
        longitude: String(currentRecord.longitude),
        sighting_time: dayjs(currentRecord.sighting_time).toDate(),
        location_description: currentRecord.location_description,
        photo_url: currentRecord.photo_url ?? '',
        coat_color: currentRecord.coat_color ?? '',
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
        photo_url: form.photo_url || null,
        coat_color: form.coat_color || null,
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

  const handleCreateFeeding = async () => {
    if (!feedingForm.food_type || !feedingForm.quantity) return;
    setFeedingSubmitting(true);
    setFeedingCreateError(null);
    try {
      await createFeedingRecord({
        cat_sighting_id: recordId,
        feeding_date: dayjs(feedingForm.feeding_date).format('YYYY-MM-DD'),
        food_type: feedingForm.food_type,
        quantity: feedingForm.quantity,
        remark: feedingForm.remark || null,
      });
      setFeedingForm({
        feeding_date: new Date(),
        food_type: '',
        quantity: '',
        remark: '',
      });
      closeFeeding();
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { error?: string } } }).response;
        setFeedingCreateError(response?.data?.error || '新增投喂记录失败，请稍后重试');
      } else {
        setFeedingCreateError('新增投喂记录失败，请稍后重试');
      }
    } finally {
      setFeedingSubmitting(false);
    }
  };

  const handleDeleteFeeding = async (id: number) => {
    if (!window.confirm('确定删除这条投喂记录？')) return;
    await deleteFeedingRecord(id);
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
              毛色
            </Text>
            <Text>{currentRecord.coat_color || '未填写'}</Text>
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
          <Stack gap={4} mt="md">
            <Text fw={500} c="dimmed">
              照片
            </Text>
            {currentRecord.photo_url ? (
              <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #dee2e6' }}>
                <img
                  src={currentRecord.photo_url}
                  alt={currentRecord.cat_nickname}
                  style={{
                    width: '100%',
                    maxHeight: 400,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => {
                    const parent = (e.currentTarget as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div style="padding: 40px; text-align: center; background: #f8f9fa;">
                          <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
                          <div style="color: #999;">图片加载失败，请检查照片地址是否正确</div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  padding: 40,
                  textAlign: 'center',
                  background: '#f8f9fa',
                  borderRadius: 8,
                  border: '1px dashed #dee2e6',
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 8 }}>📷</div>
                <div style={{ color: '#999' }}>暂无照片，点击「编辑」添加猫咪照片</div>
              </div>
            )}
          </Stack>
          {currentRecord.created_at && (
            <Text size="xs" c="dimmed" mt="md">
              创建时间：{currentRecord.created_at}
            </Text>
          )}
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <Title order={3}>🍽️ 投喂记录</Title>
            <Badge variant="light" color="orange">
              共 {feedingRecords.length} 条
            </Badge>
          </Group>
          <Button size="sm" onClick={openFeeding}>
            + 新增投喂
          </Button>
        </Group>
        {feedingError && (
          <Alert color="red" withCloseButton onClose={clearFeedingError} mb="sm">
            {feedingError}
          </Alert>
        )}
        {feedingListLoading ? (
          <Group justify="center" py="md">
            <Loader size="sm" />
          </Group>
        ) : feedingRecords.length === 0 ? (
          <Text c="dimmed" size="sm" ta="center" py="md">
            暂无投喂记录，点击「新增投喂」开始记录
          </Text>
        ) : (
          <Stack gap="sm">
            {feedingRecords.map((r) => (
              <Card key={r.id} withBorder padding="sm" radius="sm">
                <Group justify="space-between" mb={4}>
                  <Group gap="xs">
                    <Text fw={600} size="sm">
                      {r.feeding_date}
                    </Text>
                    <Badge variant="light" size="xs">
                      {r.food_type}
                    </Badge>
                  </Group>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    size="sm"
                    onClick={() => handleDeleteFeeding(r.id)}
                    aria-label="删除投喂记录"
                  >
                    ✕
                  </ActionIcon>
                </Group>
                <Group>
                  <Text size="sm" c="dimmed">
                    投喂量：
                  </Text>
                  <Text size="sm">{r.quantity}</Text>
                </Group>
                <Text size="sm" c="dimmed" mt={4} lineClamp={2}>
                  备注：{r.remark || '无'}
                </Text>
              </Card>
            ))}
          </Stack>
        )}
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
          <TextInput
            label="毛色"
            placeholder="如：橘色、黑色、三花色、白色"
            value={form.coat_color}
            onChange={(e) => setForm({ ...form, coat_color: e.target.value })}
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
          <TextInput
            label="照片地址（选填）"
            placeholder="如：https://example.com/cat.jpg"
            value={form.photo_url}
            onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
          />
          <Button
            onClick={handleUpdate}
            loading={submitting}
          >
            保存
          </Button>
        </Stack>
      </Modal>

      <Modal opened={feedingOpened} onClose={closeFeeding} title="新增投喂记录" centered>
        <Stack>
          {feedingCreateError && (
            <Alert color="red" withCloseButton onClose={() => setFeedingCreateError(null)}>
              {feedingCreateError}
            </Alert>
          )}
          <DateInput
            label="投喂日期"
            value={feedingForm.feeding_date}
            onChange={(v) => setFeedingForm({ ...feedingForm, feeding_date: v ?? new Date() })}
            valueFormat="YYYY-MM-DD"
            required
          />
          <TextInput
            label="食物类型"
            placeholder="如：伟嘉成猫粮、自制猫饭等"
            value={feedingForm.food_type}
            onChange={(e) => setFeedingForm({ ...feedingForm, food_type: e.target.value })}
            required
          />
          <TextInput
            label="投喂量"
            placeholder="如：约 80 克、1 袋（85 克）等"
            value={feedingForm.quantity}
            onChange={(e) => setFeedingForm({ ...feedingForm, quantity: e.target.value })}
            required
          />
          <Textarea
            label="备注"
            placeholder="记录特别情况（选填）"
            value={feedingForm.remark}
            onChange={(e) => setFeedingForm({ ...feedingForm, remark: e.target.value })}
            minRows={2}
          />
          <Button
            onClick={handleCreateFeeding}
            loading={feedingSubmitting}
            disabled={!feedingForm.food_type || !feedingForm.quantity}
          >
            保存
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
