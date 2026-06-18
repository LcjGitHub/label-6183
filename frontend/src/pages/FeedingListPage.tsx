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
import { useFeedingStore } from '../store';

/** 投喂记录列表页 */
export function FeedingListPage() {
  const { records, listLoading, error, fetchRecords, createRecord, deleteRecord, clearError } =
    useFeedingStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({
    feeding_date: new Date(),
    location: '',
    cat_food_type: '',
    quantity: '',
    remark: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleCreate = async () => {
    if (!form.feeding_date || !form.location || !form.cat_food_type || !form.quantity) return;
    setSubmitting(true);
    try {
      await createRecord({
        feeding_date: dayjs(form.feeding_date).format('YYYY-MM-DD'),
        location: form.location,
        cat_food_type: form.cat_food_type,
        quantity: form.quantity,
        remark: form.remark || null,
      });
      setForm({
        feeding_date: new Date(),
        location: '',
        cat_food_type: '',
        quantity: '',
        remark: '',
      });
      close();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定删除这条投喂记录？')) return;
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
        <Title order={2}>投喂记录</Title>
        <Button onClick={open}>新增记录</Button>
      </Group>

      {error && (
        <Alert color="red" withCloseButton onClose={clearError}>
          {error}
        </Alert>
      )}

      {records.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          暂无投喂记录，点击「新增记录」开始登记
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {records.map((r) => (
            <Card key={r.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={700} size="lg" component={Link} to={`/feeding/${r.id}`} c="orange">
                  {r.feeding_date}
                </Text>
                <Badge variant="light">{r.cat_food_type}</Badge>
              </Group>
              <Stack gap={4}>
                <Text size="sm">
                  <Text span c="dimmed">
                    地点：
                  </Text>
                  {r.location}
                </Text>
                <Text size="sm">
                  <Text span c="dimmed">
                    投喂量：
                  </Text>
                  {r.quantity}
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
                <Button component={Link} to={`/feeding/${r.id}`} variant="light" size="xs">
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

      <Modal opened={opened} onClose={close} title="新增投喂记录" centered>
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
            placeholder="如：社区南门花坛边"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <TextInput
            label="猫粮种类"
            placeholder="如：伟嘉成猫粮、自制猫饭等"
            value={form.cat_food_type}
            onChange={(e) => setForm({ ...form, cat_food_type: e.target.value })}
            required
          />
          <TextInput
            label="投喂量"
            placeholder="如：约 150 克（一小碗）"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
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
            disabled={!form.location || !form.cat_food_type || !form.quantity}
          >
            保存
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
