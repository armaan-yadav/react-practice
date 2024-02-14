import { useState } from "react";
import Bin from "../icons/Bin";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}
const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [showBin, setShowBin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const toggleEditMode = () => {
    setShowBin(false);
    setEditMode(!editMode);
  };
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
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
        className="relative w-full bg-secondary rounded-lg  min-h-[100px] max-h-[100px]  flex items-center ring-1 ring-inset ring-rose-400 opacity-40"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      ></div>
    );
  }
  return (
    <div
      onClick={() => toggleEditMode()}
      className="relative w-full bg-secondary rounded-lg p-2.5 min-h-[100px] max-h-[100px]  flex items-center text-left hover:ring-1 hover:ring-inset hover:ring-rose-400 cursor-grab task"
      onMouseEnter={() => setShowBin(true)}
      onMouseLeave={() => setShowBin(false)}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {!editMode ? (
        <p className={`my-auto overflow-y-auto overflow-x-hidden h-[90%] w-full whitespace-pre-wrap ${task.columnId == '3' && `line-through`}`}>
          {task.content}
        </p>
      ) : (
        <textarea
          onChange={(e) => updateTask(task.id, e.target.value)}
          defaultValue={task.content}
          autoFocus
          onBlur={() => setEditMode(false)}
          onKeyDown={(e) => {
            if (e.key == "Enter" && e.shiftKey) setEditMode(false);
          }}
          className="bg-secondary outline-none w-full"
        />
      )}
      {showBin && !editMode && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          <Bin />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
