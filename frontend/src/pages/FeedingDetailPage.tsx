import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ActionIcon,
  Alert,
  Anchor,
  Button,
  Card,
  Group,
  Loader,
  Modal,
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

/** 投喂记录详情页 */
export function FeedingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const { currentRecord, loading, error, fetchRecord, updateRecord, deleteRecord, clearError } =
    useFeedingStore();

  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [form, setForm] = useState({
    feeding_date: new Date(),
    location: '',
    cat_food_type: '',
    quantity: '',
    remark: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (recordId) fetchRecord(recordId);
  }, [recordId, fetchRecord]);

  useEffect(() => {
    if (currentRecord) {
      setForm({
        feeding_date: dayjs(currentRecord.feeding_date).toDate(),
        location: currentRecord.location,
        cat_food_type: currentRecord.cat_food_type,
        quantity: currentRecord.quantity,
        remark: currentRecord.remark ?? '',
      });
    }
  }, [currentRecord]);

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await updateRecord(recordId, {
        feeding_date: dayjs(form.feeding_date).format('YYYY-MM-DD'),
        location: form.location,
        cat_food_type: form.cat_food_type,
        quantity: form.quantity,
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
    window.location.href = '/';
  };

  if (loading && !currentRecord) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  if (!currentRecord) {
    return (
      <Stack>
        <Anchor component={Link} to="/">
          ← 返回列表
        </Anchor>
        <Text c="dimmed">投喂记录不存在或已被删除</Text>
      </Stack>
    );
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
          <Title order={2}>{currentRecord.feeding_date}</Title>
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
