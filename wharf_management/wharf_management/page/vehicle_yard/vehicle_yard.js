frappe.provide("wharf_management.vehicle_yard");
frappe.pages['vehicle_yard'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Vehicle Yard',
        single_column: true
    });



    var state = "Close";

    //    page.set_secondary_action(__("Express"), function() {
    //        if (state == "Close") {
    //            state = "Open"
    //        } else if (state == "Open") {
    //            state = "Close"
    //        }
    //    alert(state)
    //        toggle_leftMenu(state);
    //    }).addClass("btn-success");


    page.set_primary_action(__("Inspection"), function() {
        if (state == "Close") {
            state = "Open"
        } else if (state == "Open") {
            state = "Close"
        }
        //    alert(state)
        toggle_rightMenu(state);
    });

    let chasis_no_field = page.add_field({
        label: 'Chasis No',
        fieldtype: 'Data',
        fieldname: 'chasis_no',
        //        change() {
        //          console.log(chasis_no_field.get_value());
        //
        //            if (chasis_no_field.get_value()) {
        //                show_yard_details(page, chasis_no_field.get_value(), null);
        //            } else {
        //                frappe.ui.toolbar.clear_cache();
        //            }
        //        }
    });
    let bay_field = page.add_field({
        label: 'Bay',
        fieldtype: 'Data',
        fieldname: 'bay',
        options: '',
        //        change() {
        //            console.log(bay_field.get_value());
        //            if (page, bay_field.get_value()) {
        //                show_yard_details(page, null, bay_field.get_value());
        //            } else {
        //                frappe.ui.toolbar.clear_cache();
        //            }
        //        }
    });

    //    page.main.append(frappe.render_template('vehicle_yard', {}));

    //    show_yard_details(page, chasis_no_field.get_value(), bay_field.get_value());

};

var show_yard_details = function(page, chasis_no, bay) {
    if (chasis_no && !bay) {
        frappe.call({
            method: "wharf_management.wharf_management.page.vehicle_yard.vehicle_yard.get_chasis",
            args: {
                "chasis_no": chasis_no
            },
            callback: function(r) {
                //page.main.html(frappe.render_template('yard_operations', {}));
                page.main.append(frappe.render_template('vehicle_yard_content', {
                    items: r.message || []
                }))
            }
        });
    }
    if (!chasis_no && bay) {
        frappe.call({
            method: "wharf_management.wharf_management.page.vehicle_yard.vehicle_yard.get_bay",
            args: {
                "bay": bay
            },
            callback: function(r) {
                //page.main.html(frappe.render_template('yard_operations', {}));
                page.main.append(frappe.render_template('vehicle_yard_content', {
                    items: r.message || []
                }))
            }
        });
    }
    if (!chasis_no && !bay) {
        frappe.call({
            method: "wharf_management.wharf_management.page.vehicle_yard.vehicle_yard.get_all_items",
            //            args: {
            //                "bay": bay
            //            },
            callback: function(r) {
                //page.main.html(frappe.render_template('yard_operations', {}));
                page.main.append(frappe.render_template('vehicle_yard_content', {
                    items: r.message || []
                }))
            }
        });
    }


    frappe.call({
        method: "wharf_management.wharf_management.page.vehicle_yard.vehicle_yard.get_inspection_items",
        callback: function(y) {

            page.main.find('#right-sidebar-wrapper').append(frappe.render_template('vehicle_yard_rightbar', {
                    inspection_items: y.message || []
                }))
                //            console.log(y.message)
        }
    });

    //    frappe.call({
    //        method: "wharf_management.wharf_management.page.vehicle_yard.vehicle_yard.get_express_items",
    //        callback: function(express) {
    //            page.main.find('#left-sidebar-wrapper').append(frappe.render_template('vehicle_yard_leftbar', {
    //                express_items: express.message || []
    //            }))
    //            console.log(express.message)
    //        }
    //    });

};

function toggle_leftMenu(state) {
    if (state == "Close") {
        leftcloseNav()
    } else if (state == "Open") {
        leftopenNav()
    }
}

function toggle_rightMenu(state) {
    if (state == "Close") {
        closeNav()
    } else if (state == "Open") {
        openNav()
    }
}

function closeNav() {
    document.getElementById("right-sidebar-wrapper").style.width = "0px";
    document.getElementById("wrapper").style.paddingRight = "0px";
    document.getElementById("wrapper").style.marginRight = "0px";
}

function openNav() {
    document.getElementById("right-sidebar-wrapper").style.width = "120px";
    document.getElementById("wrapper").style.marginRight = "120px";
}

function leftcloseNav() {
    document.getElementById("left-sidebar-wrapper").style.width = "0px";
    document.getElementById("wrapper").style.paddingLeft = "0px";
    document.getElementById("wrapper").style.marginLeft = "0px";
}

function leftopenNav() {
    document.getElementById("left-sidebar-wrapper").style.width = "120px";
    document.getElementById("wrapper").style.marginLeft = "120px";
}


var cargo_ref, yard_id, status;

function update_onDragStart(cargo_ref) {

    frappe.db.get_value('Cargo', { 'name': cargo_ref }, 'status', function(r) {
        status = r.status
        if (status != 'Inspection') {
            frappe.db.get_value('Cargo', { 'name': cargo_ref }, 'yard_slot', function(r) {
                yard_id = r.yard_slot,
                    frappe.db.set_value('Vehicle Yard Settings', yard_id, 'occupy', 0);
            });
        }

    });

}


function DragStart(e, ref) {

    e.dataTransfer.setData('text/html', this.innerHTML);
    e.dataTransfer.setData('Text/html', e.target.id);
    //    yard_id = e.target.id
    cargo_ref = ref.id

    frappe.db.get_value('Cargo', { 'name': cargo_ref }, 'status', function(r) {
        status = r.status
        if (status != 'Inspection') {
            frappe.db.get_value('Cargo', { 'name': cargo_ref }, 'yard_slot', function(r) {
                yard_id = r.yard_slot,
                    frappe.db.set_value('Vehicle Yard Settings', yard_id, 'occupy', 0);
            });
        }
        //        alert(status, ref.id, yard_id);
        //        console.log(status, ref.id, yard_id);
    });

}

function DragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function DragEnter(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
}

function DragLeave(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
}

function allowDrop(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
}

function Drop(e, ref) {
    //    if (e.preventDefault) {
    //        e.preventDefault();
    //    }
    /*  Gettting IDs 
     *  dragstart, drag, dragenter, dragleave, dragover, drop, dragend
     */

    var drop_cargo_ref = e.dataTransfer.getData("Text/html");
    new_yard = ref.id;

    //    console.log(new_yard, drop_cargo_ref, drop_cargo_ref.id)

    Update_dropZone(status, cargo_ref, new_yard, drop_cargo_ref)

    //return false;
}


function Update_dropZone(status, cargo_ref, new_yard, drop_cargo_ref) {

    console.log(status, cargo_ref, new_yard, drop_cargo_ref)
    if (status == "Inspection") {
        frappe.db.set_value('Cargo', cargo_ref, 'yard_slot', new_yard);
        frappe.db.set_value('Cargo', cargo_ref, { 'status': 'Yard', 'yard_status': 'Closed', 'yard_date': frappe.datetime.now_datetime() });
    }
    //    if (status == "Express") {
    //        frappe.db.set_value('Cargo', cargo_ref, 'yard_slot', new_yard);
    //        frappe.db.set_value('Cargo', cargo_ref, { 'status': 'Yard', 'yard_status': 'Closed', 'yard_date': frappe.datetime.now_datetime() });

    //} 
    else if (yard_id != "Inspection") {
        frappe.db.set_value('Cargo', drop_cargo_ref, 'yard_slot', new_yard);
    }
    //    console.log(yard_id, new_yard, status, cargo_ref, drop_cargo_ref)
    frappe.db.set_value('Vehicle Yard Settings', new_yard, 'occupy', 1);

    frappe.ui.toolbar.clear_cache();

}


//-------------------------------------------------------------------------------------------------------------



//var touchToMouse = function(event) {
//    event.preventDefault();
//    if (event.touches.length > 1 || (event.type == "touchend" && event.touches.length > 0))
//        return; //allow default multi-touch gestures to work

//    var simulatedEvent = document.createEvent("MouseEvents");
//   var touch = null;
//    var type = null;


//    switch (event.type) {
//        case "touchstart":
//            type = "mousedown";
//            touch = event.changedTouches[0];
//            break;
//        case "touchmove":
//            type = "mousemove";
//            touch = event.changedTouches[0];
//            break;
//        case "touchend":
//            type = "mouseup";
//            touch = event.changedTouches[0];
//            break;
//        default:
//            return;
//    }

// https://developer.mozilla.org/en/DOM/event.initMouseEvent for API
//    var simulatedEvent = document.createEvent("MouseEvent");


//    simulatedEvent.initMouseEvent(type, true, true, window, 1,
//        touch.screenX, touch.screenY, touch.clientX, touch.clientY,
//        event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, 0, null);

//    touch.target.dispatchEvent(simulatedEvent);
//    event.preventDefault();
//};

//--------------------------------------------------------------------------------------------------------------------------

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});