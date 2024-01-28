'use client';
import React, { useRef, useState } from 'react';

const Draggable = () => {
  const fileInput = useRef(null);
  const [imageSize, setImageSize] = useState(200);
  const [imageSizeIndicator, setImageSizeIndicator] = useState(200);
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

    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    const rect = event.target.getBoundingClientRect();
    wrapper.style.left = `${event.clientX - rect.left}px`;
    wrapper.style.top = `${event.clientY - rect.top}px`;

    const closeButton = document.createElement('a');
    closeButton.textContent = 'x';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '-10px';
    closeButton.style.top = '-10px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = (e) => {
      e.preventDefault();
      wrapper.remove();
    };
    wrapper.appendChild(closeButton);

    if (data === 'myImage') {
      clonedElement.textContent = '';
      const img = document.createElement('img');
      img.src = '/clickHere.webp';
      img.width = imageSize;
      img.height = imageSize;
      img.onclick = () => {
        img.classList.add('active');
        fileInput.current.click();
      };
      wrapper.appendChild(img);
    } else if (data === 'myText') {
      clonedElement.contentEditable = 'true';
      wrapper.appendChild(clonedElement);
    }
    event.target.appendChild(wrapper);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = document.querySelector('.active');
      img.src = reader.result;
      img.width = imageSize;
      img.height = imageSize;
      setImageSizeIndicator(imageSize);
      img.classList.remove('active');
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInput}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        type="range"
        min="50"
        max="700"
        value={imageSize}
        onChange={(e) => {
          setImageSize(e.target.value);
          setImageSizeIndicator(e.target.value);
        }}
      />

      <div className="flex w-screen h-screen">
        <div className="flex-1 bg-red-600">
          <p
            id="myImage"
            draggable="true"
            onDragStart={dragStart}
          >
            Image
            <br />
            Size: {imageSizeIndicator}px
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
