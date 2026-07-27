import { useMemo, useState } from 'react'
import {
  Card,
  TableContainer,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Avatar,
  FlexLayout,
  StackLayout,
  StatusIndicator,
  Text,
} from '@salt-ds/core'
import type { AvatarProps } from '@salt-ds/core'
import { SearchInput } from '@salt-ds/lab'
import { ArrowUpIcon, ArrowDownIcon } from '@salt-ds/icons'

type UserStatus = 'Active' | 'Invited' | 'Suspended'

interface UserRow {
  name: string
  email: string
  role: string
  status: UserStatus
  lastActive: string
  // Separate sortable value from the display string above - "2h ago" and
  // "3d ago" don't compare correctly as text, so sorting needs a real number.
  lastActiveMinutes: number
  color: NonNullable<AvatarProps['color']>
}

const USERS: UserRow[] = [
  { name: 'Ava Chen', email: 'ava.chen@example.com', role: 'Admin', status: 'Active', lastActive: '5m ago', lastActiveMinutes: 5, color: 'category-1' },
  { name: 'Marcus Lee', email: 'marcus.lee@example.com', role: 'Editor', status: 'Active', lastActive: '22m ago', lastActiveMinutes: 22, color: 'category-3' },
  { name: 'Priya Nair', email: 'priya.nair@example.com', role: 'Editor', status: 'Invited', lastActive: '—', lastActiveMinutes: Infinity, color: 'category-5' },
  { name: 'Tom Baker', email: 'tom.baker@example.com', role: 'Viewer', status: 'Active', lastActive: '2h ago', lastActiveMinutes: 120, color: 'category-7' },
  { name: 'Elena Ruiz', email: 'elena.ruiz@example.com', role: 'Admin', status: 'Suspended', lastActive: '3d ago', lastActiveMinutes: 4320, color: 'category-9' },
  { name: 'Noah Kim', email: 'noah.kim@example.com', role: 'Viewer', status: 'Active', lastActive: '1h ago', lastActiveMinutes: 60, color: 'category-11' },
  { name: 'Sofia Brandt', email: 'sofia.brandt@example.com', role: 'Editor', status: 'Active', lastActive: '4h ago', lastActiveMinutes: 240, color: 'category-13' },
]

const STATUS_INDICATOR: Record<UserStatus, 'success' | 'info' | 'error'> = {
  Active: 'success',
  Invited: 'info',
  Suspended: 'error',
}

type SortKey = 'name' | 'role' | 'status' | 'lastActiveMinutes'

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'lastActiveMinutes', label: 'Last active' },
]

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  })

  // Recomputes only when the search term, sort column/direction, or the
  // underlying data actually changes - not on every render (e.g. when the
  // theme toggles or an unrelated ancestor re-renders).
  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    const filtered = term
      ? USERS.filter(
          (user) =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.role.toLowerCase().includes(term),
        )
      : USERS

    return [...filtered].sort((a, b) => {
      const aValue = a[sort.key]
      const bValue = b[sort.key]
      const comparison =
        typeof aValue === 'number' && typeof bValue === 'number'
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue))
      return sort.direction === 'asc' ? comparison : -comparison
    })
  }, [search, sort])

  function toggleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' },
    )
  }

  return (
    <Card className="chart-panel">
      <StackLayout gap={3}>
        <SearchInput
          className="users-search"
          inputProps={{ placeholder: 'Search by name, email, or role' }}
          value={search}
          onChange={(_event, value) => setSearch(value)}
          onClear={() => setSearch('')}
          style={{ maxWidth: 360 }}
        />
        <TableContainer>
          <Table zebra aria-label="Users">
            <THead>
              <TR>
                {COLUMNS.map(({ key, label }) => {
                  const isActive = sort.key === key
                  return (
                    <TH key={key} aria-sort={isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}>
                      <button type="button" className="sortable-header" onClick={() => toggleSort(key)}>
                        {label}
                        {isActive &&
                          (sort.direction === 'asc' ? (
                            <ArrowUpIcon size={1} aria-hidden />
                          ) : (
                            <ArrowDownIcon size={1} aria-hidden />
                          ))}
                      </button>
                    </TH>
                  )
                })}
              </TR>
            </THead>
            <TBody>
              {visibleUsers.map((user) => (
                <TR key={user.email}>
                  <TD>
                    <FlexLayout align="center" gap={2}>
                      <Avatar name={user.name} color={user.color} size={1} />
                      <StackLayout gap={0}>
                        <Text>{user.name}</Text>
                        <Text styleAs="label" color="secondary">
                          {user.email}
                        </Text>
                      </StackLayout>
                    </FlexLayout>
                  </TD>
                  <TD>{user.role}</TD>
                  <TD>
                    <FlexLayout align="center" gap={1}>
                      <StatusIndicator status={STATUS_INDICATOR[user.status]} size={1} />
                      <Text>{user.status}</Text>
                    </FlexLayout>
                  </TD>
                  <TD>
                    <Text color="secondary">{user.lastActive}</Text>
                  </TD>
                </TR>
              ))}
              {visibleUsers.length === 0 && (
                <TR>
                  <TD colSpan={4}>
                    <Text color="secondary">No users match "{search}".</Text>
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </TableContainer>
      </StackLayout>
    </Card>
  )
}
