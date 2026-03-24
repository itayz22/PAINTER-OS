#!/usr/bin/env bash
set -e

REPO_URL="https://github.com/itayz22/painter-os.git"
INSTALL_DIR="$HOME/painter-os"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()    { echo -e "${CYAN}[painter-os]${NC} $*"; }
success() { echo -e "${GREEN}[painter-os]${NC} $*"; }
warn()    { echo -e "${YELLOW}[painter-os]${NC} $*"; }
error()   { echo -e "${RED}[painter-os]${NC} $*" >&2; exit 1; }

# ── Dependency checks ──────────────────────────────────────────────────────────

check_cmd() {
  command -v "$1" &>/dev/null || error "'$1' is required but not installed. $2"
}

check_cmd git  "Install git: https://git-scm.com/downloads"
check_cmd node "Install Node.js (>=18): https://nodejs.org"
check_cmd npm  "Install npm (comes with Node.js): https://nodejs.org"

NODE_MAJOR=$(node -e "process.stdout.write(String(process.versions.node.split('.')[0]))")
if [ "$NODE_MAJOR" -lt 18 ]; then
  error "Node.js >=18 is required (found v$(node -v | tr -d v)). Please upgrade: https://nodejs.org"
fi

# ── Clone or update ────────────────────────────────────────────────────────────

if [ -d "$INSTALL_DIR/.git" ]; then
  info "Existing installation found at $INSTALL_DIR — pulling latest…"
  git -C "$INSTALL_DIR" pull --ff-only origin master
else
  info "Cloning PAINTER-OS into $INSTALL_DIR…"
  git clone "$REPO_URL" "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"

# ── Install dependencies ───────────────────────────────────────────────────────

info "Installing dependencies…"
npm install --prefer-offline

# ── Launch ─────────────────────────────────────────────────────────────────────

success "Installation complete!"
echo ""
echo -e "  ${CYAN}PAINTER-OS${NC} is starting on ${GREEN}http://localhost:5173${NC}"
echo ""

npm run dev
