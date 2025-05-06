import { auth } from "@/auth";
import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_OWNER || "truongnmabc";
const REPO = process.env.GITHUB_REPO || "org";
const BASE_BRANCH = "dev"; // branch gốc để tạo nhánh mới
const TARGET_BRANCH = "cicd"; // nhánh để merge PR (nơi có GitHub Action)

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { appName, type, env, domain } = body;

    if (!appName || !type || !env || !domain) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    const user = session.user?.email || "unknown";
    const timestamp = new Date().getTime();
    const branchName = `deploy/${appName}-${env}-${type}-${timestamp}`;

    console.log("🚀 ~ POST ~ branchName:", branchName);
    // 1. Lấy SHA commit mới nhất từ base branch
    const {
      data: {
        commit: { sha },
      },
    } = await octokit.repos.getBranch({
      owner: OWNER,
      repo: REPO,
      branch: BASE_BRANCH,
    });
    console.log("🚀 ~ POST ~ sha:", sha);

    // 2. Tạo branch mới từ commit đó
    await octokit.git.createRef({
      owner: OWNER,
      repo: REPO,
      ref: `refs/heads/${branchName}`,
      sha,
    });

    // 3. Tạo 1 file mới để đảm bảo có commit khác biệt
    const deployMeta = {
      appName,
      type,
      env,
      domain,
      triggeredBy: user,
      timestamp,
    };

    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: `deploy-log/${branchName}.json`,
      message: `chore: deploy metadata for ${appName}-${env}`,
      content: Buffer.from(JSON.stringify(deployMeta, null, 2)).toString(
        "base64"
      ),
      branch: branchName,
    });

    // 3. Tạo Pull Request đến nhánh cicd
    const pr = await octokit.pulls.create({
      owner: OWNER,
      repo: REPO,
      head: branchName,
      base: TARGET_BRANCH,
      title: `Deploy ${appName} to ${env} by ${user}`,
      body: `### Params:
- App: ${appName}
- Env: ${env}
- Type: ${type}
- Domain: ${domain}
- Triggered by: ${user}`,
    });

    try {
      await octokit.pulls.merge({
        owner: OWNER,
        repo: REPO,
        pull_number: pr.data.number,
        merge_method: "squash",
      });
    } catch (mergeErr) {
      console.error("PR không thể merge tự động:", mergeErr);
    }
    return NextResponse.json({
      success: true,
      message: "Branch and Pull Request created",
      data: {
        branch: branchName,
        prUrl: pr.data.html_url,
      },
    });
  } catch (error: any) {
    console.error("Build error:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
