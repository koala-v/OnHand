using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using ServiceStack;
using ServiceStack.ServiceHost;
using ServiceStack.OrmLite;
using WebApi.ServiceModel.Tables;

namespace WebApi.ServiceModel.Wms
{
				//[Route("/wms/rcbp1/sps", "Get")]				//sps?RecordCount= & BusinessPartyName=
				[Route("/wms/rcbp1", "Get")]                                //rcbp1?BusinessPartyName= &TrxNo=			
                [Route("/wms/rcbp1/All", "Get")]  
                [Route("/wms/rcdg1/UnNo", "Get")]
    public class Rcbp : IReturn<CommonResponse>
    {
        public string TrxNo { get; set; }
        public string BusinessPartyName { get; set; }
        public string BusinessPartyCode { get; set; }
        public string RecordCount { get; set; }
        public string  UnNo { get; set; }
        public string UnNoFlag { get; set; }
    }
    public class Rcbp_Logic
    {        
        public IDbConnectionFactory DbConnectionFactory { get; set; }
        public List<Rcbp1> Get_Rcbp1_List(Rcbp request)
        {
            List<Rcbp1> Result = null;
            try
            {
																using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {
                    if (!string.IsNullOrEmpty(request.BusinessPartyName))
                    {
                        string strSQL = "Select BusinessPartyCode, BusinessPartyName, StatusCode  From Rcbp1 Where StatusCode = 'USE' And BusinessPartyName LIKE '" + request.BusinessPartyName + "%'  Order By BusinessPartyCode Asc";
                        Result = db.Select<Rcbp1>(strSQL);
                    }
                    else if (!string.IsNullOrEmpty(request.BusinessPartyCode))
                    {
                        string strSQL = "Select BusinessPartyCode, BusinessPartyName, StatusCode  From Rcbp1 Where StatusCode = 'USE' And BusinessPartyCode LIKE '" + request.BusinessPartyCode + "%'  Order By BusinessPartyCode Asc";
                        Result = db.Select<Rcbp1>(strSQL);
                    }
                    else {
                        Result = null;
                    }
                  
                }
            }
            catch { throw; }
            return Result;
        }


        public List<Rcbp1> Get_Rcbp1_All(Rcbp request)
        {
            List<Rcbp1> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {
                    
                        string strSQL = "Select ISNULL(BusinessPartyCode,'') AS BusinessPartyCode   From Rcbp1 Where PartyType = 'TR' And  BusinessPartyCode !=''";
                        Result = db.Select<Rcbp1>(strSQL);                 

                }
            }
            catch { throw; }
            return Result;
        }

        public List<Rcdg1> Get_Rcdg1UnNo_List(Rcbp request)
        {
            List<Rcdg1> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {
                    if (!string.IsNullOrEmpty(request.UnNo))
                    {
                        if (request.UnNoFlag == "Y")
                        {
                            string strSQL = "Select UnNo,DGClass,DGDescription  From Rcdg1 Where UnNo = '" + request.UnNo + "' ";
                            Result = db.Select<Rcdg1>(strSQL);
                        }
                        else {
                            string strSQL = "Select UnNo,DGClass,DGDescription  From Rcdg1 Where UnNo LIKE '" + request.UnNo + "%'  Order By UnNo Asc";
                            Result = db.Select<Rcdg1>(strSQL);
                        }
                       
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
