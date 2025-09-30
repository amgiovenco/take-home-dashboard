import React, { useState } from 'react';
import UploadCSV from '../components/UploadCSV';
import ChartContainer from '../components/PlotContainer';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export function Dashboard() {
    const [data, setData] = useState(null);
    const [plots, setPlots] = useState([]);

    const handleCSV = (parsed) => {
        if (parsed && parsed.columns) {
            setData(parsed);
            // Omit the first column and filter out "time" column
            const initialPlots = parsed.columns.slice(1).filter(c => c !== "time");
            setPlots(initialPlots);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = plots.indexOf(active.id);
            const newIndex = plots.indexOf(over.id);
            setPlots(arrayMove(plots, oldIndex, newIndex));
        }
    };

    return (
        <div className = "p-6">
            <UploadCSV onUpload = {handleCSV} />
            {data && (
                <DndContext collisionDetection = {closestCenter} onDragEnd = {handleDragEnd}>
                    <SortableContext items = {plots} strategy = {verticalListSortingStrategy}>
                        {plots.map((col) => (
                            <ChartContainer key = {col} column = {col} data = {data} />
                        ))}
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}

export default Dashboard;