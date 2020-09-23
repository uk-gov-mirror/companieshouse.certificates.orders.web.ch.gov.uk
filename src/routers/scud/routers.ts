import { Router } from "express";
import { ROOT_SCAN_UPON_DEMAND, SCAN_UPON_DEMAND_CREATE } from "../../model/page.urls";
import homeController from "../../controllers/scud/home.controller";
import { render as renderCreateController } from "../../controllers/scud/create.scud.item.controller";

const router: Router = Router();

router.get(ROOT_SCAN_UPON_DEMAND, homeController);

router.get(SCAN_UPON_DEMAND_CREATE, renderCreateController);

export default router;
