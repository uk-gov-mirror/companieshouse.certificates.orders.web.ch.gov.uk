import { NextFunction, Request, Response } from "express";
import { getAccessToken } from "../../session/helper";
import { CertificateItem } from "ch-sdk-node/dist/services/order/certificates/types";
import { getCertificateItem } from "../../client/api.client";
import { CERTIFICATE_DIRECTOR_OPTIONS } from "../../model/template.paths";

export const render = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken: string = getAccessToken(req.session);
    const certificateItem: CertificateItem = await getCertificateItem(accessToken, req.params.certificateId);
    const SERVICE_URL = `/company/${certificateItem.companyNumber}/orderable/certificates`;

    return res.render(CERTIFICATE_DIRECTOR_OPTIONS, {
        companyNumber: certificateItem.companyNumber,
        SERVICE_URL,
        backLink: setBackLink(certificateItem)
    });
};

const route = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect("delivery-details");
};

export const setBackLink = (certificateItem: CertificateItem) => {
    let backLink;

    if (certificateItem.itemOptions?.registeredOfficeAddressDetails?.includeAddressRecordsType) {
        backLink = "registered-office-options";
    } else {
        backLink = "certificate-options";
    }
    return backLink;
};

export default [route];
