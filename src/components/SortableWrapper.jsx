import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({ id, children }) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging 
    } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
    ref={setNodeRef} 
    style={style} 
    {...attributes}
    className={`plot-card compact ${isDragging ? "dragging" : ""}`}
    >
      {/* clone children and add drag listeners to non-button elements */}
      {React.cloneElement(children, { dragListeners: listeners })}
    </div>
  );
}

export default SortableItem;