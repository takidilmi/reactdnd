'use client';
import React, { useRef, useState, useEffect } from 'react';

const Draggable = () => {
  // Create a reference to the file input element
  const fileInput = useRef(null);
  // Create state variables for the image size and image size indicator
  const [imageSize, setImageSize] = useState(200);
  const [imageSizeIndicator, setImageSizeIndicator] = useState(200);

  // sets the data of the dragged element
  const dragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
  };

  // prevent the default handling of the drop event
  const allowDrop = (event) => {
    event.preventDefault();
  };

  // Define the drop function that handles the drop event
  const drop = (event) => {
    event.preventDefault(); // Prevent the default behavior of the drop event

    // Get the id of the dragged element from the dataTransfer object
    const data = event.dataTransfer.getData('text/plain');

    // Get the element with the retrieved id
    const element = document.getElementById(data);

    // Clone the dragged element
    const clonedElement = element.cloneNode(true);

    // Create a new div element to wrap the cloned element and the close button
    const wrapper = document.createElement('div');

    // Set the position of the wrapper to 'absolute'
    Object.assign(wrapper.style, {
      position: 'absolute',

      // Position the wrapper at the point where the drop event occurred
      left: `${event.clientX - event.target.getBoundingClientRect().left}px`,
      top: `${event.clientY - event.target.getBoundingClientRect().top}px`,
    });

    // Create a close button for the wrapper
    const closeButton = document.createElement('a');

    // Set the position of the close button to 'absolute'
    Object.assign(closeButton.style, {
      position: 'absolute',
      right: '-10px',
      top: '-10px',
      cursor: 'pointer',
    });

    // Set the text content of the close button to 'x'
    closeButton.textContent = 'x';

    // Add an onclick event to the close button to remove the wrapper when clicked
    closeButton.onclick = (e) => {
      e.preventDefault();
      wrapper.remove();
    };

    // Add the close button to the wrapper
    wrapper.appendChild(closeButton);

    // Check if the id of the dragged element is 'myImage' or 'myText'
    if (data === 'myImage') {
      // Clear the text content of the cloned element
      clonedElement.textContent = '';

      // Create a new img element
      const img = document.createElement('img');

      // Set the source, width, and height of the img element
      Object.assign(img, {
        src: '/clickHere.webp',
        width: imageSize,
        height: imageSize,

        // Add an onclick event to the img element to open the file dialog when clicked
        onclick: () => {
          img.classList.add('active');
          fileInput.current.click();
        },
      });

      // Add the img element to the wrapper
      wrapper.appendChild(img);
    } else if (data === 'myText') {
      // Make the cloned element editable
      clonedElement.contentEditable = 'true';

      // Add the cloned element to the wrapper
      wrapper.appendChild(clonedElement);
    }

    // Add the wrapper to the target of the drop event
    event.target.appendChild(wrapper);
  };

  // allow the user to change the img file
  const handleFileChange = (event) => {
    // Get the selected file
    const file = event.target.files[0];
    // Create a new FileReader object
    const reader = new FileReader();
    // Define the onloadend event of the FileReader object
    reader.onloadend = () => {
      // Get the img element with the 'active' class
      const img = document.querySelector('.active');
      // Set the src of the img element to the data URL of the selected file
      img.src = reader.result;
      img.width = imageSize;
      img.height = imageSize;
      // Update the image size indicator
      setImageSizeIndicator(imageSize);
      // Remove the 'active' class from the img element
      img.classList.remove('active');
      // Reset the value of the file input
      event.target.value = null;
    };
    // Start reading the selected file as a data URL
    reader.readAsDataURL(file);
  };

  const reattachEventListeners = () => {
    // Get all the wrapper divs in the second div
    const wrappers = document.querySelectorAll(
      '.flex-1.bg-blue-600.relative > div'
    );
    wrappers.forEach((wrapper) => {
      // Get the close button and the content (either text or image) in the wrapper div
      const closeButton = wrapper.querySelector('a');
      const content =
        wrapper.querySelector('p') || wrapper.querySelector('img');

      // Reattach the onclick event to the close button
      closeButton.onclick = (e) => {
        e.preventDefault();
        wrapper.remove();
      };

      // Check if the content is text or an image
      if (content.tagName.toLowerCase() === 'p') {
        // Make the text content editable
        content.contentEditable = 'true';
      } else {
        // Add an onclick event to the image content that opens the file dialog
        content.onclick = () => {
          content.classList.add('active');
          fileInput.current.click();
        };
      }
    });
  };

  // Load the saved state from local storage when the component mounts
  useEffect(() => {
    const savedState = localStorage.getItem('websiteState');
    if (savedState) {
      document.querySelector('.flex-1.bg-blue-600.relative').innerHTML =
        savedState;
      reattachEventListeners();
    }
  }, []);

  // Define the saveState function that saves the current state to local storage
  const saveState = () => {
    const state = document.querySelector(
      '.flex-1.bg-blue-600.relative'
    ).innerHTML;
    localStorage.setItem('websiteState', state);
    console.log('Website state saved.');
  };
  return (
    <>
      <button
        onClick={saveState}
        style={{ position: 'absolute', top: '0', right: '10px' }}
      >
        Save
      </button>
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
