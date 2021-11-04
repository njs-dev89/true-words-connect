import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  RtmTokenBuilder,
  RtcTokenBuilder,
  RtcRole,
  RtmRole,
} from "agora-access-token";

const config = functions.config();
const appId = config.agora.app_id;
const appCertificate = config.agora.certificate;

admin.initializeApp();

exports.addTranslatorRole = functions.https.onCall(
  async (data: Record<string, unknown>) => {
    return admin
      .auth()
      .setCustomUserClaims(data.uid as string, { role: "translator" })
      .then(() => {
        return {
          message: "Translator Added",
        };
      })
      .catch((e: Record<string, unknown>) => {
        return e;
      });
  }
);

exports.addClientRole = functions.https.onCall(
  (data: Record<string, unknown>) => {
    return admin
      .auth()
      .setCustomUserClaims(data.uid as string, { role: "client" })
      .then(() => {
        return {
          message: "Client Added",
        };
      })
      .catch((e: Record<string, unknown>) => {
        return e;
      });
  }
);

exports.addAdminRole = functions.https.onCall(
  (data: Record<string, unknown>) => {
    return admin
      .auth()
      .setCustomUserClaims(data.uid as string, { role: "admin" })
      .then(() => {
        return {
          message: "Client Added",
        };
      })
      .catch((e: Record<string, unknown>) => {
        return e;
      });
  }
);

exports.genRtmToken = functions.https.onCall(
  (data: Record<string, unknown>) => {
    const expirationTimeInSeconds = 86400;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const token = RtmTokenBuilder.buildToken(
      appId,
      appCertificate,
      data.uid as string,
      RtmRole.Rtm_User,
      privilegeExpiredTs
    );
    return token;
  }
);

exports.genRtcToken = functions.https.onCall(
  (data: Record<string, unknown>) => {
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      data.channelName as string,
      Number(data.uid),
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );
    return token;
  }
);
