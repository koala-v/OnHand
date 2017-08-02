using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebApi.ServiceModel.Tables
{
    public class ONHAND_D_Table
    {
    
        public string SHP_CODE { get; set; }
        public string ShipperName { get; set; }
        public string CNG_CODE { get; set; }
        public string ConsigneeName { get; set; }
        public Nullable<System.DateTime> ONHAND_date { get; set; }
        public string CASE_NO { get; set; }
        public string PUB_YN { get; set; }
        public string HAZARDOUS_YN { get; set; }
        public string CLSF_YN { get; set; }
        public string ExerciseFlag { get; set; }
        public string LOC_CODE { get; set; }
        public string TRK_CODE { get; set; }
        public string TRK_CHRG_TYPE { get; set; }
        public Nullable<System.DateTime> PICKUP_SUP_datetime { get; set; }
        public int NO_INV_WH { get; set; }
        public int TotalPCS { get; set; }
        public int TotalWeight { get; set; }
    }
}
