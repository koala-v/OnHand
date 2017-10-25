using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using ServiceStack;
using ServiceStack.ServiceHost;
using ServiceStack.OrmLite;
using WebApi.ServiceModel.Tables;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace WebApi.ServiceModel.Wms
{
    [Route("/wms/awaw1/MAwbNo", "Get")]
    [Route("/wms/awaw1/MasterJobNo", "Get")]
    [Route("/wms/awaw1/Pid", "Get")]
    [Route("/wms/Aemt1/Insert", "Post")]
    [Route("/wms/Aemt1/Update", "Get")]
    [Route("/wms/LOCATION_K/LOC_CODE", "Get")]
    [Route("/wms/Aemt1/select", "Get")]
    public class aeaw : IReturn<CommonResponse>
    {
        public string MAwbNo { get; set; }
        public string MasterJobNo { get; set; }
        public string FromAeawFlag  { get; set; }
        public string PID_NO { get; set; }
        public string UpdateAllString { get; set; }
        public string LOC_CODE { get; set; }
        public string KeyMAwbNo { get; set; }
        public string strTallyById { get; set; }
        public string matchFlag { get; set; }
    }
    public class Aeaw_Logic
    {
        public IDbConnectionFactory DbConnectionFactory { get; set; }
        public List<Aeaw1> Get_Aeaw1_List(aeaw request)
        {
            List<Aeaw1> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {
                    if (!string.IsNullOrEmpty(request.MAwbNo))
                    {
                        string strSQL = "Select  DISTINCT MAwbNo, MasterJobNo  From Aeaw1 Where StatusCode = 'USE' And MAwbNo LIKE '" + request.MAwbNo + "%'  Order By MAwbNo Asc";
                        Result = db.Select<Aeaw1>(strSQL);
                    }
                    else
                    {
                        Result = null;
                    }

                }
            }
            catch { throw; }
            return Result;
        }

        public List<Aeaw1> Get_Aeaw1MasterJoNo_List(aeaw request)
        {
            List<Aeaw1> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {
                    if (!string.IsNullOrEmpty(request.MAwbNo))
                    {
                        string strSQL = "Select  MAwbNo,MasterJobNo  From Aeaw1 Where  MAwbNo = '" + request.MAwbNo + "' ";
                        Result = db.Select<Aeaw1>(strSQL);
                    }
                    else
                    {
                        Result = null;
                    }

                }
            }
            catch { throw; }
            return Result;
        }

        public List<Pid_AEMT1> SelectAemt1(aeaw request)
        {
            List<Pid_AEMT1> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {

                    string strMAwbNo = request.MAwbNo;
                    if (!string.IsNullOrEmpty(strMAwbNo))
                        {




                           string strSQL = "";
                        strSQL = "select distinct" +
                            "  PID_NO ," +
                            "  KeyMAwbNo ," +
                            "  MAwbNo , " +
                            "  LOC_CODE " +
                            "  From Aemt1  " +
                            "  Where  MAwbNo = '" + strMAwbNo + "' ";
                        Result = db.Select<Pid_AEMT1>(strSQL);




                        //    strSQL = "Select LOC_CODE,MAwbNo,PID_NO From Aemt1 Where KeyMAwbNo in (select KeyMAwbNo From Aemt1 Where MAwbNo='"+ strMAwbNo + "' )";

                        //Result = db.Select<Pid_AEMT1>(strSQL);




                    }               
                }
            }
            catch { throw; }
            return Result;
        }
        public List<Pid_AEMT1> Get_PID_List(aeaw request)
        {
            List<Pid_AEMT1> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {

                    if (request.FromAeawFlag == "Y")
                    {
                        if (!string.IsNullOrEmpty(request.MasterJobNo))
                        {
                            string strLoc_Code = request.LOC_CODE;
                            string strLoc = "";
                            string strForLoc = "";
                            string strWhereLoc = "";
                            if (strLoc_Code.Length > 0)
                            {
                                strLoc = strLoc_Code.Substring(1, strLoc_Code.Length - 1);
                                string[] arrLoc = strLoc.Split(',');
                                for (int i = 0; i < arrLoc.Length; i++)
                                {
                                    strForLoc = strForLoc + "Or Loc_Code ='" + arrLoc[i] + "'";

                                }
                                if (strForLoc.Length > 0)
                                {
                                    strWhereLoc = "And (" + strForLoc.Substring(2, strForLoc.Length - 2) + ")";
                                }
                            }

                            string strSQL = "";
                            strSQL = "select " +
                                "  PID_NO  ," +
                                "  (Select top 1 MAwbNo From Aeaw1 Where MasterJobNo='" + request.MasterJobNo + "' )  AS  MAwbNo ," +
                                "  (Select ISNULL(LOC_CODE,'') From ONHAND_D Where ONHAND_D.Onhand_No = OH_PID_D.Onhand_No ) as LOC_CODE " +
                                "  From OH_PID_D " +
                                "  Where " +
                                "  PID_NO is  not null And  PID_NO !='' " +
                                "  and onhand_no  in (select ONHAND_NO from  ONHAND_D where  MasterJobNo = '" + request.MasterJobNo + "' " + strWhereLoc + " ) ";
                            Result = db.Select<Pid_AEMT1>(strSQL);
                            if (Result.Count > 0) { 
                            Insert_Aemt1(Result);
                            Result = getAemt1(request.MasterJobNo, "Y", request.MAwbNo);
                            }

                        }
                    }
                    else if (request.FromAeawFlag == "N")
                    {
                        Result = getAemt1(request.MasterJobNo, "N", request.MAwbNo);
                    }
                    else if(request.FromAeawFlag == "K")
                    {
                        Result = getAemt1(request.MasterJobNo, "K", request.MAwbNo);
                    }

                }
            }
            catch { throw; }
            return Result;
        }


        public List<Pid_AEMT1> getAemt1(string MasterJoNo,string Flag,string MAwbNo)
        {
            List<Pid_AEMT1> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {
                    string strWhere = "";
                    if (Flag == "N")
                    {
                        strWhere = " And MatchFlag ='Y'";
                    }
                    else 
                    {
                        strWhere = " And (MatchFlag ='' Or MatchFlag is null Or MatchFlag ='N')";
                    }
                    string strSQL = "";
                    string strMAwbNo = MAwbNo + "_";
                    strSQL = " Select " +
                               " MAwbNo ," +
                               " PID_NO ," +
                               " KeyMAwbNo ," +
                               " LOC_CODE " +
                               " From  AEMT1 " +
                               " Where   KeyMAwbNo =  '"+ strMAwbNo + "'+cast((select max(cast(right(KeyMawbNo,len(KeyMawbNo) -len('"+ strMAwbNo + "')) AS int)) from aemt1 where left(KeyMawbNo,len('" + strMAwbNo + "'))='" + strMAwbNo + "')as varchar ) " + strWhere;

                               //" Where KeyMAwbNo in (  Select MAX(KeyMAwbNo) From Aemt1 Where MAwbNo in(Select top 1 MAwbNo From Aeaw1 Where MasterJobNo='" + MasterJoNo + "')) "  + strWhere;
                         Result = db.Select<Pid_AEMT1>(strSQL);

                }
            }
            catch { throw; }
            return Result;

          

        }
        public string Insert_Aemt1(List<Pid_AEMT1> objAemt1)
        {
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {
                   
                    string KeyMAwbNo = setKeyMAwbNo(Modfunction.CheckNull(objAemt1[0].MAwbNo));
                    for (int i = 0; i < objAemt1.Count; i++)
                    {

                        string strSql = "";
                        string TallyById = "";
                        string MAwbNo = Modfunction.CheckNull(objAemt1[i].MAwbNo);
                        string PID_NO = Modfunction.CheckNull(objAemt1[i].PID_NO);
                        string LOC_CODE = Modfunction.CheckNull(objAemt1[i].LOC_CODE);
                        strSql = "insert into Aemt1( " +
                                  "  KeyMAwbNo ,"+
                                  "  MAwbNo," +
                                  "  PID_NO, " +
                                  "  LOC_CODE, " +
                                  "  TallyById," +
                                  "  TallyByDateTime" +
                                  "  )" +
                                      "values( " +
                                      Modfunction.SQLSafeValue(KeyMAwbNo) + ", " +
                                      Modfunction.SQLSafeValue(MAwbNo) + " , " +
                                      Modfunction.SQLSafeValue(PID_NO) + " , " +
                                      Modfunction.SQLSafeValue(LOC_CODE) + " , " +
                                      Modfunction.SQLSafeValue(TallyById) + "," +
                                      " GetDate()" +
                                      ") ";
                        db.ExecuteSql(strSql);

                    };

                }
            }
            catch { throw; }
            return "";
        }

        private string setKeyMAwbNo(string MAwbNo)
        {
            string returnMawbNo = "";
            List<Pid_AEMT1> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {

                    int[] arrayMawbNo = { };
                    int MaxMawbNo = 0;
                    List<int> b = arrayMawbNo.ToList();
                    string strSql = "Select ISNULL(KeyMAwbNo,'') as  KeyMAwbNo From Aemt1 Where MAwbNo ='" + MAwbNo + "' ";
                    Result = db.Select<Pid_AEMT1>(strSql);
                    if (Result.Count > 0)
                    {
                        for (int i = 0; i < Result.Count; i++)
                        {
                            int intMAwbNo = Result[i].MAwbNo.LastIndexOf("_", Result[i].MAwbNo.Length);
                            int length = Result[i].MAwbNo.Length;
                            if (intMAwbNo > 0)
                            {
                                int intForMAwbNo = Convert.ToInt32(Result[i].MAwbNo.Substring(intMAwbNo+1));
                                b.Add(intForMAwbNo);
                                arrayMawbNo = b.ToArray();
                            }
                          
                        }

                        MaxMawbNo = arrayMawbNo.Max();

                    }
                     MaxMawbNo = MaxMawbNo + 1;
                     returnMawbNo = MAwbNo + "_"+ MaxMawbNo;                                
                }

 }
            catch { throw; }
            return returnMawbNo;
       
    }

        public int Update_Aemt1(aeaw request)
        {
            int Result = -1;

            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {
                    if (request.KeyMAwbNo != null && request.KeyMAwbNo != "" && request.PID_NO !=null && request.PID_NO !="" )
                    {
                        string strSQL = "";
                        strSQL = "Update Aemt1 set MatchFlag='Y' ,TallyByDateTime =getdate(),TallyById='"+request.strTallyById + "' Where KeyMAwbNo ='" + request.KeyMAwbNo+"' And PID_NO ='"+request.PID_NO+"' ";
                        db.ExecuteSql(strSQL);
                    }
                }

            }
            catch { throw; }
            return Result;
        }

        //public int Insert_Aemt1(aeaw request)
        //{

        //    int Result = -1;

        //    try
        //    {
        //        using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
        //        {
        //            if (request.UpdateAllString != null && request.UpdateAllString != "")
        //            {
        //                JArray ja = (JArray)JsonConvert.DeserializeObject(request.UpdateAllString);
        //                if (ja != null)
        //                {

        //                    for (int i = 0; i < ja.Count(); i++)
        //                    {
        //                        string strSql = "";                            
        //                        string MAwbNo = ja[i]["MAwbNo"].ToString();                    
        //                        if (MAwbNo != "")
        //                        {                                                                 
        //                            string PID_NO = Modfunction.CheckNull(ja[i]["PID_NO"]);
        //                            string TallyById = Modfunction.CheckNull(ja[i]["UserID"]);
        //                            strSql = "insert into Aemt1( " +
        //                                      "  MAwbNo," +
        //                                      "  PID_NO, " +
        //                                      "  TallyById," +
        //                                      "  TallyByDateTime" +                                           
        //                                      "  )" +
        //                                          "values( " +
        //                                          Modfunction.SQLSafeValue(MAwbNo) + " , " +
        //                                          Modfunction.SQLSafeValue(PID_NO) + " , " +                                          
        //                                          Modfunction.SQLSafeValue(TallyById) + "," +
        //                                          " GetDate()"+
        //                                          ") ";
        //                            db.ExecuteSql(strSql);

        //                        }

        //                    }
        //                }
        //                Result = 1;
        //            }
        //        }

        //    }
        //    catch { throw; }
        //    return Result;

        //}

        public List<LOCATION_K> Get_LOC_CODE_List(aeaw request)
        {
            List<LOCATION_K> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {
                    if (!string.IsNullOrEmpty(request.LOC_CODE))
                    {
                        string strSQL = "Select ISNULL(LocCode,'') AS  LOC_CODE  From LOCATION_K Where LocCode LIKE '" + request.LOC_CODE + "%'  Order By LocCode Asc";
                        Result = db.Select<LOCATION_K>(strSQL);
                    }
                    else
                    {

                        string strSQL = "Select ISNULL(LocCode,'') AS  LOC_CODE  From LOCATION_K";
                        Result = db.Select<LOCATION_K>(strSQL);
                    }

                }
            }
            catch { throw; }
            return Result;
        }


    }
}
