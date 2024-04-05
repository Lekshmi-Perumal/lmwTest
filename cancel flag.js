result = recordset();
insert = recordset();
Bsid = "";
Payload2 = "";
outFile = "";
Doc_Id = "";
Part_No ="";
Line_Id ="";
Status = "";
Part = "";
Value = "Y";
count = 0;
payloadPartStr = "";
soapResponse = "";
models = string[][];
Totalplayload = "";
payloadModelStr = "";
sonum = "";
prtno="";



// Reference
HeaderFileLocation = "";
operationNew = "OrderSoap";
HeaderFileLocation = commerce.getTemplateLocation("OIC","SaleOrder");
retSaleOrderRes = "";
payload = dict("string");

// Get User Info from data table and replace it in Template file 
resultSet = bmql("Select Username, Password from INT_SYSTEM_DETAILS where System ='OIC'");

// loop through the records to get username and get password.
for record in resultSet {
  userName = get(record,"Username");
  password = get(record,"Password");
  put(payload,"USERNAME", userName);
  put(payload,"PASSWORD", password); 
}

operation = "UPDATE";
defaultErrorMessage = ""; 
outFileOrig = applytemplate(HeaderFileLocation, payload, defaultErrorMessage);
outFile = outFileOrig;

 // line
lineFileLocation = commerce.getTemplateLocation("OIC", "lineTemplate");
payloadline = dict("string");
operation = "UPDATE";
defaultErrorMessage = ""; 
lineRequest = applytemplate(lineFileLocation,payloadline,defaultErrorMessage);

result = bmql("SELECT bs_id,comparable_payload,status,PartNumber FROM ordertest" );

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
    outFile = replace(outFile, "$oRCL_ERP_OrderID_t$",sonum);
    outFile = replace(outFile, "$orderTypeId$", "");
    outFile = replace(outFile, "$ebsCustomerId_t_c$", ebsCustomerId_t_c);
    outFile = replace(outFile, "$cancelledFlag_t_c$", "");
    outFile = replace(outFile, "$bookedFlag_t_c$", "");
    outFile = replace(outFile, "$ebsBillToId_t_c$", "");
    outFile = replace(outFile, "$ebsShipToId_t_c$", "");
    outFile = replace(outFile, "$orderCategoryCode_t_c$","");
    outFile = replace(outFile, "$orderSourceId_t_c$", "");
    outFile = replace(outFile, "$eBSRequestID_t_c$", "");
    outFile = replace(outFile, "$priceListId$", "");
    outFile = replace(outFile, "$salesPersonId$", "");
    outFile = replace(outFile, "$salesPerson_t_c$", "");
    outFile = replace(outFile, "$operation$", operation);
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
    outFile = replace(outFile, "$deliveryTerms_t_c$", "");
    outFile = replace(outFile, "$machineType_t_c$", "");
    outFile = replace(outFile, "$whyLMWMachine_t_c$", "");
    outFile = replace(outFile, "$freightTransportation_t_c$", "");
    outFile = replace(outFile, "$modeOfPayment_t_c$", "");
    outFile = replace(outFile, "$industry_c$", industry_c);
    outFile = replace(outFile, "$context_t_c$", context_t_c);
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

//Sending 3 records for testing	
/*
var_1 = "55171C0100";
var_2 = "55171C7600";
var_3 = "55211C0100";
*/


//result = bmql("SELECT bs_id , comparable_payload,status,PartNumber FROM ordertest WHERE PartNumber LIKE $var_1 OR PartNumber LIKE $var_2 OR PartNumber LIKE $var_3" );
result = bmql("SELECT bs_id , comparable_payload,status,PartNumber FROM ordertest" );
//print result;
for record in result {

    Bsid = get(record ,"bs_id");
    Payload2 = get(record ,"comparable_payload");
    Status = get(record ,"status");
    Part = get(record ,"PartNumber ");
  
    res = split(Payload2,",");
    Doc_Id = res[1];
    Seq_No = res[2];
    Part_No = res[3];
    Line_Id = res[4];
    
    payloadPartStr = "";       

        payloadPartStr = payloadPartStr + lineRequest; 
        payloadPartStr = replace(payloadPartStr,"$cancelledFlag_tl_c$","Y");
        payloadPartStr = replace(payloadPartStr,"$documentNumEbs_tl_c$",Doc_Id);
        payloadPartStr = replace(payloadPartStr,"$_line_bom_part_number$",Part_No);
        payloadPartStr = replace(payloadPartStr,"$oRCL_ERP_LineID_l$",Line_Id);
        payloadPartStr = replace(payloadPartStr,"$bookedFlag_tl_c$","N");
        payloadPartStr = replace(payloadPartStr,"$operation$","UPDATE");
        payloadPartStr = replace(payloadPartStr,"$flowStatusCode_tl_c$","CANCELLED");
        payloadPartStr = replace(payloadPartStr,"$orderChangeReason_l_c$","AMENDMENT");
        payloadPartStr = replace(payloadPartStr,"$requestedQuantity_l$","1");
        payloadPartStr = replace(payloadPartStr,"$cancelledQuantity$","1");
        payloadPartStr = replace(payloadPartStr,"$componentCode$","");
        payloadPartStr = replace(payloadPartStr,"$itemId_tl_c$","");
        payloadPartStr = replace(payloadPartStr,"$item_type$","");
        payloadPartStr = replace(payloadPartStr,"$requestedUnitOfMeasure_l$","");
        payloadPartStr = replace(payloadPartStr,"$top_model_line$","");
        payloadPartStr = replace(payloadPartStr,"$orderSourceId_tl_c$","");
        payloadPartStr = replace(payloadPartStr,"$totalPrice_tl_c$","");
        payloadPartStr = replace(payloadPartStr,"$calculatePriceFlag_tl_c$","");
        payloadPartStr = replace(payloadPartStr,"$eBSRequestID_tl_c$","");
        payloadPartStr = replace(payloadPartStr,"$oECSORecLineId_tl_c$","");
          
        
       
       print payloadPartStr;
        Totalplayload = Totalplayload + payloadPartStr; 
        
      
          }
         
          select = bmql("SELECT PartNumber from ordertest where PartNumber=$Part");
          for record in result {
          prtno= get(record ,"PartNumber");
          update2 = bmql("UPDATE ordertest SET status = 'Y' WHERE PartNumber= $prtno  ");
         // print update2;
     
          }
         
        outFile = replace(outFile, "$partLineInfo$", Totalplayload);
        outFile = replace(outFile, "$modelLineInfo$", "");
        

     	soapResponse = commerce.invokeWebService("OIC",outFile);
        

return "";