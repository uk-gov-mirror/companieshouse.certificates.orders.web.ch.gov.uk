import { Request, Response } from "express";
import { CERTIFIED_COPY_FILING_HISTORY, replaceCompanyNumber } from "../../model/page.urls";
import { CERTIFIED_COPY_INDEX } from "../../model/template.paths";
import { CHS_URL } from "../../config/config";

export default (req: Request, res: Response) => {
    const companyNumber: string = req.params.companyNumber;
    const startNowUrl = `${CHS_URL}${replaceCompanyNumber(CERTIFIED_COPY_FILING_HISTORY, companyNumber)}`;
    const serviceName: string = "Order a certified document";
    res.render(CERTIFIED_COPY_INDEX, { startNowUrl, companyNumber, serviceName });
};
