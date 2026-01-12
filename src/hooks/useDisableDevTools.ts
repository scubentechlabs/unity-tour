import { useEffect } from "react";

export const useDisableDevTools = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 - Developer Tools
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }

      // F11 - Fullscreen
      if (e.key === "F11") {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I - Developer Tools
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+J - Console
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C - Inspect Element
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        return false;
      }

      // Ctrl+U - View Source
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        return false;
      }

      // Ctrl+S - Save Page
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        return false;
      }
    };

    // Disable image dragging
    const handleDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
        return false;
      }
    };

    // Add CSS to prevent image selection, dragging, and text selection
    const style = document.createElement("style");
    style.id = "image-protection-styles";
    style.textContent = `
      img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
        pointer-events: auto;
        -webkit-touch-callout: none;
      }
      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      input, textarea {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
    `;
    document.head.appendChild(style);

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      const existingStyle = document.getElementById("image-protection-styles");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);
};
