resultSection = "";
resultQty  = "";
//resultSection = commerce.updateSectionValue();

/*resultListPrice = commerce.calculateCFRListPrice();
resultQty = commerce.updateQuantity();
resStr = commerce.getDataCondBased();*/

//return "2~lastReconfigDate_l_c~2020-10-27 15:19:11|" +resultSection  + resultListPrice  + resultQty + resStr ;
//return resultSection  + resultListPrice  + resultQty + resStr ;


//Keerthana R - SPEC Amendment
result = "";
result= commerce.orderAmendSpec_Cancell_c("Reconfig");
/*if(division_t_c == "TMD" AND oECAmendType_t == "SPEC_AMEND" AND oECOppEBSStatus_t_c <> "SYNC COMPLETED"){
  result = commerce.amendOrderSPECChangeTMD("", "", "");
}*/
return result;