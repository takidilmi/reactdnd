# Drag-and-Drop Website Builder

This project is a simple drag-and-drop website builder built with Next.js. It allows users to create static websites by dragging and dropping text and images into a specific section of the website.

## Features

- **Drag and Drop**: Users can drag elements with the ids "myImage" and "myText" and drop them into the website section.
- **Toolbar**: The toolbar contains two elements, Text and Image, which users can drag and drop into their website.
- **Edit Content**: Users can edit the text after it’s dropped into the website section. For images, users can click on the image to open a file dialog and select a new image to replace the existing one.
- **Delete Sections**: Users can delete the sections. Each dropped element has a close button that removes the wrapper containing the element when clicked.
- **Save and Load**: The current state of the website section is saved to local storage when the "Save" button is clicked. The saved state is loaded from local storage when the component mounts.
- **Generate and Dwoload**: One click to generate your creation into an HTML with its style for what you achieved.

## Getting Started

To get a local copy up and running, follow these steps:

1. **Clone the repo**
   ```
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. **Install packages**
   - If you're using npm:
     ```
     npm install
     ```
   - If you're using pnpm:
     ```
     pnpm install
     ```
3. **Run the app**
   - If you're using npm:
     ```
     npm run dev
     ```
   - If you're using pnpm:
     ```
     pnpm dev
     ```

## Usage

To use the website builder:

1. **Drag and Drop**: Select either the Text or Image from the toolbar and drag it into the website section.
2. **Edit Content**: Click on the text to edit it. Click on the image to open a file dialog and select a new image.
3. **Delete Sections**: Click on the 'x' button to delete a section.
4. **Save**: Click on the "Save" button to save the current state of the website section to local storage.
5. **Generate Files** : Click "Generate Files" to get your HTML file with the corresponding style/ class names ready to download and save in your machine.

Enjoy building your website!
