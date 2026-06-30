import { forwardRef, useState, type HTMLAttributes, type ReactNode, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';
import { ArrowDown, ArrowUp, SortVertical } from 'pixelarticons/react';
import { cn } from '../../lib/cn';
import { Checkbox } from '../Checkbox';
import styles from './Table.module.css';

/* ── Primitives ───────────────────────────────────────────────────── */

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  function Table({ className, ...rest }, ref) {
    return (
      <div className={styles.wrapper}>
        <table ref={ref} className={cn(styles.table, className)} {...rest} />
      </div>
    );
  },
);

export const TableHead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHead({ className, ...rest }, ref) {
    return <thead ref={ref} className={cn(styles.thead, className)} {...rest} />;
  },
);

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody({ className, ...rest }, ref) {
    return <tbody ref={ref} className={cn(styles.tbody, className)} {...rest} />;
  },
);

export const TableFoot = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableFoot({ className, ...rest }, ref) {
    return <tfoot ref={ref} className={cn(styles.tfoot, className)} {...rest} />;
  },
);

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  hoverable?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ className, selected, hoverable = true, ...rest }, ref) {
    return (
      <tr
        ref={ref}
        className={cn(styles.tr, className)}
        data-selected={selected || undefined}
        data-hoverable={hoverable || undefined}
        {...rest}
      />
    );
  },
);

export interface ThProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDir?: 'asc' | 'desc' | null;
  onSort?: () => void;
  align?: 'left' | 'center' | 'right';
}

export const Th = forwardRef<HTMLTableCellElement, ThProps>(
  function Th({ className, sortable, sortDir, onSort, align = 'left', children, ...rest }, ref) {
    return (
      <th
        ref={ref}
        className={cn(styles.th, sortable && styles.sortable, className)}
        data-align={align}
        onClick={sortable ? onSort : undefined}
        aria-sort={sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : undefined}
        {...rest}
      >
        <span className={styles.thInner}>
          {children}
          {sortable && (
            <span className={styles.sortIcon} aria-hidden="true">
              <SortIcon dir={sortDir ?? null} />
            </span>
          )}
        </span>
      </th>
    );
  },
);

export interface TdProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
}

export const Td = forwardRef<HTMLTableCellElement, TdProps>(
  function Td({ className, align = 'left', ...rest }, ref) {
    return <td ref={ref} className={cn(styles.td, className)} data-align={align} {...rest} />;
  },
);

/* ── DataTable ────────────────────────────────────────────────────── */

export interface DataTableColumn {
  key: string;
  header: ReactNode;
  cell: (row: Record<string, unknown>, index: number) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface DataTableProps extends Omit<HTMLAttributes<HTMLTableElement>, 'children'> {
  columns: DataTableColumn[];
  data: Record<string, unknown>[];
  rowKey: (row: Record<string, unknown>) => string;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectChange?: (keys: Set<string>) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string, dir: 'asc' | 'desc') => void;
  empty?: ReactNode;
}

export function DataTable({
  columns,
  data,
  rowKey,
  selectable,
  selectedKeys: controlledKeys,
  onSelectChange,
  sortKey,
  sortDir,
  onSort,
  empty = 'No data',
  className,
  ...rest
}: DataTableProps) {
  const [internalKeys, setInternalKeys] = useState<Set<string>>(new Set());
  const selectedKeys = controlledKeys ?? internalKeys;
  const setSelectedKeys = (keys: Set<string>) => {
    if (!controlledKeys) setInternalKeys(keys);
    onSelectChange?.(keys);
  };

  const allKeys = data.map(rowKey);
  const allSelected = allKeys.length > 0 && allKeys.every(k => selectedKeys.has(k));
  const someSelected = allKeys.some(k => selectedKeys.has(k)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(allKeys));
    }
  };

  const toggleRow = (key: string) => {
    const next = new Set(selectedKeys);
    next.has(key) ? next.delete(key) : next.add(key);
    setSelectedKeys(next);
  };

  const handleSort = (col: DataTableColumn) => {
    if (!col.sortable || !onSort) return;
    const next: 'asc' | 'desc' =
      sortKey === col.key && sortDir === 'asc' ? 'desc' : 'asc';
    onSort(col.key, next);
  };

  return (
    <Table className={className} {...rest}>
      <TableHead>
        <TableRow hoverable={false}>
          {selectable && (
            <Th style={{ width: 40 }}>
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
                aria-label="Select all"
              />
            </Th>
          )}
          {columns.map(col => (
            <Th
              key={col.key}
              style={col.width ? { width: col.width } : undefined}
              align={col.align}
              sortable={col.sortable}
              sortDir={sortKey === col.key ? (sortDir ?? null) : null}
              onSort={() => handleSort(col)}
            >
              {col.header}
            </Th>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.length === 0 ? (
          <TableRow hoverable={false}>
            <Td
              colSpan={columns.length + (selectable ? 1 : 0)}
              style={{ textAlign: 'center', padding: 'var(--space-7)', color: 'var(--color-fg-muted)' }}
            >
              {empty}
            </Td>
          </TableRow>
        ) : (
          data.map((row, i) => {
            const key = rowKey(row);
            const isSelected = selectedKeys.has(key);
            return (
              <TableRow key={key} selected={isSelected}>
                {selectable && (
                  <Td style={{ width: 40 }}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleRow(key)}
                      aria-label={`Select row ${i + 1}`}
                    />
                  </Td>
                )}
                {columns.map(col => (
                  <Td key={col.key} align={col.align}>
                    {col.cell(row, i)}
                  </Td>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

function SortIcon({ dir }: { dir: 'asc' | 'desc' | null }) {
  if (dir === 'asc')  return <ArrowUp width="10" height="10" />;
  if (dir === 'desc') return <ArrowDown width="10" height="10" />;
  return <SortVertical width="10" height="10" />;
}
