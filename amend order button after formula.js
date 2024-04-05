orderFuncRes = "";
if (division_t_c == "MTD") {
	//orderFuncRes = commerce.orderUpdateServiceMTD("CANCEL");
	//orderFuncRes = commerce.orderUpdateServiceMTD("CREATE");
	orderFuncRes = commerce.cancel_Flag_c();
	orderFuncRes = commerce.createOperation_c();
	
} elif (division_t_c == "TMD" or division_t_c == "TMD EXPORTS") {
	//if(oECAmendType_t <> "QUANTITY_AMEND"){
		//orderFuncRes = commerce.orderUpdateServiceTMDDom("CANCEL");
	//}	 
	orderFuncRes = commerce.orderUpdateServiceTMDDom("CREATE");
	orderFuncRes = commerce.orderUpdateServiceTMDDom("CANCEL");
	
} /*elif (division_t_c == "TMD EXPORTS" and custBusinessType_t_c == "Exports") {
	orderFuncRes = commerce.orderUpdateServiceTMDExp();
}*/

return orderFuncRes;