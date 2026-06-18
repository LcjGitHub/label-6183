import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  Loader,
  Modal,
  NumberInput,
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
import { useHealthFollowupStore } from '../store';

const MENTAL_STATUS_OPTIONS = ['活泼好动', '精神一般', '萎靡不振', '嗜睡'];

/** 健康随访记录列表页 */
export function HealthFollowupListPage() {
  const { records, listLoading, error, fetchRecords, createRecord, deleteRecord, clearError } =
    useHealthFollowupStore();
  const [opened, { open, close }] = useDisclosure(false);
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
    fetchRecords();
  }, [fetchRecords]);

  const handleCreate = async () => {
    if (!form.cat_nickname || !form.followup_date || !form.weight || !form.mental_status) return;
    setSubmitting(true);
    try {
      await createRecord({
        cat_nickname: form.cat_nickname,
        followup_date: dayjs(form.followup_date).format('YYYY-MM-DD'),
        weight: Number(form.weight),
        mental_status: form.mental_status,
        went_doctor: form.went_doctor ? 1 : 0,
        remark: form.remark || null,
      });
      setForm({
        cat_nickname: '',
        followup_date: new Date(),
        weight: 0,
        mental_status: '活泼好动',
        went_doctor: false,
        remark: '',
      });
      close();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定删除这条随访记录？')) return;
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
        <Title order={2}>健康随访</Title>
        <Button onClick={open}>新增随访</Button>
      </Group>

      {error && (
        <Alert color="red" withCloseButton onClose={clearError}>
          {error}
        </Alert>
      )}

      {records.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          暂无随访记录，点击「新增随访」开始登记
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {records.map((r) => (
            <Card key={r.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={700} size="lg" component={Link} to={`/followup/${r.id}`} c="orange">
                  {r.cat_nickname}
                </Text>
                <Badge variant="light" color={r.went_doctor ? 'red' : 'green'}>
                  {r.went_doctor ? '已就医' : '未就医'}
                </Badge>
              </Group>
              <Stack gap={4}>
                <Text size="sm">
                  <Text span c="dimmed">
                    随访日期：
                  </Text>
                  {r.followup_date}
                </Text>
                <Text size="sm">
                  <Text span c="dimmed">
                    体重：
                  </Text>
                  {r.weight} kg
                </Text>
                <Text size="sm">
                  <Text span c="dimmed">
                    精神状态：
                  </Text>
                  {r.mental_status}
                </Text>
                {r.remark && (
                  <Text size="sm" lineClamp={2}>
                    <Text span c="dimmed">
                      备注：
                    </Text>
                    {r.remark}
                  </Text>
                )}
              </Stack>
              <Group mt="md" justify="space-between">
                <Button component={Link} to={`/followup/${r.id}`} variant="light" size="xs">
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

      <Modal opened={opened} onClose={close} title="新增健康随访记录" centered>
        <Stack>
          <TextInput
            label="猫咪昵称"
            placeholder="如：橘胖子、黑炭"
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
            placeholder="如：4.5"
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
            placeholder="记录当天的特别情况（选填）"
            value={form.remark}
            onChange={(e) => setForm({ ...form, remark: e.target.value })}
            minRows={2}
          />
          <Button
            onClick={handleCreate}
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
