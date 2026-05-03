#!/bin/bash
# ============================================================
# DemocrAI — Google Cloud Run Deployment Script
# Project: election-495007
# Region:  asia-south1 (Mumbai — closest to India users)
# ============================================================

set -e

PROJECT_ID="election-495007"
REGION="asia-south1"
SERVICE_NAME="democrai"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# ── Env vars passed to Cloud Run ─────────────────────────────
# Set these before running, or export them in your shell.
# They are passed as --set-env-vars (non-secret) for simplicity.
# For production, use Secret Manager instead.
GEMINI_KEY="${GEMINI_API_KEY:-}"
CIVIC_KEY="${GOOGLE_CIVIC_API_KEY:-}"
FIREBASE_PID="${FIREBASE_PROJECT_ID:-}"
FIREBASE_EMAIL="${FIREBASE_CLIENT_EMAIL:-}"
FIREBASE_KEY="${FIREBASE_PRIVATE_KEY:-}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  DemocrAI → Google Cloud Run Deploy"
echo "  Project : ${PROJECT_ID}"
echo "  Region  : ${REGION}"
echo "  Image   : ${IMAGE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Set project
gcloud config set project "${PROJECT_ID}"

# 2. Enable required APIs
echo "▶ Enabling required APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  civicinfo.googleapis.com \
  firestore.googleapis.com \
  --project "${PROJECT_ID}"

# 3. Configure Docker auth
echo "▶ Configuring Docker for GCR..."
gcloud auth configure-docker --quiet

# 4. Build with Cloud Build (no local Docker needed)
echo "▶ Building image via Cloud Build..."
gcloud builds submit \
  --tag "${IMAGE}:latest" \
  --project "${PROJECT_ID}" \
  --timeout=20m \
  .

# 5. Deploy to Cloud Run
echo "▶ Deploying to Cloud Run..."

# Build the env vars string — only include keys that are set
ENV_VARS="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1"
[ -n "${GEMINI_KEY}" ]    && ENV_VARS="${ENV_VARS},GEMINI_API_KEY=${GEMINI_KEY}"
[ -n "${CIVIC_KEY}" ]     && ENV_VARS="${ENV_VARS},GOOGLE_CIVIC_API_KEY=${CIVIC_KEY}"
[ -n "${FIREBASE_PID}" ]  && ENV_VARS="${ENV_VARS},FIREBASE_PROJECT_ID=${FIREBASE_PID}"
[ -n "${FIREBASE_EMAIL}" ] && ENV_VARS="${ENV_VARS},FIREBASE_CLIENT_EMAIL=${FIREBASE_EMAIL}"
[ -n "${FIREBASE_KEY}" ]  && ENV_VARS="${ENV_VARS},FIREBASE_PRIVATE_KEY=${FIREBASE_KEY}"

gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}:latest" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "${ENV_VARS}" \
  --project "${PROJECT_ID}"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Service URL:"
gcloud run services describe "${SERVICE_NAME}" \
  --region "${REGION}" \
  --project "${PROJECT_ID}" \
  --format "value(status.url)"
