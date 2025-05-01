import {
  DndContext,
  closestCenter,
  TouchSensor,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import axios from "../api/axios";
import { toast } from "react-toastify";

const SortableTaskCard = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        onToggleComplete={onToggleComplete}
        onDelete={onDelete}
        onEdit={onEdit}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

const GridView = ({
  tasks,
  setTasks,
  token,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      touchOnly: true,
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t._id === active.id);
    const newIndex = tasks.findIndex((t) => t._id === over.id);
    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(newTasks);

    try {
      const orderedIds = newTasks.map((t) => t._id);
      await axios.put(
        "/api/todos/reorder",
        { tasksOrder: orderedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Orden actualizado", {
        position: "bottom-right",
        className: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
      });
    } catch (err) {
      toast.error(
        "Error al actualizar el orden: " +
          (err.response?.data?.message || err.message),
        {
          position: "bottom-right",
          className: "bg-rose-50 border-l-4 border-rose-500 text-rose-700",
        }
      );
    }
  };

  if (tasks.length === 0) {
    return (
      <p className="text-xl text-gray-500 mt-10 text-center">
        No hay tareas para mostrar 💤
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task._id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default GridView;
