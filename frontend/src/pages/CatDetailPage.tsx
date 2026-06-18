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
  Timeline,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import type { ObservationLog } from '../types';
import { useCatStore } from '../store';

/** 单猫详情与观察 Timeline 页 */
export function CatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const catId = Number(id);
  const {
    currentCat,
    loading,
    error,
    fetchCat,
    updateCat,
    addLog,
    updateLog,
    deleteLog,
    clearError,
  } = useCatStore();

  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [logOpened, { open: openLog, close: closeLog }] = useDisclosure(false);
  const [editingLog, setEditingLog] = useState<ObservationLog | null>(null);

  const [catForm, setCatForm] = useState({
    nickname: '',
    fur_color: '',
    location: '',
    personality: '',
  });
  const [logForm, setLogForm] = useState({
    observed_at: new Date(),
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (catId) fetchCat(catId);
  }, [catId, fetchCat]);

  useEffect(() => {
    if (currentCat) {
      setCatForm({
        nickname: currentCat.nickname,
        fur_color: currentCat.fur_color,
        location: currentCat.location,
        personality: currentCat.personality,
      });
    }
  }, [currentCat]);

  const handleUpdateCat = async () => {
    setSubmitting(true);
    try {
      await updateCat(catId, catForm);
      closeEdit();
    } finally {
      setSubmitting(false);
    }
  };

  const openAddLog = () => {
    setEditingLog(null);
    setLogForm({ observed_at: new Date(), content: '' });
    openLog();
  };

  const openEditLog = (log: ObservationLog) => {
    setEditingLog(log);
    setLogForm({
      observed_at: dayjs(log.observed_at).toDate(),
      content: log.content,
    });
    openLog();
  };

  const handleSaveLog = async () => {
    if (!logForm.content || !logForm.observed_at) return;
    const dateStr = dayjs(logForm.observed_at).format('YYYY-MM-DD');
    setSubmitting(true);
    try {
      if (editingLog) {
        await updateLog(editingLog.id, dateStr, logForm.content);
      } else {
        await addLog(catId, dateStr, logForm.content);
      }
      closeLog();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLog = async (log: ObservationLog) => {
    if (!window.confirm('确定删除这条观察日志？')) return;
    await deleteLog(log.id);
  };

  if (loading && !currentCat) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  if (!currentCat) {
    return (
      <Stack>
        <Anchor component={Link} to="/">
          ← 返回列表
        </Anchor>
        <Text c="dimmed">猫咪不存在或已被删除</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Anchor component={Link} to="/" size="sm">
        ← 返回列表
      </Anchor>

      {error && (
        <Alert color="red" withCloseButton onClose={clearError}>
          {error}
        </Alert>
      )}

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={2}>{currentCat.nickname}</Title>
          <Button variant="light" size="xs" onClick={openEdit}>
            编辑档案
          </Button>
        </Group>
        <Stack gap="xs">
          <Text>
            <Text span fw={500}>
              毛色：
            </Text>
            {currentCat.fur_color}
          </Text>
          <Text>
            <Text span fw={500}>
              地点：
            </Text>
            {currentCat.location}
          </Text>
          <Text>
            <Text span fw={500}>
              性格：
            </Text>
            {currentCat.personality}
          </Text>
        </Stack>
      </Card>

      <Group justify="space-between">
        <Title order={3}>观察日志</Title>
        <Button size="sm" onClick={openAddLog}>
          新增日志
        </Button>
      </Group>

      {currentCat.logs.length === 0 ? (
        <Text c="dimmed" ta="center" py="lg">
          还没有观察记录，点击「新增日志」写下第一次见到 TA 的故事
        </Text>
      ) : (
        <Timeline active={currentCat.logs.length} bulletSize={24} lineWidth={2}>
          {currentCat.logs.map((log) => (
            <Timeline.Item key={log.id} title={log.observed_at}>
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Text size="sm" style={{ flex: 1 }}>
                  {log.content}
                </Text>
                <Group gap={4}>
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() => openEditLog(log)}
                    aria-label="编辑"
                  >
                    ✎
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    size="sm"
                    onClick={() => handleDeleteLog(log)}
                    aria-label="删除"
                  >
                    ✕
                  </ActionIcon>
                </Group>
              </Group>
            </Timeline.Item>
          ))}
        </Timeline>
      )}

      <Modal opened={editOpened} onClose={closeEdit} title="编辑猫咪档案" centered>
        <Stack>
          <TextInput
            label="昵称"
            value={catForm.nickname}
            onChange={(e) => setCatForm({ ...catForm, nickname: e.target.value })}
          />
          <TextInput
            label="毛色"
            value={catForm.fur_color}
            onChange={(e) => setCatForm({ ...catForm, fur_color: e.target.value })}
          />
          <TextInput
            label="常出没地点"
            value={catForm.location}
            onChange={(e) => setCatForm({ ...catForm, location: e.target.value })}
          />
          <Textarea
            label="性格"
            value={catForm.personality}
            onChange={(e) => setCatForm({ ...catForm, personality: e.target.value })}
            minRows={2}
          />
          <Button onClick={handleUpdateCat} loading={submitting}>
            保存
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={logOpened}
        onClose={closeLog}
        title={editingLog ? '编辑观察日志' : '新增观察日志'}
        centered
      >
        <Stack>
          <DateInput
            label="观察日期"
            value={logForm.observed_at}
            onChange={(v) => setLogForm({ ...logForm, observed_at: v ?? new Date() })}
            valueFormat="YYYY-MM-DD"
            required
          />
          <Textarea
            label="观察内容"
            placeholder="今天看到了什么？"
            value={logForm.content}
            onChange={(e) => setLogForm({ ...logForm, content: e.target.value })}
            minRows={3}
            required
          />
          <Button onClick={handleSaveLog} loading={submitting} disabled={!logForm.content}>
            保存
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
