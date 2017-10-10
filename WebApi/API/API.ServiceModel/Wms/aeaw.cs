﻿using System;
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
    [Route("/wms/LOCATION_K/LOC_CODE", "Get")]
    public class aeaw : IReturn<CommonResponse>
    {
        public string MAwbNo { get; set; }
        public string MasterJobNo { get; set; }
        public string FromAeawFlag  { get; set; }
        public string PID_NO { get; set; }
        public string UpdateAllString { get; set; }
        public string LOC_CODE { get; set; }



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
                        string strSQL = "Select  top 50 MAwbNo, MasterJobNo  From Aeaw1 Where StatusCode = 'USE' And MAwbNo LIKE '" + request.MAwbNo + "%'  Order By MAwbNo Asc";
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

        public List<Pid_AEMT1> Get_PID_List(aeaw request)
        {
            List<Pid_AEMT1> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {
                   
                    if (request.FromAeawFlag == "Y") {
                        if (!string.IsNullOrEmpty(request.MasterJobNo))
                        {
                            string strLoc_Code = request.LOC_CODE;
                            string strLoc = "";
                            string strForLoc = "";
                            string strWhereLoc = "";
                            if (strLoc_Code.Length > 0)
                            {
                                strLoc = strLoc_Code.Substring(1,strLoc_Code.Length-1);                             
                                string[] arrLoc = strLoc.Split(',');
                                for (int i=0;i<arrLoc.Length;i++)
                                {
                                    strForLoc = strForLoc+ "Or Loc_Code ='" + arrLoc[i] + "'";
                                  
                                }
                                if (strForLoc.Length > 0)
                                {
                                    strWhereLoc = "And (" + strForLoc.Substring(2, strForLoc.Length-2) + ")";
                                }
                            }

                            string strSQL = "";
                            strSQL = "select " +
                                "  PID_NO  ," +
                                " (Select ISNULL(LOC_CODE,'') From ONHAND_D Where ONHAND_D.Onhand_No = OH_PID_D.Onhand_No ) as LOC_CODE " +
                                " From OH_PID_D " +
                                " Where " +
                                "  PID_NO is  not null And  PID_NO !='' " +
                                " and onhand_no  in (select ONHAND_NO from  ONHAND_D where  MasterJobNo = '" + request.MasterJobNo + "' " + strWhereLoc + " ) ";
                            Result = db.Select<Pid_AEMT1>(strSQL);
                            Insert_Aemt1(Result);
                        }
                    }
                 
                }
            }
            catch { throw; }
            return Result;
        }

        public string Insert_Aemt1(object objAemt1) {
            //for (int i = 0; i < objAemt1.ToString().Length; i++) {
            //    string PID_NO = objAemt1.;
            //}
           return "1";
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
                        Result = null;
                    }

                }
            }
            catch { throw; }
            return Result;
        }


    }
}
