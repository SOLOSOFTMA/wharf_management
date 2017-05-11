// Copyright (c) 2017, Caitlah Technology and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gate2', {
	refresh: function(frm) {

	},
	
	onload: function(frm) {
		
		frappe.call({
			"method": "frappe.client.get",
						args: {
							doctype: "Cargo",
							name: frm.doc.booking_ref,
							filters: {
								'docstatus' : 1
							},	
						},
						callback: function (data) {
								cur_frm.set_value("customer", data.message["consignee"]);
								cur_frm.set_value("container_no", data.message["container_no"]);
								cur_frm.set_value("custom_warrant", data.message["custom_warrant"]);
								cur_frm.set_value("custom_code", data.message["custom_code"]);	
								cur_frm.set_value("delivery_code", data.message["delivery_code"]);
								cur_frm.set_value("delivery_code", data.message["delivery_code"]);truck_licenses_plate
								
								cur_frm.set_df_property("container_no", "read_only", 1);
								cur_frm.set_df_property("customer", "read_only", 1);
								cur_frm.set_df_property("delivery_code", "read_only", 1);
								cur_frm.set_df_property("custom_code", "read_only", 1);
								cur_frm.set_df_property("custom_warrant", "read_only", 1);
								
								
							}								
			})
		frappe.call({
			"method": "frappe.client.get",
						args: {
							doctype: "Gate1",
							booking_ref: frm.doc.booking_ref,
							filters: {
								'docstatus' : 1
							},	
						},
						callback: function (data) {
								cur_frm.set_value("truck_licenses_plate", data.message["truck_licenses_plate"]);
								cur_frm.set_value("company", data.message["company"]);
								cur_frm.set_value("drivers_information", data.message["drivers_information"]);															
								cur_frm.set_df_property("drivers_information", "read_only", 1);
								cur_frm.set_df_property("company", "read_only", 1);
								cur_frm.set_df_property("truck_licenses_plate", "read_only", 1);
								
								
							}								
			})
				
	}
});
