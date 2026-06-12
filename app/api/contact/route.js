import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { landlordEmail, landlordName, renterEmail, renterName, listingTitle, message, listingCategory, listingType } = await request.json()

    const getListingType = () => {
      if (listingCategory === 'Job') return 'Job Post'
      if (listingCategory === 'Vehicle') return listingType === 'Rent' ? 'Vehicle Rental' : 'Vehicle For Sale'
      if (listingType === 'Sale') return 'Property For Sale'
      return 'Rental Property'
    }

    const getEmoji = () => {
      if (listingCategory === 'Job') return '💼'
      if (listingCategory === 'Vehicle') return '🚗'
      return '🏠'
    }

    const listingTypeLabel = getListingType()
    const emoji = getEmoji()

    await resend.emails.send({
      from: 'EnjeraPressList <onboarding@resend.dev>',
      to: [landlordEmail, 'mailtogetie@gmail.com'],
      subject: `${emoji} Someone viewed your ${listingTypeLabel}: ${listingTitle}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #ea580c; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">EnjeraPressList.Com</h1>
            <p style="color: #fed7aa; margin: 8px 0 0; font-size: 14px;">Free Listings — Ethiopia & USA</p>
          </div>

          <div style="background: #ffffff; padding: 28px; border: 1px solid #e5e7eb; border-top: none;">

            <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <p style="font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 6px;">
                ${emoji} Someone is interested in your ${listingTypeLabel}!
              </p>
              <p style="font-size: 14px; color: #6b7280; margin: 0;">
                A visitor just clicked to reveal contact information for your listing.
              </p>
            </div>

            <div style="background: #f9fafb; border-radius: 10px; padding: 16px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
              <p style="font-size: 11px; font-weight: 700; color: #6b7280; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">Your Listing</p>
              <p style="font-size: 16px; font-weight: 700; color: #111827; margin: 0 0 4px;">${emoji} ${listingTitle}</p>
              <p style="font-size: 13px; color: #6b7280; margin: 0;">Type: ${listingTypeLabel}</p>
            </div>

            <div style="background: #f0fdf4; border-radius: 10px; padding: 16px; margin-bottom: 20px; border: 1px solid #bbf7d0;">
              <p style="font-size: 11px; font-weight: 700; color: #166534; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">What Happened</p>
              <p style="font-size: 14px; color: #166534; margin: 0; line-height: 1.6;">
                ✅ A visitor viewed your listing and clicked <strong>"Reveal Contact Info"</strong><br/>
                ✅ They can now see your email and phone number<br/>
                ✅ Expect them to contact you soon
              </p>
            </div>

            ${message ? `
            <div style="background: #f9fafb; border-radius: 10px; padding: 16px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
              <p style="font-size: 11px; font-weight: 700; color: #6b7280; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">Message from Visitor</p>
              <p style="font-size: 14px; color: #111827; margin: 0; line-height: 1.6;">${message}</p>
            </div>
            ` : ''}

            <div style="background: #fef3c7; border-radius: 10px; padding: 14px; text-align: center;">
              <p style="font-size: 13px; color: #92400e; margin: 0; font-weight: 600;">
                💡 Tip: Respond quickly to increase your chances of closing a deal!
              </p>
            </div>
          </div>

          <div style="background: #1f2937; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
            <div style="display: flex; justify-content: center; gap: 4px; margin-bottom: 8px;">
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 EnjeraPressList.Com · Free listings · No fees</p>
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
