import { createApiClient } from "ch-sdk-node";
import { CompanyProfile } from "ch-sdk-node/dist/services/company-profile";
import { BasketItem, ItemUriPostRequest, Basket, BasketPatchRequest } from "ch-sdk-node/dist/services/order/basket/types";
import { CertificateItemPostRequest, CertificateItemPatchRequest, CertificateItem } from "ch-sdk-node/dist/services/order/item/certificate/types";
import { API_URL } from "../config/config";
import Resource from "ch-sdk-node/dist/services/resource";

export const getCompanyProfile = async (companyNumber: string, oAuth: string) => {
    const api = createApiClient(undefined, oAuth, API_URL);

    const sdkResponse =
        await api.companyProfile.getCompanyProfile(companyNumber.toUpperCase());

    const companyProfile = sdkResponse.resource as CompanyProfile;

    return {
        companyName: companyProfile.companyName,
    };
};

export const postCertificateItem =
    async (oAuth: string, certificateItem: CertificateItemPostRequest): Promise<CertificateItem> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const certificateItemResource: Resource<CertificateItem> = await api.certificate.postCertificate(certificateItem);
    if (certificateItemResource.httpStatusCode !== 200 && certificateItemResource.httpStatusCode !== 201) {
        throw {
          status: certificateItemResource.httpStatusCode,
        };
    }
    return certificateItemResource.resource as CertificateItem;
};

export const patchCertificateItem = async (
    oAuth: string, certificateId: string, certificateItem: CertificateItemPatchRequest): Promise<CertificateItem> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const certificateItemResource: Resource<CertificateItem> =
        await api.certificate.patchCertificate(certificateItem, certificateId);
    if (certificateItemResource.httpStatusCode !== 200) {
        throw {
          status: certificateItemResource.httpStatusCode,
        };
    }
    return certificateItemResource.resource as CertificateItem;
};

export const getCertificateItem = async (oAuth: string, certificateId: string): Promise<CertificateItem> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const certificateItemResource: Resource<CertificateItem> = await api.certificate.getCertificate(certificateId);
    if (certificateItemResource.httpStatusCode !== 200) {
        throw new Error("Unable to retrieve certificate");
    }
    return certificateItemResource.resource as CertificateItem;
};

export const addItemToBasket = async (oAuth: string, itemUri: ItemUriPostRequest): Promise<BasketItem> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const itemUriResource: Resource<BasketItem> = await api.basket.postItemToBasket(itemUri);
    if (itemUriResource.httpStatusCode !== 200 && itemUriResource.httpStatusCode !== 201) {
        throw {
            status: itemUriResource.httpStatusCode,
        };
    }
    return itemUriResource.resource as BasketItem;
};

export const getBasket = async (oAuth: string): Promise<Basket> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const basketResource: Resource<Basket> = await api.basket.getBasket();
    if (basketResource.httpStatusCode !== 200 && basketResource.httpStatusCode !== 201) {
        throw {
            status: basketResource.httpStatusCode,
        };
    }
    return basketResource.resource as Basket;
};

export const patchBasket = async (oAuth: string, basketPatchRequest: BasketPatchRequest): Promise<Basket> => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const basketResource: Resource<Basket> = await api.basket.patchBasket(basketPatchRequest);
    if (basketResource.httpStatusCode !== 200 && basketResource.httpStatusCode !== 201) {
        throw {
            status: basketResource.httpStatusCode,
        };
    }
    return basketResource.resource as Basket;
};
