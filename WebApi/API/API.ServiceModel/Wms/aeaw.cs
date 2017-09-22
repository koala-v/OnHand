using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ServiceStack.ServiceHost;
using ServiceStack.OrmLite;
using WebApi.ServiceModel.Tables;
namespace WebApi.ServiceModel.Wms
{
    [Route("/wms/awaw1/MAwbNo", "Get")]
    [Route("/wms/awaw1/MasterJobNo", "Get")]
    [Route("/wms/awaw1/Pid", "Get")]
    public class aeaw : IReturn<CommonResponse>
    {
        public string MAwbNo { get; set; }
        public string MasterJobNo { get; set; }
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
                        string strSQL = "Select top 20 MAwbNo, MasterJobNo  From Aeaw1 Where StatusCode = 'USE' And MAwbNo LIKE '" + request.MAwbNo + "%'  Order By MAwbNo Asc";
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
                        string strSQL = "Select  MasterJobNo  From Aeaw1 Where  MAwbNo = '" + request.MAwbNo + "' ";
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

                    if (!string.IsNullOrEmpty(request.MasterJobNo))
                    {                     
                       string strSQL = "";
                        strSQL = " select  " +
                        " RowNum = ROW_NUMBER() OVER(ORDER BY OH_PID_D.LineItemNo ASC) , " +
                        " OH_PID_D.ONHAND_NO  , " +
                        " OH_PID_D.LineItemNo , " +                      
                        " ISNULL(OH_PID_D.PID_NO,'') AS PID_NO , " +                    
                        " from OH_PID_D left join ONHAND_D on ONHAND_D.onhand_no=OH_PID_D.onhand_no  where OH_PID_D.onhand_no=(Select Onhand_No from Onhand_D where MasterJoNo ='"+request.MasterJobNo +"')";
                        Result = db.Select<Pid_AEMT1>(strSQL);

                    }
                }

            }
            catch { throw; }
            return Result;
        }
    }
}
