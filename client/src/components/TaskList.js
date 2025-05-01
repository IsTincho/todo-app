import { useState } from "react";
import GridView from "./GridView";
import ListView from "./ListView";
import { Grid, List } from "lucide-react";

const TaskList = ({
  tasks,
  setTasks,
  token,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const [viewMode, setViewMode] = useState("grid"); // "grid" o "list" el estado

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-1 inline-flex">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "grid"
                ? "bg-rose-50 text-rose-500"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
            title="Vista de cuadrícula"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-rose-50 text-rose-500"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
            title="Vista de lista"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <GridView
          tasks={tasks}
          setTasks={setTasks}
          token={token}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ) : (
        <ListView
          tasks={tasks}
          setTasks={setTasks}
          token={token}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
    </div>
  );
};

export default TaskList;
