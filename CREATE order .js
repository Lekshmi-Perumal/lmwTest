//CREATE
payloadModelStr = "";
models = string[][];
Bsid = "";
Totalplayload = ""; 
sonum = "";
 


HeaderFileLocation = "";
operationNew = "OrderSoap";
HeaderFileLocation = commerce.getTemplateLocation("OIC","SaleOrder");
retSaleOrderRes = "";
payload = dict("string");

resultSet = bmql("Select Username, Password from INT_SYSTEM_DETAILS where System ='OIC'");

for record in resultSet {
  userName = get(record,"Username");
  password = get(record,"Password");
  put(payload,"USERNAME", userName);
  put(payload,"PASSWORD", password); 
}

operation = "UPDATE"; //LEKSHMI CHANGED FROM CREATE TO UPDATE
defaultErrorMessage=""; 
outFileOrig = applytemplate(HeaderFileLocation, payload, defaultErrorMessage);
outFile = outFileOrig;

lineFileLocation = commerce.getTemplateLocation("OIC", "lineTemplate");

lineRequest = applytemplate(lineFileLocation, payload, defaultErrorMessage);

result = bmql("SELECT bs_id , comparable_payload,status,PartNumber FROM ordertest" );
for records in result {

    Bsid = get(records ,"bs_id");
    }
    
    for line in transactionLine {
	sonum = line.saleOrderId_tl_c;
	
    
    outFile = replace(outFile, "$eBSResponsiblity_t_c$", "ORDER_MGMT_SUPER_USER");
    outFile = replace(outFile, "$eBSRespApplication_t_c$", "ONT");
    outFile = replace(outFile, "$eBSSecurityGroup_t_c$", "STANDARD");
    outFile = replace(outFile, "$eBSNlsLanguage_t_c$", "AMERICAN");
    outFile = replace(outFile, "$org_id$", oRCL_ERP_OrgID_t);
    outFile = replace(outFile, "$oRCL_ERP_OrderID_t$",sonum);///edited
    outFile = replace(outFile, "$orderTypeId$", "");
    outFile = replace(outFile, "$ebsCustomerId_t_c$", ebsCustomerId_t_c);
    outFile = replace(outFile, "$cancelledFlag_t_c$", "");
    outFile = replace(outFile, "$bookedFlag_t_c$", "");
    outFile = replace(outFile, "$ebsBillToId_t_c$", "");
    outFile = replace(outFile, "$ebsShipToId_t_c$", "");
    outFile = replace(outFile, "$orderCategoryCode_t_c$", "");
    outFile = replace(outFile, "$orderSourceId_t_c$", "");
    outFile = replace(outFile, "$eBSRequestID_t_c$", "");
    
    outFile = replace(outFile, "$priceListId$", "");
    outFile = replace(outFile, "$salesPersonId$", "");
    outFile = replace(outFile, "$salesPerson_t_c$", "");
    outFile = replace(outFile, "$operation$", operation);
    outFile = replace(outFile, "$oRCL_ERP_OrderID_t$", "");
    outFile = replace(outFile, "$bs_id$", Bsid);
    outFile = replace(outFile, "$_customer_t_phone$", "");
    outFile = replace(outFile, "$_customer_t_email$", "");
    poNum = purchaseOrderNumber_t;
    poNum = replace(poNum, "&", "&amp;");
    poNum = replace(poNum, "'", "&apos;");
    poNum = replace(poNum, "<", "&lt;");
    poNum = replace(poNum, ">", "&gt;");
    poNum = replace(poNum, "\"", "&quot;");
    poNum = replace(poNum, "(", "");
    poNum = replace(poNum, ")", "");
    outFile = replace(outFile, "$poNumber_t$", poNum);
    outFile = replace(outFile, "$currency$", oRCL_INT_TargetCurrency_t);
    outFile = replace(outFile, "$customerCategory_t_c$", customerCategory_t_c);
    outFile = replace(outFile, "$customerCategory_t_c$", "");
    outFile = replace(outFile, "$deliveryTerms_t_c$", "");
    outFile = replace(outFile, "$machineType_t_c$", "");
    outFile = replace(outFile, "$machineType_t_c$", "");
    outFile = replace(outFile, "$whyLMWMachine_t_c$", "");
    outFile = replace(outFile, "$freightTransportation_t_c$", "");
    outFile = replace(outFile, "$modeOfPayment_t_c$", "");
    outFile = replace(outFile, "$industry_c$", industry_c);
    outFile = replace(outFile, "$industry_c$", "");
    outFile = replace(outFile, "$context_t_c$", context_t_c);
    outFile = replace(outFile, "$custInfo_t_c$", "");
    outFile = replace(outFile, "$custInfo_t_c$", "");
    outFile = replace(outFile, "$flowStatusCode_t_c$", flowStatusCode_t_c);
   
    
        outFile = replace(outFile, "$flexAttr1$", employeeName_t_c);
	outFile = replace(outFile, "$flexAttr2$", _transaction_customer_t_first_name);
	outFile = replace(outFile, "$flexAttr3$", "");
	outFile = replace(outFile, "$flexAttr4$", freightAndInsurance_t_c);//freightTransportation_t_c
	outFile = replace(outFile, "$flexAttr5$", machineType_t_c);//machineType_t_c - LOV
	payTerms = paymentTerms_t_c;
	payTerms = replace(payTerms, "&", "&amp;");
	outFile = replace(outFile, "$flexAttr6$", payTerms);//modeOfPayment_t_c
	outFile = replace(outFile, "$flexAttr7$", deliveryTerms_t_c);
	outFile = replace(outFile, "$flexAttr8$", "");//custInfo_t_c - LOV
	outFile = replace(outFile, "$flexAttr9$", whyLMWMachine_t_c);//whyLMWMachine_t_c
	outFile = replace(outFile, "$flexAttr10$", "");
	outFile = replace(outFile, "$flexAttr11$", newMarket_t_c);
	outFile = replace(outFile, "$flexAttr12$", "");//customerCategory_t_c - LOV
	outFile = replace(outFile, "$flexAttr13$", "");//industry_c - LOV
	outFile = replace(outFile, "$flexAttr14$", "");//typeOfProject_t_c - LOV
	outFile = replace(outFile, "$flexAttr15$", "");
	outFile = replace(outFile, "$flexAttr16$", _transaction_customer_t_phone);
	outFile = replace(outFile, "$flexAttr17$", _transaction_customer_t_email);
	outFile = replace(outFile, "$flexAttr18$", "");//orderCategory_t_c - LOV
	outFile = replace(outFile, "$flexAttr19$", "");
	outFile = replace(outFile, "$flexAttr20$", transactionInternalId_t_c);
	outFile = replace(outFile, "$OptyNum$", opportunityNumber_t);
	}
 


modelIndx = 1;
cnt = 0;

arrSeqNum = integer[];
grpSeqDict = dict("string");
docNumDict = dict("string");
lineBomPartDict = dict("string");
ordTypeIdDict = dict("string");
ordCategCodeDict = dict("string");
reqQuanDict = dict("string");
reqUomDict = dict("string");
itemIdDict = dict("string");
partNumDict = dict("string");
bomLvlDict = dict("string");
unitPriceDict = dict("string");
CancelQuanDict= dict("string");


//CRP - TOTAL
oecTotal = 0;
cpqTotal = totalAmountWithGST;
totQty = 0;
for line in transactionLine {
  if (line._part_number == "") {
    oecTotal = line.totalOrderValueOEC_tl_c;
    totQty = totQty + line.requestedQuantity_l;
  }
}

//print oecTotal;
//print cpqTotal;
//print totQty;

seqCnt = 0;
for line in transactionLine {
    if (line._part_number == "" AND (line.saleOrderNum_tl_c == "" OR ISNULL(line.saleOrderNum_tl_c))) {
        models[cnt][0] = line._document_number;
        models[cnt][1] = line._group_sequence_number;
        models[cnt][2] = line._line_bom_part_number;
	models[cnt][3] = line.oecSoRecId_tl_c;
	models[cnt][4] = line.saleOrderId_tl_c;
	models[cnt][5] = line.saleOrderNum_tl_c;
	models[cnt][6] = line.oecSoRecId_tl_c;
	models[cnt][7] = line.oECSORecLineId_tl_c;  
	models[cnt][8] = line.cancelledQuantity;        
        cnt = cnt + 1;
    }
    
    
	arrSeqNum[seqCnt] = line._sequence_number;
	put(grpSeqDict, line._sequence_number, line._group_sequence_number);
	put(docNumDict, line._sequence_number, line._document_number);
	put(lineBomPartDict, line._sequence_number, line._line_bom_part_number);
	put(partNumDict, line._sequence_number, line._part_number);
	put(reqQuanDict, line._sequence_number, string(line.requestedQuantity_l));
	put(reqUomDict, line._sequence_number, line._part_units);
	put(itemIdDict, line._sequence_number, line.itemId_tl_c);
	put(bomLvlDict, line._sequence_number, string(line._line_bom_level));
	put(ordTypeIdDict, line._sequence_number, line.orderTypeId_tl_c);
	put(ordCategCodeDict, line._sequence_number, line.orderCategoryCode_tl_c);
	//put(oecSoRecIdDict, line._sequence_number, line.oECSORecLineId_tl_c);
	put(unitPriceDict, line._sequence_number, string(line.totalPrice_tl_c));
	put(CancelQuanDict,line._sequence_number,line.cancelledQuantity);
	
	seqCnt = seqCnt + 1;
}


sortedArrSeqNum = sort(arrSeqNum, "asc");
//print sortedArrSeqNum;



for i in sortedArrSeqNum {
    grpSeqNo = get(grpSeqDict, i);
    docNum = get(docNumDict, i);
    lineBmPartNo = get(lineBomPartDict, i);
    orderTypeId = get(ordTypeIdDict, i);
    orderCategCode = get(ordCategCodeDict, i);
    reqQuan = get(reqQuanDict, i);
    reqUom = get(reqUomDict, i);
    itemId = get(itemIdDict, i);
    cancelledQuantity = get(CancelQuanDict,i);

payloadModelStr = payloadModelStr + lineRequest;

    payloadModelStr = replace(payloadModelStr, "$documentNumEbs_tl_c$", docNum);
    outFile = replace(outFile, "$orderTypeId$", orderTypeId);
    outFile = replace(outFile, "$orderCategoryCode_t_c$", orderCategCode);
    payloadModelStr = replace(payloadModelStr, "$oRCL_ERP_LineID_l$", "");
    payloadModelStr = replace(payloadModelStr, "$oECSORecLineId_tl_c$", models[i][7]);
    payloadModelStr = replace(payloadModelStr, "$_line_bom_part_number$", lineBmPartNo);
    payloadModelStr = replace(payloadModelStr, "$requestedQuantity_l$", reqQuan);
    payloadModelStr = replace(payloadModelStr, "$requestedUnitOfMeasure_l$", reqUom);
    payloadModelStr = replace(payloadModelStr, "$itemId_tl_c$", itemId);
    payloadModelStr = replace(payloadModelStr, "$operation$", "CREATE");
    payloadModelStr = replace(payloadModelStr, "$top_model_line$", string(modelIndx));
    payloadModelStr = replace(payloadModelStr, "$item_type$", "MODEL");
    componentCode = itemId;
    payloadModelStr = replace(payloadModelStr, "$componentCode$", componentCode );
    componentCode = componentCode + "-";
    payloadModelStr = replace(payloadModelStr, "$cancelledQuantity$", "");
    payloadModelStr = replace(payloadModelStr, "$cancelledFlag_tl_c$", "");
    payloadModelStr = replace(payloadModelStr, "$bookedFlag_tl_c$", "");
    payloadModelStr = replace(payloadModelStr, "$totalPrice_tl_c$", "");   //unitPrice
    payloadModelStr = replace(payloadModelStr, "$orderSourceId_tl_c$", "17");
    payloadModelStr = replace(payloadModelStr, "$calculatePriceFlag_tl_c$", "Y");  //Y
    payloadModelStr = replace(payloadModelStr, "$eBSRequestID_tl_c$", "111966321");
    payloadModelStr = replace(payloadModelStr, "$flowStatusCode_tl_c$", "ENTERED");
    payloadModelStr = replace(payloadModelStr, "$orderChangeReason_l_c$", "");
     
     
     //print payloadModelStr;

}

//Getting exsiting BOM details 

attr = string[];
attr[0]= "requestedQuantity_l";
attr[1]= "itemId_tl_c";
attr[2]="_line_bom_part_number";
attr[3] = "requestedUnitOfMeasure_l";
attr[4]= "oRCL_ERP_LineID_l";
attr[5]= "cancel_tl_c";
attr[6]= "_document_number";
attr[7] = "_group_sequence_number";
attr[8] = "_sequence_number";
bsid1 = atoi(bs_id);
jObj = getbom(bsid1 , 2);
details = dict("string");
jObj = getbom(bsid1 , 2,attr,true,true);
print jObj;
arr=jsonarray();
 
arr = jsonget(jObj , "children", "jsonarray");
print arr;
if (isnull(arr) == false) {
    size = jsonarraysize(arr);
}
print size; 
indices = range(size);
for index in indices {
    bomItem = jsonarrayget(arr , index, "json");
   // print bomItem;
    fields = jsonget(bomItem,"fields","json");
   // print fields;
    line_bom_part_number= jsonget(fields,"_line_bom_part_number","string");
    requestedQuantity_l = jsonget(fields,"requestedQuantity_l","string");
    itemId_tl_c  = jsonget(fields,"itemId_tl_c","string");
    requestedUnitOfMeasure_l= jsonget(fields,"requestedUnitOfMeasure_l","string");
    oRCL_ERP_LineID_l= jsonget(fields,"oRCL_ERP_LineID_l","string");
    cancel_tl_c = jsonget(fields,"cancel_tl_c","string");
    group_sequence_number = jsonget(fields,"_group_sequence_number","string");
    sequence_number = jsonget(fields,"_sequence_number","string");
    doc_no = jsonget(fields,"_document_number","string");
    
    str =  line_bom_part_number+":" +requestedQuantity_l +":"+ itemId_tl_c +":"
     + requestedUnitOfMeasure_l +":"+ oRCL_ERP_LineID_l+":"+cancel_tl_c + ":" +group_sequence_number+ ":" + sequence_number  ;


    

    payloadPartStr = "";       

        payloadPartStr = payloadPartStr + lineRequest; 
        payloadPartStr = replace(payloadPartStr,"$cancelledFlag_tl_c$","");
        payloadPartStr = replace(payloadPartStr,"$documentNumEbs_tl_c$",doc_no);
        payloadPartStr = replace(payloadPartStr,"$_line_bom_part_number$",line_bom_part_number);
        payloadPartStr = replace(payloadPartStr,"$oRCL_ERP_LineID_l$",oRCL_ERP_LineID_l);
        payloadPartStr = replace(payloadPartStr,"$bookedFlag_tl_c$","N");
        payloadPartStr = replace(payloadPartStr,"$operation$","CREATE");
        payloadPartStr = replace(payloadPartStr,"$flowStatusCode_tl_c$","ENTERED");
        payloadPartStr = replace(payloadPartStr,"$orderChangeReason_l_c$","");

        //EMPTY
       // payloadPartStr = replace(payloadPartStr,"$cancelledQuantity$",cancelledQuantity);
        payloadPartStr = replace(payloadPartStr,"$componentCode$","");
        payloadPartStr = replace(payloadPartStr,"$itemId_tl_c$","");
        payloadPartStr = replace(payloadPartStr,"$item_type$","");
        payloadPartStr = replace(payloadPartStr,"$requestedQuantity_l$",requestedQuantity_l );
        payloadPartStr = replace(payloadPartStr,"$requestedUnitOfMeasure_l$",requestedUnitOfMeasure_l);
        payloadPartStr = replace(payloadPartStr,"$top_model_line$","");
        payloadPartStr = replace(payloadPartStr,"$orderSourceId_tl_c$","");
        payloadPartStr = replace(payloadPartStr,"$totalPrice_tl_c$","");
        payloadPartStr = replace(payloadPartStr,"$calculatePriceFlag_tl_c$","");
        payloadPartStr = replace(payloadPartStr,"$eBSRequestID_tl_c$","");
        payloadPartStr = replace(payloadPartStr,"$oECSORecLineId_tl_c$","");
        
         Totalplayload = Totalplayload + payloadPartStr; 
         
       
       
        }
      
        
        //print Totalplayload;
     
        outFile = replace(outFile, "$partLineInfo$" , Totalplayload);
        outFile = replace(outFile, "$modelLineInfo$", payloadModelStr);
        print outFile;
        soapResponse = commerce.invokeWebService("OIC",outFile);
      

return "";