import { Request, Response, NextFunction } from "express";
import { CertificateItemPatchRequest, ItemOptionsRequest, CertificateItem } from "ch-sdk-node/dist/services/order/item/certificate/types";
import { patchCertificateItem, getCertificateItem } from "../client/api.client";

import { DELIVERY_DETAILS, CERTIFICATE_OPTIONS } from "../model/template.paths";
import { getAccessToken } from "../session/helper";

const GOOD_STANDING_FIELD: string = "goodStanding";
const REGISTERED_OFFICE_FIELD: string = "registeredOffice";
const DIRECTORS_FIELD: string = "directors";
const SECRETARIES_FIELD: string = "secretaries";
const COMPANY_OBJECTS_FIELD: string = "companyObjects";
const MORE_INFO_FIELD: string = "moreInfo";

export const render = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken: string = getAccessToken(req.session);
        const certificateItem: CertificateItem = await getCertificateItem(accessToken, req.params.certificateId);

        return res.render(CERTIFICATE_OPTIONS, {
            companyNumber: certificateItem.companyNumber,
            itemOptions: certificateItem.itemOptions,
            templateName: CERTIFICATE_OPTIONS,
        });
    } catch (err) {
        next(err);
    }
};

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const moreInfo: string[] | string = req.body[MORE_INFO_FIELD];
        let additionalInfoItemOptions: ItemOptionsRequest;
        if (typeof moreInfo === "string") {
            additionalInfoItemOptions = setItemOptions([moreInfo]);
        } else {
            additionalInfoItemOptions = setItemOptions(moreInfo);
        }

        const certificateItem: CertificateItemPatchRequest = {
            itemOptions: {
                ...additionalInfoItemOptions,
            },
            quantity: 1,
        };
        const accessToken: string = getAccessToken(req.session);
        await patchCertificateItem(accessToken, req.params.certificateId, certificateItem);

        return res.redirect(DELIVERY_DETAILS);
    } catch (err) {
        return next(err);
    }
};

export const setItemOptions = (options: string[]): ItemOptionsRequest => {
    const initialItemOptions: ItemOptionsRequest = {
        directorDetails: {
            includeBasicInformation: null,
        },
        includeCompanyObjectsInformation: null,
        includeGoodStandingInformation: null,
        registeredOfficeAddressDetails: {
            includeAddressRecordsType: null,
        },
        secretaryDetails: {
            includeBasicInformation: null,
        },
    };
    return options === undefined ? initialItemOptions :
        options.reduce((itemOptionsAccum: ItemOptionsRequest, option: string) => {
            switch (option) {
                case GOOD_STANDING_FIELD: {
                    itemOptionsAccum.includeGoodStandingInformation = true;
                    break;
                }
                case REGISTERED_OFFICE_FIELD: {
                    itemOptionsAccum.registeredOfficeAddressDetails = { includeAddressRecordsType: "current" };
                    break;
                }
                case DIRECTORS_FIELD: {
                    itemOptionsAccum.directorDetails = { includeBasicInformation: true };
                    break;
                }
                case SECRETARIES_FIELD: {
                    itemOptionsAccum.secretaryDetails = { includeBasicInformation: true };
                    break;
                }
                case COMPANY_OBJECTS_FIELD: {
                    itemOptionsAccum.includeCompanyObjectsInformation = true;
                    break;
                }
                default:
                    break;
            }
            return itemOptionsAccum;
        }, initialItemOptions);
};
