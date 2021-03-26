//Function that handles the pop-up window operation
//In the pop up, user can save, load, or view the works that they have done on the canvas. 
function openModalFunction(modal, action){
    if(modal == null){
        return
    }

    var current_modal_header = modal.getElementsByClassName("modal-header")[0].getElementsByClassName("modal-title")[0];
    var current_modal_body = modal.getElementsByClassName("modal-body")[0];
    var current_modal_footer = modal.getElementsByClassName("modal-footer")[0];

    //Switch between the action that user will take. 
    //There are particularly 3 actions. Each action will lead a different display of the modal pop-up window. 
    switch(action){
        case "save":
            modal.classList.add("active");
            overlay.classList.add("active");
            current_modal_header.textContent = "Save your work";
            var insert_user_name = document.createElement("input");
            var insert_row_name = document.createElement("input");

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

            current_modal_footer.getElementsByClassName("button_submit_data")[0].textContent = "Load Data"

            break;
        case "view":
            modal.classList.add("active");
            overlay.classList.add("active");
            current_modal_header.textContent = "View your work";
            modal.style.width = "60%";
            var http_request = new XMLHttpRequest();
            var server_data = "";

            var data = {
                "request_type":"view"
            };

            var json_string = JSON.stringify(data);

            http_request.open("POST", "mainscript.php", true);
            http_request.setRequestHeader("Content-type", "application/json");

            http_request.send(json_string);

            http_request.onreadystatechange = function(e){
                if(http_request.readyState == 4 && http_request.status == 200){
                    server_data = JSON.parse(http_request.responseText);
                    console.log(server_data);
                    var current_modal_body = modal.getElementsByClassName("modal-body")[0];
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
                    for(let index=0; index<header_elements.length; index+=1){
                        var th = document.createElement("th");
                        th.textContent = header_elements[index];
                        current_row.appendChild(th);
                    }
                    table_data.appendChild(current_row);


                    //Handle the data of the table
                    for(let index=0; index<server_data["usernames"].length; index+=1){
                        current_row = table_data.insertRow(index+1);
                        var td = document.createElement("td");
                        td.textContent = index+1;
                        current_row.appendChild(td);
                        for(let key of Object.keys(server_data)){
                            var td = document.createElement("td");
                            td.textContent = server_data[key][index];
                            current_row.appendChild(td);
                        }
                        table_data.appendChild(current_row);
                    }
                    
                    current_modal_body.appendChild(table_data);
                }
            }

            break;
    }
}

//Function to close the modal pop-up window. 
function closeModalFunction(modal){
    if(modal == null){
        return
    }

    modal.classList.remove("active");
    overlay.classList.remove("active");
    modal.style.width = "40%";
    var current_body = modal.getElementsByClassName("modal-body")[0];

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

    for(let item of line_data){
        draw_line(item["line_coordinates"][0], item["line_coordinates"][1], item["line_coordinates"][2], item["line_coordinates"][3], item["line_color"], item["line_weight"], context);
    }
}

//Function to draw a line given 2 end points.
function draw_line(p1x, p1y, p2x, p2y, color, brush_size, context){
    var dx = Math.abs(p1x - p2x);
    var dy = Math.abs(p1y - p2y);
    
    var m = Math.abs(dy/dx);
    var n = Math.abs(dx/dy);

    context.fillStyle = color;

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

window.onload = (e) => {

    function set_default(){
        selected_size = 1;
        size_dropdown.value = "";

        color_selector.value = "#000000";
        current_brush_color = color_selector.value;
        display_color_text.value = color_selector.value;
    }

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
        if(eraser_on == false){
            [startPointX, startPointY] = [parseInt(e.offsetX), parseInt(e.offsetY)];
        }else{
            //Remove the line
            del_line_x = parseInt(e.offsetX);
            del_line_y = parseInt(e.offsetY);

            function array_remove (arr, value){
                return arr.filter(function(element){
                    return element != value;
                });
            }

            for(let item of line_data){
                // let slope1, slope2, slope3;
                let p1p2, p2p3, p1p3;
                //line_coordinates index: 
                //[0] = x1 --- [1] = y1 --- [2] = x2 ---- [3] = y2

                p1p2 = Math.sqrt(Math.pow((del_line_y - item["line_coordinates"][1]), 2) + Math.pow((del_line_x - item["line_coordinates"][0]), 2));
                p2p3 = Math.sqrt(Math.pow((item["line_coordinates"][3] - del_line_y), 2) + Math.pow((item["line_coordinates"][2] - del_line_x), 2));
                p1p3 = Math.sqrt(Math.pow((item["line_coordinates"][3] - item["line_coordinates"][1]), 2) + Math.pow((item["line_coordinates"][2] - item["line_coordinates"][0]), 2));

                console.log(p1p2 + p2p3);
                console.log(p1p3);
                console.log("=================================");

                if(Math.round(p1p2 + p2p3) == Math.round(p1p3)){
                    line_data = array_remove(line_data, item);
                    console.log(line_data);
                    break;
                }
            }
            
            draw_data(line_data, canvas);
        }
    });

    canvas.addEventListener("mouseup", function(e){
        if(eraser_on == false){
            [endPointX, endPointY] = [parseInt(e.offsetX), parseInt(e.offsetY)];
            draw_line(startPointX, startPointY, endPointX, endPointY, current_brush_color, selected_size, context);

            line_data.push(gather_line_data(hold_coordinate(startPointX, startPointY, endPointX, endPointY), display_color_text.value, selected_size));
        }
    });

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

    submitModal.addEventListener("click", (e) => {
        const modal = submitModal.closest(".modal");
        if(chosen_modal_action == "save"){

            /*TODO:
            Make a validation; user must not submit/save the record if they did not put--
            -- the username AND the recordname
            */
            let username = document.querySelector("#username").value;
            let recordname = document.querySelector("#recordname").value;

            /*TODO:
            Ask the user if they sure want to save an empty canvas
            */
            var data = {
                "request_type":"save",
                "username":username,
                "recordname":recordname,
                "line_data":line_data
            };

            json_string = JSON.stringify(data);

            http_request.open("POST", "mainscript.php", true);
            http_request.setRequestHeader("Content-type", "application/json");

            http_request.send(json_string);

            http_request.onreadystatechange = function(e) {
                if (http_request.readyState === 4 && http_request.status === 200) {
                    alert(http_request.responseText);
                }
            }
        }
        else if(chosen_modal_action == "load"){
            var insertedRecordName = document.querySelector("#loadRecordName").value;
            var insertedUserName = document.querySelector("#loadUserName").value;

            var data = {
                "request_type":"load",
                "requested_username":insertedUserName,
                "requested_recordname":insertedRecordName
            }

            json_string = JSON.stringify(data);
            http_request.open("POST", "mainscript.php", true);
            http_request.setRequestHeader("Content-type", "application/json");

            http_request.send(json_string);

            http_request.onreadystatechange = function(e){
                if(http_request.readyState === 4 && http_request.status === 200){
                    line_data = JSON.parse(http_request.responseText);
                    draw_data(line_data, canvas);
                }
            }

        }
        else if(chosen_modal_action == "view"){
            alert("View window closed");
        }

        closeModalFunction(modal);

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
    
    closeModal.forEach(button => {
        button.addEventListener("click", (e) => {
            const modal = button.closest(".modal");
            closeModalFunction(modal);
        })
    });

    overlay.addEventListener("click", (e) => {
        const modals = document.querySelectorAll(".modal.active");
        modals.forEach(modal => {
            closeModalFunction(modal);
        });
    });

};

////Lines of code to print the starting and ending point for the current line into the console. 
////Might be required later. 
//console.log("Start point: "+ startPointX.toString() + "," + startPointY.toString() + "\n" + "Ending point: " + endPointX.toString() + "," + endPointY.toString());

//Lines of code to check whether a point between 2 points is collinear or not. 
// slope1 = (del_line_y - item["line_coordinates"][1]) / (del_line_x - item["line_coordinates"][0]);
//                 slope2 = (item["line_coordinates"][3] - del_line_y) / (item["line_coordinates"][2] - del_line_x);

//                 console.log(slope1);
//                 console.log(slope2);
//                 console.log("==========================");
        
//                 if(Math.round(slope1) == Math.round(slope2)){
//                     line_data = array_remove(line_data, item);
//                     console.log(line_data);
//                     break;
//                 }