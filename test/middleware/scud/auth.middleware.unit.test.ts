import chai from "chai";
import sinon from "sinon";
import { Request, Response } from "express";
import { Session } from "ch-node-session-handler/lib/session/model/Session";

import scudAuthMiddleware from "../../../src/middleware/scud/auth.middleware";
import * as apiClient from "../../../src/client/api.client";

const sandbox = sinon.createSandbox();

const nextFunctionSpy = sandbox.spy();
const res = {} as Response;
const redirectSpy = sandbox.spy();
res.redirect = redirectSpy;

describe("scud.auth.middleware.unit", () => {
    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it("should call res.redirect if user is not signed in and trying to access the create page", async () => {
        const req = {
            path: "/create"
        } as Request;
        req.params = { companyNumber: "00006500", filingHistoryId: "0001" };
        req.session = new Session(
            {
                signin_info: {
                    signed_in: 0
                }
            }
        );
        await scudAuthMiddleware(req, res, nextFunctionSpy);
        chai.expect(redirectSpy)
            .to.have.been.calledWith("/signin?return_to=/company/00006500/orderable/scan-upon-demand/0001/create");
    });

    it("should call res.redirect if there an attempt to access the create page with no session", async () => {
        const req = {
            path: "/create"
        } as Request;
        req.params = { companyNumber: "00006500", filingHistoryId: "0001" };
        req.session = undefined;
        await scudAuthMiddleware(req, res, nextFunctionSpy);
        chai.expect(redirectSpy)
            .to.have.been.calledWith("/signin?return_to=/company/00006500/orderable/scan-upon-demand/0001/create");
    });

    it("should call res.redirect if user is not signed in and trying to access the check details page", async () => {
        const req = {
            path: "/check-details"
        } as Request;
        req.params = { companyNumber: "00006500", filingHistoryId: "0001" };
        req.session = new Session(
            {
                signin_info: {
                    signed_in: 0
                }
            }
        );
        await scudAuthMiddleware(req, res, nextFunctionSpy);
        chai.expect(redirectSpy)
            .to.have.been.calledWith("/signin?return_to=/company/00006500/orderable/scan-upon-demand/0001/create");
    });

    it("should call res.redirect if there an attempt to access the check details page with no session", async () => {
        const req = {
            path: "/check-details"
        } as Request;
        req.params = { companyNumber: "00006500", filingHistoryId: "0001" };
        req.session = undefined;
        await scudAuthMiddleware(req, res, nextFunctionSpy);
        chai.expect(redirectSpy)
            .to.have.been.calledWith("/signin?return_to=/company/00006500/orderable/scan-upon-demand/0001/create");
    });
});
