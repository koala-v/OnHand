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
    [Route("/wms/ONHAND_D/confirm", "Post")]
    public class ONHAND_D : IReturn<CommonResponse>
    {
        public string strONHAND_NO { get; set; }
        public string CustomerCode { get; set; }
        public string TrxNo { get; set; }
        public string UpdateAllString { get; set; }
        public string NextNo { get; set; }
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

        public int ConfirmAll_ONHAND_D(ONHAND_D request)
        {
          
            int Result = -1;
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
                                string SHP_CODE = ja[i]["SHP_CODE"].ToString();
                                string CNG_CODE = ja[i]["CNG_CODE"].ToString();
                                string ONHAND_date = ja[i]["ONHAND_date"].ToString();
                                string CASE_NO = CASE_NO =ja[i]["CASE_NO"].ToString();                                                           
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
                                   Modfunction.SQLSafeValue(generateOnhandNo()) +" , " +
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
                            Result = 1;
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
