import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { sourceBranch, targetBranch, title, labels } = await request.json();

    if (!process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
      throw new Error("GitHub configuration missing");
    }

    // Create the pull request
    const { data: pr } = await octokit.pulls.create({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      title,
      head: sourceBranch,
      base: targetBranch,
    });

    // Add labels to the PR
    if (labels && labels.length > 0) {
      await octokit.issues.addLabels({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        issue_number: pr.number,
        labels,
      });
    }

    return NextResponse.json({
      message: "Pull Request created successfully",
      pr: {
        number: pr.number,
        url: pr.html_url,
        title: pr.title,
      },
    });
  } catch (error) {
    console.error("PR creation error:", error);
    return NextResponse.json(
      { error: "Failed to create Pull Request" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    return NextResponse.json({
      message: "Hello World",
    });
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return new NextResponse(JSON.stringify({ error: "Không thể đọc file " }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
