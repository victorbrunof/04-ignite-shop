import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { priceId } = req.body;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Merhod not allowed" });
  }

  if (!priceId) {
    return res.status(400).json({ error: "Price not found" });
  }

  const successurl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelurl = `${process.env.NEXT_URL}/`;

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: successurl,
    cancel_url: cancelurl,
    mode: "payment",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });

  return res.status(201).json({
    checkoutUrl: checkoutSession.url,
  });
}
