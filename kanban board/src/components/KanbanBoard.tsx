import { useMemo, useState } from "react";
import Plus from "../icons/Plus";
import { Column, Id } from "../types";
import ColumnsContainer from "./ColumnsContainer";
import { DndContext, DragStartEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { generateID } from "../utils/utils";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  return (
    <div className="flex items-center w-full min-h-screen overflow-y-hidden overflow-x-hidden-auto m-auto px-[40px]">
      <DndContext onDragStart={onDragStart}>
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnsContainer
                  column={col}
                  deleteColumn={deleteColumn}
                  key={col.id}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className="bg-primary w-[350px] h-[60px] ring-rose-400 hover:ring-1 rounded-lg cursor-pointer flex items-center gap-3 px-3"
            onClick={() => createColumn()}
          >
            <Plus /> Add Column
          </button>
        </div>
      </DndContext>
    </div>
  );

  function createColumn() {
    const columnToAdd: Column = {
      id: generateID(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }
  function deleteColumn(id: Id) {
    const updatedColumns = columns.filter((column) => column.id !== id);
    setColumns(updatedColumns);
  }
  function onDragStart(event: DragStartEvent) {}
};

export default KanbanBoard;
