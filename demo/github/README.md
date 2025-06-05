# GitHub double-clickjacking demo

This is a demostration of a double-clickjacking attack on GitHub. It gets the user to peform a double-click on a precisely calculated position on the page, but closes the tab on the first pointerdown event, causing the second click to land on the "Star" button on the repository which was loaded in the background.
