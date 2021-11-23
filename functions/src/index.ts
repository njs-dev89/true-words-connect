import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import {
  RtmTokenBuilder,
  RtcTokenBuilder,
  RtcRole,
  RtmRole,
} from "agora-access-token";

const config = functions.config();
const appId = config.agora.app_id;
const appCertificate = config.agora.certificate;
const secretKey = config.stripe.secret_key;
const whSecret = config.stripe.wh_secret;

const stripe = new Stripe(secretKey, { apiVersion: "2020-08-27" });

admin.initializeApp();
const db = admin.firestore();

exports.addProviderRole = functions.https.onCall(
  async (data: Record<string, unknown>) => {
    return admin
      .auth()
      .setCustomUserClaims(data.uid as string, { role: "provider" })
      .then(() => {
        return {
          message: "Provider Added",
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

// exports.addStripeAccount = functions.https.onCall(async () => {
//   const account = await Stripe.accounts.create({ type: "express" });
//   return account;
// });

exports.createStripeAccount = functions.firestore
  .document("providers/{providerId}")
  .onCreate(async (snap, context) => {
    const account = await stripe.accounts.create({
      type: "express",
      business_type: "individual",
      // business_profile: {
      //   url: `http://localhost:3000/providers/profile/${snap.id}`,
      // },
      settings: {
        payouts: {
          schedule: {
            delay_days: 14,
            interval: "daily",
          },
        },
      },
    });
    db.doc(`/providers/${snap.id}`).set(
      {
        stripeAccountId: account.id,
      },
      { merge: true }
    );
  });

exports.createStripeAccountLink = functions.https.onCall(
  async (data: Record<string, unknown>) => {
    const accountLink = await stripe.accountLinks.create({
      account: data.accountId as string,
      refresh_url: "http://localhost:3000/profile/overview",
      return_url: "http://localhost:3000/profile/overview",
      type: "account_onboarding",
    });

    return accountLink;
  }
);

exports.stripeDashboardLoginLink = functions.https.onCall(
  async (data: Record<string, unknown>) => {
    const link = await stripe.accounts.createLoginLink(
      data.accountId as string
    );

    return link;
  }
);

exports.checkOnboardingComplete = functions.https.onCall(
  async (data: Record<string, unknown>) => {
    const account = await stripe.accounts.retrieve(data.accountId as string);
    return account;
  }
);

exports.createPaymentIntent = functions.https.onCall(
  async (data: Record<string, unknown>) => {
    const offerSnap = await db.doc(`/offers/${data.offerId}`).get();
    const offer = offerSnap.data();
    const providerSnap = await db.doc(`/providers/${offer?.provider.id}`).get();
    const provider = providerSnap.data();

    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_types: ["card"],
      amount: offer?.price * 100,
      currency: "usd",
      application_fee_amount: offer?.price * 100 * 0.2,
      on_behalf_of: provider?.stripeAccountId as string,
      transfer_data: {
        destination: provider?.stripeAccountId as string,
      },
    });

    await db
      .doc(`/offers/${data.offerId}`)
      .set({ paymentIntentId: paymentIntent.id }, { merge: true });

    return paymentIntent.client_secret;
  }
);

exports.stripePaymentWebhook = functions.https.onRequest(
  async (req, res): Promise<any> => {
    let event;
    if (whSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature as string,
          whSecret
        );
      } catch (err) {
        console.log("Webhook signature verification failed.", err);
        return res.sendStatus(400);
      }
    }

    switch (event?.type) {
      case "payment_intent.succeeded": {
        const dataObject: any = event.data.object;
        let offer: Record<string, any> = {};
        let offerId;
        await (
          await db
            .collection("offers")
            .where("paymentIntentId", "==", dataObject.id)
            .get()
        ).forEach((data) => {
          offer = data.data();
          offerId = data.id;
        });
        offer.amountRecieved = dataObject.amount_received;
        offer.paymentStatus = dataObject.status;
        await db.collection("orders").doc().set(offer);
        await db
          .doc(`/offers/${offerId}`)
          .set({ status: "accepted" }, { merge: true });

        break;
      }
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event?.type}.`);
    }

    res.sendStatus(200);
  }
);

exports.offerEmail = functions.firestore
  .document("offers/{offerId}")
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const offer = snap.data();
    db.collection("/mails").add({
      to: offer.client.email,
      message: {
        subject: `New offer from ${offer.provider.username}`,
        text: `You have recieved an offer from ${offer.provider.username}. 
        The offered amount is $${offer.price} for ${offer.hours} hrs job.`,
      },
    });
  });

exports.newOrderEmail = functions.firestore
  .document("orders/{orderId}")
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const order = snap.data();
    db.collection("/mails").add({
      to: order.provider.email,
      message: {
        subject: `New order from ${order.client.username}`,
        text: `You have recieved an order from ${order.client.username}. 
        The order price is $${order.price} for ${order.hours} hrs job.`,
      },
    });
  });

exports.providerRating = functions.firestore
  .document("providers/{providerId}/reviews/{reviewId}")
  .onCreate(async (snap, context) => {
    const review = snap.data();
    const userDoc = (
      await db.doc(`/providers/${review.reviewedTo}`).get()
    ).data();
    const totalRating = userDoc?.totalRating || 0;
    const totalReviews = userDoc?.totalReviews || 0;
    await db.doc(`/providers/${review.reviewedTo}`).set(
      {
        totalRating: totalRating + review.rating,
        totalReviews: totalReviews + 1,
        rating: (totalRating + review.rating) / (totalReviews + 1),
      },
      { merge: true }
    );
  });

exports.clientRating = functions.firestore
  .document("clients/{clientId}/reviews/{reviewId}")
  .onCreate(async (snap, context) => {
    const review = snap.data();
    const userDoc = (
      await db.doc(`/clients/${review.reviewedTo}`).get()
    ).data();
    const totalRating = userDoc?.totalRating || 0;
    const totalReviews = userDoc?.totalReviews || 0;
    await db.doc(`/clients/${review.reviewedTo}`).set(
      {
        totalRating: totalRating + review.rating,
        totalReviews: totalReviews + 1,
        rating: (totalRating + review.rating) / (totalReviews + 1),
      },
      { merge: true }
    );
  });
