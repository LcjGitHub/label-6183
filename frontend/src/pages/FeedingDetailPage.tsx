import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  Select,
  SegmentedControl,
  Stack,
  Text,
  Timeline,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useFeedingStore } from '../store';

const WEATHER_OPTIONS = [
  { value: '晴天', label: '☀️ 晴天' },
  { value: '阴天', label: '☁️ 阴天' },
  { value: '雨天', label: '🌧️ 雨天' },
  { value: '雪天', label: '❄️ 雪天' },
];

const WEATHER_COLOR_MAP: Record<string, string> = {
  '晴天': 'yellow',
  '阴天': 'gray',
  '雨天': 'blue',
  '雪天': 'cyan',
};

const WEATHER_DOT_MAP: Record<string, string> = {
  '晴天': 'yellow',
  '阴天': 'gray',
  '雨天': 'blue',
  '雪天': 'cyan',
};

/** 投喂记录详情页 */
export function FeedingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recordId = Number(id);
  const {
    records,
    currentRecord,
    listLoading,
    detailLoading,
    error,
    fetchRecords,
    fetchRecord,
    updateRecord,
    deleteRecord,
    clearError,
  } = useFeedingStore();

  const [detailFetched, setDetailFetched] = useState(false);
  const [timelineScope, setTimelineScope] = useState<'location' | 'all'>('location');
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [form, setForm] = useState({
    feeding_date: new Date(),
    location: '',
    cat_food_type: '',
    quantity: '',
    weather: '',
    remark: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDetailFetched(false);
    if (recordId) fetchRecord(recordId);
  }, [recordId, fetchRecord]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    if (!detailLoading) setDetailFetched(true);
  }, [detailLoading]);

  useEffect(() => {
    if (currentRecord) {
      setForm({
        feeding_date: dayjs(currentRecord.feeding_date).toDate(),
        location: currentRecord.location,
        cat_food_type: currentRecord.cat_food_type,
        quantity: currentRecord.quantity,
        weather: currentRecord.weather ?? '',
        remark: currentRecord.remark ?? '',
      });
    }
  }, [currentRecord]);

  const timelineRecords = useMemo(() => {
    const base = timelineScope === 'location' && currentRecord
      ? records.filter((r) => r.location === currentRecord.location)
      : records;
    return [...base].sort(
      (a, b) => b.feeding_date.localeCompare(a.feeding_date) || b.id - a.id
    );
  }, [records, timelineScope, currentRecord]);

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await updateRecord(recordId, {
        feeding_date: dayjs(form.feeding_date).format('YYYY-MM-DD'),
        location: form.location,
        cat_food_type: form.cat_food_type,
        quantity: form.quantity,
        weather: form.weather || null,
        remark: form.remark || null,
      });
      closeEdit();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('确定删除这条投喂记录？')) return;
    await deleteRecord(recordId);
    navigate('/');
  };

  if (detailLoading || listLoading) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  if (detailFetched && !currentRecord) {
    return (
      <Stack>
        <Anchor component={Link} to="/">
          ← 返回列表
        </Anchor>
        <Text c="dimmed">投喂记录不存在或已被删除</Text>
      </Stack>
    );
  }

  if (!currentRecord) {
    return null;
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Anchor component={Link} to="/" size="sm">
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
          <Group gap="xs">
            <Title order={2}>{currentRecord.feeding_date}</Title>
            {currentRecord.weather && (
              <Badge variant="light" color={WEATHER_COLOR_MAP[currentRecord.weather] || 'gray'}>
                {currentRecord.weather}
              </Badge>
            )}
          </Group>
          <Text size="sm" c="dimmed">
            记录编号 #{currentRecord.id}
          </Text>
        </Group>
        <Stack gap="md">
          <Group>
            <Text w={100} fw={500} c="dimmed">
              投喂日期
            </Text>
            <Text>{currentRecord.feeding_date}</Text>
          </Group>
          <Group>
            <Text w={100} fw={500} c="dimmed">
              投喂地点
            </Text>
            <Text>{currentRecord.location}</Text>
          </Group>
          <Group>
            <Text w={100} fw={500} c="dimmed">
              猫粮种类
            </Text>
            <Text>{currentRecord.cat_food_type}</Text>
          </Group>
          <Group>
            <Text w={100} fw={500} c="dimmed">
              投喂量
            </Text>
            <Text>{currentRecord.quantity}</Text>
          </Group>
          <Group>
            <Text w={100} fw={500} c="dimmed">
              天气
            </Text>
            <Text>{currentRecord.weather ?? '未记录'}</Text>
          </Group>
          {currentRecord.remark && (
            <Stack gap={4}>
              <Text fw={500} c="dimmed">
                备注
              </Text>
              <Text style={{ whiteSpace: 'pre-wrap' }}>{currentRecord.remark}</Text>
            </Stack>
          )}
          {currentRecord.created_at && (
            <Text size="xs" c="dimmed" mt="md">
              创建时间：{currentRecord.created_at}
            </Text>
          )}
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>投喂时间线</Title>
          <SegmentedControl
            size="sm"
            value={timelineScope}
            onChange={(v) => setTimelineScope(v as 'location' | 'all')}
            data={[
              { value: 'location', label: '同地点' },
              { value: 'all', label: '全部' },
            ]}
          />
        </Group>
        {timelineRecords.length === 0 ? (
          <Text c="dimmed" size="sm">
            暂无记录
          </Text>
        ) : (
          <Timeline active={timelineRecords.findIndex((r) => r.id === currentRecord.id)} bulletSize={18} lineWidth={2}>
            {timelineRecords.map((r) => {
              const isCurrent = r.id === currentRecord.id;
              return (
                <Timeline.Item
                  key={r.id}
                  bullet={isCurrent ? '📍' : (r.weather ? null : undefined)}
                  color={r.weather ? WEATHER_DOT_MAP[r.weather] || 'gray' : 'gray'}
                  title={
                    <Group gap="xs" align="center">
                      {isCurrent ? (
                        <Text fw={700} c="orange" size="sm">
                          {r.feeding_date}
                        </Text>
                      ) : (
                        <Text
                          component={Link}
                          to={`/feeding/${r.id}`}
                          fw={500}
                          size="sm"
                          style={{ textDecoration: 'none' }}
                        >
                          {r.feeding_date}
                        </Text>
                      )}
                      {r.weather && (
                        <Badge
                          variant="light"
                          color={WEATHER_COLOR_MAP[r.weather] || 'gray'}
                          size="xs"
                        >
                          {r.weather}
                        </Badge>
                      )}
                      {isCurrent && (
                        <Badge color="orange" size="xs">
                          当前
                        </Badge>
                      )}
                    </Group>
                  }
                >
                  <Card withBorder padding="sm" radius="sm" variant={isCurrent ? 'filled' : 'light'} color={isCurrent ? 'orange' : 'gray'}>
                    <Stack gap={2}>
                      <Group>
                        <Text size="xs" c={isCurrent ? 'white' : 'dimmed'} w={60}>
                          地点
                        </Text>
                        <Text size="sm" c={isCurrent ? 'white' : 'inherit'}>
                          {r.location}
                        </Text>
                      </Group>
                      <Group>
                        <Text size="xs" c={isCurrent ? 'white' : 'dimmed'} w={60}>
                          猫粮
                        </Text>
                        <Text size="sm" c={isCurrent ? 'white' : 'inherit'}>
                          {r.cat_food_type} · {r.quantity}
                        </Text>
                      </Group>
                      {r.remark && (
                        <Text
                          size="xs"
                          c={isCurrent ? 'white' : 'dimmed'}
                          mt={4}
                          lineClamp={2}
                        >
                          {r.remark}
                        </Text>
                      )}
                    </Stack>
                  </Card>
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
      </Card>

      <Modal opened={editOpened} onClose={closeEdit} title="编辑投喂记录" centered>
        <Stack>
          <DateInput
            label="投喂日期"
            value={form.feeding_date}
            onChange={(v) => setForm({ ...form, feeding_date: v ?? new Date() })}
            valueFormat="YYYY-MM-DD"
            required
          />
          <TextInput
            label="投喂地点"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <TextInput
            label="猫粮种类"
            value={form.cat_food_type}
            onChange={(e) => setForm({ ...form, cat_food_type: e.target.value })}
            required
          />
          <TextInput
            label="投喂量"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
          <Select
            label="天气"
            placeholder="选择天气状况（选填）"
            data={WEATHER_OPTIONS}
            value={form.weather}
            onChange={(v) => setForm({ ...form, weather: v ?? '' })}
            clearable
          />
          <Textarea
            label="备注"
            value={form.remark}
            onChange={(e) => setForm({ ...form, remark: e.target.value })}
            minRows={2}
          />
          <Button
            onClick={handleUpdate}
            loading={submitting}
            disabled={!form.location || !form.cat_food_type || !form.quantity}
          >
            保存
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
