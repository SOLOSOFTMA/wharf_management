frappe.provide("wharf_management.yard_operations");
frappe.pages['yard_operations'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Yard Operations',
        single_column: true
    });



    var state = "Close";

    page.set_secondary_action(__("Express"), function() {
        if (state == "Close") {
            state = "Open"
        } else if (state == "Open") {
            state = "Close"
        }
        //    alert(state)
        toggle_leftMenu(state);
    }).addClass("btn-success");


    page.set_primary_action(__("Inspection"), function() {
        if (state == "Close") {
            state = "Open"
        } else if (state == "Open") {
            state = "Close"
        }
        //    alert(state)
        toggle_rightMenu(state);
    });

    let container_no_field = page.add_field({
        label: 'Container No',
        fieldtype: 'Data',
        fieldname: 'contanier_no',
        options: '',
        change() {
            console.log(container_no_field.get_value());
        }
    });
    let bay_field = page.add_field({
        label: 'Bay',
        fieldtype: 'Data',
        fieldname: 'bay',
        options: '',
        change() {
            console.log(bay_field.get_value());
        }
    });

    //    page.main.html(frappe.render_template('yard_operations', {}));

    show_yard_details(page, container_no_field.get_value());

};

var show_yard_details = function(page) {
    frappe.call({
        method: "wharf_management.wharf_management.page.yard_operations.yard_operations.get_items",
        //        args: {
        //            "container_no": container_no
        //        },
        callback: function(r) {
            //page.main.html(frappe.render_template('yard_operations', {}));
            page.main.html(frappe.render_template('yard_operations', {
                items: r.message || []
            }))
        }
    });

    frappe.call({
        method: "wharf_management.wharf_management.page.yard_operations.yard_operations.get_inspection_items",
        callback: function(y) {

            page.main.find('#right-sidebar-wrapper').html(frappe.render_template('yard_operations_rightbar', {
                    inspection_items: y.message || []
                }))
                //            console.log(y.message)
        }
    });

    frappe.call({
        method: "wharf_management.wharf_management.page.yard_operations.yard_operations.get_express_items",
        callback: function(express) {

            page.main.find('#left-sidebar-wrapper').html(frappe.render_template('yard_operations_leftbar', {
                express_items: express.message || []
            }))
            console.log(express.message)
        }
    });

};




//function allowDrop(ev) {
//    ev.preventDefault();
//}

//function drag(ev, ref) {
//    ev.dataTransfer.setData('Text/html', ev.target.id);
//    objeto = ref.id;

//    yard_id = ev.target.id;
//    alert(yard_id)
//    if (!yard_id == 'Inspection') {
//        frappe.db.set_value('Yard Settings', yard_id, 'occupy', 0);
//    }
//}


//function drop(ev, target) {
//    ev.preventDefault();

//    console.log(objeto, ev.target.id)

//    var data = ev.dataTransfer.getData('Text/html');
//    destino = ev.target.id;

//    frappe.db.set_value('Cargo', objeto, 'yard_slot', destino);

//    if (yard_id == "Inspection") {
//        frappe.db.set_value('Cargo', objeto, { 'status': 'Yard', 'yard_status': 'Closed' });
//    }

//    update_yard_slot();
//}

//function update_yard_slot() {

//    frappe.db.set_value('Yard Settings', destino, 'occupy', 1);
//    frappe.ui.toolbar.clear_cache();
//}


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
        if (status != 'Inspection' || status != 'Express') {
            frappe.db.get_value('Cargo', { 'name': cargo_ref }, 'yard_slot', function(r) {
                yard_id = r.yard_slot,
                    frappe.db.set_value('Yard Settings', yard_id, 'occupy', 0);
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
                    frappe.db.set_value('Yard Settings', yard_id, 'occupy', 0);
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

function DragEnd(e) {

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
    frappe.db.set_value('Yard Settings', new_yard, 'occupy', 1);

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