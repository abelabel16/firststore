import { NextResponse } from "next/server";
import { site } from "@/config/site";
import { createOrder } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payments";

export async function POST(req: Request) {
  let body: { product?: string; name?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { product, name, email } = body;
  if (product !== "course" && product !== "vip") {
    return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  }
  if (!name?.trim() || !email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid name and email." }, { status: 400 });
  }

  const amountUsd = product === "course" ? site.course.price : site.mentorship.price;
  const provider = getPaymentProvider();
  const order = createOrder({ email, name, product, amountUsd, provider: provider.name });

  try {
    const { checkoutUrl } = await provider.createCheckout(order);
    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error("Checkout creation failed:", err);
    return NextResponse.json(
      { error: "Could not start the payment. Please try again in a moment." },
      { status: 502 }
    );
  }
}
