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
    [Route("/wms/Rcpk", "Get")]     //all Rcpk
 
    public class Rcpk : IReturn<CommonResponse>
    {

    }
    public class rcpk_loigc
    {
        public IDbConnectionFactory DbConnectionFactory { get; set; }
        public List<Rcpk1> Get_Rcpk_List(Rcpk request)
        {
            List<Rcpk1> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection("WMS"))
                {
                  
                        string strSQL = " Select  ISNULL(PackType,'') AS  PackType,ISNULL(PackTypeCode,'') AS  PackTypeCode From Rcpk1 Where PackType !='' ";
                        Result = db.Select<Rcpk1>(strSQL);
                    

                }
            }
            catch { throw; }
            return Result;
        }
    }
}
