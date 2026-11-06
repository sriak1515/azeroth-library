# Start the viewer project in Codex Cloud

## One-time repository seed

1. Create a private GitHub repository, for example `azeroth-library`.
2. Extract this ZIP. Put the **contents** of `Azeroth-Library-Cloud-Starter/` at the repository root, so `package.json`, `AGENTS.md` and this file sit at the top level. Commit and push them. Uploading the ZIP itself as a repository file does not seed usable source code. If using a browser upload, include `.gitignore` as well.
3. Create/select a Codex Cloud environment with access to this repository. Allow npm dependency installation. The project needs Node.js 20+; `npm ci` installs its pinned tools. No credentials, API keys or game-server access are needed.
4. Start a task for that repository and paste the prompt below. The task can read all the design/context files directly from GitHub; it does not need this original conversation or access to ChatGPT Library.

## First task prompt

```text
Implement the first Azeroth Library viewer pass described in docs-dev/FIRST_TASK.md.
Read AGENTS.md, design/DESIGN_DIRECTION.md and docs-dev/TECHNICAL_HANDOFF.md first.

Preserve the approved v0.2 design and working behavior. Keep the implementation light: this is a personal local Windows viewer. Actual Markdown content is authored elsewhere and must remain outside the viewer repository; bundled sample content is only fixtures.

Implement external-folder loading and a simple Windows read/update workflow. Do not expand campaign content, redesign the site, add syncing/hosting, or build an authoring application. Make reasonable implementation choices without asking about routine details. Run the build and proportionate checks, then provide the changes for review and clear Windows trial instructions. State any Windows behavior you could not verify in the cloud.
```

## What happens afterwards

Review the result, merge it when satisfactory, and try the supplied viewer package on Windows with fixture/sample content. Report broken or awkward behavior back to the development session. Campaign writing happens in a different session against the documented content format. You do not need to write Markdown or supervise the implementation.

Codex Cloud setup reference, checked 6 November 2026: https://learn.chatgpt.com/docs/cloud . Use the available environment/repository controls in your account; this package assumes no special ZIP-attachment feature in the cloud task composer.
