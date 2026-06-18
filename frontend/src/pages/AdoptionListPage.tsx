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
  Select,
  SimpleGrid,
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

const statusOptions = [
  { value: '待审核', label: '待审核' },
  { value: '已通过', label: '已通过' },
  { value: '已拒绝', label: '已拒绝' },
];

/** 领养意向列表页 */
export function AdoptionListPage() {
  const { records, listLoading, error, fetchRecords, createRecord, updateRecord, clearError } =
    useAdoptionStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({
    applicant_name: '',
    phone: '',
    cat_nickname: '',
    application_date: new Date(),
    remark: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleCreate = async () => {
    if (!form.applicant_name || !form.phone || !form.cat_nickname) return;
    setSubmitting(true);
    try {
      await createRecord({
        applicant_name: form.applicant_name,
        phone: form.phone,
        cat_nickname: form.cat_nickname,
        application_date: dayjs(form.application_date).format('YYYY-MM-DD'),
        application_status: '待审核',
        remark: form.remark || null,
      });
      setForm({
        applicant_name: '',
        phone: '',
        cat_nickname: '',
        application_date: new Date(),
        remark: '',
      });
      close();
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string | null) => {
    if (!newStatus) return;
    setStatusLoadingId(id);
    try {
      await updateRecord(id, { application_status: newStatus });
    } finally {
      setStatusLoadingId(null);
    }
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
        <Title order={2}>领养意向登记</Title>
        <Button onClick={open}>新增意向</Button>
      </Group>

      {error && (
        <Alert color="red" withCloseButton onClose={clearError}>
          {error}
        </Alert>
      )}

      {records.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          暂无领养意向，点击「新增意向」开始登记
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {records.map((r) => (
            <Card key={r.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={700} size="lg" component={Link} to={`/adoption/${r.id}`} c="orange">
                  {r.applicant_name}
                </Text>
                <Select
                  value={r.application_status}
                  onChange={(v) => handleStatusChange(r.id, v)}
                  data={statusOptions}
                  size="xs"
                  w={100}
                  allowDeselect={false}
                  disabled={statusLoadingId === r.id}
                  leftSection={
                    <Badge
                      color={statusColors[r.application_status] || 'gray'}
                      variant="light"
                      size="xs"
                      style={{ pointerEvents: 'none' }}
                    >
                      ●
                    </Badge>
                  }
                />
              </Group>
              <Stack gap={4}>
                <Text size="sm">
                  <Text span c="dimmed">
                    意向猫咪：
                  </Text>
                  {r.cat_nickname}
                </Text>
                <Text size="sm">
                  <Text span c="dimmed">
                    联系电话：
                  </Text>
                  {r.phone}
                </Text>
                <Text size="sm">
                  <Text span c="dimmed">
                    申请日期：
                  </Text>
                  {r.application_date}
                </Text>
                {r.remark && (
                  <Text size="sm" lineClamp={2}>
                    <Text span c="dimmed">
                      补充说明：
                    </Text>
                    {r.remark}
                  </Text>
                )}
              </Stack>
              <Group mt="md" justify="flex-start">
                <Button component={Link} to={`/adoption/${r.id}`} variant="light" size="xs">
                  查看详情
                </Button>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Modal opened={opened} onClose={close} title="新增领养意向" centered>
        <Stack>
          <TextInput
            label="申请人姓名"
            placeholder="请输入申请人姓名"
            value={form.applicant_name}
            onChange={(e) => setForm({ ...form, applicant_name: e.target.value })}
            required
          />
          <TextInput
            label="联系电话"
            placeholder="请输入联系电话"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <TextInput
            label="意向猫咪昵称"
            placeholder="请输入意向猫咪的昵称"
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
          <Textarea
            label="补充说明"
            placeholder="请输入补充说明（选填）"
            value={form.remark}
            onChange={(e) => setForm({ ...form, remark: e.target.value })}
            minRows={2}
          />
          <Button
            onClick={handleCreate}
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
