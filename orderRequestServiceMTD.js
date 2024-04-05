HeaderFileLocation=""; 
operationNew = "OrderSoap";
HeaderFileLocation = commerce.getTemplateLocation("OIC", "SaleOrder");
retSaleOrderRes = "";
payload = dict("string");
//Get User Info from data table and replace it in Template file 
resultSet = bmql("Select Username, Password from INT_SYSTEM_DETAILS where System ='OIC'");

//loop through the records to get username and get password.
for record in resultSet {
  userName = get(record,"Username");
  password = get(record,"Password");
  put(payload,"USERNAME", userName);
  put(payload,"PASSWORD", password); 
}
operation = "CREATE";
defaultErrorMessage=""; 
outFileOrig = applytemplate(HeaderFileLocation, payload, defaultErrorMessage);
outFile = outFileOrig;
outFileDiscount = outFileOrig; //Keerthana

lineFileLocation = commerce.getTemplateLocation("OIC", "lineTemplate");
//print "lineFileLocation : "+lineFileLocation;

payloadLine = dict("string");
payloadModelStr = "";
payloadPartStr = "";

lineRequest = applytemplate(lineFileLocation, payloadLine, defaultErrorMessage);
//print "lineRequest:" +lineRequest;
print "Division : "+division_t_c;
modelIndx = 1;
componentCode = "";
modelDocNum = "";
models = string[][];

//Transaction Status
orderCnt = 0;
returnStatus = "";

cnt = 0;
/*for line in transactionLine {
  if (line._part_number == "") {
    models[cnt][0] = line._document_number;
    models[cnt][1] = line._group_sequence_number;
    models[cnt][2] = line._line_bom_part_number;
    models[cnt][3] = line.oecSoRecId_tl_c;
    models[cnt][4] = line.saleOrderId_tl_c;
    models[cnt][5] = line.saleOrderNum_tl_c;
    cnt = cnt + 1;
  }
}*/

arrSeqNum = integer[];
grpSeqDict = dict("string");
docNumDict = dict("string");
lineBomPartDict = dict("string");
partNumDict = dict("string");
reqQuanDict = dict("string");
reqUomDict = dict("string");
itemIdDict = dict("string");
bomLvlDict = dict("string");
ordTypeIdDict = dict("string");
ordCategCodeDict = dict("string");
oecSoRecIdDict = dict("string");
unitPriceDict = dict("string");

//Keerthana
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

print oecTotal;
print cpqTotal;
print totQty;

discountValueTot = 0;
flowStatus = "BOOKED";
if(oecTotal > cpqTotal){
    discountValueTot = oecTotal - cpqTotal;
    flowStatus = "ENTERED";
}elif(oecTotal < cpqTotal){
    discountValueTot = cpqTotal - oecTotal;
    flowStatus = "BOOKED";
}

discountValue = discountValueTot/totQty;

//Keerthana

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
		//Keerthana
		/*discountValue = 0;
		flowStatus = "BOOKED";
		if(line.listPrice_l > line.totalPrice_tl_c){
			discountValue = line.listPrice_l - line.totalPrice_tl_c;
			flowStatus = "ENTERED";
		}elif(line.listPrice_l < line.totalPrice_tl_c){
			discountValue = line.totalPrice_tl_c - line.listPrice_l;
			flowStatus = "BOOKED";
		}*/
		models[cnt][8] = string(discountValue);
		models[cnt][9] = flowStatus;
		//Keerthana
		
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
	
	seqCnt = seqCnt + 1;
}
print "printing array seqnum ------------->";
print arrSeqNum;
sortedArrSeqNum = sort(arrSeqNum, "asc");
print sortedArrSeqNum;
//print docNumDict;
//print lineBomPartDict;
//print partNumDict;
//print reqQuanDict;
//print reqUomDict;
//print itemIdDict;

print models;

indx = range(cnt);
for i in indx {
  str = string(integer(atof(models[i][1])));
  str = str + ".";
  print str;
  //If sale order is not created for this model line, then proceed to create
  if (models[i][4] == "") {
	outFile = replace(outFile, "$eBSResponsiblity_t_c$", "ORDER_MGMT_SUPER_USER");
	outFile = replace(outFile, "$eBSRespApplication_t_c$", "ONT");
	outFile = replace(outFile, "$eBSSecurityGroup_t_c$", "STANDARD");
	outFile = replace(outFile, "$eBSNlsLanguage_t_c$", "AMERICAN");
	outFile = replace(outFile, "$org_id$", oRCL_ERP_OrgID_t);
	outFile = replace(outFile, "$ebsCustomerId_t_c$", ebsCustomerId_t_c);
	outFile = replace(outFile, "$priceListId$", "");
	outFile = replace(outFile, "$salesPersonId$", "");
	outFile = replace(outFile, "$salesPerson_t_c$", "");
	outFile = replace(outFile, "$operation$", operation);
	outFile = replace(outFile, "$oRCL_ERP_OrderID_t$", "");
	outFile = replace(outFile, "$bs_id$", bs_id);
	outFile = replace(outFile, "$_customer_t_phone$", "");
	outFile = replace(outFile, "$_customer_t_email$", "");
	poNum = purchaseOrderNumber_t;
	end=len(pODate_t_c);
	POdate=substring(pODate_t_c, 0 , end-8);
	print "line 179";
	
		 //odate =strtojavadate(pODate_t_c, "MM/dd/yyyy");
      //rodate = datetostr(pODate_t_c, "yyyy-MM-dd HH:mm:ss");
	
	PoNumAndDate= poNum+"_"+"DATED"+"_"+POdate;
	POValue=purchaseOrderAmount_t_c;
	transportCharges =transportationCharges_t_c;
	poNum = replace(poNum, "&", "&amp;");
	poNum = replace(poNum, "'", "&apos;");
	poNum = replace(poNum, "<", "&lt;");
	poNum = replace(poNum, ">", "&gt;");
	poNum = replace(poNum, "\"", "&quot;");
	poNum = replace(poNum, "(", "");
	poNum = replace(poNum, ")", "");
	outFile = replace(outFile, "$poNumber_t$", PoNumAndDate);
	//outfile= replace(outFile,"$poNumber_t$",PoDate);
	outFile = replace(outFile, "$POValue$", POValue);
	outFile = replace(outFile, "$transportCharges$", string(transportCharges));	
	outFile = replace(outFile, "$currency$", oRCL_INT_TargetCurrency_t);
//	outFile = replace(outFile, "$customerCategory_t_c$", customerCategory_t_c);
	outFile = replace(outFile, "$customerCategory_t_c$", "");
	outFile = replace(outFile, "$deliveryTerms_t_c$", "");
	outFile = replace(outFile, "$machineType_t_c$", "");
	//outFile = replace(outFile, "$machineType_t_c$", "");
	outFile = replace(outFile, "$whyLMWMachine_t_c$", "");
	outFile = replace(outFile, "$freightTransportation_t_c$", "");
	outFile = replace(outFile, "$modeOfPayment_t_c$", "");
	//outFile = replace(outFile, "$industry_c$", industry_c);
	outFile = replace(outFile, "$industry_c$", "");
	outFile = replace(outFile, "$context_t_c$", context_t_c);
	outFile = replace(outFile, "$custInfo_t_c$", "");
	//outFile = replace(outFile, "$custInfo_t_c$", "");
	//outFile = replace(outFile, "$flowStatusCode_t_c$", flowStatusCode_t_c);
	outFile = replace(outFile, "$flowStatusCode_t_c$", models[i][9]);   //Keerthana
	print "Keee----";
	print PoNumAndDate;
	print POValue;
	print transportCharges;
	print models[i][9];
	if(models[i][9] == "BOOKED"){
	  outFile = replace(outFile, "$bookedFlag_t_c$", "Y");   //Keerthana
	}else{
	  outFile = replace(outFile, "$bookedFlag_t_c$", bookedFlag_t_c);
	}
	outFile = replace(outFile, "$cancelledFlag_t_c$", cancelledFlag_t_c);
	outFile = replace(outFile, "$transactionInternalId_t_c$", "");
	outFile = replace(outFile, "$orderSourceId_t_c$", "17");
	outFile = replace(outFile, "$eBSRequestID_t_c$", "111966321");
	outFile = replace(outFile, "$ebsBillToId_t_c$", ebsBillToId_t_c);
	outFile = replace(outFile, "$ebsShipToId_t_c$", ebsShipToId_t_c);
	outFile = replace(outFile, "$oECSORecID_t_c$", "");
	
	outFile = replace(outFile, "$flexAttr1$", employeeName_t_c);
	outFile = replace(outFile, "$flexAttr2$", _transaction_customer_t_first_name);
	outFile = replace(outFile, "$flexAttr3$", models[i][6]);
	outFile = replace(outFile, "$flexAttr4$", freightAndInsurance_t_c);//freightTransportation_t_c
	//outFile = replace(outFile, "$flexAttr5$", machineType_t_c);//machineType_t_c - LOV
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

  for num in sortedArrSeqNum {
    grpSeqNo = get(grpSeqDict, num);
    docNum = get(docNumDict, num);
    lineBmPartNo = get(lineBomPartDict, num);
    partNum = get(partNumDict, num);
    reqQuan = get(reqQuanDict, num);
    reqUom = get(reqUomDict, num);
    itemId = get(itemIdDict, num);
    bomLvl = get(bomLvlDict, num);
    orderTypeId = get(ordTypeIdDict, num);
    orderCategCode = get(ordCategCodeDict, num);
    oecSoRecId = get(oecSoRecIdDict, num);
    unitPrice = get(unitPriceDict, num);
  
    if (startswith(grpSeqNo, str)) {
      if (partNum == "") {

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
	payloadModelStr = replace(payloadModelStr, "$operation$", operation);
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
	payloadModelStr = replace(payloadModelStr, "$flowStatusCode_tl_c$", "");
	payloadModelStr = replace(payloadModelStr, "$orderChangeReason_l_c$", "");
	
	modelDocNum = docNum;
	print "doc num : " + docNum;
	print "seq num : " + string(num);
	print "grp seq num : " + grpSeqNo;
	print "model : " + lineBmPartNo;
	print "level : " + bomLvl;
	print "item id : "+ itemId;
	print "compCode : " + componentCode;
	arrCompCode = split(componentCode, "-");
	print "printing arrCompCode";
	print arrCompCode;
	print "------------------------";
      } else {
	  payloadPartStr = payloadPartStr + lineRequest;
	  payloadPartStr = replace(payloadPartStr, "$documentNumEbs_tl_c$", docNum);
	  payloadPartStr = replace(payloadPartStr, "$oRCL_ERP_LineID_l$", "");
	  payloadPartStr = replace(payloadPartStr, "$oECSORecLineId_tl_c$", "");
	  payloadPartStr = replace(payloadPartStr, "$_line_bom_part_number$", lineBmPartNo);
	  payloadPartStr = replace(payloadPartStr, "$requestedQuantity_l$", reqQuan);
//	  payloadPartStr = replace(payloadPartStr, "$requestedUnitOfMeasure_l$", reqUom);
  	  payloadPartStr = replace(payloadPartStr, "$requestedUnitOfMeasure_l$", reqUom);
	  payloadPartStr = replace(payloadPartStr, "$itemId_tl_c$", itemId);
	  payloadPartStr = replace(payloadPartStr, "$operation$", operation);
	  payloadPartStr = replace(payloadPartStr, "$top_model_line$", string(modelIndx));
	  payloadPartStr = replace(payloadPartStr, "$item_type$", "");
	  payloadPartStr = replace(payloadPartStr, "$cancelledQuantity$", "");
	  payloadPartStr = replace(payloadPartStr, "$cancelledFlag_tl_c$", "");
	  payloadPartStr = replace(payloadPartStr, "$bookedFlag_tl_c$", "");
	  payloadPartStr = replace(payloadPartStr, "$totalPrice_tl_c$", "");   //unitPrice
	  payloadPartStr = replace(payloadPartStr, "$orderSourceId_tl_c$", "17");
	  payloadPartStr = replace(payloadPartStr, "$calculatePriceFlag_tl_c$", "Y");
	  payloadPartStr = replace(payloadPartStr, "$eBSRequestID_tl_c$", "111966321");
	  payloadPartStr = replace(payloadPartStr, "$flowStatusCode_tl_c$", "");
	  payloadPartStr = replace(payloadPartStr, "$orderChangeReason_l_c$", "");

	  //-----------------------------------
	  bomLevel = bomLvl;
	  print "doc num : " + docNum;
	  print "seq num : " + string(num);
	  print "grp seq num : " + grpSeqNo;
	  print "level : " + bomLvl;
	  print "part : " + lineBmPartNo;
	  print "item id : "+ itemId;
	  arrCompCode = split(componentCode, "-");
	  print arrCompCode;
	  componentCode = "";
	  limit = range(atoi(bomLvl));
	  for j in limit {
	    componentCode = componentCode + arrCompCode[j] + "-";
	  }
	  componentCode = componentCode + itemId;
	  print "compCode : " + componentCode;		
	  print "------------------------";
	  payloadPartStr = replace(payloadPartStr, "$componentCode$", componentCode);
	  
      }
    } else { 
        print "doc no : "+ docNum +", grp seq : "+ grpSeqNo +", but start with "+str;
        //break; 
      }
  }

	//Sale order creation for each payload generated for each model ---------------------.
	outFile = replace(outFile, "$modelLineInfo$", payloadModelStr);
	outFile = replace(outFile, "$partLineInfo$", payloadPartStr);
	print "printing outfile------->";
	print outFile;
	print "Invoking web service------->";
	soapResponse = "";
	soapResponse = commerce.invokeWebService("OIC", outFile);
	print "SO response for model "+ soapResponse;
	xpaths = string[];
	xpaths[0] = "/*[name()='env:Envelope']/*[name()='env:Body']/*[name()='bmxsd:processResponse']/*[name()='bmxsd:transaction']/*[name()='bmxsd:data_xml']/*[name()='bmxsd:transaction']/*[name()='bmxsd:integrationStatus_t_c']";
	xpaths[1] = "/*[name()='env:Envelope']/*[name()='env:Body']/*[name()='bmxsd:processResponse']/*[name()='bmxsd:transaction']/*[name()='bmxsd:data_xml']/*[name()='bmxsd:transaction']/*[name()='bmxsd:oRCL_ERP_IntegrationStatusText_t']";
	xpaths[2] = "/*[name()='env:Envelope']/*[name()='env:Body']/*[name()='bmxsd:processResponse']/*[name()='bmxsd:transaction']/*[name()='bmxsd:data_xml']/*[name()='bmxsd:transaction']/*[name()='bmxsd:oRCL_ERP_OrderNumber_t']";
	xpaths[3] = "/*[name()='env:Envelope']/*[name()='env:Body']/*[name()='bmxsd:processResponse']/*[name()='bmxsd:transaction']/*[name()='bmxsd:data_xml']/*[name()='bmxsd:transaction']/*[name()='bmxsd:oRCL_ERP_OrderID_t']";
	xpaths[4] = "/*[name()='env:Envelope']/*[name()='env:Body']/*[name()='bmxsd:processResponse']/*[name()='bmxsd:transaction']/*[name()='bmxsd:data_xml']/*[name()='bmxsd:transaction']/*[name()='bmxsd:flowStatusCode_t_c']";
	output = readxmlsingle(soapResponse, xpaths);
	
	if (get(output, xpaths[0])  <> "S") {
	  print "ERROR in Webservice Invocation";
	
	  retSaleOrderRes = retSaleOrderRes + modelDocNum + "~sOResponseStatus_tl_c~"
	  		+ get(output, xpaths[0]) + ", " + get(output, xpaths[1]) + "|";
	  print "SO status : "+retSaleOrderRes;
	  //throwerror(get(output, xpaths[0]) + ", " + get(output, xpaths[1])); 
	  
	} else {

		print "Sale Order is created with Order num : " + get(output, xpaths[2]) +" at ";
		print getdate(true);
		strJavaDate = strtojavadate(getstrdate(), "MM/dd/yyyy HH:mm:ss");
		curDateStr = datetostr(strJavaDate, "yyyy-MM-dd", "GMT+5:30");
		
		retSaleOrderRes = retSaleOrderRes + modelDocNum + "~sOResponseStatus_tl_c~"
			+ get(output, xpaths[0]) + ", " + get(output, xpaths[1])
			+ "|" + modelDocNum + "~saleOrderNum_tl_c~" + get(output, xpaths[2])
			+ "|" + modelDocNum + "~saleOrderId_tl_c~" + get(output, xpaths[3])
			+ "|" + modelDocNum + "~orderStatus_tl_c~" + get(output, xpaths[4])
			+ "|" + modelDocNum + "~orderDateMtd_t_c~" + curDateStr + "|";
			
		orderCnt = orderCnt + 1;
		returnStatus = returnStatus + modelDocNum + "~status_l~ORDERED|";
	  
	  //retSaleOrderRes = retSaleOrderRes + commerce.parseOrderResponseMtd(soapResponse, str);
	  retSaleOrderRes = retSaleOrderRes + commerce.parseOrderResponse(soapResponse);
	  print "SO status : "+retSaleOrderRes;
	  
	  //Update Discount if greater or lesser than floor price value; //Keerthana
	  if(models[i][8] <> "0"){
	    outFileDiscount = replace(outFileDiscount, "$eBSResponsiblity_t_c$", "ORDER_MGMT_SUPER_USER");
	    outFileDiscount = replace(outFileDiscount, "$eBSRespApplication_t_c$", "ONT");
	    outFileDiscount = replace(outFileDiscount, "$eBSSecurityGroup_t_c$", "STANDARD");
  	    outFileDiscount = replace(outFileDiscount, "$eBSNlsLanguage_t_c$", "AMERICAN");
	    outFileDiscount = replace(outFileDiscount, "$org_id$", oRCL_ERP_OrgID_t);
	    outFileDiscount = replace(outFileDiscount, "$flexAttr1$", bs_id);
	    outFileDiscount = replace(outFileDiscount, "$flexAttr2$", "1");
	    outFileDiscount = replace(outFileDiscount, "$flexAttr3$", models[i][8]);
	    outFileDiscount = replace(outFileDiscount, "$oRCL_ERP_OrderID_t$", get(output, xpaths[3]));
	    soapResponseDisc = "";
	    soapResponseDisc = commerce.invokeWebService("OIC_MTD_DISC", outFileDiscount);
	    //print "SO response for model "+ soapResponseDisc;
	    
	    /*//Update OEC to Trigger to Intranet //Keerthana
	    if(models[i][9] == "ENTERED" and opportunityNumber_t <> ""){
  	      returnData = "";
              baseUrl = "";
              username = "";
              password = "";
	      tableResults = recordset();
	      tableResults = bmql("select * from int_system_details where System = 'OEC'");	
              for res in tableResults {
                baseUrl = get(res,"RestEndpoint");
 	        userName = get(res,"Username");
	        passWord = get(res,"Password");
	        print baseUrl+", "+userName+", "+passWord;
	      }
	      
	      headersOpty = dict("string");
	      authorization = "Basic " + encodebase64(userName+":"+passWord);
	      put(headersOpty, "Content-Type", "application/json");
	      put(headersOpty, "Authorization", authorization);
	      val = "TO_INTRANET_ORDER_APPROVAL";
	      reqBody = "{"
		+"\"HeatTreatment_c\":\""+val+"\""+"}";
	      //print "reqBody ---->"+reqBody;
	      response = urldata(baseUrl+opportunityNumber_t , "PATCH", headersOpty, reqBody);
	      //response = urldata(baseUrl+ "300000004217625", "PATCH", headers, reqBody);
      	      reStatus = get(response, "Status-Code");
	      print reStatus;
	      resBody = get(response, "Message-Body");
	      //print resBody;
	    
	      if (find (reStatus, "OK") > 0) {
	        print "OEC Sale order records are updated";
	      } else {
                throwerror(resBody);
              }
	    }*/
	  }
	}
	payloadModelStr = "";
	payloadPartStr = "";
	soapResponse = "";
	outFile = outFileOrig;
	outFileDiscount = outFileOrig;
  } else {
  	print "Sale order is already created with ID: "+models[i][4]+ " and number: "+models[i][5];
  }
}
//---------------end
//Transaction Status
if (orderCnt == cnt) {		//all order successful [cnt: total model lines]
   returnStatus = returnStatus + _transaction_document_number + "~status_t~" + "ORDERED" + "|";
   
} elif (orderCnt > 0) {
  returnStatus = returnStatus + _transaction_document_number + "~status_t~" + "PARTIALLY_ORDERED" + "|";
  
} elif (orderCnt == 0) {
  returnStatus = returnStatus + _transaction_document_number + "~status_t~" + "CREATED" + "|";
  
}

retSaleOrderRes = returnStatus + retSaleOrderRes;

return retSaleOrderRes;