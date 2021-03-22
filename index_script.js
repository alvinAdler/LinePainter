function openModalFunction(modal, action){
    if(modal == null){
        return
    }

    modal.classList.add("active");
    overlay.classList.add("active");

    var current_modal_header = modal.getElementsByClassName("modal-header")[0].getElementsByClassName("modal-title")[0];
    var current_modal_body = modal.getElementsByClassName("modal-body")[0];
    var current_modal_footer = modal.getElementsByClassName("modal-footer")[0];

    switch(action){
        case "save":
            console.log(modal);
            current_modal_header.textContent = "Save your work";
            var insert_row_name = document.createElement("input");

            if(current_modal_body.childNodes.length == 1){
                current_modal_body.appendChild(insert_row_name);
            }

            insert_row_name.setAttribute("class", "input_save");
            insert_row_name.setAttribute("placeholder", "Insert your record name here");
            insert_row_name.setAttribute("type", "text");
            insert_row_name.style.width = "80%";
            insert_row_name.style.padding = "10px";
            insert_row_name.style.margin = "5% 5%";

            current_modal_footer.getElementsByClassName("button_submit_data")[0].textContent = "Save Data"

            break;
        case "load":
            console.log("load");
            current_modal_header.textContent = "Load your work";
            break;
        case "view":
            console.log("view");
            current_modal_header.textContent = "View your work";
            break;
    }
}

function closeModalFunction(modal){
    if(modal == null){
        return
    }

    modal.classList.remove("active");
    overlay.classList.remove("active");
}

window.onload = (e) => {
    var canvas = document.getElementById("sample_canvas");
    var location_text = document.getElementById("mouse_loc");
    var size_dropdown = document.getElementById("id_sizes");

    //Getting the color and text input for inputting the color for the brush
    var display_color_text = document.querySelector("#text_show_color");
    var color_selector = document.querySelector("#input_select_color");
    var button_clear_canvas = document.querySelector("#button_clear_canvas");
    var button_default_settings = document.querySelector("#button_default_settings");

    //Getting the modal components
    const saveModal = document.querySelector("#button_backend_save");
    const loadModal = document.querySelector("#button_backend_load");
    const viewModal = document.querySelector("#button_backend_view");
    const closeModal = document.querySelectorAll("[data-close-button]");
    const overlay = document.querySelector("#overlay");
    var element = document.querySelector(".modal-footer");

    //Section of code to add new tag via javascript. Will be required later.
    // var sample_tag = document.createElement("button");
    // var sample_text = document.createTextNode("Sample");

    // sample_tag.appendChild(sample_text);
    // element.appendChild(sample_tag);

    var context = canvas.getContext("2d");
    var startPointX, startPointY, endPointX, endPointY;
    var selected_size = 1;
    var current_brush_color = "#000000";
    var chosen_modal_action = "";

    //context.fillStyle = "rgba(0, 0, 0, 1)";
    context.fillStyle = current_brush_color;

    function draw_line(p1x, p1y, p2x, p2y, color, brush_size){
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

    //Creating the event listeners for the canvas

    canvas.addEventListener("mousedown", function(e){
        [startPointX, startPointY] = [parseInt(e.offsetX), parseInt(e.offsetY)];
    });

    canvas.addEventListener("mouseup", function(e){
        [endPointX, endPointY] = [parseInt(e.offsetX), parseInt(e.offsetY)];
        console.log("Start point: "+ startPointX.toString() + "," + startPointY.toString() + "\n" + "Ending point: " + endPointX.toString() + "," + endPointY.toString());
        draw_line(startPointX, startPointY, endPointX, endPointY, current_brush_color, selected_size);
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
    });

    //Event listener to reset to default settings
    button_default_settings.addEventListener("click", function(e){
        selected_size = 1;
        size_dropdown.value = "";

        color_selector.value = "#000000";
        current_brush_color = color_selector.value;
        display_color_text.value = color_selector.value;
    });

    
    saveModal.addEventListener("click", (e) => {
        const modal = document.querySelector(saveModal.dataset.modalTarget);
        chosen_modal_action = "save";
        openModalFunction(modal, chosen_modal_action);
    })

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