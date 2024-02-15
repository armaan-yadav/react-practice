import { useEffect, useMemo, useState } from "react";
import Plus from "../icons/Plus";
import { Column, Id, Task } from "../types";
import ColumnsContainer from "./ColumnsContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { generateID } from "../utils/utils";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import Navbar from "./Navbar";

const KanbanBoard = () => {
  const temp1 = localStorage.getItem("Columns");
  const value1 = JSON.parse(temp1!);
  const temp2 = localStorage.getItem("Tasks");
  const value2 = JSON.parse(temp2!);
  const [columns, setColumns] = useState<Column[]>(value1 || []);
  const [tasks, setTasks] = useState<Task[]>(value2 || []);

  const columnsId = useMemo(
    () => columns?.map((col: Column) => col.id),
    [columns]
  );
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  useEffect(() => {
    localStorage.setItem("Columns", JSON.stringify(columns));
  }, [columns]);
  useEffect(() => {
    localStorage.setItem("Tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center w-full h-[calc(100vh-55px)]  overflow-y-hidden max-sm:overflow-y-auto overflow-x-auto max-sm:overflow-x-hidden m-auto max-sm:mt-5 ">
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          sensors={sensors}
        >
          <div className="sm:m-auto flex gap-4 px-[40px]  max-sm:flex-col  max-sm:items-center">
            <div className="flex gap-4 max-sm:flex-col  max-sm:w-[90%]">
              <SortableContext items={columnsId}>
                {columns?.map((col) => (
                  <ColumnsContainer
                    tasks={tasks.filter((task) => task.columnId === col.id)}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateTitle={updateTitle}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    key={col.id}
                  />
                ))}
              </SortableContext>
            </div>
            <button
              className="bg-primary w-[350px] h-[60px] ring-rose-400 hover:ring-1 rounded-lg cursor-pointer flex items-center gap-3 px-3 "
              onClick={() => createColumn()}
            >
              <Plus /> Add Column
            </button>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnsContainer
                  createTask={createColumn}
                  column={activeColumn}
                  updateTask={updateTask}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                  deleteTask={deleteTask}
                  deleteColumn={deleteColumn}
                  updateTitle={updateTitle}
                />
              )}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </>
  );

  function createColumn() {
    const columnToAdd: Column = {
      id: generateID(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }
  function deleteColumn(columnid: Id) {
    const updatedColumns = columns.filter((column) => column.id !== columnid);
    setColumns(updatedColumns);

    const updatedTasks = tasks.filter((task) => task.columnId != columnid);
    setTasks(updatedTasks);
  }
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type == "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type == "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;
    //dropping a task over another task//
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id == activeId);
        const overIndex = tasks.findIndex((task) => task.id == overId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id == activeId);
        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
  function updateTitle(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;

      return { ...col, title };
    });

    setColumns(newColumns);
  }
  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateID(),
      content: `Task${tasks.length + 1}`,
      columnId,
    };
    setTasks([...tasks, newTask]);
  }
  function deleteTask(taskId: Id) {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  }
  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;

      return { ...task, content };
    });
    setTasks(newTasks);
  }
};

export default KanbanBoard;

/** const localColumns = JSON.parse(localStorage.getItem("Columns")!);
    console.log(localColumns.length);
    if (localColumns.length === 0) {
      localStorage.setItem("Columns", JSON.stringify(defaultColumns));
      console.log("first");
    }
    const localTasks = JSON.parse(localStorage.getItem("Columns")!);
    if (localTasks.length === 0) {
      localStorage.setItem("Tasks", JSON.stringify(defaultTasks));
    } */
