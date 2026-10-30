"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

interface SortableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    dragHandle: React.ReactNode,
  ) => React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export const SortableList = <T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  className,
  itemClassName,
}: SortableListProps<T>) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(({ id }) => id === active.id);
    const newIndex = items.findIndex(({ id }) => id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id} className={itemClassName}>
              {(dragHandle) => renderItem(item, index, dragHandle)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

interface SortableItemProps {
  id: string;
  className?: string;
  children: (dragHandle: React.ReactNode) => React.ReactNode;
}

const SortableItem = ({ id, className, children }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "relative",
        isDragging && "z-10 opacity-80 shadow-lg",
        className,
      )}
    >
      {children(
        <button
          ref={setActivatorNodeRef}
          type="button"
          className="cursor-grab touch-none rounded-sm active:cursor-grabbing"
          aria-label="Drag to reorder section"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="text-foreground/40 size-4" />
        </button>,
      )}
    </div>
  );
};
