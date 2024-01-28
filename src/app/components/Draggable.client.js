'use client';
import React, { useRef } from 'react';

const Draggable = () => {
  const fileInput = useRef(null);
  const dragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const drop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const element = document.getElementById(data);
    const clonedElement = element.cloneNode(true);
    clonedElement.style.position = 'absolute';
    const rect = event.target.getBoundingClientRect();
    clonedElement.style.left = `${event.clientX - rect.left}px`;
    clonedElement.style.top = `${event.clientY - rect.top}px`;
    if (data === 'myImage') {
      clonedElement.textContent = '';
      const img = document.createElement('img');
      img.src = "https://via.placeholder.com/200";
      img.onclick = () => fileInput.current.click();
      clonedElement.appendChild(img);
    } else if (data === 'myText') {
      clonedElement.contentEditable = 'true';
    }
    event.target.appendChild(clonedElement);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = document.querySelector('#myImage img');
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input type="file" ref={fileInput} onChange={handleFileChange} style={{ display: 'none' }} />
      <div className="flex w-screen h-screen">
        <div className="flex-1 bg-red-600">
          <p
            id="myImage"
            draggable="true"
            onDragStart={dragStart}
          >
            Image
          </p>
          <p
            id="myText"
            draggable="true"
            onDragStart={dragStart}
          >
            draggable
          </p>
        </div>
        <div
          className="flex-1 bg-blue-600 relative"
          onDrop={drop}
          onDragOver={allowDrop}
        >
          Right Side
        </div>
      </div>
    </>
  );
};

export default Draggable;

