import { useEffect, useState } from 'react';
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
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useAdoptionStore } from '../store';

const statusColors: Record<string, string> = {
  '待审核': 'yellow',
  '已通过': 'green',
  '已拒绝': 'red',
};

/** 领养意向详情页 */
export function AdoptionDetailPage() {
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
  } = useAdoptionStore();

  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [form, setForm] = useState({
    applicant_name: '',
    phone: '',
    cat_nickname: '',
    application_date: new Date(),
    application_status: '待审核',
    remark: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (recordId) fetchRecord(recordId);
  }, [recordId, fetchRecord]);

  useEffect(() => {
    if (currentRecord) {
      setForm({
        applicant_name: currentRecord.applicant_name,
        phone: currentRecord.phone,
        cat_nickname: currentRecord.cat_nickname,
        application_date: dayjs(currentRecord.application_date).toDate(),
        application_status: currentRecord.application_status,
        remark: currentRecord.remark ?? '',
      });
    }
  }, [currentRecord]);

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await updateRecord(recordId, {
        applicant_name: form.applicant_name,
        phone: form.phone,
        cat_nickname: form.cat_nickname,
        application_date: dayjs(form.application_date).format('YYYY-MM-DD'),
        application_status: form.application_status,
        remark: form.remark || null,
      });
      closeEdit();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('确定删除这条领养意向？')) return;
    await deleteRecord(recordId);
    navigate('/adoption');
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
        <Anchor component={Link} to="/adoption">
          ← 返回列表
        </Anchor>
        <Text c="dimmed">领养意向不存在或已被删除</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" mt="sm">
        <Anchor component={Link} to="/adoption" size="sm">
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
          <Title order={2}>{currentRecord.applicant_name}</Title>
          <Group>
            <Badge color={statusColors[currentRecord.application_status] || 'gray'} variant="light">
              {currentRecord.application_status}
            </Badge>
            <Text size="sm" c="dimmed">
              记录编号 #{currentRecord.id}
            </Text>
          </Group>
        </Group>
        <Stack gap="md">
          <Group>
            <Text w={120} fw={500} c="dimmed">
              申请人姓名
            </Text>
            <Text>{currentRecord.applicant_name}</Text>
          </Group>
          <Group>
            <Text w={120} fw={500} c="dimmed">
              联系电话
            </Text>
            <Text>{currentRecord.phone}</Text>
          </Group>
          <Group>
            <Text w={120} fw={500} c="dimmed">
              意向猫咪
            </Text>
            <Text>{currentRecord.cat_nickname}</Text>
          </Group>
          <Group>
            <Text w={120} fw={500} c="dimmed">
              申请日期
            </Text>
            <Text>{currentRecord.application_date}</Text>
          </Group>
          <Group>
            <Text w={120} fw={500} c="dimmed">
              申请状态
            </Text>
            <Badge color={statusColors[currentRecord.application_status] || 'gray'} variant="light">
              {currentRecord.application_status}
            </Badge>
          </Group>
          <Stack gap={4}>
            <Text fw={500} c="dimmed">
              补充说明
            </Text>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{currentRecord.remark || '无'}</Text>
          </Stack>
          {currentRecord.created_at && (
            <Text size="xs" c="dimmed" mt="md">
              创建时间：{currentRecord.created_at}
            </Text>
          )}
        </Stack>
      </Card>

      <Modal opened={editOpened} onClose={closeEdit} title="编辑领养意向" centered>
        <Stack>
          <TextInput
            label="申请人姓名"
            value={form.applicant_name}
            onChange={(e) => setForm({ ...form, applicant_name: e.target.value })}
            required
          />
          <TextInput
            label="联系电话"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <TextInput
            label="意向猫咪昵称"
            value={form.cat_nickname}
            onChange={(e) => setForm({ ...form, cat_nickname: e.target.value })}
            required
          />
          <DateInput
            label="申请日期"
            value={form.application_date}
            onChange={(v) => setForm({ ...form, application_date: v ?? new Date() })}
            valueFormat="YYYY-MM-DD"
            required
          />
          <Select
            label="申请状态"
            value={form.application_status}
            onChange={(v) => setForm({ ...form, application_status: v ?? '待审核' })}
            data={[
              { value: '待审核', label: '待审核' },
              { value: '已通过', label: '已通过' },
              { value: '已拒绝', label: '已拒绝' },
            ]}
          />
          <Textarea
            label="补充说明"
            value={form.remark}
            onChange={(e) => setForm({ ...form, remark: e.target.value })}
            minRows={2}
          />
          <Button
            onClick={handleUpdate}
            loading={submitting}
            disabled={!form.applicant_name || !form.phone || !form.cat_nickname}
          >
            保存
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
