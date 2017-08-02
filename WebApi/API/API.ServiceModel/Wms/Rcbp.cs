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
				[Route("/wms/rcbp1", "Get")]								//rcbp1?BusinessPartyName= &TrxNo=			
    public class Rcbp : IReturn<CommonResponse>
    {
        public string TrxNo { get; set; }
        public string BusinessPartyName { get; set; }
								public string RecordCount { get; set; }
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
                    else {
                        Result = null;
                    }
                  
                }
            }
            catch { throw; }
            return Result;
        }
			
				}
}
