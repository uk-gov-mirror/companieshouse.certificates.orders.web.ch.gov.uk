import chai from "chai";
import sinon from "sinon";
import ioredis from "ioredis";

import { CERTIFIED_COPY_DELIVERY_DETAILS, replaceCertifiedCopyId } from "../../../src/model/page.urls";
import * as errorMessages from "../../../src/model/error.messages";
import { SIGNED_IN_COOKIE, signedInSession } from "../../__mocks__/redis.mocks";
import { Basket } from "ch-sdk-node/dist/services/order/basket/types";
import * as apiClient from "../../../src/client/api.client";

const ENTER_YOUR_FIRST_NAME_NOT_INPUT = "Enter your first name";
const ENTER_YOUR_LAST_NAME_NOT_INPUT = "Enter your last name";
const ENTER_BUILDING_AND_STREET_LINE_ONE = "Enter a building and street";
const FIRST_NAME_INVALID_CHARACTER_ERROR = "First name cannot include";
const LAST_NAME_INVALID_CHARACTER_ERROR = "Last name cannot include";
const ADDRESS_LINE_ONE_INVALID_CHARACTERS_ERROR: string = "Address line 1 cannot include ";
const ADDRESS_LINE_TWO_INVALID_CHARACTERS_ERROR: string = "Address line 2 cannot include ";
const ADDRESS_TOWN_INVALID_CHARACTERS_ERROR: string = "Town or city cannot include ";
const ADDRESS_COUNTY_INVALID_CHARACTERS_ERROR: string = "County cannot include ";
const ADDRESS_POSTCODE_INVALID_CHARACTERS_ERROR: string = "Postcode cannot include ";
const ADDRESS_COUNTRY_INVALID_CHARACTERS_ERROR: string = "Country cannot include ";
const INVALID_CHARACTER = "|";
const CHARACTER_LENGTH_TEXT_50 = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const POSTCODE: string = "CX14 1BX";
const COUNTY: string = "county";
const CERTIFIED_COPY_ID = "0001";
const DELIVERY_DETAILS_URL = replaceCertifiedCopyId(CERTIFIED_COPY_DELIVERY_DETAILS, CERTIFIED_COPY_ID);

const sandbox = sinon.createSandbox();
let testApp = null;
let getBasketStub;

describe("certified.copies.delivery.details.controller", () => {
    beforeEach((done) => {
        sandbox.stub(ioredis.prototype, "connect").returns(Promise.resolve());
        sandbox.stub(ioredis.prototype, "get").returns(Promise.resolve(signedInSession));
        testApp = require("../../../src/app").default;
        done();
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    describe("delivery details url test", () => {
        it("renders the delivery details web page", async () => {
            const basketDetails = {
                deliveryDetails: {
                    forename: "john",
                    surname: "smith",
                    addressLine1: "117 kings road",
                    addressLine2: "pontcanna",
                    country: "wales",
                    locality: "canton",
                    postalCode: "cf5 4xb",
                    region: "glamorgan"
                }
            } as Basket;

            getBasketStub = sandbox.stub(apiClient, "getBasket").returns(Promise.resolve(basketDetails));

            const res = await chai.request(testApp)
                .get(DELIVERY_DETAILS_URL)
                .set("Cookie", [`__SID=${SIGNED_IN_COOKIE}`]);

            chai.expect(res.status).to.equal(200);
            chai.expect(res.text).to.contain("What are the delivery details?");
        });
    });

    describe("delivery details validation test", () => {
        it("should receive error message instructing user to input required fields", async () => {
            const res = await chai.request(testApp)
                .post(DELIVERY_DETAILS_URL)
                .set("Cookie", [`__SID=${SIGNED_IN_COOKIE}`]);

            chai.expect(res.status).to.equal(200);
            chai.expect(res.text).to.contain(ENTER_YOUR_FIRST_NAME_NOT_INPUT);
            chai.expect(res.text).to.contain(ENTER_YOUR_LAST_NAME_NOT_INPUT);
            chai.expect(res.text).to.contain(ENTER_BUILDING_AND_STREET_LINE_ONE);
            chai.expect(res.text).to.contain(errorMessages.ADDRESS_COUNTY_AND_POSTCODE_EMPTY);
            chai.expect(res.text).to.contain(errorMessages.ADDRESS_COUNTRY_EMPTY);
        });
    });

    describe("delivery details validation", () => {
        it("should receive error message when entering invalid characters in all fields", async () => {
            const res = await chai.request(testApp)
                .post(DELIVERY_DETAILS_URL)
                .set("Accept", "application/json")
                .send({
                    addressCountry: INVALID_CHARACTER,
                    addressCounty: INVALID_CHARACTER,
                    addressLineOne: INVALID_CHARACTER,
                    addressLineTwo: INVALID_CHARACTER,
                    addressPostcode: INVALID_CHARACTER,
                    addressTown: INVALID_CHARACTER,
                    firstName: INVALID_CHARACTER,
                    lastName: INVALID_CHARACTER
                })
                .set("Cookie", [`__SID=${SIGNED_IN_COOKIE}`]);

            chai.expect(res.status).to.equal(200);
            chai.expect(res.text).to.contain(FIRST_NAME_INVALID_CHARACTER_ERROR);
            chai.expect(res.text).to.contain(LAST_NAME_INVALID_CHARACTER_ERROR);
            chai.expect(res.text).to.contain(ADDRESS_LINE_ONE_INVALID_CHARACTERS_ERROR);
            chai.expect(res.text).to.contain(ADDRESS_LINE_TWO_INVALID_CHARACTERS_ERROR);
            chai.expect(res.text).to.contain(ADDRESS_TOWN_INVALID_CHARACTERS_ERROR);
            chai.expect(res.text).to.contain(ADDRESS_COUNTY_INVALID_CHARACTERS_ERROR);
            chai.expect(res.text).to.contain(ADDRESS_POSTCODE_INVALID_CHARACTERS_ERROR);
            chai.expect(res.text).to.contain(ADDRESS_COUNTRY_INVALID_CHARACTERS_ERROR);
        });

        it("should receive error messages requesting less than allowed character length in input fields", async () => {
            const res = await chai.request(testApp)
                .post(DELIVERY_DETAILS_URL)
                .send({
                    addressCountry: CHARACTER_LENGTH_TEXT_50,
                    addressCounty: CHARACTER_LENGTH_TEXT_50,
                    addressLineOne: CHARACTER_LENGTH_TEXT_50,
                    addressLineTwo: CHARACTER_LENGTH_TEXT_50,
                    addressPostcode: CHARACTER_LENGTH_TEXT_50,
                    addressTown: CHARACTER_LENGTH_TEXT_50,
                    firstName: CHARACTER_LENGTH_TEXT_50,
                    lastName: CHARACTER_LENGTH_TEXT_50
                })
                .set("Cookie", [`__SID=${SIGNED_IN_COOKIE}`]);

            chai.expect(res.status).to.equal(200);
            chai.expect(res.text).to.contain(errorMessages.ORDER_DETAILS_FIRST_NAME_MAX_LENGTH);
            chai.expect(res.text).to.contain(errorMessages.ORDER_DETAILS_LAST_NAME_MAX_LENGTH);
            chai.expect(res.text).to.contain(errorMessages.ADDRESS_LINE_ONE_MAX_LENGTH);
            chai.expect(res.text).to.contain(errorMessages.ADDRESS_LINE_TWO_MAX_LENGTH);
            chai.expect(res.text).to.contain(errorMessages.ADDRESS_TOWN_MAX_LENGTH);
            chai.expect(res.text).to.contain(errorMessages.ADDRESS_COUNTY_MAX_LENGTH);
            chai.expect(res.text).to.contain(errorMessages.ADDRESS_POSTCODE_MAX_LENGTH);
            chai.expect(res.text).to.contain(errorMessages.ADDRESS_COUNTRY_MAX_LENGTH);
        });

        it("should not receive Postcode or county error message when postcode is input", async () => {
            const res = await chai.request(testApp)
                .post(DELIVERY_DETAILS_URL)
                .send({
                    addressPostcode: POSTCODE
                })
                .set("Cookie", [`__SID=${SIGNED_IN_COOKIE}`]);

            chai.expect(res.status).to.equal(200);
            chai.expect(res.text).not.to.contain(errorMessages.ADDRESS_COUNTY_AND_POSTCODE_EMPTY);
        });

        it("should not receive Postcode or county error message when county is input", async () => {
            const res = await chai.request(testApp)
                .post(DELIVERY_DETAILS_URL)
                .send({
                    addressCounty: COUNTY
                })
                .set("Cookie", [`__SID=${SIGNED_IN_COOKIE}`]);

            chai.expect(res.status).to.equal(200);
            chai.expect(res.text).not.to.contain(errorMessages.ADDRESS_COUNTY_AND_POSTCODE_EMPTY);
        });
    });
});
