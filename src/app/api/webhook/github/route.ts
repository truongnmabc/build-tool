import crypto from "crypto";
import { NextResponse } from "next/server";
import { getIO } from "../../../../lib/socket";

// Verify GitHub webhook signature
function verifyGithubWebhook(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  const calculatedSignature = `sha256=${digest}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const signature = request.headers.get("x-hub-signature-256");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 401 }
      );
    }

    if (
      !verifyGithubWebhook(
        payload,
        signature,
        process.env.GITHUB_WEBHOOK_SECRET || ""
      )
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { action, pull_request, repository } = payload;

    if (action === "opened" || action === "synchronize") {
      const io = getIO();
      io.emit("github:webhook", {
        type: "pull_request",
        action,
        repository: repository.full_name,
        prNumber: pull_request.number,
        prTitle: pull_request.title,
        prUrl: pull_request.html_url,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
