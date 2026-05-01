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
  --project "${PROJECT_ID}"

# 3. Configure Docker auth
echo "▶ Configuring Docker for GCR..."
gcloud auth configure-docker --quiet

# 4. Build with Cloud Build (no local Docker needed)
echo "▶ Building image via Cloud Build..."
gcloud builds submit \
  --tag "${IMAGE}:latest" \
  --project "${PROJECT_ID}" \
  .

# 5. Deploy to Cloud Run
echo "▶ Deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}:latest" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1" \
  --project "${PROJECT_ID}"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Service URL:"
gcloud run services describe "${SERVICE_NAME}" \
  --region "${REGION}" \
  --project "${PROJECT_ID}" \
  --format "value(status.url)"
