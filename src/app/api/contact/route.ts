import { NextRequest, NextResponse } from "next/server"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY

    if (apiKey) {
      // Use Resend API to send email
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(apiKey)

        const emailResponse = await resend.emails.send({
          from: "onboarding@resend.dev", // Resend requires verification for custom domains
          to: "singhhydra@gmail.com",
          replyTo: body.email,
          subject: `New Contact Form Submission: ${body.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
              <p><strong>Subject:</strong> ${escapeHtml(body.subject)}</p>
              <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                <h3>Message:</h3>
                <p style="white-space: pre-wrap;">${escapeHtml(body.message)}</p>
              </div>
            </div>
          `,
        })

        if (emailResponse.error) {
          console.error("Resend API error:", emailResponse.error)
          return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
          )
        }

        return NextResponse.json(
          { success: true, message: "Email sent successfully" },
          { status: 200 }
        )
      } catch (error) {
        console.error("Error sending email via Resend:", error)
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        )
      }
    } else {
      // Development fallback: log the message
      console.log("Contact form submission (RESEND_API_KEY not set):")
      console.log({
        timestamp: new Date().toISOString(),
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
      })

      return NextResponse.json(
        { success: true, message: "Message logged (development mode)" },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Helper function to escape HTML special characters
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}
