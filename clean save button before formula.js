resAttrData = commerce.getRequiredItemAttrData();
print "resAttrData : "+resAttrData;
//resTxnLineData = commerce.updateTxnLineThroughSeqNum();

//result = (resPrice + resAttrData);
resultCFR= commerce.calculateCFRListPrice();
result= commerce.activeVersion_c();
//resultC = commerce.carding_Price_Calculation();
//result =  resAttrData + resultCFR + commerce.addressFormat() + resTxnLineData;
result =  resAttrData + resultCFR + commerce.addressFormat();
//resPrice = commerce.getModelPrice();
//print "resprice" + resprice;
/* invoking lib function to fetch data from 
SaleOrder object for MTD and PurchaseOrder object for TMD */
//result = result + commerce.getOECSaleOrderRec_c();
isErr=commerce.bill_ship_to();
ErrorMessage = "";
print isErr;

results= ErrorMessage+result;
return results;