// FedaPay configuration and helpers
const FEDAPAY_API_KEY = process.env.FEDAPAY_API_KEY
const FEDAPAY_BASE_URL = process.env.FEDAPAY_API_KEY?.startsWith("sk_live")
  ? "https://api.fedapay.com"
  : "https://sandbox-api.fedapay.com"

// Create a FedaPay transaction
export async function createTransaction({ amount, description, customer, orderId }) {
  try {
    const response = await fetch(`${FEDAPAY_BASE_URL}/v1/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FEDAPAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        amount: Math.round(amount), // FedaPay expects integer (no decimals)
        currency: {
          iso: "XOF", // Franc CFA
        },
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paiement/webhook`,
        customer: {
          firstname: customer.prenom,
          lastname: customer.nom,
          email: customer.email,
          phone_number: customer.telephone,
        },
        custom_metadata: {
          order_id: orderId,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la création de la transaction")
    }

    return {
      success: true,
      transaction: data.v1.transaction,
    }
  } catch (error) {
    console.error("FedaPay create transaction error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Generate payment token for checkout
export async function generatePaymentToken(transactionId) {
  try {
    const response = await fetch(`${FEDAPAY_BASE_URL}/v1/transactions/${transactionId}/token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FEDAPAY_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la génération du token")
    }

    return {
      success: true,
      token: data.v1.token,
      url: data.v1.url,
    }
  } catch (error) {
    console.error("FedaPay generate token error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Verify transaction status
export async function verifyTransaction(transactionId) {
  try {
    const response = await fetch(`${FEDAPAY_BASE_URL}/v1/transactions/${transactionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${FEDAPAY_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la vérification")
    }

    return {
      success: true,
      transaction: data.v1.transaction,
    }
  } catch (error) {
    console.error("FedaPay verify transaction error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Verify webhook signature
export function verifyWebhookSignature(payload, signature) {
  const crypto = require("crypto")
  const secret = process.env.FEDAPAY_WEBHOOK_SECRET

  if (!secret) {
    console.error("FEDAPAY_WEBHOOK_SECRET not configured")
    return false
  }

  const hash = crypto.createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex")

  return hash === signature
}
