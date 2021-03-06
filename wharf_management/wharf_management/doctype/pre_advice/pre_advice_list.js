// Copyright (c) 2017, Caitlah Technology and contributors
// For license information, please see license.txt

frappe.listview_settings['Pre Advice'] = {
    hide_name_column: true,
    add_fields: ["status"],
    has_indicator_for_draft: 1,
    get_indicator: function(doc) {

        if (doc.docstatus == 0) {
            if (doc.status == "Export") {
                return [__("Export"), "red", "status,=,Export"];
            } else {
                return [__("Need Attention"), "red", "status,=,'Uploaded'"];
            }
        } else if (doc.status === "Booked") {
            return [__("Booked"), "purple", "status,=,Booked"];

        } else if (doc.status === "Re-stowing") {
            return [__("Re-stowing"), "grey", "status,=,Re-stowing"];

        } else if (doc.status === "Outbound") {
            return [__("Outbound"), "purple", "status,=,Outbound"];

        } else if (doc.status === "Inspection") {
            return [__("Inspection"), "green", "status,=,Inspection"];

        } else if (doc.status === "Yard") {
            return [__("Yard"), "purple", "status,=,Yard"];

        } else if (doc.status === "Paid") {
            return [__("Paid"), "orange", "status,=,Paid"];

        } else if (doc.status === "Gate1") {
            return [__("Passed Gate1"), "blue", "status,=,Gate1"];

        } else if (doc.status === "Gate Out") {
            return [__("Outward"), "green", "status,=,Gate2"];

        } else if (doc.status === "Devanning") {
            return [__("Devan"), "black", "status,=,Devanning"];

        } else if (doc.status === "Transfer") {
            return [__("Transfer"), "orange", "status,=,Transfer"];
        }
    },
    refresh: function(frm) {
        if (frappe.user_roles.includes('Yard Inspection User', 'Yard Operation User')) {

            frm.page.sidebar.hide(); // this removes the sidebar
            $(".timeline").hide()
            frm.page.wrapper.find(".layout-main-section-wrapper").removeClass("col-md-10"); // this removes class "col-md-10" from content block, which sets width to 83%
        }
        if (frappe.user.has_role('System Manager', 'Yard Operation Supervisor')) {
            frm.page.sidebar.show(); // this removes the sidebar
            $(".timeline").show()
            frm.page.wrapper.find(".layout-main-section-wrapper").addClass("col-md-10");
        }


    }
};