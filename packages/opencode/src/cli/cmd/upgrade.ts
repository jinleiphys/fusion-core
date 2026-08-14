import type { Argv } from "yargs"
import { UI } from "../ui"
import * as prompts from "@clack/prompts"
import { InstallationVersion } from "@opencode-ai/core/installation/version"

// FUSION-specific on purpose. Upstream's upgrade fetches
// api.github.com/repos/anomalyco/opencode/releases and pipes opencode.ai/install
// into a shell, so inheriting it would silently replace a FUSION install with
// plain opencode. FUSION ships only as a GitHub release tarball: no npm package,
// no brew formula, no hosted install script, so there is nothing to pipe. This
// command therefore reports whether a newer FUSION release exists and prints the
// exact command to install it, rather than performing a swap it cannot do safely
// while the binary it would overwrite is the one running.
const REPO = "jinleiphys/FUSION"
const RELEASES = `https://github.com/${REPO}/releases`
const LATEST_API = `https://api.github.com/repos/${REPO}/releases/latest`

function assetName(): string | undefined {
  const arch = process.arch === "arm64" ? "arm64" : process.arch === "x64" ? "x64" : undefined
  if (!arch) return undefined
  if (process.platform === "darwin") return `fusion-darwin-${arch}.tar.gz`
  if (process.platform === "linux") return `fusion-linux-${arch}.tar.gz`
  return undefined
}

export const UpgradeCommand = {
  command: "upgrade",
  describe: "check for a newer FUSION release and print how to install it",
  builder: (yargs: Argv) => yargs,
  handler: async () => {
    UI.empty()
    UI.println(UI.logo("  "))
    UI.empty()
    prompts.intro("Upgrade")

    let latest: string | undefined
    try {
      const response = await fetch(LATEST_API, { headers: { accept: "application/json" } })
      if (response.ok) {
        const data = (await response.json()) as { tag_name?: string }
        latest = data.tag_name?.replace(/^v/, "")
      }
    } catch {
      // Fall through to the manual instructions: not reaching GitHub is a
      // reason to print the steps, not a reason to fail.
    }

    if (latest && latest === InstallationVersion) {
      prompts.log.success(`FUSION ${InstallationVersion} is the latest release`)
      prompts.outro("Done")
      return
    }
    if (latest) prompts.log.info(`Installed ${InstallationVersion}, latest ${latest}`)
    else prompts.log.warn(`Could not reach ${LATEST_API}, so the installed version was not compared`)

    const asset = assetName()
    if (asset) {
      prompts.log.info(
        `FUSION is a release tarball. From the directory holding the binary:\n\n` +
          `  curl -fsSL ${RELEASES}/latest/download/${asset} | tar -xz\n\n` +
          `Other platforms: ${RELEASES}/latest`,
      )
    } else {
      prompts.log.info(`No prebuilt binary for ${process.platform}/${process.arch}. See ${RELEASES}/latest`)
    }
    prompts.outro("Done")
  },
}
