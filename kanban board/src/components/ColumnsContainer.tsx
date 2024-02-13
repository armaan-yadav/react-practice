import { useState } from "react";
import Bin from "../icons/Bin";
import Plus from "../icons/Plus";
import { Column, Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { generateID } from "../utils/utils";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

const ColumnsContainer = (props: Props) => {
  const { column, deleteColumn } = props;
  const [tasks, setTasks] = useState<Task[]>([]);
  const { setNodeRef, transform, transition, attributes, listeners } =
    useSortable({
      id: column.id,
      data: {
        type: "Column",
        column,
      },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const createTask = () => {
    const newTask: Task = {
      id: generateID(),
      description: "hello",
    };
    setTasks([...tasks, newTask]);
  };
  return (
    <div
      className="w-[350px] max-h-[500px] h-[500px] bg-primary rounded-lg flex flex-col"
      ref={setNodeRef}
      style={style}
    >
        {/* column title */}
      <div
        className="w-full bg-secondary h-[60px] rounded-lg text-lg hover:ring-1 ring-rose-400 flex items-center px-3 justify-between font-bold"
        {...attributes}
        {...listeners}
      >
        {column.title}
        <button onClick={() => deleteColumn(column.id)}>
          {" "}
          <Bin />
        </button>
      </div>

      {/* column tasks */}
      <div className="flex flex-grow flex-col gap-3 overflow-y-auto">
        {tasks.map((task) => (
          <div key={task.id}>{task.description + task.id}</div>
        ))}
      </div>

      {/* column footer */}
      <div
        className="w-full bg-secondary h-[60px] rounded-lg text-lg hover:ring-1 ring-rose-400 flex items-center px-3 gap-2"
        onClick={() => createTask()}
      >
        <Plus /> Add Task
      </div>
    </div>
  );
};

export default ColumnsContainer;
