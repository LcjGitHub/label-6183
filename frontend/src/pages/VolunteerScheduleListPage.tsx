import { useEffect, useMemo, useState } from 'react';
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
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DatePicker, DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useVolunteerScheduleStore } from '../store';
import type { VolunteerSchedule } from '../types';

const emptyForm = {
  volunteer_name: '',
  duty_date: new Date(),
  area: '',
  phone: '',
  is_arrived: 0,
  remark: '',
};

/** 志愿者排班列表页 */
export function VolunteerScheduleListPage() {
  const { records, listLoading, error, fetchRecords, createRecord, updateRecord, deleteRecord, clearError } =
    useVolunteerScheduleStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingRecord, setEditingRecord] = useState<VolunteerSchedule | null>(null);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const groupedRecords = useMemo(() => {
    const groups: Record<string, VolunteerSchedule[]> = {};
    records.forEach((r) => {
      if (!groups[r.duty_date]) {
        groups[r.duty_date] = [];
      }
      groups[r.duty_date].push(r);
    });
    return groups;
  }, [records]);

  const dateCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    Object.keys(groupedRecords).forEach((date) => {
      map[date] = groupedRecords[date].length;
    });
    return map;
  }, [groupedRecords]);

  const filteredRecords = useMemo(() => {
    if (!filterDate) return records;
    return records.filter((r) => r.duty_date === filterDate);
  }, [records, filterDate]);

  const filteredGrouped = useMemo(() => {
    if (!filterDate) return groupedRecords;
    return filterDate in groupedRecords ? { [filterDate]: groupedRecords[filterDate] } : {};
  }, [groupedRecords, filterDate]);

  const sortedDates = useMemo(() => {
    return Object.keys(filteredGrouped).sort();
  }, [filteredGrouped]);

  const renderDay = (date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    const count = dateCountMap[dateStr] || 0;
    const isSelected = filterDate === dateStr;

    return (
      <div
        onClick={() => setFilterDate(isSelected ? null : dateStr)}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          cursor: 'pointer',
          borderRadius: '4px',
          backgroundColor: isSelected ? 'rgba(255, 140, 0, 0.1)' : 'transparent',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            fontWeight: isSelected ? 700 : 400,
            color: isSelected ? '#ff8c00' : 'inherit',
          }}
        >
          {date.getDate()}
        </span>
        {count > 0 && (
          <span
            style={{
              fontSize: '10px',
              padding: '0 4px',
              backgroundColor: '#ff8c00',
              color: 'white',
              borderRadius: '10px',
              lineHeight: '16px',
            }}
          >
            {count}人
          </span>
        )}
      </div>
    );
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setForm(emptyForm);
    open();
  };

  const openEditModal = (record: VolunteerSchedule) => {
    setEditingRecord(record);
    setForm({
      volunteer_name: record.volunteer_name,
      duty_date: new Date(record.duty_date),
      area: record.area,
      phone: record.phone,
      is_arrived: record.is_arrived,
      remark: record.remark || '',
    });
    open();
  };

  const handleSubmit = async () => {
    if (!form.volunteer_name || !form.duty_date || !form.area || !form.phone) return;
    setSubmitting(true);
    try {
      const payload = {
        volunteer_name: form.volunteer_name,
        duty_date: dayjs(form.duty_date).format('YYYY-MM-DD'),
        area: form.area,
        phone: form.phone,
        is_arrived: form.is_arrived,
        remark: form.remark || null,
      };
      if (editingRecord) {
        await updateRecord(editingRecord.id, payload);
      } else {
        await createRecord(payload);
      }
      close();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定删除这条排班记录？')) return;
    await deleteRecord(id);
  };

  const handleToggleArrived = async (record: VolunteerSchedule) => {
    await updateRecord(record.id, { is_arrived: record.is_arrived ? 0 : 1 });
  };

  const handleClearFilter = () => {
    setFilterDate(null);
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
        <Title order={2}>志愿者排班</Title>
        <Button onClick={openCreateModal}>新增排班</Button>
      </Group>

      {error && (
        <Alert color="red" withCloseButton onClose={clearError}>
          {error}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Text fw={700} size="lg">📅 排班日历</Text>
            {filterDate && (
              <Button variant="subtle" size="sm" onClick={handleClearFilter}>
                清除筛选
              </Button>
            )}
          </Group>
          <DatePicker
            value={filterDate ? new Date(filterDate) : null}
            onChange={(val: Date | null) => setFilterDate(val ? dayjs(val).format('YYYY-MM-DD') : null)}
            renderDay={renderDay}
            size="lg"
            style={{ width: '100%' }}
          />
          {filterDate && (
            <Group mt="md" justify="center">
              <Badge size="lg" color="orange" variant="light">
                当前筛选：{filterDate}，共 {filteredRecords.length} 条排班
              </Badge>
            </Group>
          )}
        </Card>

        <Stack gap="md">
          {filterDate && (
            <Group gap="md">
              <DateInput
                label="快速筛选"
                value={filterDate ? new Date(filterDate) : null}
                onChange={(v) => setFilterDate(v ? dayjs(v).format('YYYY-MM-DD') : null)}
                valueFormat="YYYY-MM-DD"
                placeholder="选择日期"
                clearable
              />
            </Group>
          )}

          {records.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              暂无排班记录，点击「新增排班」开始登记
            </Text>
          ) : sortedDates.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              所选日期暂无排班记录
            </Text>
          ) : (
            <Stack gap="lg" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {sortedDates.map((date) => (
                <Card key={date} shadow="sm" padding="md" radius="md" withBorder>
                  <Group justify="space-between" mb="sm">
                    <Text fw={700} size="md">
                      📅 {date}
                      <Badge ml="sm" variant="light">
                        {filteredGrouped[date].length} 人值班
                      </Badge>
                    </Text>
                  </Group>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                    {filteredGrouped[date].map((r) => (
                      <Card key={r.id} padding="sm" radius="sm" withBorder>
                        <Group justify="space-between" mb="xs">
                          <Text fw={600} size="sm" c="orange">
                            {r.volunteer_name}
                          </Text>
                          <Badge color={r.is_arrived ? 'green' : 'gray'} variant="light" size="sm">
                            {r.is_arrived ? '已到岗' : '未到岗'}
                          </Badge>
                        </Group>
                        <Stack gap={2}>
                          <Text size="xs">
                            <Text span c="dimmed">
                              区域：
                            </Text>
                            {r.area}
                          </Text>
                          <Text size="xs">
                            <Text span c="dimmed">
                              电话：
                            </Text>
                            {r.phone}
                          </Text>
                          <Text size="xs">
                            <Text span c="dimmed">
                              备注：
                            </Text>
                            {r.remark || '无'}
                          </Text>
                        </Stack>
                        <Group mt="xs" justify="space-between">
                          <Group gap={4}>
                            <Checkbox
                              size="xs"
                              label="已到岗"
                              checked={!!r.is_arrived}
                              onChange={() => handleToggleArrived(r)}
                            />
                          </Group>
                          <Group gap={4}>
                            <ActionIcon
                              color="orange"
                              variant="subtle"
                              size="sm"
                              onClick={() => openEditModal(r)}
                              aria-label="编辑"
                            >
                              ✏️
                            </ActionIcon>
                            <ActionIcon
                              color="red"
                              variant="subtle"
                              size="sm"
                              onClick={() => handleDelete(r.id)}
                              aria-label="删除"
                            >
                              ✕
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </SimpleGrid>

      <Modal opened={opened} onClose={close} title={editingRecord ? '编辑排班' : '新增排班'} centered>
        <Stack>
          <TextInput
            label="志愿者姓名"
            placeholder="请输入姓名"
            value={form.volunteer_name}
            onChange={(e) => setForm({ ...form, volunteer_name: e.target.value })}
            required
          />
          <DateInput
            label="值班日期"
            value={form.duty_date}
            onChange={(v) => setForm({ ...form, duty_date: v ?? new Date() })}
            valueFormat="YYYY-MM-DD"
            required
          />
          <TextInput
            label="负责区域"
            placeholder="如：社区北门、花园区域"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            required
          />
          <TextInput
            label="联系电话"
            placeholder="请输入联系电话"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <Checkbox
            label="是否已到岗"
            checked={!!form.is_arrived}
            onChange={(e) => setForm({ ...form, is_arrived: e.target.checked ? 1 : 0 })}
          />
          <Textarea
            label="备注"
            placeholder="记录特别情况（选填）"
            value={form.remark}
            onChange={(e) => setForm({ ...form, remark: e.target.value })}
            minRows={2}
          />
          <Button
            onClick={handleSubmit}
            loading={submitting}
            disabled={!form.volunteer_name || !form.area || !form.phone}
          >
            {editingRecord ? '保存修改' : '新增'}
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
