'use client';
import { motion } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';

const Draggable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const variants = {
    open: {
      transform: 'translateX(0px)',
      clipPath: 'circle(100% at 50% 50%)',
    },
    closed: {
      transform: 'translateX(-301px)',
      clipPath: 'circle(0% at 50% 50%)',
    },
  };

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

  // Reattaches event listeners to elements within wrappers
  const reattachEventListeners = () => {
    // Select all elements with specific class and structure
    const wrappers = document.querySelectorAll('.queryDiv > div');
    // For each wrapper, perform the following actions
    wrappers.forEach((wrapper) => {
      // Find close button within wrapper
      const closeButton = wrapper.querySelector('a');
      // Find content (paragraph or image) within wrapper
      const content = wrapper.querySelector('p, img');
      // Add event listener to close button to remove wrapper when clicked
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.remove();
      });
      // If content is a paragraph, make it editable
      if (content.tagName.toLowerCase() === 'p') {
        content.contentEditable = 'true';
      } else {
        // If content is an image, add event listener to make it active and trigger file input click
        content.addEventListener('click', () => {
          content.classList.add('active');
          fileInput.current.click();
        });
      }
    });
  };

  // Load the saved state from local storage when the component mounts
  useEffect(() => {
    const savedState = localStorage.getItem('websiteState');
    if (savedState) {
      document.querySelector('.queryDiv').innerHTML = savedState;
      reattachEventListeners();
    }
  }, []);

  // Define the saveState function that saves the current state to local storage
  const saveState = () => {
    const state = document.querySelector('.queryDiv').innerHTML;
    localStorage.setItem('websiteState', state);
    console.log('Website state saved.');
  };
  return (
    <>
      <button
        className="fixed bg-green-600 rounded-[4px] mt-5 right-0 p-5 z-[999]"
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
      <div className="flex w-screen h-screen">
        <motion.div
          className="absolute top-0 overflow-hidden bottom-0 z-[10] flex justify-around pt-3 bg-red-600 w-[300px]"
          animate={isOpen ? 'open' : 'closed'}
          variants={variants}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-5">
            <p
              id="myImage"
              draggable="true"
              onDragStart={dragStart}
            >
              Image
            </p>
            <div className="flex flex-col">
              <p className="text-[13px]">Size: {imageSizeIndicator}px</p>
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
            </div>
          </div>
          <p
            id="myText"
            draggable="true"
            onDragStart={dragStart}
          >
            Text
          </p>
        </motion.div>
        <button
          className="z-20 absolute left-3 top-40 break-words"
          onClick={() => setIsOpen(!isOpen)}
        >
          Toolbar
        </button>

        <div
          className="flex-auto bg-blue-600 relative flex justify-center items-center queryDiv"
          onDrop={drop}
          onDragOver={allowDrop}
        >
          Website Section
        </div>
      </div>
    </>
  );
};

export default Draggable;
