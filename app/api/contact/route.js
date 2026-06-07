import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { landlordEmail, landlordName, renterEmail, renterName, listingTitle, message } = await request.json()

    await resend.emails.send({
      from: 'EnjeraPressList <onboarding@resend.dev>',
      to: landlordEmail,
      subject: `New inquiry about your listing: ${listingTitle}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #ea580c; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">EnjeraPressList.Com</h1>
            <p style="color: #fed7aa; margin: 8px 0 0; font-size: 14px;">Free Rental & Property Listings</p>
          </div>

          <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #111827; font-size: 18px; margin: 0 0 16px;">Hi ${landlordName},</h2>
            <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
              Someone is interested in your listing <strong style="color: #ea580c;">${listingTitle}</strong>!
            </p>

            <div style="background: #f9fafb; border-radius: 10px; padding: 16px; margin: 0 0 20px; border: 1px solid #e5e7eb;">
              <h3 style="color: #374151; font-size: 14px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.05em;">Renter Details</h3>
              <p style="color: #111827; margin: 0 0 6px; font-size: 14px;">👤 <strong>Name:</strong> ${renterName}</p>
              <p style="color: #111827; margin: 0 0 6px; font-size: 14px;">📧 <strong>Email:</strong> <a href="mailto:${renterEmail}" style="color: #ea580c;">${renterEmail}</a></p>
              ${message ? `<p style="color: #111827; margin: 8px 0 0; font-size: 14px;">💬 <strong>Message:</strong> ${message}</p>` : ''}
            </div>

            <a href="mailto:${renterEmail}" style="display: block; background: #ea580c; color: #ffffff; text-align: center; padding: 14px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; margin: 0 0 16px;">
              Reply to ${renterName}
            </a>

            <div style="background: #f0fdf4; border-radius: 10px; padding: 14px; border: 1px solid #bbf7d0;">
              <p style="color: #166534; font-size: 13px; margin: 0; text-align: center;">
                🔒 This inquiry was sent through EnjeraPressList.Com — no middlemen, no fees
              </p>
            </div>
          </div>

          <div style="background: #1f2937; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 EnjeraPressList.Com · Free rental listings</p>
          </div>
        </div>
      `
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
