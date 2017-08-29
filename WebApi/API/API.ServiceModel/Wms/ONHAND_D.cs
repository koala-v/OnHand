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
    [Route("/wms/ONHAND_D", "Get")]   //ONHAND_D?CustomerCode ,ONHAND_D?TrxNo
    [Route("/wms/ONHAND_D", "Get")]     //ONHAND_D?TrxNo
    [Route("/wms/OH_PID_D", "Get")]     //OH_PID_D?OnhandNO
    [Route("/wms/OH_PID_D/create", "Get")]     //OH_PID_D?OnhandNO
    [Route("/wms/OH_PID_D/DeleteLineItem", "Get")]     //OH_PID_D?OnhandNO,
    [Route("/wms/ONHAND_D/confirm", "Post")]
    [Route("/wms/OH_PID_D/updateLineItem", "Post")]
    public class ONHAND_D : IReturn<CommonResponse>
    {
        public string strONHAND_NO { get; set; }
        public string CustomerCode { get; set; }
        public string TrxNo { get; set; }
        public string UpdateAllString { get; set; }
        public string NextNo { get; set; }
        public string LineItemNo { get; set; }
    }
    public class imcc_loigc
    {
        public IDbConnectionFactory DbConnectionFactory { get; set; }
        public List<ONHAND_D_Table> Get_ONHAND_D_List(ONHAND_D request)
        {
            List<ONHAND_D_Table> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {

                    if (!string.IsNullOrEmpty(request.strONHAND_NO))
                    {

                        string strSQL = "";
                            strSQL=" select  "  +
                            " ISNULL(SHP_CODE, '') AS SHP_CODE, " +
                            " ISNULL((select BusinessPartyName from rcbp1 where BusinessPartyCode = SHP_CODE ),'')  AS  'ShipperName', " +
                            " ISNULL(CNG_CODE,'') AS CNG_CODE, " +
                            " ISNULL( (select  BusinessPartyName from rcbp1 where BusinessPartyCode = CNG_CODE),'' ) AS  'ConsigneeName', " +
                            " ONHAND_date, " +
                            " ISNULL(CASE_NO,'') AS CASE_NO, " +
                            " ISNULL( PUB_YN,'') AS PUB_YN, " +
                            " ISNULL(HAZARDOUS_YN,'') AS HAZARDOUS_YN , " +
                            " ISNULL(CLSF_YN,'') AS CLSF_YN, " +
                            " ISNULL(ExerciseFlag,'') AS ExerciseFlag , " +
                            " ISNULL(LOC_CODE,'') AS LOC_CODE, " +
                            " ISNULL(TRK_CODE,'') AS TRK_CODE, " +
                            " ISNULL(TRK_CHRG_TYPE,'') AS TRK_CHRG_TYPE, " +
                            " PICKUP_SUP_datetime, " +
                            " ISNULL(NO_INV_WH,0) AS  NO_INV_WH, " +
                            " ISNULL((select  sum(PIECES) from OH_PID_D where onhand_no = ONHAND_D.onhand_no ), 0) AS TotalPCS,   " +
                            " ISNULL((select  sum(GROSS_LB) from OH_PID_D where onhand_no = ONHAND_D.onhand_no ),0 ) AS TotalWeight    " +
                            " from ONHAND_D  where onhand_no ='" + request.strONHAND_NO + "'";
                        Result = db.Select<ONHAND_D_Table>(strSQL);
                 
                    }
                }
                              
            }
            catch { throw; }
            return Result;
        }


        public List<ON_PID_D> Get_OH_PID_D_List(ONHAND_D request)
        {
            List<ON_PID_D> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {

                    if (!string.IsNullOrEmpty(request.strONHAND_NO))
                    {

                        string strSQL = "";
                        strSQL = " select  " +
                        " RowNum = ROW_NUMBER() OVER(ORDER BY OH_PID_D.LineItemNo ASC) , " +
                        " OH_PID_D.ONHAND_NO  , " +
                        " OH_PID_D.LineItemNo , " +
                        " ISNULL(OH_PID_D.PACK_TYPE,'') AS PACK_TYPE, " +
                        " ISNULL(OH_PID_D.TRK_BILL_NO,'') AS TRK_BILL_NO , " +
                        " ISNULL(OH_PID_D.PID_NO,'') AS PID_NO , " +
                        " ISNULL(OH_PID_D.UnNo,'') AS UnNo , " +
                        " OH_PID_D.LENGTH, " +
                        " OH_PID_D.WIDTH, " +
                        " OH_PID_D.HEIGHT, " +
                        " OH_PID_D.GROSS_LB, " +
                        " ISNULL(ONHAND_D.SHP_CODE, '') AS SHP_CODE, " +
                        " ISNULL((select BusinessPartyName from rcbp1 where BusinessPartyCode = ONHAND_D.SHP_CODE ),'')  AS  'ShipperName', " +
                        " ISNULL(ONHAND_D.CNG_CODE,'') AS CNG_CODE, " +
                        " ISNULL( (select  BusinessPartyName from rcbp1 where BusinessPartyCode = ONHAND_D.CNG_CODE),'' ) AS  'ConsigneeName', " +
                        " ONHAND_D.ONHAND_date, " +
                        " ISNULL(ONHAND_D.CASE_NO,'') AS CASE_NO, " +
                        " ISNULL( ONHAND_D.PUB_YN,'') AS PUB_YN, " +
                        " ISNULL(ONHAND_D.HAZARDOUS_YN,'') AS HAZARDOUS_YN , " +
                        " ISNULL(ONHAND_D.CLSF_YN,'') AS CLSF_YN, " +
                        " ISNULL(ONHAND_D.ExerciseFlag,'') AS ExerciseFlag , " +
                        " ISNULL(ONHAND_D.LOC_CODE,'') AS LOC_CODE, " +
                        " ISNULL(ONHAND_D.TRK_CODE,'') AS TRK_CODE, " +
                        " ISNULL(ONHAND_D.TRK_CHRG_TYPE,'') AS TRK_CHRG_TYPE, " +
                        " ONHAND_D.PICKUP_SUP_datetime, " +
                        " ISNULL(ONHAND_D.NO_INV_WH,0) AS  NO_INV_WH, " +
                        " ISNULL((select  sum(PIECES) from OH_PID_D  ), 0) AS TotalPCS,   " +
                        " ISNULL((select  sum(GROSS_LB) from OH_PID_D  ),0 ) AS TotalWeight    " +
                        " from OH_PID_D left join ONHAND_D on ONHAND_D.onhand_no=OH_PID_D.onhand_no  where OH_PID_D.onhand_no='" + request.strONHAND_NO + "'";
                        //   " from OH_PID_D left join ONHAND_D on ONHAND_D.onhand_no=OH_PID_D.onhand_no  where OH_PID_D.onhand_no='ONHAND06'";
                        Result = db.Select<ON_PID_D>(strSQL);

                    }
                }

            }
            catch { throw; }
            return Result;
        }


        public int UpdateLineItem(ONHAND_D request) {

            int  Result =-1;
         
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection())
                {
                    if (request.UpdateAllString != null && request.UpdateAllString != "")
                    {
                        JArray ja = (JArray)JsonConvert.DeserializeObject(request.UpdateAllString);
                        if (ja != null)
                        {

                            for (int i = 0; i < ja.Count(); i++)
                            {

                                string strSql = "";
                                int LENGTH = 0;
                                int WIDTH = 0;
                                int HEIGHT = 0;
                                int GROSS_LB = 0;
                                int lineItemNo = int.Parse(ja[i]["LineItemNo"].ToString());
                                if (lineItemNo > 0)
                                {
                                    string OnhandNo= ja[i]["ONHAND_NO"].ToString();
                                    string PACK_TYPE = ja[i]["PACK_TYPE"].ToString();
                                    string TRK_BILL_NO = ja[i]["TRK_BILL_NO"].ToString();
                                    string PID_NO = ja[i]["PID_NO"].ToString();
                                    string UnNo = ja[i]["UnNo"].ToString();
                                    LENGTH = Modfunction.ReturnZero(ja[i]["LENGTH"].ToString());
                                    WIDTH = Modfunction.ReturnZero(ja[i]["WIDTH"].ToString());
                                    HEIGHT = Modfunction.ReturnZero(ja[i]["HEIGHT"].ToString());
                                    GROSS_LB = Modfunction.ReturnZero(ja[i]["GROSS_LB"].ToString());

                                    //if (ja[i]["LENGTH"].ToString() == "")
                                    //{
                                    //    LENGTH = 0;
                                    //}
                                    //else
                                    //{
                                    //    LENGTH = int.Parse(Modfunction.CheckNull(ja[i]["LENGTH"].ToString()));
                                    //}
                                    //if (ja[i]["WIDTH"].ToString() == "")
                                    //{
                                    //    WIDTH = 0;
                                    //}
                                    //else
                                    //{
                                    //    WIDTH = int.Parse(ja[i]["WIDTH"].ToString());
                                    //}
                                    //if (ja[i]["HEIGHT"].ToString() == "")
                                    //{
                                    //    HEIGHT = 0;
                                    //}
                                    //else
                                    //{
                                    //    HEIGHT = int.Parse(ja[i]["HEIGHT"].ToString());
                                    //}
                                    //if (ja[i]["GROSS_LB"].ToString() == "")
                                    //{
                                    //    GROSS_LB = 0;
                                    //}
                                    //else
                                    //{
                                    //    GROSS_LB = int.Parse(ja[i]["GROSS_LB"].ToString());
                                    //}                                                           
                                    strSql = " UPDATE OH_PID_D Set " +
                                              "PACK_TYPE='"+ PACK_TYPE + "'," +
                                              "TRK_BILL_NO='" + TRK_BILL_NO + "'," +
                                              "PID_NO='" + PID_NO + "'," +
                                              "UnNo='" + UnNo + "'," +
                                              "LENGTH=" + LENGTH + "," +
                                              "WIDTH=" + WIDTH + "," +
                                              "HEIGHT=" + HEIGHT + "," +
                                              "GROSS_LB=" + GROSS_LB + ""+
                                              " WHERE ONHAND_NO ='" + OnhandNo + "' And LineItemNo="+ lineItemNo + "  " +
                                              "";                               
                                    db.ExecuteSql(strSql);
                                    aggregateMaster(OnhandNo);

                                }

                            }
                        }
                        Result = 1;
                    }
                }

            }
            catch { throw; }
            return Result;
        }

        public int DeleteLineItem(ONHAND_D request)
        {

            int Result = -1;

            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection())
                {
                    if (request.strONHAND_NO != null && request.strONHAND_NO != "" && request.LineItemNo != null && request.LineItemNo != "") {
                        string strSql = "";
                        strSql = "Delete from OH_PID_D where " +
                          "ONHAND_NO ='"+request .strONHAND_NO +"'"+
                          "And LineItemNo="+request.LineItemNo + "" ;
                        db.ExecuteSql(strSql);
                        aggregateMaster(request.strONHAND_NO);
                    }
                 
                }
                Result = 1;

            }
            catch { throw; }
            return Result;
        }

        public int aggregateMaster(string onhandNo) {
            int Result = -1;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection())
                {
                    if (onhandNo != "") {
                  string strSql = "";
                  strSql=  " UPDATE Onhand_D Set " +
                 " TOT_PCS = (SELECT SUM(ISNULL(PIECES, 0)) FROM OH_PID_D WHERE ONHAND_NO = '" + onhandNo + "'), " +
                 " TOT_GROSS_LB = (SELECT SUM(ISNULL(VOL_LB, 0)) FROM OH_PID_D WHERE ONHAND_NO = '" + onhandNo + "'), " +
                 " TOT_VOL_FT = (SELECT SUM(ISNULL(GROSS_LB, 0)) FROM OH_PID_D WHERE ONHAND_NO = '" + onhandNo + "'), " +
                 " TOT_VOL_LB = (SELECT SUM(CONVERT(INT, PIECES * LENGTH * WIDTH * HEIGHT / 1728) + ROUND((((PIECES * LENGTH * WIDTH * HEIGHT) % 1728) / 1728 * 100) / 100, 1)) FROM OH_PID_D WHERE " +
                 " ONHAND_NO = '" + onhandNo + "') " +
                 " WHERE ONHAND_NO ='"+ onhandNo + "'  " +
                 "";
                        db.ExecuteSql(strSql);
                    }
              
                }
                Result = 1;

            }
            catch { throw; }
            return Result;
        }
        public int Create_OH_PID_D(ONHAND_D request)
        {

            int Result = -1;
            int intMaxLineItemNo = 1;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection())
                {

                    string onhandno = request.strONHAND_NO;
                    if (onhandno != "") {                
                        List<ON_PID_D> list1 = db.Select<ON_PID_D>("Select Max(LineItemNo) LineItemNo from OH_PID_D Where onhand_no = " + Modfunction.SQLSafeValue(onhandno));
                        if (list1 != null)
                        {
                            if (list1[0].LineItemNo > 0)
                                intMaxLineItemNo = list1[0].LineItemNo + 1;
                        }
                        string strSql = "";
                        strSql = "insert into OH_PID_D( " +
                       "   onhand_no," +
                       "   LineItemNo, " +
                       "   INV_NO " +
                       "  )" +
                           "values( " +
                           Modfunction.SQLSafeValue(onhandno) + " , " +
                           intMaxLineItemNo +"," +
                          "''"+
                           ") ";
                        db.ExecuteSql(strSql);
                    }
                }                                     
                       Result = intMaxLineItemNo;
                               
            }
            catch { throw; }
            return Result;
        }

        public string ConfirmAll_ONHAND_D(ONHAND_D request)
        {
          
            string  Result ="";
            String KeyOnhandNo = "";
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection())
                {
                    if (request.UpdateAllString != null && request.UpdateAllString != "")
                    {
                        JArray ja = (JArray)JsonConvert.DeserializeObject(request.UpdateAllString);
                        if (ja != null)
                        {

                            for (int i = 0; i < ja.Count(); i++)
                            {
                              
                                string strSql = "";
                                KeyOnhandNo = generateOnhandNo();
                                string SHP_CODE = ja[i]["SHP_CODE"].ToString();
                                string CNG_CODE = ja[i]["CNG_CODE"].ToString();
                                string ONHAND_date = ja[i]["ONHAND_date"].ToString();
                                string CASE_NO  =ja[i]["CASE_NO"].ToString();                                                           
                                string PUB_YN = ja[i]["PUB_YN"].ToString();
                                string HAZARDOUS_YN = ja[i]["HAZARDOUS_YN"].ToString();
                                string CLSF_YN = ja[i]["CLSF_YN"].ToString();
                                string ExerciseFlag = ja[i]["ExerciseFlag"].ToString();
                                string LOC_CODE = ja[i]["LOC_CODE"].ToString();
                                string TRK_CODE = ja[i]["TRK_CODE"].ToString();
                                string TRK_CHRG_TYPE = ja[i]["TRK_CHRG_TYPE"].ToString();
                                string PICKUP_SUP_datetime = ja[i]["PICKUP_SUP_datetime"].ToString();                                                       
                                int NO_INV_WH ;
                                string UserID = ja[i]["UserID"].ToString();
                                if (ja[i]["NO_INV_WH"].ToString() == "")
                                {
                                    NO_INV_WH = 0;
                                }
                                else
                                {
                                    NO_INV_WH = int.Parse(ja[i]["NO_INV_WH"].ToString());
                                }

                                strSql = "insert into ONHAND_D( " +
                               "   onhand_no,"+
                               "   SHP_CODE," +
                               "   CNG_CODE ," +
                               "   ONHAND_date," +
                               "   CASE_NO ," +
                               "   PUB_YN," +
                               "   HAZARDOUS_YN ," +
                               "   CLSF_YN ," +
                               "   ExerciseFlag ," +
                               "   LOC_CODE ," +
                               "   TRK_CODE ," +
                               "   TRK_CHRG_TYPE ," +
                               "   PICKUP_SUP_datetime," +
                               "   NO_INV_WH," +
                               "   CreateBy," +
                               "   UpdateBy," +
                               "   CreateDateTime," +
                               "   UpdateDateTime," +
                               "   StatusCode " +
                               "  )" +
                                   "values( " +
                                   Modfunction.SQLSafeValue(KeyOnhandNo) +" , " +
                                   Modfunction.SQLSafeValue(SHP_CODE)+","+
                                   Modfunction.SQLSafeValue(CNG_CODE) + "," +
                                   Modfunction.SQLSafeValue(ONHAND_date) + "," +
                                   Modfunction.SQLSafeValue(CASE_NO) + "," +
                                   Modfunction.SQLSafeValue(PUB_YN) + "," +
                                   Modfunction.SQLSafeValue(HAZARDOUS_YN) + "," +
                                   Modfunction.SQLSafeValue(CLSF_YN) + "," +
                                   Modfunction.SQLSafeValue(ExerciseFlag) + "," +
                                   Modfunction.SQLSafeValue(LOC_CODE) + "," +
                                   Modfunction.SQLSafeValue(TRK_CODE) + "," +
                                   Modfunction.SQLSafeValue(TRK_CHRG_TYPE) + "," +
                                   Modfunction.SQLSafeValue(PICKUP_SUP_datetime) + "," +
                                   NO_INV_WH + "," +
                                   Modfunction.SQLSafeValue(UserID) + "," +
                                   Modfunction.SQLSafeValue(UserID) + "," +
                                   "GETDATE()," +
                                   "GETDATE()," +
                                    "'USE'" +
                                   ") ";
                                db.ExecuteSql(strSql);
                            }
                            }
                            Result = KeyOnhandNo;
                        }
                    }
                
            }
            catch { throw; }
            return Result;
        }

        private string generateOnhandNo()
        {
            ONHAND_D pair;
            var prefixRules = "";
            var runningNo = "";

            using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
            {
                try
                {
                    List<sanm1> sanm1 = db.Select<sanm1>("SELECT Prefix, NextNo FROM sanm1 WHERE NumberType = 'OMOH'");

                    prefixRules = Modfunction.CheckNull(sanm1[0].Prefix);
                    runningNo = Modfunction.CheckNull(sanm1[0].NextNo);                   
                    pair = generateTransactionNo(prefixRules, runningNo);
                    string strSql = "";
                    strSql = "NextNo="+ Modfunction.SQLSafeValue(pair.NextNo) + "";
                    db.Update("sanm1",
                                  strSql,
                                  "numbertype='OMOH' ");
                
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

            return pair.TrxNo;
        }


        private ONHAND_D generateTransactionNo(string prefixRules, string runningNo)
        {
            var pair = new ONHAND_D();
            var rules = prefixRules.Split(',');
            var now = DateTime.Now;

            foreach (var r in rules)
            {
                var rule = r.Trim();
                if (rule == "YY" || rule == "MM")
                {
                    pair.TrxNo += now.ToString(rule);
                }
                else
                {
                    //assume is Fxx, until further instruction
                    pair.TrxNo += rule.Substring(1);
                }
            }

            pair.TrxNo += runningNo;

            //compute next number for storage.
            var runningInt = 0;
            Int32.TryParse(runningNo, out runningInt);
            ++runningInt;
            pair.NextNo = runningInt.ToString(new String('0', runningNo.Length));

            return pair;
        }
    }
   

}
