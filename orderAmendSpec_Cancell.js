results ="";
partnumber ="";
result ="";
resu = recordset();
insert = recordset();
update = recordset();
query = recordset();
Bsid ="";
updateStr ="";
updatepart ="";
Bsid2 ="";

if (division_t_c=="MTD"){
	if (param1=="Reconfig"){
		if(_system_selected_document_number <> ""){
			query = bmql("SELECT bs_id FROM ordertest");

for records in query {
	Bsid = get(records ,"bs_id");  
         }
	 	
for line in transactionLine{
	if (line.saleOrderId_tl_c <> "" and line.saleOrderNum_tl_c <> ""){
		arrItemNum = string[];
        	countItem = 0;
        
grpSeqNum = line._group_sequence_number;
for line1 in transactionLine{
	curGrpNum = line1._group_sequence_number;
        
if( line1._part_number <> "" and startswith(curGrpNum, grpSeqNum) and line1.oRCL_ERP_LineID_l <> "" and line1._part_number <> ""){
	arrItemNum[countItem] = line1.oRCL_ERP_LineID_l;
	countItem = countItem + 1;
	print countItem;
 }
              
value = replace(getarrayattrstring(arrItemNum),"$,$",",");

if (value <> ""){
    if (line1.oRCL_ERP_LineID_l<>""){
    	retdata = results + "," + line._document_number + "," + grpSeqNum + ","+ line1._part_number+ "," + line1.oRCL_ERP_LineID_l+ ","  + value;
     	Bsid2= bs_id;
        result = retdata;
        partnumber = line1._part_number;
        line_id_ebs_c= retdata;
         
	res=split(retdata,",");
	Doc_Id= res[1]; 
	Seq_No= res[2];
	Part_No= res[3];
	Line_Id= res[4]; 
  
	res2 = split(result,",");
	Doc_Id1= res[1]; 
	Seq_No1= res[2];
	Part_No1= res[3];
	Line_Id1= res[4]; 
      
if(Bsid == "" ){ 
	insert= bmql("INSERT INTO ordertest (bs_id, comparable_payload,PartNumber) VALUES ($Bsid2, $result, $Part_No)"); 
        print insert;                      
     }
    }
   }
  }
 }
}

//ELSE PART	

query = bmql("SELECT bs_id FROM ordertest");
for records in query {
	Bsid = get(records ,"bs_id"); 
}
         
if(Bsid <> "" ){
	delete = bmql("DELETE FROM ordertest");
	print delete; 
	
for line in transactionLine{
    if (line.saleOrderId_tl_c <> "" and line.saleOrderNum_tl_c <> ""){
        arrItemNum = string[];
        countItem = 0;
        grpSeqNum = line._group_sequence_number;
    for line1 in transactionLine{
        curGrpNum = line1._group_sequence_number;
    if( line1._part_number <> "" and startswith(curGrpNum, grpSeqNum) and line1.oRCL_ERP_LineID_l <> "" and line1._part_number <> ""){
	arrItemNum[countItem] = line1.oRCL_ERP_LineID_l;
	countItem = countItem + 1;
	print countItem;
}
              
value = replace(getarrayattrstring(arrItemNum),"$,$",",");
    if (value <> ""){
       if (line1.oRCL_ERP_LineID_l<>""){
           retdata = results + "," + line._document_number + "," + grpSeqNum + ","+ line1._part_number+ "," + line1.oRCL_ERP_LineID_l+ ","  + value;
           Bsid2= bs_id;
           result = retdata;
           partnumber = line1._part_number;
           line_id_ebs_c= retdata;
                                                         
           res=split(retdata,",");
           Doc_Id= res[1]; 
           Seq_No= res[2];
           Part_No= res[3];
           Line_Id= res[4]; 
 
           res2 = split(result,",");
           Doc_Id1= res[1]; 
           Seq_No1= res[2];
           Part_No1= res[3];
           Line_Id1= res[4];
	
	   insert= bmql("INSERT INTO ordertest (bs_id, comparable_payload,PartNumber) VALUES ($Bsid2, $result, $Part_No)");
	   print insert; 

	 }
	}
       }
      }
     }
    }
   }
  }
 }
         
return"";