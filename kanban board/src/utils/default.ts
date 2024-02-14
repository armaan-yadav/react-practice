import { Column, Task } from "../types";

export const defaultColumns: Array<Column> = [
  { id: "1", title: "To Do" },
  { id: "2", title: "Doing" },
  { id: "3", title: "Done" },
];

export const defaultTasks: Array<Task> = [
  { columnId: "1", content: "Raaste badlo , Manzil Nahii!", id: "11" },
];
