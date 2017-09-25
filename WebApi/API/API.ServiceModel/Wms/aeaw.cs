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
        public string FromAeawFlag  { get; set; }
        public string PID_NO { get; set; }
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

                    if (request.FromAeawFlag == "Y") {
                        if (!string.IsNullOrEmpty(request.MasterJobNo))
                        {                    
                            string strSQL = "";
                            strSQL = "select "+                  
                                "  PID_NO " +
                                " From OH_PID_D " +
                                " Where " +
                                " ( PID_NO is  not null And  PID_NO !='' and PID_NO " +
                                " not in(select PID_NO  from AEMT1 where AEMT1.MawbNo in (select Aeaw1.MawbNo from Aeaw1 where MasterJobNo = '" + request.MasterJobNo + "')) ) " +
                                " and onhand_no  in (select ONHAND_NO from  ONHAND_D where  MasterJobNo = '" + request.MasterJobNo + "' ) ";
                            Result = db.Select<Pid_AEMT1>(strSQL);
                        }
                    }
                    else {
                        if (!string.IsNullOrEmpty(request.MasterJobNo))
                        {
                            string strSQL = "";
                            strSQL = "select " +
                              " PID_NO " +
                              " From AEMT1 "+
                              " Where Mawbno in (select MawbNo from Aeaw1 where MasterJobNo = '"+request.MasterJobNo +"')";                         
                            Result = db.Select<Pid_AEMT1>(strSQL);

                        }
                    }
                }
            }
            catch { throw; }
            return Result;
        }


 
    }
}
