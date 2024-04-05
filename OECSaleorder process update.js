returnData = "";
baseUrl = "";
baseUrlOpty = "";
username = "";
password = "";

tableResults = recordset();
tableResults = bmql("select * from int_system_details where System = 'OEC_SO_Custom'");
tblResOpty = bmql("select * from int_system_details where System = 'OEC'");
//print tableResults;
for res in tblResOpty {
  baseUrlOpty = get(res,"RestEndpoint");
  print baseUrlOpty;
}

for res in tableResults {
  baseUrl = get(res,"RestEndpoint");
  userName = get(res,"Username");
  passWord = get(res,"Password");
  print baseUrl+", "+userName+", "+passWord;
}
headers = dict("string");
authorization = "Basic " + encodebase64(userName+":"+passWord);
put(headers, "Content-Type", "application/json");
put(headers, "Authorization", authorization);

modelArray = string[][];
print oSCModelList; // [{"_row_number": 1, "amount":10, "type":"gas"},
                    // {"_row_number": 2, "amount":50, "type":"water"}]
Quantity = 0;
arraySize = jsonarraysize(oSCModelList);
indices = range(arraySize );

if (division_t_c == "MTD") {
  for index in indices {
	modeldet = jsonarrayget(oSCModelList, index, "json");
	Quantity = jsonget(modeldet ,"oSCQuantity", "integer");
	Model    = jsonget(modeldet ,"oSCModel","string");
	break;
  }
}

flagWhUn1 = false;
flagWhUn2 = false;

models = string[][];
cnt = 0;
for line in transactionLine { 
  if (line._part_number == "" and (((division_t_c == "TMD" or division_t_c == "TMD EXPORTS") and upper(line.oRCL_OSC_Status_l) == "WON") or division_t_c == "MTD")) {
    models[cnt][0] = line._document_number;
    models[cnt][1] = line._group_sequence_number;
    models[cnt][2] = line._line_bom_part_number;
    models[cnt][3] = line.warehouse_tl_c;
    if (line.warehouse_tl_c == "UN1") {
	flagWhUn1 = true;
	
    }
    if (line.warehouse_tl_c == "UN2") {
	flagWhUn2 = true;
    }
    models[cnt][4] = line.orderTypeId_tl_c;
    models[cnt][5] = line.oRCL_ERP_LineID_l;
    models[cnt][6] = line.itemId_tl_c;
    models[cnt][7] = line.modelDescription;
    models[cnt][8] = line.starNum_tl_c;
    models[cnt][9] = line.workOrderNumber_tl_c;
    models[cnt][10] = line.orderStatus_tl_c;
    models[cnt][11] = string(line.requestedQuantity_l);
    models[cnt][12] = string(line.totalPrice_tl_c);
    models[cnt][13] = string(line.netAmount_l);
    models[cnt][14] = line.saleOrderId_tl_c;
    models[cnt][15] = line.saleOrderNum_tl_c;
    models[cnt][16] = line.lineStatus_tl_c;
    models[cnt][17] = line.oecSoRecId_tl_c;
    models[cnt][18] = line.oECSORecLineId_tl_c;
    models[cnt][19] = line.orderDateMtd_t_c;
    models[cnt][20] = line.revnId_tl_c;
    models[cnt][21] = line.eBSLineNumber_lc;
    cnt = cnt + 1;
  }
}
print models;

response = dict("string");
result =dict("string");
resCodePost = "0";
reStatPatch = "";
responseLine = dict("string");
resCodeLinePost = "0";
resStatLinePatch = "";
resCodeupdate="";

print "Quantity: "+ string(Quantity);
print "model cnt: "+ string(cnt);

if (division_t_c == "MTD") {
  if (Quantity == cnt) {
	indx = range(cnt);
	for i in indx {
	  //if (models[i][14] <> "") {
	    docNum = models[i][0];
	    
	    orderDateStr = "";
	    if (models[i][19] <> "") {
		strJavaDate = strtojavadate(models[i][19], "yyyy-MM-dd HH:mm:ss");
		orderDateStr = datetostr(strJavaDate, "yyyy-MM-dd", "GMT+5:30");
	    } else {
		orderDateStr = "";
	    }
	    
	    print "Revenue ID: "+models[i][20];
	    
	    //Updating Opty revenue
	    if (models[i][20] <> "") {
		    reqBodyRevn = "{"
				+"\"DocumentNumber_c\":\"" +docNum + "\""
			+"}";
		    print "Revn patch url: "+ baseUrlOpty + models[i][20];
		    responseRevn = urldata(baseUrlOpty + opportunityNumber_t +"/child/ChildRevenue/"+models[i][20], "PATCH", headers, reqBodyRevn);
		    reStatRevnPatch = get(responseRevn, "Status-Code");
		    print reStatRevnPatch;
		    resBodyRevn = get(responseRevn, "Message-Body");
		    if (find(reStatRevnPatch, "OK") > 0) {
			print "Opty revenue update success!!!";
		    } else {
			print "Opty revenue update ran with issue: "+resBodyRevn;
		    }
	    }
	    //end revenue update

	    reqBody = "{"
		+"\"HeaderID_c\":\"" +models[i][14]+ "\","
		+"\"Division_c\":\"" +division_t_c+ "\"," 
		+"\"OrderNo_c\":\"" +models[i][15]+ "\","
		+"\"OrderDate_c\":\"" +orderDateStr+ "\","
		+"\"OpportunityID_c\":" +opportunityID_t+ ","
		+"\"Opportunity_Id_OptyId_SaleOrder\":" +opportunityID_t+ ","
		+"\"OrderTypeID_c\":\"" +models[i][4]+ "\","
		+"\"Status_c\":\"" +models[i][10]+ "\","
		+"\"CustomerCode_c\":\"" +customerNumber+ "\","
		+"\"CustomerName_c\":\"" +_transaction_customer_t_company_name+ "\","
		+"\"ContactName_c\":\"" +_transaction_customer_t_first_name+ "\","
		+"\"PaymentTerms_c\":\"" +paymentTerms_t_c+ "\","
		+"\"SalesPerson_c\":\"" +lastUpdatedBy_t+ "\","
		//+"\"SHIP_To_c\":\"" +shipToAddress_t_c+ "\","
		+"\"PONo_c\":\"" +purchaseOrderNumber_t+ "\","
		+"\"TotalAmount_c\":\"" +string(totalAmountWithGST)+ "\","
		+"\"OpportunityNo_c\":\"" +opportunityNumber_t+ "\","
		+"\"QuoteVersion_c\":\"" +string(version_t)+ "\","
		+"\"CPQTransactionID_c\":\"" +bs_id+ "\""
		+"}";
	    print "reqBody ---->"+reqBody;

	    // oecSoRecId_tl_c == ""
	
            print "line 156";
            //aj
	    if (  models[i][15]=="") {
			salebody = "{"
             + "\"OpportunityID_c\":" + opportunityID_t + ","
             +"\"CPQTransactionID_c\":\"" +bs_id+ "\","             
             + "\"OpportunityNo_c\":" + opportunityNumber_t + "\""
 			 /*+"\"Id\":" +SaleOrderID_t+ ","
 			 +"\"RecordName\":" +SOname_t+ ","
 			 +"\"OrderNo_c\":" +OrderNo_c_t+ 
  			*/
 			 + "}";
			print "line 166";
		result = urldata(baseUrl+ "?q=CPQTransactionID_c=" + "'" + bs_id+ "'", "GET", headers,salebody);
		resCodeupdate = get(result, "Status-Code");
		 salebody = get(result, "Message-Body");
		 resultobj = json(salebody);
		 resCount = jsonget(resultobj , "items", "jsonarray");
arrSize = jsonarraysize(resCount);
        print "arrSize--------------->";
        print arrSize;
 transId1 = jsonarray();
 ordernumber = jsonarray();
 saleno="";
limit = range(arrSize);
for pos in limit{
  // print "resCount-------";
  //  print  resCount;
  

  itemspayload = jsonarrayget(resCount, pos, "Json");
  gettransaction_ID = jsonget(itemspayload, "CPQTransactionID_c", "integer");
  orderNo = string(jsonget(itemspayload, "OrderNo_c", "integer"));
  saleorderid = string(jsonget(itemspayload,"Id","integer"));

		print "patch url: "+baseUrl + saleorderid;
		response = urldata(baseUrl +saleorderid, "PATCH", headers, reqBody);
		reStatPatch = get(response, "Status-Code");
		print reStatPatch;
}
	    }
	    //aj
	    resBody = get(response, "Message-Body");
	    //print resBody;

	    if ((resCodePost <> "" and atoi(resCodePost) == 201) or find(reStatPatch, "OK") > 0) {
		resObj = json(resBody);
		//print resObj;
		soRecId = string(jsonget(resObj, "Id", "integer"));
		print "updation of OEC Sale order header record:---Success with ID: "+soRecId;
		soRecNum = jsonget(resObj, "RecordNumber", "string");
		soRecName = jsonget(resObj, "RecordName", "string");
		
		returnData = returnData + docNum +"~oecSoRecId_tl_c~"+ soRecId +"|";
		returnData = returnData + docNum+ "~oECSORecNum_tl_c~" +soRecNum+ "|";
		returnData = returnData + docNum+ "~oECSORecName_tl_c~" +soRecName+ "|";
		
		reqBodyLines = "{"
		  	+"\"SaleOrder_Id_c\":\"" +soRecId+ "\","
			+"\"HeaderID_c\":\"" +models[i][14]+ "\","
			+"\"LineID_c\":\"" +models[i][5]+ "\","
			+"\"LineNo_c\":\"" +models[i][21]+ "\","
			+"\"InventoryItemID_c\":\"" +models[i][6]+ "\","
			+"\"CICRDDRecId_c\":\"" +opportunityID_t+ "\","
			+"\"ProductCode_c\":\"" +models[i][2]+ "\","
			+"\"ProductDescription_c\":\"" +models[i][7]+ "\","
			+"\"Status_c\":\"" +models[i][16]+ "\","
			+"\"StartItemNo_c\":\"" +models[i][8]+ "\","
			+"\"WorkOrderNo_c\":\"" +models[i][9]+ "\","
			+"\"Qty_c\":\"" +models[i][11]+ "\","
			+"\"UnitPrice_c\":\"" +models[i][12]+ "\","
			+"\"TotalAmount_c\":\"" +models[i][13]+ "\","
			+"\"CPQDocumentNo_c\":\"" +models[i][0]+ "\""
			+"}";

		print "reqBodyLines ---->"+reqBodyLines;
		urlRecLines = baseUrl + soRecId + "/child/OrderLineCollection_c/";

		responseLine = dict("string");
		// oECSORecLineId_tl_c == ""
		if (models[i][18] == "") {
			print "post url: "+urlRecLines;
			responseLine = urldata(urlRecLines, "POST", headers, reqBodyLines);
			resCodeLinePost = get(responseLine, "Status-Code");
			print resCodeLinePost;
		} else {
			print "patch url: "+urlRecLines + models[i][18];
			responseLine = urldata(urlRecLines + models[i][18], "PATCH", headers, reqBodyLines);
			resStatLinePatch = get(responseLine, "Status-Code");
			print resStatLinePatch;
		}

		resBodyLine = get(responseLine, "Message-Body");
		//print resBodyLine;

		if ((resCodeLinePost <> "" and atoi(resCodeLinePost) == 201) or find(resStatLinePatch, "OK") > 0) {
		  resObjLine = json(resBodyLine);
		  soLineRecId = string(jsonget(resObjLine, "Id", "integer"));
		  print "Creation of OEC Sale order line record:---Success! with ID: "+soLineRecId;
		  returnData = returnData + docNum +"~oECSORecLineId_tl_c~"+ soLineRecId +"|";
		} else {
		  print "Something went wrong!!!\n"+resBodyLine;
		}
	    } else {
	    	print "Something went wrong!!!\n"+resBody;
	    }
	  //}
	}
  } else {
  	print "Please Split the Model lines before Sale Order creation!";
  	//throwerror("Please Split the Model lines before Sale Order creation!");
  }
} elif (division_t_c == "TMD" or division_t_c == "TMD EXPORTS") {

	if (division_t_c == "TMD") {
		totalAmt = totalAmountWithGST;
	} elif (division_t_c == "TMD EXPORTS") {
		totalAmt = totalNetWtihSparesInsuranceExport_t_c;
	}
	
	print flagWhUn1;
	print flagWhUn2;
	// Sale Order records for UN1
	// if(saleOrderUN1Number_t_c <> "") 
	if(flagWhUn1 == true) {
		orderDateStr = "";
		if (orderDateUN1_t_c <> "") {
			strJavaDate = strtojavadate(orderDateUN1_t_c, "yyyy-MM-dd HH:mm:ss");
			orderDateStr = datetostr(strJavaDate, "yyyy-MM-dd", "GMT+5:30");
		} else {
			orderDateStr = "";
		}
		
		saleOrderNum = "";
		if (saleOrderUN1Number_t_c == "") {
			saleOrderNum = "0";
		} else {
			saleOrderNum = saleOrderUN1Number_t_c;
		}

		reqBody = "{"
			+"\"HeaderID_c\":\"" +orderIdUN1_t_c+ "\","
			+"\"Division_c\":\"" +division_t_c+ "\","
			+"\"Unit_c\":\"" +"UN1"+ "\","
			+"\"OrderNo_c\":\"" +saleOrderNum+ "\","
			+"\"OrderDate_c\":\"" +orderDateStr+ "\","
			+"\"OpportunityID_c\":" +opportunityID_t+ ","
			+"\"Opportunity_Id_OptyId_SaleOrder\":" +opportunityID_t+ ","
			+"\"OrderTypeID_c\":\"" +"1210"+ "\","
			+"\"Status_c\":\"" +orderUN1Status_t_c+ "\","
			+"\"CustomerCode_c\":\"" +customerNumber+ "\","
			+"\"CustomerName_c\":\"" +_transaction_customer_t_company_name+ "\","
			+"\"ContactName_c\":\"" +_transaction_customer_t_first_name+ "\","
			+"\"PaymentTerms_c\":\"" + replace(replace(paymentTerms_t_c,"\n", ""), "\t", "")+ "\","
			//+"\"SalesPerson_c\":\"" +lastUpdatedBy_t+ "\","
			//+"\"SHIP_To_c\":\"" +shipToAddress_t_c+ "\","
			+"\"PONo_c\":\"" +purchaseOrderNumber_t+ "\","
			+"\"TotalAmount_c\":\"" +string(totalAmt)+ "\","
			+"\"OpportunityNo_c\":\"" +opportunityNumber_t+ "\","
			+"\"QuoteVersion_c\":\"" +string(version_t)+ "\","
			+"\"CPQTransactionID_c\":\"" +bs_id+ "\""
			+"}";

		print "reqBody ---->"+reqBody;
		
		if (oECSOUN1RecID_t_c == "") {
			response = urldata(baseUrl, "POST", headers, reqBody);
			resCodePost = get(response, "Status-Code");
			print resCodePost;
		} else {
			print "patch url: "+baseUrl + oECSOUN1RecID_t_c;
			response = urldata(baseUrl + oECSOUN1RecID_t_c, "PATCH", headers, reqBody);
			reStatPatch = get(response, "Status-Code");
			print reStatPatch;
		}
		
		resBody = get(response, "Message-Body");
		//print resBody;

		if ((resCodePost <> "" and atoi(resCodePost) == 201) or find(reStatPatch, "OK") > 0) {
			//returnData = returnData + "1~updatedOpportunity~yes|";
			resObj = json(resBody);
			//print resObj;
			soRecId = string(jsonget(resObj, "Id", "integer"));
			print soRecId;
			print "Creation of OEC Sale order TMD Unit 1 header record:---Success with ID: "+soRecId;
			soRecNum = jsonget(resObj, "RecordNumber", "string");
			soRecName = jsonget(resObj, "RecordName", "string");
			returnData = returnData + _transaction_document_number  +"~oECSOUN1RecID_t_c~"+ soRecId +"|";
			
			indx = range(cnt);
			for i in indx {
			  docNum = models[i][0];
			  if (models[i][3] == "UN1") {
			    reqBodyLines = "{"
			  	+"\"SaleOrder_Id_c\":\"" +soRecId+ "\","
				+"\"HeaderID_c\":\"" +orderIdUN1_t_c+ "\","
				+"\"LineID_c\":\"" +models[i][5]+ "\","
				+"\"LineNo_c\":\"" +models[i][21]+ "\","
				+"\"InventoryItemID_c\":\"" +models[i][6]+ "\","
				+"\"ProductCode_c\":\"" +models[i][2]+ "\","
				+"\"ProductDescription_c\":\"" +models[i][7]+ "\","
				+"\"Status_c\":\"" +models[i][15]+ "\","
				+"\"Qty_c\":\"" +models[i][11]+ "\","
				+"\"UnitPrice_c\":\"" +models[i][12]+ "\","
				+"\"TotalAmount_c\":\"" +models[i][13]+ "\","
				+"\"CPQDocumentNo_c\":\"" +models[i][0]+ "\""
				+"}";

			    print "reqBodyLines ---->"+reqBodyLines;
			    urlRecLines = baseUrl + soRecId + "/child/OrderLineCollection_c/";
			    if (models[i][18] == "") {
				print "post url: "+urlRecLines;
				responseLine = urldata(urlRecLines, "POST", headers, reqBodyLines);
				resCodeLinePost = get(responseLine, "Status-Code");
				print resCodeLinePost;
			    } else {
				print "patch url: "+urlRecLines + models[i][18];
				responseLine = urldata(urlRecLines + models[i][18], "PATCH", headers, reqBodyLines);
				resStatLinePatch = get(responseLine, "Status-Code");
				print resStatLinePatch;
			    }
			    
			    resBodyLine = get(responseLine, "Message-Body");
			    //print resBodyLine;

			    if ((resCodeLinePost <> "" and atoi(resCodeLinePost) == 201) or find(resStatLinePatch, "OK") > 0) {
				resObjLine = json(resBodyLine);
				soLineRecId = string(jsonget(resObjLine, "Id", "integer"));
				print "Creation of OEC Sale order line record:---Success! with ID: "+soLineRecId;
				returnData = returnData + docNum +"~oECSORecLineId_tl_c~"+ soLineRecId +"|";
			    } else {
				print "Something went wrong!!!\n"+resBodyLine;
			    }
			  }
			  resCodeLinePost = "";
			  resStatLinePatch = "";
			}
		} else {
			resErr = get(response, "Error-Message");
			print resErr;
			//throwerror(resErr);
		}
	}

	// Sale Order records for UN2
	// if (saleOrderUN2Number_t_c <> "") 
	if (flagWhUn2 == true) {
		orderDateStr = "";
		if (orderDateUN2_t_c <> "") {
			strJavaDate = strtojavadate(orderDateUN2_t_c, "yyyy-MM-dd HH:mm:ss");
			orderDateStr = datetostr(strJavaDate, "yyyy-MM-dd", "GMT+5:30");
		} else {
			orderDateStr = "";
		}
		
		saleOrderNum = "";
		if (saleOrderUN2Number_t_c == "") {
			saleOrderNum = "0";
		} else {
			saleOrderNum = saleOrderUN2Number_t_c;
		}
		
		reqBody = "{"
			+"\"HeaderID_c\":\"" +orderIdUN2_t_c+ "\","
			+"\"Division_c\":\"" +division_t_c+ "\","
			+"\"Unit_c\":\"" +"UN2"+ "\","
			+"\"OrderNo_c\":\"" +saleOrderNum+ "\","
			+"\"OrderDate_c\":\"" +orderDateStr+ "\","
			+"\"OpportunityID_c\":\"" +opportunityID_t+ "\","
			+"\"Opportunity_Id_OptyId_SaleOrder\":\"" +opportunityID_t+ "\","
			+"\"OrderTypeID_c\":\"" +"1210"+ "\","
			+"\"Status_c\":\"" +orderUN2Status_t_c+ "\","
			+"\"CustomerCode_c\":\"" +customerNumber+ "\","
			+"\"CustomerName_c\":\"" +_transaction_customer_t_company_name+ "\","
			+"\"ContactName_c\":\"" +_transaction_customer_t_first_name+ "\","
			+"\"PaymentTerms_c\":\"" +replace(replace(paymentTerms_t_c,"\n", ""), "\t", "")+ "\","
			//+"\"SalesPerson_c\":\"" +lastUpdatedBy_t+ "\","
			//+"\"SHIP_To_c\":\"" +shipToAddress_t_c+ "\","
			+"\"PONo_c\":\"" +purchaseOrderNumber_t+ "\","
			+"\"TotalAmount_c\":\"" +string(totalAmt)+ "\","
			+"\"OpportunityNo_c\":\"" +opportunityNumber_t+ "\","
			+"\"QuoteVersion_c\":\"" +string(version_t)+ "\","
			+"\"CPQTransactionID_c\":\"" +bs_id+ "\""
			+"}";
		print "reqBody ---->"+reqBody;

		if (oECSOUN2RecID_t_c == "") {
			response = urldata(baseUrl, "POST", headers, reqBody);
			resCodePost = get(response, "Status-Code");
			print resCodePost;
		} else {
			print "patch url: "+baseUrl + oECSOUN2RecID_t_c;
			response = urldata(baseUrl + oECSOUN2RecID_t_c, "PATCH", headers, reqBody);
			reStatPatch = get(response, "Status-Code");
			print reStatPatch;
		}
		
		resBody = get(response, "Message-Body");
		//print resBody;

		if ((resCodePost <> "" and atoi(resCodePost) == 201) or find(reStatPatch, "OK") > 0) {
			//returnData = returnData + "1~updatedOpportunity~yes|";
			resObj = json(resBody);
			//print resObj;
			soRecId = string(jsonget(resObj, "Id", "integer"));
			print soRecId;
			print "Creation of OEC Sale order TMD Unit 2 header record:---Success with ID: "+soRecId;
			soRecNum = jsonget(resObj, "RecordNumber", "string");
			soRecName = jsonget(resObj, "RecordName", "string");
			returnData = returnData + _transaction_document_number +"~oECSOUN2RecID_t_c~"+ soRecId +"|";
			
			indx = range(cnt);
			for i in indx {
			  if (models[i][3] == "UN2") {
			    reqBodyLines = "{"
			  	+"\"SaleOrder_Id_c\":\"" +soRecId+ "\","
				+"\"HeaderID_c\":\"" +orderIdUN2_t_c+ "\","
				+"\"LineID_c\":\"" +models[i][5]+ "\","
				+"\"LineNo_c\":\"" +models[i][21]+ "\","
				+"\"InventoryItemID_c\":\"" +models[i][6]+ "\","
				+"\"ProductCode_c\":\"" +models[i][2]+ "\","
				+"\"ProductDescription_c\":\"" +models[i][7]+ "\","
				+"\"Status_c\":\"" +models[i][10]+ "\","
				+"\"Qty_c\":\"" +models[i][11]+ "\","
				+"\"UnitPrice_c\":\"" +models[i][12]+ "\","
				+"\"TotalAmount_c\":\"" +models[i][13]+ "\","
				+"\"CPQDocumentNo_c\":\"" +models[i][0]+ "\""
				+"}";

			    print "reqBodyLines ---->"+reqBodyLines;
			    urlRecLines = baseUrl + soRecId + "/child/OrderLineCollection_c/";
			    print "urlRecLines: "+urlRecLines;
			    
			    if (models[i][18] == "") {
				print "post url: "+urlRecLines;
				responseLine = urldata(urlRecLines, "POST", headers, reqBodyLines);
				resCodeLinePost = get(responseLine, "Status-Code");
				print resCodeLinePost;
			    } else {
				print "patch url: "+urlRecLines + models[i][18];
				responseLine = urldata(urlRecLines + models[i][18], "PATCH", headers, reqBodyLines);
				resStatLinePatch = get(responseLine, "Status-Code");
				print resStatLinePatch;
			    }

			    resBodyLine = get(responseLine, "Message-Body");
			    //print resBodyLine;

			    if ((resCodeLinePost <> "" and atoi(resCodeLinePost) == 201) or find(resStatLinePatch, "OK") > 0) {
				resObjLine = json(resBodyLine);
				soLineRecId = string(jsonget(resObjLine, "Id", "integer"));
				print "Creation of OEC Sale order line record:---Success! with ID: "+soLineRecId;
				returnData = returnData + models[i][0] +"~oECSORecLineId_tl_c~"+ soLineRecId +"|";
			    } else {
				print "Something went wrong!!!\n"+resBodyLine;
			    }
			  }
			}
		} else {
			resErr = get(response, "Error-Message");
			print "Something went wrong----> "+resErr;
			//throwerror(resErr);
		}
	}
}

return returnData;
