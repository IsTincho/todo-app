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
  onViewDetails,
}) => {
  const [viewMode, setViewMode] = useState("grid"); // "grid" o "list" el estado

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-1 inline-flex">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "grid"
                ? "bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
            title="Vista de cuadrícula"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
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
          onViewDetails={onViewDetails}
        />
      ) : (
        <ListView
          tasks={tasks}
          setTasks={setTasks}
          token={token}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  );
};

export default TaskList;
