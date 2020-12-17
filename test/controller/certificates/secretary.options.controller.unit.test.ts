import chai from "chai";
import { CertificateItem } from "ch-sdk-node/dist/services/order/certificates/types";
import { setBackLink } from "../../../src/controllers/certificates/secretary.options.controller";

describe("secretary.options.controller.unit", () => {
    describe("setBackUrl for no registered address option selected", () => {
        it("the back button link should take the user to the certificate options page", () => {
            const certificateItem = {
                itemOptions: {
                    forename: "john",
                    surname: "smith"
                }
            } as CertificateItem;

            chai.expect(setBackLink(certificateItem)).to.equal("certificate-options");
        });
    });

    describe("setBackUrl for registered office option selected", () => {
        it("the back button link should take the user to the registered office option page", () => {
            const certificateItem = {
                itemOptions: {
                    registeredOfficeAddressDetails: {
                        includeAddressRecordsType: "current"
                    }
                }
            } as CertificateItem;

            chai.expect(setBackLink(certificateItem)).to.equal("registered-office-options");
        });
    });

    describe("setBackUrl for director option selected", () => {
        it("the back button link should take the user to the director options page", () => {
            const certificateItem = {
                itemOptions: {
                    directorDetails: {
                        includeBasicInformation: true
                    }
                }
            } as CertificateItem;

            chai.expect(setBackLink(certificateItem)).to.equal("director-options");
        });
    });
});
