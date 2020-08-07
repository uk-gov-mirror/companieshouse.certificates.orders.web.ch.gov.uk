import { NextFunction, Request, Response } from "express";
import { createLogger } from "ch-structured-logging";
import { CertifiedCopyItem, FilingHistoryDocuments } from "ch-sdk-node/dist/services/certified-copies";
import { Basket } from "ch-sdk-node/dist/services/order/basket";

import { CERTIFIED_COPY_DELIVERY_DETAILS, replaceCertifiedCopyId } from "../../model/page.urls";
import { CERTIFIED_COPY_CHECK_DETAILS } from "../../model/template.paths";
import { getAccessToken, getUserId } from "../../session/helper";
import { APPLICATION_NAME } from "../../config/config";
import { getCertifiedCopyItem, getBasket } from "../../client/api.client";
import { mapDeliveryDetails, mapDeliveryMethod } from "../../utils/check-details-utils";
import { getFullFilingHistoryDescription } from "../../config/api.enumerations";

const logger = createLogger(APPLICATION_NAME);

export const render = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken: string = getAccessToken(req.session);
        const certifiedCopyItem: CertifiedCopyItem = await getCertifiedCopyItem(accessToken, req.params.certifiedCopyId);
        const basket: Basket = await getBasket(accessToken);

        res.render(CERTIFIED_COPY_CHECK_DETAILS, {
            backUrl: replaceCertifiedCopyId(CERTIFIED_COPY_DELIVERY_DETAILS, req.params.certifiedCopyId),
            companyNumber: certifiedCopyItem.companyNumber,
            deliveryMethod: mapDeliveryMethod(certifiedCopyItem.itemOptions),
            deliveryDetails: mapDeliveryDetails(basket.deliveryDetails),
            filingHistoryDocuments: mapFilingHistoriesDocuments(certifiedCopyItem.itemOptions.filingHistoryDocuments)
        });
    } catch (err) {
        logger.error(`${err}`);
        next(err);
    }
};

export const mapFilingHistoryDescriptionValues = (description: string, descriptionValues: Record<string, string>) => {
    return Object.entries(descriptionValues).reduce((newObj, [key, val]) => {
        return newObj.replace("{" + key + "}", val as string);
    }, description);
};

export const removeAsterisks = (description: string) => {
    return description.replace(/\*/g, "");
};

export const mapFilingHistoriesDocuments = (filingHistoryDocuments: FilingHistoryDocuments[]) => {
    const mappedFilingHistories = filingHistoryDocuments.map(filingHistoryDocument => {
        const descriptionFromFile = getFullFilingHistoryDescription(filingHistoryDocument.filingHistoryDescription);
        const mappedFilingHistroyDescription = mapFilingHistoryDescriptionValues(descriptionFromFile, filingHistoryDocument.filingHistoryDescriptionValues || {});
        const cleanedFilingHistoryDescription = removeAsterisks(mappedFilingHistroyDescription);
        return {
            filingHistoryDate: filingHistoryDocument.filingHistoryDate,
            filingHistoryDescription: cleanedFilingHistoryDescription,
            filingHistoryId: filingHistoryDocument.filingHistoryId,
            filingHistoryType: filingHistoryDocument.filingHistoryType
        };
    });
    return mappedFilingHistories;
};

export default [render];
