# Deployment Guide for ArvanCloud

This guide explains how to build Docker images and deploy to ArvanCloud Kubernetes.

## Prerequisites

1. Docker installed locally
2. GitHub account with access to the repository
3. ArvanCloud account with Kubernetes cluster
4. `kubectl` configured for your ArvanCloud cluster

## Step 1: Build and Push Docker Image

### Option A: Using GitHub Actions (Recommended)

The GitHub Actions workflow will automatically build and push the image when you push to the `main` branch.

1. Make sure your repository has GitHub Actions enabled
2. Push your code to the `main` branch
3. The workflow will build and push to `ghcr.io/kzfamirhossein-beep/utes-website:latest`

### Option B: Manual Build (Windows PowerShell)

```powershell
# Login to GitHub Container Registry
docker login ghcr.io -u YOUR_GITHUB_USERNAME

# Build and push
.\docker-build.ps1 latest
```

### Option C: Manual Build (Linux/Mac)

```bash
# Login to GitHub Container Registry
docker login ghcr.io -u YOUR_GITHUB_USERNAME

# Build and push
chmod +x docker-build.sh
./docker-build.sh latest
```

## Step 2: Deploy to Arvan Cloud via Web Interface

### Using Arvan Cloud Container Dashboard

1. **Wait for GitHub Actions to Complete**
   - Go to your GitHub repository: `https://github.com/kzfamirhossein-beep/WebsiteUtes`
   - Navigate to the "Actions" tab
   - Wait for the "Build and Push Docker Image" workflow to complete successfully
   - Once complete, the image will be available at: `ghcr.io/kzfamirhossein-beep/utes-website:latest`

2. **Create GitHub Personal Access Token (if you don't have one)**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name like "Arvan Cloud GHCR Access"
   - Select the `read:packages` permission
   - Generate and copy the token (you'll need it for Arvan Cloud)

3. **Deploy in Arvan Cloud Dashboard**
   - Log in to your Arvan Cloud dashboard
   - Navigate to **Container** → **Create Application**
   - Select **Docker Image (داکر ایمیج)** section
   - Check the **"Private Registry" (رجیستری خصوصی)** checkbox
   - Fill in the following details:
     - **Image Name (نام ایمیج)**: `ghcr.io/kzfamirhossein-beep/utes-website`
     - **Tag (تگ)**: `latest`
     - **Username (نام کاربری)**: `kzfamirhossein-beep`
     - **Password (رمز عبور)**: `[Your GitHub Personal Access Token]`
   - Click **"Start" (شروع)** to deploy

4. **Configure Application Settings**
   - Set the port to `3000` (default Next.js port)
   - Configure resource limits (CPU, Memory) as needed
   - Set up environment variables if required
   - Configure persistent volumes for `/app/data` and `/app/public/uploads` if needed

5. **Access Your Application**
   - Once deployed, Arvan Cloud will provide you with a service URL
   - Your application should be accessible at that URL

## Step 3: Configure Image Pull Secret for ArvanCloud (Alternative - Using kubectl)

If you prefer to use kubectl instead of the web interface, you can create a secret:

```bash
# Create a GitHub Personal Access Token with `read:packages` permission
# Then create the secret in Kubernetes:
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --docker-email=YOUR_EMAIL \
  --namespace=default
```

Update `k8s/deployment.yaml` to use the secret:

```yaml
spec:
  template:
    spec:
      imagePullSecrets:
      - name: ghcr-secret
      containers:
      ...
```

## Step 4: Deploy to ArvanCloud (Using kubectl)

1. **Create Persistent Volume Claims** (for data and uploads):
```bash
kubectl apply -f k8s/pvc.yaml
```

2. **Deploy the application**:
```bash
kubectl apply -f k8s/deployment.yaml
```

3. **Create Ingress** (if using custom domain):
```bash
kubectl apply -f k8s/ingress.yaml
```

## Step 5: Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress

# View logs
kubectl logs -f deployment/utes-website
```

## Updating the Deployment

When you push a new image:

```bash
# Restart the deployment to pull the latest image
kubectl rollout restart deployment/utes-website

# Or update the image tag in deployment.yaml and apply
kubectl apply -f k8s/deployment.yaml
```

## Important Notes

1. **Media Files**: The large media files (video, images) are not in the Docker image. You'll need to:
   - Upload them separately to cloud storage (S3, Cloudinary, etc.)
   - Or mount them as a volume from external storage
   - Or use a CDN

2. **Data Persistence**: The JSON data files and uploads are stored in Persistent Volumes. Make sure to backup these volumes.

3. **Environment Variables**: If you need environment variables, create a ConfigMap or Secret:
```bash
kubectl create configmap utes-config --from-literal=NODE_ENV=production
```

4. **Image Pull Policy**: The deployment uses `imagePullPolicy: Always` to always pull the latest image. Change to `IfNotPresent` for faster startup if needed.

## Troubleshooting

- **Image pull errors**: Make sure the image pull secret is created and the deployment references it
- **Pod crashes**: Check logs with `kubectl logs <pod-name>`
- **Storage issues**: Verify PVCs are bound with `kubectl get pvc`
- **Ingress not working**: Check ingress controller is installed and ingress is configured correctly

