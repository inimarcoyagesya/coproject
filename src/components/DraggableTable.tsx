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

const initialRows: DataRow[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User", status: "Inactive" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "User", status: "Active" },
];

// Komponen untuk header kolom yang dapat di-drag
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
      className="px-4 py-2 bg-green-600 text-white"
    >
      {label}
    </th>
  );
}

// Komponen untuk baris tabel yang dapat di-drag
interface DraggableRowProps {
  row: DataRow;
}
function DraggableRow({ row }: DraggableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id.toString() });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };
  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td className="px-4 py-2">{row.name}</td>
      <td className="px-4 py-2">{row.email}</td>
      <td className="px-4 py-2">{row.role}</td>
      <td className="px-4 py-2">{row.status}</td>
    </tr>
  );
}

export default function DraggableTable() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [rows, setRows] = useState<DataRow[]>(initialRows);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Fungsi untuk mengatur drag dan drop kolom
  const handleColumnDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
      setColumns((cols) => arrayMove(cols, oldIndex, newIndex));
    }
  };

  // Fungsi untuk mengatur drag dan drop baris
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          {/* DndContext dan SortableContext untuk kolom */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleColumnDragEnd}>
            <SortableContext items={columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
              <tr>
                {columns.map((column) => (
                  <DraggableHeaderCell key={column.id} id={column.id} label={column.label} />
                ))}
              </tr>
            </SortableContext>
          </DndContext>
        </thead>
        {/* DndContext dan SortableContext untuk baris */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleRowDragEnd}>
          <SortableContext items={rows.map((row) => row.id.toString())} strategy={verticalListSortingStrategy}>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </tbody>
          </SortableContext>
        </DndContext>
      </table>
    </div>
  );
}
