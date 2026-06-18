import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  Loader,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useHealthFollowupStore } from '../store';

const MENTAL_STATUS_OPTIONS = ['活泼好动', '精神一般', '萎靡不振', '嗜睡'];

/** 健康随访记录详情页 */
export function HealthFollowupDetailPage() {
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
  } = useHealthFollowupStore();

  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [form, setForm] = useState({
    cat_nickname: '',
    followup_date: new Date(),
    weight: 0,
    mental_status: '活泼好动',
    went_doctor: false,
    remark: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (recordId) fetchRecord(recordId);
  }, [recordId, fetchRecord]);

  useEffect(() => {
    if (currentRecord) {
      setForm({
        cat_nickname: currentRecord.cat_nickname,
        followup_date: dayjs(currentRecord.followup_date).toDate(),
        weight: currentRecord.weight,
        mental_status: currentRecord.mental_status,
        went_doctor: currentRecord.went_doctor === 1,
        remark: currentRecord.remark ?? '',
      });
    }
  }, [currentRecord]);

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await updateRecord(recordId, {
        cat_nickname: form.cat_nickname,
        followup_date: dayjs(form.followup_date).format('YYYY-MM-DD'),
        weight: Number(form.weight),
        mental_status: form.mental_status,
        went_doctor: form.went_doctor ? 1 : 0,
        remark: form.remark || null,
      });
      closeEdit();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('确定删除这条随访记录？')) return;
    await deleteRecord(recordId);
    navigate('/followup');
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
        <Anchor component={Link} to="/followup">
          ← 返回列表
        </Anchor>
        <Text c="dimmed">随访记录不存在或已被删除</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Anchor component={Link} to="/followup" size="sm">
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
          <Title order={2}>{currentRecord.cat_nickname}</Title>
          <Group>
            <Badge variant="light" color={currentRecord.went_doctor ? 'red' : 'green'}>
              {currentRecord.went_doctor ? '已就医' : '未就医'}
            </Badge>
            <Text size="sm" c="dimmed">
              记录编号 #{currentRecord.id}
            </Text>
          </Group>
        </Group>
        <Stack gap="md">
          <Group>
            <Text w={100} fw={500} c="dimmed">
              随访日期
            </Text>
            <Text>{currentRecord.followup_date}</Text>
          </Group>
          <Group>
            <Text w={100} fw={500} c="dimmed">
              体重
            </Text>
            <Text>{currentRecord.weight} kg</Text>
          </Group>
          <Group>
            <Text w={100} fw={500} c="dimmed">
              精神状态
            </Text>
            <Text>{currentRecord.mental_status}</Text>
          </Group>
          <Group>
            <Text w={100} fw={500} c="dimmed">
              是否就医
            </Text>
            <Text>{currentRecord.went_doctor ? '是' : '否'}</Text>
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

      <Modal opened={editOpened} onClose={closeEdit} title="编辑健康随访记录" centered>
        <Stack>
          <TextInput
            label="猫咪昵称"
            value={form.cat_nickname}
            onChange={(e) => setForm({ ...form, cat_nickname: e.target.value })}
            required
          />
          <DateInput
            label="随访日期"
            value={form.followup_date}
            onChange={(v) => setForm({ ...form, followup_date: v ?? new Date() })}
            valueFormat="YYYY-MM-DD"
            required
          />
          <NumberInput
            label="体重（kg）"
            value={form.weight}
            onChange={(v) => setForm({ ...form, weight: Number(v) })}
            min={0}
            step={0.1}
            required
          />
          <Select
            label="精神状态"
            data={MENTAL_STATUS_OPTIONS}
            value={form.mental_status}
            onChange={(v) => setForm({ ...form, mental_status: v ?? '活泼好动' })}
            required
          />
          <Checkbox
            label="本次是否就医"
            checked={form.went_doctor}
            onChange={(e) => setForm({ ...form, went_doctor: e.currentTarget.checked })}
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
            disabled={!form.cat_nickname || !form.weight || !form.mental_status}
          >
            保存
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
