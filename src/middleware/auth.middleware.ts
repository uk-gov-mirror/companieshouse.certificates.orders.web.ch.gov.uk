import { NextFunction, Request, RequestHandler, Response } from "express";
import { ISignInInfo } from "ch-node-session-handler/lib/session/model/SessionInterfaces";
import { SessionKey } from "ch-node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "ch-node-session-handler/lib/session/keys/SignInInfoKeys";
import { Session, VerifiedSession } from "ch-node-session-handler/lib/session/model/Session";
import { CERTIFICATE_OPTIONS, replaceCompanyNumber } from "./../model/page.urls";

export default (req: Request, res: Response, next: NextFunction) => {
    if (req.path !== "/") {
        // tslint:disable-next-line
        req.session.ifNothing(() => console.log(`${req.url}: Session object is missing!`));
        const signedIn: boolean = req.session
                .chain((session: Session) => session.getValue<ISignInInfo>(SessionKey.SignInInfo))
                .map((signInInfo: ISignInInfo) => signInInfo[SignInInfoKeys.SignedIn] === 1)
                .orDefault(false);

        if (!signedIn) {
            const companyNumber = req.params.companyNumber;
            const certificateOptionssUrl = replaceCompanyNumber(CERTIFICATE_OPTIONS, companyNumber);
            return res.redirect(`/signin?return_to=${certificateOptionssUrl}`);
        }
    }
    next();
};
