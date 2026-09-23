"use client";

import React, { useState } from "react";
import { GripVertical, ArrowUp, ArrowDown, Trash2, ArrowUpToLine, ArrowDownToLine } from "lucide-react";

export interface DraggableItem {
  id: string;
  [key: string]: any;
}

interface DraggableListProps<T extends DraggableItem> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  onRemove?: (id: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T) => string;
  emptyMessage?: string;
}

export function DraggableList<T extends DraggableItem>({
  items,
  onReorder,
  onRemove,
  renderItem,
  keyExtractor = (item) => item.id,
  emptyMessage = "No items to display",
}: DraggableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Set a lightweight ghost image or text
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...items];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    onReorder(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(index - 1, 0, moved);
    onReorder(updated);
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(index + 1, 0, moved);
    onReorder(updated);
  };

  const moveToTop = (index: number) => {
    if (index <= 0) return;
    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.unshift(moved);
    onReorder(updated);
  };

  const moveToBottom = (index: number) => {
    if (index >= items.length - 1) return;
    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.push(moved);
    onReorder(updated);
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isDragging = draggedIndex === index;
        const isDragOver = dragOverIndex === index && draggedIndex !== index;

        return (
          <div
            key={keyExtractor(item)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`group relative flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 select-none ${
              isDragging
                ? "opacity-40 border-blue-500/50 bg-blue-500/10 scale-[0.99]"
                : isDragOver
                ? "border-blue-400 bg-white/10 shadow-lg scale-[1.01]"
                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
            }`}
          >
            {/* Drag Handle */}
            <div
              className="cursor-grab active:cursor-grabbing text-gray-500 group-hover:text-gray-300 p-1 rounded hover:bg-white/10 transition-colors flex items-center justify-center shrink-0"
              title="Drag up or down to reorder"
            >
              <GripVertical size={16} />
            </div>

            {/* Position Index Badge */}
            <span className="text-[11px] font-mono text-gray-500 w-5 text-center shrink-0">
              #{index + 1}
            </span>

            {/* Custom Content */}
            <div className="flex-1 min-w-0">
              {renderItem(item, index)}
            </div>

            {/* Up / Down Controls */}
            <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                title="Move Up"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => moveDown(index)}
                disabled={index === items.length - 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                title="Move Down"
              >
                <ArrowDown size={14} />
              </button>

              {items.length > 2 && (
                <>
                  <button
                    type="button"
                    onClick={() => moveToTop(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors hidden sm:inline-flex"
                    title="Move to Top"
                  >
                    <ArrowUpToLine size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveToBottom(index)}
                    disabled={index === items.length - 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors hidden sm:inline-flex"
                    title="Move to Bottom"
                  >
                    <ArrowDownToLine size={13} />
                  </button>
                </>
              )}

              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="p-1.5 rounded-lg text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-colors ml-1"
                  title="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
