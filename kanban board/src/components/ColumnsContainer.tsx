import { useMemo, useState } from "react";
import Bin from "../icons/Bin";
import Plus from "../icons/Plus";
import { Column, Id, Task } from "../types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  tasks: Array<Task>;
  deleteColumn: (id: Id) => void;
  updateTitle: (id: Id, title: string) => void;
  createTask: (id: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const ColumnsContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    updateTitle,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;
  const [editMode, setEditMode] = useState<boolean>(false);
  const tasksId = useMemo(() => {
    return tasks?.map((task) => task.id);
  }, [tasks]);
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        className="w-[350px] max-h-[500px] h-[500px] max-sm:h-[250px] rounded-lg flex flex-col opacity-40 border-2 border-rose-400 bg-primary"
        ref={setNodeRef}
        style={style}
      ></div>
    );
  }

  return (
    <div
      className="w-[350px] max-h-[500px] h-[500px] bg-primary rounded-lg flex flex-col max-sm:h-[350px]"
      ref={setNodeRef}
      style={style}
    >
      {/* column title */}
      <div
        className={`w-full bg-secondary min-h-[60px] rounded-lg text-lg ${
          !editMode && `hover:ring-1`
        } ring-rose-400 flex items-center px-3 justify-between font-bold`}
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
      >
        {!editMode ? (
          column.title
        ) : (
          <input
            value={column.title}
            type="text"
            autoFocus
            defaultValue={column.title}
            onBlur={() => {
              setEditMode(false);
            }}
            className="bg-secondary rounded-lg outline ring-rose-400 ring-2 p-2"
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditMode(false);
            }}
            onChange={(e) => updateTitle(column.id, e.target.value)}
          />
        )}
        <button onClick={() => deleteColumn(column.id)}>
          {" "}
          <Bin />
        </button>
      </div>

      {/* column tasks */}

      <div className="flex flex-grow flex-col gap-6 overflow-y-auto p-2">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard
              task={task}
              key={task.id}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      {/* column footer */}
      <div
        className="w-full bg-primary min-h-[60px] rounded-lg text-lg hover:ring-1 ring-rose-400 flex items-center px-3 gap-2 cursor-pointer hover:text-rose-400 hover:bg-secondary"
        onClick={() => createTask(column.id)}
      >
        <Plus /> Add Task
      </div>
    </div>
  );
};

export default ColumnsContainer;
