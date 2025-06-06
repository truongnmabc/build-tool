# Tools Admin Dashboard

A web-based admin dashboard for managing tools and scripts in a monorepo environment.

## Features

- Script execution interface for:
  - Project initialization
  - Database synchronization
  - App building
- GitHub Pull Request creation with label management
- Automated CI/CD pipeline with GitHub Actions

## Prerequisites

- Node.js 16+
- pnpm 8+
- GitHub account with repository access
- GitHub Personal Access Token with repo scope

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd tools-admin
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```env
   GITHUB_TOKEN=your_github_token
   GITHUB_OWNER=your_org_or_username
   GITHUB_REPO=your_repo_name
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Script Execution

- `POST /api/scripts/init-project`

  - Initializes a new project
  - No request body required

- `POST /api/scripts/sync-db`

  - Synchronizes the database
  - No request body required

- `POST /api/scripts/build-app`
  - Builds the specified app
  - No request body required

### GitHub Integration

- `POST /api/github/create-pr`
  - Creates a new Pull Request
  - Request body:
    ```json
    {
      "sourceBranch": "feature/update-tools",
      "targetBranch": "main",
      "title": "Update tools",
      "labels": ["build:tools"]
    }
    ```

## CI/CD Pipeline

The GitHub Actions workflow (`/.github/workflows/ci.yml`) automatically:

1. Detects which app to build based on:
   - Branch name (e.g., `feature/tools-*`)
   - PR labels (e.g., `build:tools`)
2. Runs tests for the affected app
3. Builds the app if tests pass

## Security

- GitHub token is stored in environment variables
- API routes are protected
- Rate limiting is implemented
- Input validation is enforced

## Development

- Built with Next.js 13+
- Uses TypeScript for type safety
- Styled with Tailwind CSS and Ant Design
- Uses GitHub API v3 for PR management

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a Pull Request with appropriate labels

## License

MIT
#   b u i l d - t o o l  
 