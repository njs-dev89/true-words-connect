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
const returnUrl = config.stripe.return_url;

const stripe = new Stripe(secretKey, { apiVersion: "2020-08-27" });

admin.initializeApp();
const db = admin.firestore();

exports.addProviderRole = functions.https.onCall(
  async (data: Record<string, unknown>) => {
    try {
      const userRecord = await admin.auth().getUser(data.uid as string);
      const isAdmin = userRecord.customClaims?.isAdmin ? true : false;
      await admin
        .auth()
        .setCustomUserClaims(data.uid as string, { isAdmin, role: "provider" });
      return {
        message: "Provider Added",
      };
    } catch (err) {
      return err;
    }
    // return admin
    //   .auth()
    //   .setCustomUserClaims(data.uid as string, { role: "provider" })
    //   .then(() => {
    //     return {
    //       message: "Provider Added",
    //     };
    //   })
    //   .catch((e: Record<string, unknown>) => {
    //     return e;
    //   });
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
  async (data: Record<string, unknown>) => {
    try {
      const userRecord = await admin.auth().getUser(data.uid as string);
      const role = userRecord ? userRecord.customClaims?.role : "client";
      await admin
        .auth()
        .setCustomUserClaims(data.uid as string, { isAdmin: true, role });
      return {
        message: "Admin Added",
      };
    } catch (err) {
      return err;
    }
    // return admin
    //   .auth()
    //   .setCustomUserClaims(data.uid as string, { isAdmin: true })
    //   .then(() => {
    //     return {
    //       message: "Admin Added",
    //     };
    //   })
    //   .catch((e: Record<string, unknown>) => {
    //     return e;
    //   });
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
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
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
      refresh_url: returnUrl,
      return_url: returnUrl,
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
      amount: offer?.price * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: offer?.client.email,
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

exports.cancelOrder = functions.https.onCall(
  async (data: Record<string, unknown>) => {
    const refund = await stripe.refunds.create({
      payment_intent: data.paymentIntentId as string,
    });
    if (refund.status === "succeeded") {
      await db
        .doc(`/orders/${data.orderId}`)
        .set({ status: "cancelled" }, { merge: true });
      return refund.status;
    } else {
      return "failed";
    }
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
        if (offer.contractType === "hourly") {
          offer.time_remaining_secs = offer.hours * 60 * 60;
          offer.last_duration = 0;
        }
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

    db.collection(`/clients/${offer.client.id}/notifications`).add({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      title: "New Offer Received",
      user: {
        username: offer.provider.username,
        profile_pic: offer.provider.profile_pic,
      },
      message: `New offer of price $${offer.price} received from ${offer.client.username}.`,
      hasNotified: false,
      hasRead: false,
    });
  });

exports.offerRequestEmail = functions.firestore
  .document("providers/{providerId}/offerRequest/{offerRequestId}")
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const offerRequest = snap.data();
    db.collection("/mails").add({
      to: context.params.providerId,
      message: {
        subject: `New offerRequest from ${offerRequest.client.username}`,
        text: `You have recieved an offerRequest from ${offerRequest.client.username}. 
        Client budget amount is $${offerRequest.budget} for ${offerRequest.hours} hrs job.`,
      },
    });

    db.collection(`/providers/${context.params.providerId}/notifications`).add({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      title: "New Offer Request Received",
      user: {
        username: offerRequest.client.username,
        profile_pic: offerRequest.client.profile_pic,
      },
      message: `New offerRequest of price $${offerRequest.budget} received from ${offerRequest.client.username}.`,
      hasNotified: false,
      hasRead: false,
    });
  });

exports.clientSignupEmail = functions.firestore
  .document("clients/{clientId}")
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const client = snap.data();
    db.collection("/mails").add({
      to: client.email,
      message: {
        subject: `Signup success as username ${client.username}`,
        text: `You have Suuceessfully signed up with username 
        ${client.username} and email ${client.email}. 
        `,
      },
    });
  });

exports.providerAcceptanceEmail = functions.firestore
  .document("providers/{providerId}")
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const provider = snap.data();
    db.collection("/mails").add({
      to: provider.email,
      message: {
        subject: "Provider application accepted",
        text: `Congratulations! Your application to become provider
         at TrueWordsConnect has been accepted. You can now complete 
         your profile and start providing your services at TrueWordsConnect. 
        `,
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
    db.collection(`/providers/${order.provider.id}/notifications`).add({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      title: "New Order Received",
      user: {
        username: order.client.username,
        profile_pic: order.client.profile_pic,
      },
      message: `New order of price $${order.price} received from ${order.client.username}.`,
      hasNotified: false,
      hasRead: false,
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
