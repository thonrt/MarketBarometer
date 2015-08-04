using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml.Linq;
using Newtonsoft.Json;

namespace DataProvider
{
    public class MarketBarometer : IHttpHandler
    {
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        public void ProcessRequest(HttpContext context)
        {
            string path = AppDomain.CurrentDomain.BaseDirectory + "Data.xml";
            XElement data = XElement.Load(path);


            //XML to JSON
            string dataObj = JsonConvert.SerializeXNode(data);

            //JSON to XML
            //XDocument dataDom = JsonConvert.DeserializeXNode(dataObj);

            context.Response.Write(dataObj);
        }
    }
}
