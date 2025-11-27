# Quick Start Guide - Deploy to ArvanCloud

## 1. Build and Push Docker Image

### Using PowerShell (Windows):
```powershell
# Login to GitHub Container Registry
docker login ghcr.io -u YOUR_GITHUB_USERNAME

# Build and push
.\docker-build.ps1 latest
```

### Using GitHub Actions (Automatic):
Just push to `main` branch - the workflow will build and push automatically.

## 2. Create Image Pull Secret in ArvanCloud

```powershell
# Create a GitHub Personal Access Token with 'read:packages' permission
# Then run:
.\setup-k8s-secret.ps1 -GitHubUsername YOUR_USERNAME -GitHubToken YOUR_TOKEN
```

Or manually:
```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_USERNAME \
  --docker-password=YOUR_TOKEN \
  --docker-email=YOUR_EMAIL
```

## 3. Deploy to ArvanCloud

```bash
# Create persistent volumes
kubectl apply -f k8s/pvc.yaml

# Deploy the application
kubectl apply -f k8s/deployment.yaml

# Create ingress (optional, for custom domain)
kubectl apply -f k8s/ingress.yaml
```

## 4. Verify

```bash
# Check status
kubectl get pods
kubectl get services
kubectl get ingress

# View logs
kubectl logs -f deployment/utes-website
```

## 5. Update Deployment

When you push a new image:
```bash
kubectl rollout restart deployment/utes-website
```

## Important Notes

- **Media files** (video, images) are NOT in the Docker image - you need to upload them separately or use cloud storage
- **Data persistence** - JSON files and uploads are stored in PVCs
- Make sure your GitHub token has `read:packages` permission

