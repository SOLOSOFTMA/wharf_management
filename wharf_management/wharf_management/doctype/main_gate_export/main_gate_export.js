// Copyright (c) 2017, Sione Taumoepeau and contributors
// For license information, please see license.txt

frappe.ui.form.on('Main Gate Export', {
	refresh: function(frm) {

		cur_frm.add_fetch('truck_licenses_plate', 'company', 'company');		

	}
});
