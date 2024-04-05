actVer= true;

 print isReconfigured_t_c;
if (isReconfigured_t_c <> false){
print "line 5";
 setattributevalue(1 ,"activeVersionFlag_c", true);
 print activeVersionFlag_c;
     }
     
     
     
     return string(actVer) ;