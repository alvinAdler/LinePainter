//Function that handles the pop-up window operation
//In the pop up, user can save, load, or view the works that they have done on the canvas. 
function openModalFunction(modal, action){
    if(modal == null){
        return
    }

    //Getting the header, body, and footer of the current modal pop-up dialogue.
    var current_modal_header = modal.getElementsByClassName("modal-header")[0].getElementsByClassName("modal-title")[0];
    var current_modal_body = modal.getElementsByClassName("modal-body")[0];
    var current_modal_footer = modal.getElementsByClassName("modal-footer")[0];

    //Switch between the action that user will take. 
    //There are particularly 3 actions. Each action will lead a different display of the modal pop-up window. 
    switch(action){
        case "save":
            //Activate the modal
            //There is a class in the css to make the modal pop-up box visible. That class has name "active"
            modal.classList.add("active");
            overlay.classList.add("active");
            current_modal_header.textContent = "Save your work";

            //Creating 2 inputs; for the username and for the record name
            var insert_user_name = document.createElement("input");
            var insert_row_name = document.createElement("input");

            //If the body of the current modal have 0 child, then add the 2 input elements. 
            if(current_modal_body.childNodes.length == 0){
                current_modal_body.appendChild(insert_user_name);
                current_modal_body.appendChild(insert_row_name);
            }

            //Setting the attributes and styles of the record name input.
            insert_row_name.setAttribute("class", "input_save");
            insert_row_name.setAttribute("placeholder", "Insert your record name here");
            insert_row_name.setAttribute("type", "text");
            insert_row_name.setAttribute("id", "recordname");
            insert_row_name.required = true;
            insert_row_name.style.width = "80%";
            insert_row_name.style.padding = "10px";
            insert_row_name.style.margin = "5% 5%";

            //Setting the attributes and styles of the user name input. 
            insert_user_name.setAttribute("class", "input_username");
            insert_user_name.setAttribute("placeholder", "Insert your name here");
            insert_user_name.setAttribute("type", "text");
            insert_user_name.setAttribute("id", "username");
            insert_user_name.required = true;
            insert_user_name.style.width = "80%";
            insert_user_name.style.padding = "10px";
            insert_user_name.style.margin = "5% 5%";

            //If the current action is "save", display a button with name "save data" to the user.
            //The button for it is already in there. That particular button can be used for anything. 
            //We just need to change or toggle the class or make some identifier regarding which action should be taken at which time.
            current_modal_footer.getElementsByClassName("button_submit_data")[0].textContent = "Save Data"

            break;
        case "load":
            //Activate the modal pop-up dialogue box
            modal.classList.add("active");
            overlay.classList.add("active");
            current_modal_header.textContent = "Load your work";

            var usernameInput = document.createElement("input");
            var recordnameInput = document.createElement("input");

            if(current_modal_body.childNodes.length == 0){
                current_modal_body.appendChild(usernameInput);
                current_modal_body.appendChild(recordnameInput);
            }

            //Setting the attributes and styles of the record name input.
            recordnameInput.setAttribute("class", "recordInput");
            recordnameInput.setAttribute("placeholder", "Insert record name to be loaded");
            recordnameInput.setAttribute("type", "text");
            recordnameInput.setAttribute("id", "loadRecordName");
            recordnameInput.required = true;
            recordnameInput.style.width = "80%";
            recordnameInput.style.padding = "10px";
            recordnameInput.style.margin = "5% 5%";

            //Setting the attributes and styles of the user name input. 
            usernameInput.setAttribute("class", "nameInput");
            usernameInput.setAttribute("placeholder", "Insert the owner of the record");
            usernameInput.setAttribute("type", "text");
            usernameInput.setAttribute("id", "loadUserName");
            usernameInput.required = true;
            usernameInput.style.width = "80%";
            usernameInput.style.padding = "10px";
            usernameInput.style.margin = "5% 5%";
            
            //Setting the text of the button inside the footer. 
            current_modal_footer.getElementsByClassName("button_submit_data")[0].textContent = "Load Data"

            break;
        case "view":
            //Activate the modal.
            modal.classList.add("active");
            overlay.classList.add("active");
            current_modal_header.textContent = "View your work";

            //Since there are many data, it is the best to make the modal wider. 
            modal.style.width = "60%";

            //Using AJAX to create a connection to the server. 
            var http_request = new XMLHttpRequest();

            //Used as a container for the data from the server.
            var server_data = "";
            
            //This will be sent to the server; indicating that client is requesting--
            //-- for the content for the view. 
            var data = {
                "request_type":"view"
            };

            //Cast the object/hashmap of "data" to become a string in JSON format. 
            var json_string = JSON.stringify(data);

            //Opening the request and then sending the request to the server (mainscript.php)
            http_request.open("POST", "mainscript.php", true);
            http_request.setRequestHeader("Content-type", "application/json");

            http_request.send(json_string);

            //Waiting for the reply from the server. 
            http_request.onreadystatechange = function(e){
                if(http_request.readyState == 4 && http_request.status == 200){
                    //Parse the data from the server to become an object/hashmap (the data from the--
                    //-- server is a string. )
                    server_data = JSON.parse(http_request.responseText);

                    //Grabbing the body of the current modal.
                    var current_modal_body = modal.getElementsByClassName("modal-body")[0];

                    //Creating a table for the display of the data. 
                    //The idea in here is to serve the data in the format of a table. 
                    var table_data = document.createElement("table");

                    var header_elements = new Array("No", "Username", "Recordname", "LinesQuantity", "ColorsQuantity", "WeightVariant");
                                   
                    //Handle the table's default attributes
                    table_data.style.width = "100%";
                    table_data.style.border = "2px solid black";
                    table_data.style.fontSize = "75%";
                    table_data.setAttribute("id", "view_table");
                    
                    var current_row = document.createElement("tr");
                    current_row = table_data.insertRow(0);

                    //Handle the header of the table
                    //Creating a new th element for every header element. 
                    for(let index=0; index<header_elements.length; index+=1){
                        var th = document.createElement("th");
                        th.textContent = header_elements[index];
                        current_row.appendChild(th);
                    }
                    //Append the current row (which is the header row) to the table.
                    table_data.appendChild(current_row);


                    //Handle the data of the table
                    //The idea is to iterate every data from the server
                    //Since all array must have the same length, one array is used as a benchmark which is the array in the usernames key.
                    for(let index=0; index<server_data["usernames"].length; index+=1){
                        //Row at index 0 is already occupied for the header. 
                        current_row = table_data.insertRow(index+1);

                        //Creating a temporary td element for the "no(number)" column in the table. 
                        var td = document.createElement("td");
                        td.textContent = index+1;
                        current_row.appendChild(td);

                        //Loop every key from the data of the server. 
                        //Those data are: usernames, recordnames, numberOfLines, numberOfColors, weightVariant
                        //Append the data from those fields to a temporary td element. That temp element will be created--
                        //-- for every iteration of the data from the server. 
                        for(let key of Object.keys(server_data)){
                            var td = document.createElement("td");
                            td.textContent = server_data[key][index];
                            current_row.appendChild(td);
                        }
                        table_data.appendChild(current_row);
                    }
                    
                    //After everything is done, append the data to the body of the modal pop-up dialogue box--
                    //-- to be displayed.
                    current_modal_body.appendChild(table_data);
                }
            }

            //Setting the text of the footer button
            current_modal_footer.getElementsByClassName("button_submit_data")[0].textContent = "Ok";

            break;
    }
}

//Function to close the modal pop-up window. 
function closeModalFunction(modal){
    if(modal == null){
        return
    }

    //Hide the modal pop-up dialogue box by removing the active class.
    modal.classList.remove("active");
    overlay.classList.remove("active");
    
    //Resize the width to become 40% which is the initial width
    modal.style.width = "40%";
    var current_body = modal.getElementsByClassName("modal-body")[0];

    //Removing every child from the body of the current modal
    while(current_body.firstChild){
        current_body.removeChild(current_body.lastChild);
    }
}

//Function to take the given coordinates (startind point and ending point), merge them into an array, and then return it. 
//The usage of it is to unifiy the coordinate as one; to ease the process to transfer data to the server. 
function hold_coordinate(starting_point_x, starting_point_y, ending_point_x, ending_point_y){
    var temp = [starting_point_x, starting_point_y, ending_point_x, ending_point_y];
    return temp;
}

//Function to wrap-up all the necessary information to be sent to the server.
function gather_line_data(line_coordinates, line_color, line_weight){
    var current_line_properties = {
        "line_coordinates":line_coordinates,
        "line_color":line_color,
        "line_weight":line_weight
    };

    return current_line_properties;
}


//function to draw data
function draw_data(line_data, canvas){
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    //Remember that line_data is nothing but an array of hashmaps/objects. Every index has its own dictionary. 
    //Each dictionary contains 2 coordinates of a point (starting and ending point), 1 line color, and 1 line weight. 
    //One dictionary element represents one line. Since there are multiple lines, we need to iterate them in a loop.
    for(let item of line_data){
        draw_line(item["line_coordinates"][0], item["line_coordinates"][1], item["line_coordinates"][2], item["line_coordinates"][3], item["line_color"], item["line_weight"], context);
    }
}

//Function to draw a line given 2 end points.
function draw_line(p1x, p1y, p2x, p2y, color, brush_size, context){
    //Taking the difference between 2 point. 
    var dx = Math.abs(p1x - p2x);
    var dy = Math.abs(p1y - p2y);
    
    //Calculating the slope of the line. M for the shallow line and n for the steep one.
    var m = Math.abs(dy/dx);
    var n = Math.abs(dx/dy);

    //Determining the color of the line
    context.fillStyle = color;

    //This method is called Digital Differential Analyzer (DDA)
    //Where instead of recalcultaing the line using the conventional y=mx+c formula at every iteration, 
    //We just add the respected value with some constant

    //Case 1: Horizontal line => Left to Right
    if(p1x < p2x && p1y == p2y){
        for(let coor_x=p1x; coor_x<=p2x; coor_x+=1){
            context.fillRect(coor_x, p1y, brush_size, brush_size);
        }
    }

    //Case 2: Horizontal line => Right to Left
    else if (p1x > p2x && p1y == p2y) {
        for(let coor_x=p1x; coor_x>=p2x; coor_x-=1){
            context.fillRect(coor_x, p1y, brush_size, brush_size);
        }
    }

    //Case 3: Vertical Line => Top to Bottom
    else if(p1x == p2x && p1y <= p2y){
        for(let coor_y = p1y; coor_y <= p2y; coor_y+=1){
            context.fillRect(p1x, coor_y, brush_size, brush_size);
        }
    }
    
    //Case 4: Vertical Line => Bottom to Top
    else if(p1x == p2x && p1y >= p2y){
        for(let coor_y = p1y; coor_y >= p2y; coor_y-=1){
            context.fillRect(p1x, coor_y, brush_size, brush_size);
        }
    }

    //Case 5: Oblique line => Bottom Left to Top Right
    else if(dx == dy && p1x < p2x && p1y > p2y){
        let coor_y = p1y;
        for(let coor_x = p1x; coor_x <= p2x; coor_x += 1){
            context.fillRect(coor_x, coor_y, brush_size, brush_size);
            coor_y -= 1;
        }
    }

    //Case 6: Oblique line => Bottom Right to Top Left
    else if(dx == dy && p1x > p2x && p1y > p2y){
        let coor_y = p1y;
        for(let coor_x = p1x; coor_x >= p2x; coor_x -= 1){
            context.fillRect(coor_x, coor_y, brush_size, brush_size);
            coor_y -= 1;
        }
    }

    //Case 7: Oblique line => Top Right to Bottom Left
    else if(dx == dy && p1x > p2x && p1y < p2y){
        let coor_y = p1y;
        for(let coor_x = p1x; coor_x >= p2x; coor_x-=1){
            context.fillRect(coor_x, coor_y, brush_size, brush_size);
            coor_y += 1;
        }
    }

    //Case 8: Oblique line => Top Left to Bottom Right
    else if(dx == dy && p1x < p2x && p1y < p2y){
        let coor_y = p1y;
        for(let coor_x = p1x; coor_x <= p2x; coor_x += 1){
            context.fillRect(coor_x, coor_y, brush_size, brush_size);
            coor_y += 1;
        }
    }

    //Case 9: Shallow line => Bottom Left to Top Right
    else if(dx > dy && p1x < p2x && p1y > p2y){
        coor_y = p1y;
        for(let coor_x = p1x; coor_x <= p2x; coor_x += 1){
            context.fillRect(coor_x, Math.round(coor_y), brush_size, brush_size);
            coor_y =  coor_y - m;
        }
    }

    //Case 10: Steep line => Bottom left to Top Right
    else if(dx < dy && p1x < p2x && p1y > p2y){
        coor_x = p1x;
        for(let coor_y = p1y; coor_y >= p2y; coor_y -= 1){
            context.fillRect(Math.round(coor_x), coor_y, brush_size, brush_size);
            coor_x += n;
        }
    }

    //Case 11: Steep line => Bottom Right to Top Left
    else if(dx < dy && p1x > p2x && p1y > p2y){
        coor_x = p1x;
        for(let coor_y = p1y; coor_y >= p2y; coor_y -= 1){
            context.fillRect(Math.round(coor_x), coor_y, brush_size, brush_size);
            coor_x -= n;
        }
    }

    //Case 12: Shallow line => Bottom Right to Top Left
    else if(dx > dy && p1x > p2x && p1y > p2y){
        coor_y = p1y;
        for(let coor_x = p1x; coor_x >= p2x; coor_x -= 1){
            context.fillRect(coor_x, Math.round(coor_y), brush_size, brush_size);
            coor_y -= m;
        }
    }

    //Case 13: Shallow Line => Top Right to Bottom Left
    else if(dx > dy && p1x > p2x && p1y < p2y){
        coor_y = p1y;
        for(let coor_x = p1x; coor_x >= p2x; coor_x -= 1){
            context.fillRect(coor_x, Math.round(coor_y), brush_size, brush_size);
            coor_y += m;
        }
    }

    //Case 14: Steep Line => Top Right to Bottom Left
    else if(dx < dy && p1x > p2x && p1y < p2y){
        coor_x = p1x;
        for(let coor_y = p1y; coor_y <= p2y; coor_y += 1){
            context.fillRect(Math.round(coor_x), coor_y, brush_size, brush_size);
            coor_x -= n;
        }
    }

    //Case 15: Steep Line => Top Left to Bottom Right
    else if(dx < dy && p1x < p2x && p1y < p2y){
        coor_x = p1x;
        for(let coor_y = p1y; coor_y <= p2y; coor_y += 1){
            context.fillRect(Math.round(coor_x), coor_y, brush_size, brush_size);
            coor_x += n;
        }
    }

    //Case 16: Shallow Line => Top left to Bottom Right
    else if(dx > dy && p1x < p2x && p1y < p2y){
        coor_y = p1y;
        for(let coor_x = p1x; coor_x <= p2x; coor_x += 1){
            context.fillRect(coor_x, Math.round(coor_y), brush_size, brush_size);
            coor_y += m;
        }
    }
}

//Begin all operation when the window is successfully loaded.
window.onload = (e) => {
    //Creating an inner function to set all element to be default.
    function set_default(){
        selected_size = 1;
        size_dropdown.value = "";

        color_selector.value = "#000000";
        current_brush_color = color_selector.value;
        display_color_text.value = color_selector.value;
    }

    //Initializing the canvas and other UI components.
    var canvas = document.getElementById("sample_canvas");
    var location_text = document.getElementById("mouse_loc");
    var size_dropdown = document.getElementById("id_sizes");
    var button_erase_line = document.querySelector("#button_erase_line");

    //Getting the color and text input for inputting the color for the brush
    var display_color_text = document.querySelector("#text_show_color");
    var color_selector = document.querySelector("#input_select_color");
    var button_clear_canvas = document.querySelector("#button_clear_canvas");
    var button_default_settings = document.querySelector("#button_default_settings");

    //Getting the modal components
    const saveModal = document.querySelector("#button_backend_save");
    const loadModal = document.querySelector("#button_backend_load");
    const viewModal = document.querySelector("#button_backend_view");
    const submitModal = document.querySelectorAll(".button_submit_data")[0];
    const closeModal = document.querySelectorAll("[data-close-button]");
    const overlay = document.querySelector("#overlay");

    //Global variables
    var context = canvas.getContext("2d");
    var startPointX, startPointY, endPointX, endPointY;
    var selected_size = 1;
    var current_brush_color = "#000000";
    var chosen_modal_action = "";
    var eraser_on = false;
    var del_line_x = 0, del_line_y = 0;

    //The data of a line consists of: starting and ending point of the line, the weight of the line, and the color of the line;
    var line_data = [];
    var json_string = "";

    var http_request = new XMLHttpRequest();

    set_default();

    //context.fillStyle = "rgba(0, 0, 0, 1)";
    context.fillStyle = current_brush_color;

    //Creating the event listeners for the canvas

    canvas.addEventListener("mousedown", function(e){
        //The canvas is mainly used for 2 main activity: to add line or to delete a line. 
        //Check the condition for every mousedown event. The default value of eraser_on is false.
        if(eraser_on == false){
            [startPointX, startPointY] = [parseInt(e.offsetX), parseInt(e.offsetY)];
        }else{
            //If user wish to delete a line, this section of code will be executed.

            //To delete a line, user must click the canvas. Therefore, grab the current point where user clicks. 
            del_line_x = parseInt(e.offsetX);
            del_line_y = parseInt(e.offsetY);

            //This is the function to remove a value from an array. The purpose will be explained later.
            function array_remove (arr, value){
                return arr.filter(function(element){
                    return element != value;
                });
            }

            //This is where the removal of a line happens
            //The idea is to check whether the point that user just click is colinnear with any line from the--
            //-- list of lines. If the current point is colinnear with a line, then we can conclude that user wants to delete that line.
            //Colinnear means that given point A, B, and C are perfectly aligned together in a line.
            for(let item of line_data){
                let p1p2, p2p3, p1p3;
                //line_coordinates index: 
                //[0] = x1 --- [1] = y1 --- [2] = x2 ---- [3] = y2
                
                //Given 3 consecutive points: p1, p2, and p3, these 3 points are colinnear if:
                //The distance between p1p2 added with the distance between p2p3 is equal with p1p3. In other words:
                //Collinear if: p1p2 + p2p3 = p1p3
                //The formula to find the distance between 2 points; A and B is:
                //The square root of the addition between P and Q where P is the power of 2 between By-Ay  and--
                //-- Q is the power of 2 between Bx-Ax.
                
                p1p2 = Math.sqrt(Math.pow((del_line_y - item["line_coordinates"][1]), 2) + Math.pow((del_line_x - item["line_coordinates"][0]), 2));
                p2p3 = Math.sqrt(Math.pow((item["line_coordinates"][3] - del_line_y), 2) + Math.pow((item["line_coordinates"][2] - del_line_x), 2));
                p1p3 = Math.sqrt(Math.pow((item["line_coordinates"][3] - item["line_coordinates"][1]), 2) + Math.pow((item["line_coordinates"][2] - item["line_coordinates"][0]), 2));

                //In here, we check whether it is colinnear or not. If yes, the remove the current line with the array_remove function.
                if(Math.round(p1p2 + p2p3) == Math.round(p1p3)){
                    line_data = array_remove(line_data, item);
                    console.log(line_data);
                    break;
                }
            }
            
            //If done, we want to redraw everything (the line that is selected to be erased won't be drawn)
            draw_data(line_data, canvas);
        }
    });

    //If user lift their finger from the mouse click button while the cursor is within the canvas, then user wants to draw something.
    canvas.addEventListener("mouseup", function(e){
        //There will be no action in mouseup while eraser mode is on
        if(eraser_on == false){
            //Grab the coordinate of the current location of the mouse. . .
            [endPointX, endPointY] = [parseInt(e.offsetX), parseInt(e.offsetY)];

            //. . . and draw a line from the starting point to the current point. 
            draw_line(startPointX, startPointY, endPointX, endPointY, current_brush_color, selected_size, context);

            //We need to keep track of the drawn line on the canvas. Therefore, push the current information of a line to the line_data array.
            line_data.push(gather_line_data(hold_coordinate(startPointX, startPointY, endPointX, endPointY), display_color_text.value, selected_size));
        }
    });

    //Keep track of the coordinate of the mouse while user move the pointer within the canvas.
    canvas.addEventListener("mousemove", function(e){
        [loc_x, loc_y] = [e.offsetX, e.offsetY];
        location_text.textContent = `Location of mouse is at: (${loc_x}, ${loc_y})`;
    });

    //Event listener for the size dropdown menu
    size_dropdown.addEventListener("change", function(e){
        selected_size = parseInt(size_dropdown.value);
    });

    //Event listener for the color input
    color_selector.addEventListener("input", function(e){
        current_brush_color = color_selector.value;
        display_color_text.value = current_brush_color;
    });

    //Event listener to clear the content of canvas
    button_clear_canvas.addEventListener("click", function(e){
        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        line_data = [];
    });

    //Event listener to reset to default settings
    button_default_settings.addEventListener("click", function(e){
        set_default();
    });

    //Event listener for the erase button;
    //This button determines whether the eraser mode is on or off.
    button_erase_line.addEventListener("click", function(e){
        if(this.classList.contains("button_active")){
            eraser_on = false;
            this.classList.toggle("button_active");
        }else{  
            eraser_on = true;
            this.classList.toggle("button_active");
        }
    });

    
    saveModal.addEventListener("click", (e) => {
        const modal = document.querySelector(saveModal.dataset.modalTarget);
        chosen_modal_action = "save";
        openModalFunction(modal, chosen_modal_action);

    });

    loadModal.addEventListener("click", (e) => {
        const modal = document.querySelector(loadModal.dataset.modalTarget);
        chosen_modal_action = "load";
        openModalFunction(modal, chosen_modal_action);
    });

    viewModal.addEventListener("click", (e) => {
        const modal = document.querySelector(viewModal.dataset.modalTarget);
        chosen_modal_action = "view";
        openModalFunction(modal, chosen_modal_action);
    });

    //This is the submit button for all 3 features: save, load, and view. 
    submitModal.addEventListener("click", (e) => {
        const modal = submitModal.closest(".modal");
        //violent and violent message basically checks whether or not user has violate something inside the modal
        //If user leaves out a field to be empty inside the modal, that is considered to be violent/violation.
        //If a violation occurs, user can not proceed with the action from the current modal.
        let violent = false;
        let violent_message = "";
        if(chosen_modal_action == "save"){
            //If user wants to save data, then grab the username and recordname that has inputted by the user. 
            let username = document.querySelector("#username").value;
            let recordname = document.querySelector("#recordname").value;

            //Check whether both of them has value or not
            if((username) && (recordname)){
                //Set the violent flag to be false and gather all data regarding the lines inside the current canvas    
                violent = false;
                var data = {
                    "request_type":"save",
                    "username":username,
                    "recordname":recordname,
                    "line_data":line_data
                };

                //Cast the data to string, create connection to the server, send it, and wait the response from the server--
                //-- whether or not the save process succeeded.
                json_string = JSON.stringify(data);

                http_request.open("POST", "mainscript.php", true);
                http_request.setRequestHeader("Content-type", "application/json");

                http_request.send(json_string);

                http_request.onreadystatechange = function(e) {
                    if (http_request.readyState === 4 && http_request.status === 200) {
                        alert(http_request.responseText);
                    }
                }
            }else{
                //If at least one of the field is empty, set it as violent/violation.
                violent_message = "Please fill in the user name and the record name";
                violent = true;
            }
        }
        else if(chosen_modal_action == "load"){
            //Load operation chosen. Grabbing the target usrename and target recordname for the server.
            var insertedRecordName = document.querySelector("#loadRecordName").value;
            var insertedUserName = document.querySelector("#loadUserName").value;

            //Violation check. The fields must not be empty.
            if((insertedRecordName) && (insertedUserName)){
                violent = false;

                //Setting the request and the data to be sent to the server.
                var data = {
                    "request_type":"load",
                    "requested_username":insertedUserName,
                    "requested_recordname":insertedRecordName
                }
                
                json_string = JSON.stringify(data);
                http_request.open("POST", "mainscript.php", true);
                http_request.setRequestHeader("Content-type", "application/json");
    
                http_request.send(json_string);
                
                //Waiting for the response from the server.
                //If there is a matching record with the user's inputs, then draw that record.
                //If not, simply alert the user.
                http_request.onreadystatechange = function(e){
                    if(http_request.readyState === 4 && http_request.status === 200){
                        response_message = http_request.responseText;
                        if(response_message == "No Data"){
                            alert("No data found");
                        }
                        else{
                            line_data = JSON.parse(http_request.responseText);
                            draw_data(line_data, canvas);
                        }
                    }
                }
            }else{
                violent_message = "Please fill in the targeted user name and record name";
                violent = true;
            }

        }
        else if(chosen_modal_action == "view"){
            alert("View window closed");
        }

        //If there is no violation/violent, the modal can be closed.
        //If there is, the modal can not be closed by the submit button. 
        //Remember, if there is a violation, no operation will be performed and the program will jump straight to here. 
        if(!violent){
            closeModalFunction(modal);
        }else{
            alert(violent_message);
        }

    });
    
    closeModal.forEach(button => {
        button.addEventListener("click", (e) => {
            const modal = button.closest(".modal");
            closeModalFunction(modal);
        })
    });

    //If user clicks the overaly (the blackish backdrop behind the modal), the modal will be closed.
    overlay.addEventListener("click", (e) => {
        const modals = document.querySelectorAll(".modal.active");
        modals.forEach(modal => {
            closeModalFunction(modal);
        });
    });

};