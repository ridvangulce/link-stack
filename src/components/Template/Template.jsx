import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripLines } from "react-icons/fa";
import { BsPencil } from "react-icons/bs";
import "./Template.css";
const Template = () => {
    const [title, setTitle] = useState('Headline Title');

    const handleChange = (event) => {
        const newTitle = event.target.value;
        setTitle(newTitle || 'Headline Title');
    };
    const handleClick = (event) => {
        event.target.select();
    };

    return (
        <DragDropContext>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        <Draggable draggableId="draggable" index={0}>
                            {(provided) => (
                                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                    <FaGripLines />
                                    <BsPencil className="edit-pen" />
                                    <input
                                        className="text-input"
                                        type="text"
                                        value={title}
                                        onChange={handleChange}
                                        onClick={handleClick}
                                    />
                                </div>
                            )}
                        </Draggable>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Template;
