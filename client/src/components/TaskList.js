import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import axios from "../api/axios";
import { toast } from "react-toastify";

const SortableTaskCard = ({ task, onMarkAsCompleted, onDelete, onEdit }) => {
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
        onMarkAsCompleted={() => onMarkAsCompleted(task._id)}
        onDelete={() => onDelete(task._id)}
        onEdit={() => onEdit(task)}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

const TaskList = ({
  tasks,
  setTasks,
  token,
  onMarkAsCompleted,
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
      toast.success("Orden actualizado");
    } catch (err) {
      toast.error(
        "Error al actualizar el orden: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  if (tasks.length === 0) {
    return (
      <p className="text-xl text-gray-500 mt-10">No tenés tareas todavía 💤</p>
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
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task._id}
              task={task}
              onMarkAsCompleted={onMarkAsCompleted}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TaskList;
