import { createApiClient } from "@companieshouse/api-sdk-node";
import { CompanyProfile, CompanyProfileResource } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { BasketItem, ItemUriPostRequest, Basket, BasketPatchRequest } from "@companieshouse/api-sdk-node/dist/services/order/basket/types";
import { CertificateItemPostRequest, CertificateItemPatchRequest, CertificateItem } from "@companieshouse/api-sdk-node/dist/services/order/certificates/types";
import { CertifiedCopyItem, CertifiedCopyItemResource } from "@companieshouse/api-sdk-node/dist/services/order/certified-copies/types";
import { API_KEY, API_URL, APPLICATION_NAME } from "../config/config";
import { createLogger } from "ch-structured-logging";
import Resource from "@companieshouse/api-sdk-node/dist/services/resource";
import createError from "http-errors";
import { MidItemPostRequest, MidItem } from "@companieshouse/api-sdk-node/dist/services/order/mid/types";

const logger = createLogger(APPLICATION_NAME);

export const getCompanyProfile = async (apiKey: string, companyNumber: string): Promise<CompanyProfile> => {
    const api = createApiClient(apiKey, undefined, API_URL);
    const companyProfileResource: Resource<CompanyProfile> = await api.companyProfile.getCompanyProfile(companyNumber.toUpperCase());
    if (companyProfileResource.httpStatusCode !== 200 && companyProfileResource.httpStatusCode !== 201) {
        throw createError(companyProfileResource.httpStatusCode, companyProfileResource.httpStatusCode.toString());
    }
    logger.info(`Get company profile, company_number=${companyNumber}, status_code=${companyProfileResource.httpStatusCode}`);
    return companyProfileResource.resource as CompanyProfile;
};

export const postCertificateItem =
    async (oAuth: string, certificateItem: CertificateItemPostRequest): Promise<CertificateItem> => {
        const api = createApiClient(undefined, oAuth, API_URL);
        const certificateItemResource: Resource<CertificateItem> = await api.certificate.postCertificate(certificateItem);
        if (certificateItemResource.httpStatusCode !== 200 && certificateItemResource.httpStatusCode !== 201) {
            throw createError(certificateItemResource.httpStatusCode, certificateItemResource.httpStatusCode.toString());
        }
        logger.info(`Create certificate, status_code=${certificateItemResource.httpStatusCode}`);
        return certificateItemResource.resource as CertificateItem;
    };

export const patchCertificateItem = async (
    oAuth: string, certificateId: string, certificateItem: CertificateItemPatchRequest): Promise<CertificateItem> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const certificateItemResource: Resource<CertificateItem> =
        await api.certificate.patchCertificate(certificateItem, certificateId);
    if (certificateItemResource.httpStatusCode !== 200) {
        throw createError(certificateItemResource.httpStatusCode, certificateItemResource.httpStatusCode.toString());
    }
    logger.info(`Patch certificate, id=${certificateId}, status_code=${certificateItemResource.httpStatusCode}`);
    return certificateItemResource.resource as CertificateItem;
};

export const getCertificateItem = async (oAuth: string, certificateId: string): Promise<CertificateItem> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const certificateItemResource: Resource<CertificateItem> = await api.certificate.getCertificate(certificateId);
    if (certificateItemResource.httpStatusCode !== 200) {
        throw createError(certificateItemResource.httpStatusCode, certificateItemResource.httpStatusCode.toString() || "Unable to retrieve certificate");
    }
    return certificateItemResource.resource as CertificateItem;
};

export const addItemToBasket = async (oAuth: string, itemUri: ItemUriPostRequest): Promise<BasketItem> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const itemUriResource: Resource<BasketItem> = await api.basket.postItemToBasket(itemUri);
    if (itemUriResource.httpStatusCode !== 200 && itemUriResource.httpStatusCode !== 201) {
        throw createError(itemUriResource.httpStatusCode, itemUriResource.httpStatusCode.toString());
    }
    logger.info(`Add item to basket, status_code=${itemUriResource.httpStatusCode}`);
    return itemUriResource.resource as BasketItem;
};

export const getBasket = async (oAuth: string): Promise<Basket> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const basketResource: Resource<Basket> = await api.basket.getBasket();
    if (basketResource.httpStatusCode !== 200 && basketResource.httpStatusCode !== 201) {
        throw createError(basketResource.httpStatusCode, basketResource.httpStatusCode.toString());
    }
    logger.info(`Get basket, status_code=${basketResource.httpStatusCode}`);
    return basketResource.resource as Basket;
};

export const patchBasket = async (oAuth: string, basketPatchRequest: BasketPatchRequest): Promise<Basket> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const basketResource: Resource<Basket> = await api.basket.patchBasket(basketPatchRequest);
    if (basketResource.httpStatusCode !== 200 && basketResource.httpStatusCode !== 201) {
        throw createError(basketResource.httpStatusCode, basketResource.httpStatusCode.toString());
    }
    logger.info(`Patch basket, status_code=${basketResource.httpStatusCode}`);
    return basketResource.resource as Basket;
};

export const getCertifiedCopyItem = async (oAuth: string, certifiedCopyId: string) : Promise<CertifiedCopyItem> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const certifiedCopyItemResource: Resource<CertifiedCopyItem> = await api.certifiedCopies.getCertifiedCopy(certifiedCopyId);
    if (certifiedCopyItemResource.httpStatusCode !== 200 && certifiedCopyItemResource.httpStatusCode !== 201) {
        throw createError(certifiedCopyItemResource.httpStatusCode, certifiedCopyItemResource.httpStatusCode.toString());
    }
    logger.info(`Get certified copy item, certified_copy_item_id=${certifiedCopyId}, status_code=${certifiedCopyItemResource.httpStatusCode}`);
    return certifiedCopyItemResource.resource as CertifiedCopyItem;
};

export const postMissingImageDeliveryItem = async (oAuth: string, missingImageDeliveryItem: MidItemPostRequest): Promise<MidItem> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const missingImageDeliveryItemResource: Resource<MidItem> = await api.mid.postMid(missingImageDeliveryItem);
    if (missingImageDeliveryItemResource.httpStatusCode !== 200 && missingImageDeliveryItemResource.httpStatusCode !== 201) {
        throw createError(missingImageDeliveryItemResource.httpStatusCode, missingImageDeliveryItemResource.httpStatusCode.toString());
    }
    logger.info(`Create Missing Image Delivery, status_code=${missingImageDeliveryItemResource.httpStatusCode}`);
    return missingImageDeliveryItemResource.resource as MidItem;
};

export const getMissingImageDeliveryItem = async (oAuth: string, missingImageDeliveryId: string): Promise<MidItem> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const midItemResource: Resource<MidItem> = await api.mid.getMid(missingImageDeliveryId);
    if (midItemResource.httpStatusCode !== 200 && midItemResource.httpStatusCode !== 201) {
        throw createError(midItemResource.httpStatusCode, midItemResource.httpStatusCode.toString());
    }
    logger.info(`Get missing image delivery item, missing_image_delivery_id=${missingImageDeliveryId}, status_code=${midItemResource.httpStatusCode}`);
    return midItemResource.resource as MidItem;
};
