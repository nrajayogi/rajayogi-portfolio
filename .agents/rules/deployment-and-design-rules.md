# Mandatory Guidelines: Design System & Production Deployment

## 1. Strict 4px Corner Radius (`rounded-[4px]`) Everywhere
- **Every single element** with a corner radius must strictly be `rounded-[4px]`.
- Absolutely **NO** `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-lg`, `rounded-md`, or `rounded-sm`.
- Applies to all buttons, cards, image containers, modal windows, draggable stickers, tags, chips, input fields, and audio toggles.

## 2. 80% Percentage Angle Gauge
- The radial gauge and primary empirical outcome metrics must maintain the **80% percentage angle** (288° sweep / ~80% perceived operator agency baseline from N=14 empirical study).

## 3. Mandatory Production Deployment Pipeline
Whenever the user requests a deployment or asks to push to production:
1. **Verify Builds Locally**:
   - `npx tsc --noEmit` must pass with code 0 (zero type errors).
   - `npm run build` must pass with code 0.
2. **Commit & Push to GitHub**:
   - Stage all changes: `git add -A`
   - Commit with descriptive message: `git commit -m "..."`
   - Push to main branch: `git push origin main`.
3. **Deploy Directly to Production on Vercel**:
   - Run: `npx -y vercel deploy --temporary --yes`.
   - Confirm it builds and links to production alias: `https://rajayogi-portfolio.vercel.app`.
   - Never leave deployment pending or rely solely on unverified auto-deploy webhooks.
4. **Live Verification**:
   - Verify both URLs with `curl -ILs`:
     - `https://rajayogi-portfolio.vercel.app/` -> HTTP 200
     - `https://rajayogi-portfolio.vercel.app/work/lift-me-up` -> HTTP 200
5. **Always Report the Verified Live URL**:
   - Return `https://rajayogi-portfolio.vercel.app` to the user.
