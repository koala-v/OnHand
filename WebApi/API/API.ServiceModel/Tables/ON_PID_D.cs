using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebApi.ServiceModel.Tables
{
   public class ON_PID_D
    {
        public string ONHAND_NO { get; set; }
        public int     LineItemNo { get; set; }
        public string  PACK_TYPE { get; set; }
        public string TRK_BILL_NO{ get; set; }
        public string  PID_NO { get; set; }
        public string UnNo{ get; set; }
        public int LENGTH { get; set; }
        public int WIDTH { get; set; }
        public int HEIGHT { get; set; }
        public int GROSS_LB { get; set; }
    }
}
