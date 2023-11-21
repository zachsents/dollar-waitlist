import { defineSecret } from "firebase-functions/params"
import { onRequest } from "firebase-functions/v2/https"
import Stripe from "stripe"
import { db } from "./init.js"
import { FieldValue } from "firebase-admin/firestore"


const stripeKey = defineSecret("STRIPE_EVENT_HANDLER_RESTRICTED_KEY")


const handlers = {
    "checkout.session.completed": onCheckoutSessionCompleted
}


export const onStripeEvent = onRequest({
    secrets: [stripeKey],
}, async (req, res) => {

    const stripe = new Stripe(stripeKey.value())
    const event = req.body

    const eventHandler = handlers[event.type]
    const response = await eventHandler?.(stripe, event.data.object, event)
        .catch(error => ({
            status: 500,
            data: {
                error: {
                    message: error.message,
                    stack: error.stack,
                }
            }
        }))

    if (response)
        return res.status(response.status || 200).send(response.data)

    res.sendStatus(200)
})


/**
 * @param {Stripe} stripe
 * @param {Stripe.Checkout.Session} checkoutSession
 */
async function onCheckoutSessionCompleted(stripe, checkoutSession) {

    const productId = await stripe.checkout.sessions.listLineItems(checkoutSession.id)
        .then(lineItems => lineItems.data[0]?.price.product)

    if (!productId)
        return

    const waitlistId = await stripe.products.retrieve(productId)
        .then(product => product.metadata.waitlistId)

    if (!waitlistId)
        return

    const waitlistRef = db.collection("waitlists").doc(waitlistId)

    await Promise.all([
        db.collection("waitlist-signups").add({
            email: checkoutSession.customer_email || checkoutSession.customer_details.email,
            waitlistId,
            waitlist: waitlistRef,
            createdAt: FieldValue.serverTimestamp(),
        }),
        waitlistRef.update({
            signupCount: FieldValue.increment(1),
        })
    ])
}