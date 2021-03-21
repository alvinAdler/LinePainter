window.onload = (e) => {
    var canvas = document.getElementById("sample_canvas");
    var location_text = document.getElementById("mouse_loc");
    var size_dropdown = document.getElementById("id_sizes");

    //Getting the color and text input for inputting the color for the brush
    var display_color_text = document.querySelector("#text_show_color");
    var color_selector = document.querySelector("#input_select_color");

    var context = canvas.getContext("2d");

    var startPointX, startPointY, endPointX, endPointY;
    var selected_size = 1;
    var current_brush_color = "#000000";

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
        [startPointX, startPointY] = [e.offsetX, e.offsetY]
    });

    canvas.addEventListener("mouseup", function(e){
        [endPointX, endPointY] = [e.offsetX, e.offsetY]
        draw_line(startPointX, startPointY, endPointX, endPointY, current_brush_color, selected_size);
    });

    canvas.addEventListener("mousemove", function(e){
        [loc_x, loc_y] = [e.offsetX, e.offsetY]
        location_text.innerHTML = `Location of mouse is at: (${loc_x}, ${loc_y})`;
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

};