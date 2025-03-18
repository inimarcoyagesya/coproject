import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Column {
  id: string;
  label: string;
}

const initialColumns: Column[] = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "status", label: "Status" },
];

interface DataRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

// Dummy data row
const initialRows: DataRow[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User", status: "Inactive" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "User", status: "Active" },
];

// === Draggable Header Cell ===
interface DraggableHeaderCellProps {
  id: string;
  label: string;
}

function DraggableHeaderCell({ id, label }: DraggableHeaderCellProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };
  return (
    <th
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="px-4 py-2 bg-blue-900 text-white dark:bg-gray-800 dark:text-gray-200 transition-colors"
    >
      {label}
    </th>
  );
}

// === Draggable Row ===
interface DraggableRowProps {
  row: DataRow;
}

function DraggableRow({ row }: DraggableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: row.id.toString(),
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };
  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-900 dark:text-gray-200 transition-colors"
    >
      <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{row.name}</td>
      <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{row.email}</td>
      <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{row.role}</td>
      <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{row.status}</td>
    </tr>
  );
}

// === Main Table ===
export default function DraggableTable() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [rows, setRows] = useState<DataRow[]>(initialRows);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Drag End Column
  const handleColumnDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
      setColumns((cols) => arrayMove(cols, oldIndex, newIndex));
    }
  };

  // Drag End Row
  const handleRowDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = rows.findIndex((row) => row.id.toString() === active.id);
      const newIndex = rows.findIndex((row) => row.id.toString() === over.id);
      setRows((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="overflow-x-auto">
      <DndContext sensors={sensors} collisionDetection={closestCenter}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
          <thead>
            <SortableContext items={columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
              <tr>
                {columns.map((column) => (
                  <DraggableHeaderCell key={column.id} id={column.id} label={column.label} />
                ))}
              </tr>
            </SortableContext>
          </thead>
          <tbody>
            <SortableContext items={rows.map((row) => row.id.toString())} strategy={verticalListSortingStrategy}>
              {rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}
