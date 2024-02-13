// When the document is ready, execute this function
$(document).ready(function() { 
    
    // Event handler for adding a new panel
    $('#addPanel').click(function() {
        // Count the number of existing panels to generate a unique ID
        var panelCount = $('.panel').length + 1;
        var panelId = 'panel-' + panelCount;

        // Calculate the center position for the new panel
        var grid_size = 50; // Define the grid size
        var panel_width = 200; // Define the panel width
        var panel_height = 200; // Define the panel height
        var centerX = Math.round(($('#canvas').width() / 2 - panel_width / 2) / grid_size) * grid_size;
        var centerY = Math.round(($('#canvas').height() / 2 - panel_height / 2) / grid_size) * grid_size;// Calculate the center position for the new panel
    

        // HTML markup for the new panel
        var panelHtml = `<div class="panel" id="${panelId}" style="left:${centerX}px; top:${centerY}px;">
        <div class="handle"></div> <!-- Handle for dragging the panel -->
        <button class="delete-panel">X</button> <!-- Delete button -->
        <input type="text" class="panel-title" value="Todo List ${panelCount}" onfocus="this.select()" onkeyup="if(event.keyCode==13) {this.blur();}"> <!-- Input field for the panel title -->
        <ul class="todo-list"></ul> <!-- List for todo items -->
        <input type="text" class="todo-input" placeholder="Add new todo"/> <!-- Input field for adding new todos -->
        </div>`;

        // Append the new panel to the canvas
        $('#canvas').append(panelHtml);

        $('#' + panelId).draggable({
            handle: ".handle", // Specify the handle for dragging
            cancel: ".panel-title, .editable", // Specify elements to exclude from dragging
            grid: [grid_size, grid_size], // Set the grid size to snap to during dragging
            containment: "#canvas" // Specify the containment element
        }).resizable({
            minHeight: 200, // Set the minimum height of the panel
            minWidth: 200, // Set the minimum width of the panel
            grid: [grid_size, grid_size] // Set the grid size to snap to during resizing
        });

        // Make the todo items sortable
        $('.todo-list').sortable({
            handle: ".drag-handle", // Specify the handle for sorting
            placeholder: "sortable-placeholder" // Specify the placeholder for sorting
        }).disableSelection(); // Disable text selection while sorting
    });

    // Event handler for deleting a panel or note
    $(document).on('click', '.delete-panel', function() {
        if (confirm('Are you sure you want to delete this panel/note?')) {
            $(this).closest('.panel, .note').remove();
        }
    });


    // Event handler for adding a new todo item
    $(document).on('keypress', '.todo-input', function(e) {
        if (e.which == 13) { // Check if the Enter key is pressed
            var todoText = $(this).val(); // Get the text entered in the input field
            $(this).val(''); // Clear the input field
            var listItem = `<li class='todo-item'><div class="drag-handle">&#x2630;</div><input type="checkbox" class="todo-checkbox"/><span class="editable">${todoText}</span></li>`; // HTML markup for the new todo item
            $(this).siblings('.todo-list').append($(listItem)); // Append the new todo item to the todo list
        }
    });

    // Event handler for making todo item text editable
    $(document).on('click', '.editable', function() {
        var $editable = $(this);
        $editable.attr('contenteditable', 'true').focus(); // Make the text editable and focus on it

        // Enable cursor movement and text selection
        $editable.on('mousedown', function(e) {
            e.stopPropagation();
        }).on('keydown', function(e) {
            e.stopPropagation();
        }).on('mouseup', function(e) {
            e.stopPropagation();
        }).on('selectstart', function(e) {
            e.stopPropagation();
        });
    });


    // Event handler for updating todo item text
    $(document).on('blur', '.editable[contenteditable="true"]', function() {
        $(this).attr('contenteditable', 'false'); // Disable editing
        var updatedText = $(this).text(); // Get the updated text
        console.log("Todo updated to: " + updatedText); // Log the updated text
    });

    // Event handler for marking a todo item as completed
    $(document).on('click', '.todo-checkbox', function() {
        $(this).parent().toggleClass('completed');
    });

    //Add a note
    $('#addNote').click(function() {
        // Count the number of existing panels to generate a unique ID
        var noteCount = $('.note').length + 1;
        var panelId = 'note-' + noteCount;

        // Calculate the center position for the new panel
        var grid_size = 50; // Define the grid size
        var panel_width = 200; // Define the panel width
        var panel_height = 200; // Define the panel height
        var centerX = Math.round(($('#canvas').width() / 2 - panel_width / 2) / grid_size) * grid_size;
        var centerY = Math.round(($('#canvas').height() / 2 - panel_height / 2) / grid_size) * grid_size;// Calculate the center position for the new panel
    

        // HTML markup for the new panel
        var panelHtml = `<div class="note" id="${panelId}" style="left:${centerX}px; top:${centerY}px;">
            <div class="handle"></div> <!-- Handle for dragging the panel -->
            <button class="delete-panel">X</button> <!-- Delete button -->
            <input type="text" class="panel-title" value="Note ${noteCount}" onfocus="this.select()" onkeyup="if(event.keyCode==13) {this.blur();}"> <!-- Input field for the panel title -->
            <div class="note-body" contenteditable="true"></div> <!-- Text area for the panel body -->
        </div>`;

        // Append the new panel to the canvas
        $('#canvas').append(panelHtml);

        $('#' + panelId).draggable({
            handle: ".handle", // Specify the handle for dragging
            cancel: ".panel-title, .editable", // Specify elements to exclude from dragging
            grid: [grid_size, grid_size], // Set the grid size to snap to during dragging
            containment: "#canvas" // Specify the containment element
        }).resizable({
            minHeight: 200, // Set the minimum height of the panel
            minWidth: 200, // Set the minimum width of the panel
            grid: [grid_size, grid_size] // Set the grid size to snap to during resizing
        });
    });

    // Function to save a text file to a local folder
    function saveTextFile() {
        var boardData = collectBoardData();
        var text = boardData; // JSON string of board data
        var filename = $("#canvasTitle").text() + ".json"; // Append .json to the filename
        var blob = new Blob([text], {type: "application/json;charset=utf-8"}); // Specify JSON MIME type
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = filename; // Specify the file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Event handler for saving the text file when the saveToFile button is pressed
    $('#saveToFile').click(function() {
        saveTextFile();
    });

    function makeTitleEditable() {
        $('#canvasTitle').one('click', function() {
            var currentTitle = $(this).text();
            var editInputHtml = '<input type="text" class="title-input" value="' + currentTitle + '">';
            var $editInput = $(editInputHtml).replaceAll($(this));
            $editInput.focus();

            // When the input loses focus, replace it with the title
            $editInput.on('blur keyup', function(e) {
                if (e.type === 'blur' || e.key === 'Enter') {
                    var newTitle = $editInput.val();
                    $editInput.replaceWith('<div id="canvasTitle" class="editable-title">' + newTitle + '</div>');
                    makeTitleEditable(); // Reattach the event listener
                }
            });
        });
    }

    // Initialize the editable title functionality
    makeTitleEditable();

    function collectBoardData() {
        var boardData = {
            boardTitle: $("#canvasTitle").text(), // Assuming the board title has the ID 'canvasTitle'
            items: []
        };
    
        // Iterate through all panels
        $('.panel').each(function() {
            var panel = $(this);
            var item = {
                id: panel.attr('id'),
                type: 'todo',
                location: { top: panel.css('top'), left: panel.css('left') },
                size: { width: panel.width(), height: panel.height() },
                title: panel.find('.panel-title').val(),
                content: panel.find('.todo-list').text() // Assuming list items are plain text
            };
            boardData.items.push(item);
        });
    
        // Iterate through all notes
        $('.note').each(function() {
            var note = $(this);
            var item = {
                id: note.attr('id'),
                type: 'note',
                location: { top: note.css('top'), left: note.css('left') },
                size: { width: note.width(), height: note.height() },
                title: note.find('.panel-title').val(),
                content: note.find('.note-body').html() // Capturing HTML content
            };
            boardData.items.push(item);
        });
    
        // Convert the boardData object to JSON
        return JSON.stringify(boardData, null, 2); // Pretty-print the JSON
    }
    
    document.getElementById('loadBoard').addEventListener('click', function() {
        // Programmatically click the hidden file input
        document.getElementById('loadBoardFile').click();
        loadBoardFromData(boardData);
    });
    
    document.getElementById('loadBoardFile').addEventListener('change', function() {
        if (this.files.length > 0) {
            var file = this.files[0];
            var reader = new FileReader();
    
            reader.onload = function(e) {
                var boardData = JSON.parse(e.target.result);
                loadBoardFromData(boardData);
            };
    
            reader.readAsText(file);
        }
    });

    function loadBoardFromData(boardData) {
        // Clear existing panels and notes
        $('.panel, .note').remove();

        // Reset panel count if necessary
        var panelCount = 0;

        // Set the board title
        $("#canvasTitle").text(boardData.boardTitle);

        boardData.items.forEach(function(item) {
            if (item.type === 'todo') {
                panelCount++;
                var panelHtml = `
                    <div class="panel" id="${item.id}" style="left:${item.location.left}; top:${item.location.top}; width: ${item.size.width}px; height: ${item.size.height}px;">
                        <div class="handle"></div>
                        <button class="delete-panel">X</button>
                        <input type="text" class="panel-title" value="${item.title}" onfocus="this.select()" onkeyup="if(event.keyCode==13) {this.blur();}">
                        <ul class="todo-list">${item.content}</ul>
                        <input type="text" class="todo-input" placeholder="Add new todo"/>
                    </div>`;

                $('#canvas').append(panelHtml);

                $('#' + panelId).draggable({
                    handle: ".handle", // Specify the handle for dragging
                    cancel: ".panel-title, .editable", // Specify elements to exclude from dragging
                    grid: [grid_size, grid_size], // Set the grid size to snap to during dragging
                    containment: "#canvas" // Specify the containment element
                }).resizable({
                    minHeight: 200, // Set the minimum height of the panel
                    minWidth: 200, // Set the minimum width of the panel
                    grid: [grid_size, grid_size] // Set the grid size to snap to during resizing
                });
        
                // Make the todo items sortable
                $('.todo-list').sortable({
                    handle: ".drag-handle", // Specify the handle for sorting
                    placeholder: "sortable-placeholder" // Specify the placeholder for sorting
                }).disableSelection(); // Disable text selection while sorting
            }
        });
        
    }
    

});