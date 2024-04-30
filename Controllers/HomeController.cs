using BAK_web.Models;
using System.Threading;
using System.Web.Mvc;

namespace BAK_web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.width = 0;
            ViewBag.height = 0;
            ViewBag.canGenerate = false;
            ViewBag.crosswordType = "british";
            ViewBag.language = "czech";
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }

        public ActionResult GenerateCrossword(int width, int height)
        {
            Crossword crossword = new Crossword(width, height, true);
            ViewBag.canGenerate = true;
            return PartialView("CrosswordPartial", crossword);
        }

        public ActionResult Generate(int width, int height, bool isBritish, bool isCzechLanguage)
        {
            Crossword crossword;
            if (isBritish)
            {
                crossword = new CrosswordBritish(width, height, isCzechLanguage);
            }
            else
            {
                crossword = new CrosswordSw(width, height, isCzechLanguage);
            }

            return Json(crossword);
        }

    }
}