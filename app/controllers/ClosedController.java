package controllers;

import play.mvc.Controller;
import play.mvc.Result;

public class ClosedController extends Controller {

    public Result index(){
        return ok(views.html.closed.render());
    }
}
