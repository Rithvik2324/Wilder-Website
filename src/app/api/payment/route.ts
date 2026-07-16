import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, tourName, email } = await req.json();

    const orderNumber = `WILDER-${Date.now()}`;

    const params = new URLSearchParams();

    params.append("userName", process.env.BBL_USERNAME!);
    params.append("password", process.env.BBL_PASSWORD!);

    params.append(
      "amount",
      String(Math.round(Number(amount) * 100))
    );

    params.append("description", tourName);

    params.append(
  "returnUrl",
  `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`
);

    params.append("orderNumber", orderNumber);

    if (email) {
      params.append("email", email);
    }
    console.log(params.toString());
console.log("Return URL:", `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`);

    const response = await fetch(
      `${process.env.BBL_BASE_URL}/register.do`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

console.log("Belize Bank Response:", data);
if (data.errorCode !== undefined) {
    console.log(data);

    return NextResponse.json(
        {
            success: false,
            message: data.errorMessage,
            errorCode: data.errorCode
        },
        {
            status: 400
        }
    );
}

    return NextResponse.json({
      success: true,
      paymentUrl: data.formUrl,
      orderId: data.orderId,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to initialize payment.",
      },
      {
        status: 500,
      }
    );
  }
}