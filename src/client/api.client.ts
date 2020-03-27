import { createApiClient } from "ch-sdk-node";
import { CompanyProfile } from "ch-sdk-node/dist/services/company-profile";
import { CertificateItemPostRequest, CertificateItem } from "ch-sdk-node/dist/services/order/item/certificate/types";
import { API_URL } from "../session/config";
import Resource from "ch-sdk-node/dist/services/resource";

export const getCompanyProfile = async (companyNumber: string, oAuth: string) => {
    const api = createApiClient(undefined, oAuth, API_URL);
    const profile = await api.companyProfile.getCompanyProfile(companyNumber);

    const sdkResponse =
        await api.companyProfile.getCompanyProfile(companyNumber.toUpperCase());

    const companyProfile = sdkResponse.resource as CompanyProfile;

    return {
        companyName: companyProfile.companyName,
    };
};

export const postCertificateItem =
    async (oAuth: string, certificateItem: CertificateItemPostRequest) => {
        const api = createApiClient(undefined, oAuth, API_URL);
        const postCertificateItem: Resource<CertificateItem> = await api.certificate.postCertificate(certificateItem);
        return postCertificateItem;
};
