# Fix ImagePullBackOff Error in Arvan Cloud

## Problem
The pod is trying to pull from Docker Hub instead of GitHub Container Registry:
```
Failed to pull image "kzfamirhossein-beep/utes-website:latest": 
failed to resolve reference "docker.io/kzfamirhossein-beep/utes-website:latest"
```

## Root Cause
The image name in Arvan Cloud doesn't include the registry prefix `ghcr.io`, so Kubernetes defaults to Docker Hub.

## Solution

### Step 1: Update Image Name in Arvan Cloud

In the Arvan Cloud dashboard, you **MUST** use the **FULL** image path:

**Correct Format:**
```
Image Name: ghcr.io/kzfamirhossein-beep/utes-website
Tag: latest
```

**NOT:**
```
Image Name: kzfamirhossein-beep/utes-website  ❌ (This defaults to Docker Hub)
```

### Step 2: Create Image Pull Secret

You need to create a Kubernetes secret for GitHub Container Registry authentication.

#### Option A: Using Arvan Cloud Dashboard (if available)
1. Go to your Kubernetes cluster in Arvan Cloud
2. Navigate to **Secrets** or **Configurations**
3. Create a new secret with:
   - **Name**: `ghcr-secret`
   - **Type**: Docker Registry Secret
   - **Registry**: `ghcr.io`
   - **Username**: `kzfamirhossein-beep`
   - **Password**: Your GitHub Personal Access Token (with `read:packages` permission)

#### Option B: Using kubectl (if you have access)

1. **Get your GitHub Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Create a token with `read:packages` permission

2. **Create the secret:**
   ```bash
   kubectl create secret docker-registry ghcr-secret \
     --docker-server=ghcr.io \
     --docker-username=kzfamirhossein-beep \
     --docker-password=YOUR_GITHUB_TOKEN \
     --docker-email=your-email@example.com \
     --namespace=default
   ```

   Replace:
   - `YOUR_GITHUB_TOKEN` with your actual GitHub Personal Access Token
   - `your-email@example.com` with your email

3. **Verify the secret:**
   ```bash
   kubectl get secret ghcr-secret
   ```

### Step 3: Update Deployment in Arvan Cloud

1. **Edit your application/deployment** in Arvan Cloud
2. **Update the image name** to include the full path:
   ```
   ghcr.io/kzfamirhossein-beep/utes-website:latest
   ```
3. **Ensure the image pull secret is configured:**
   - The deployment should reference `ghcr-secret` in the image pull secrets section
   - If using the web interface, look for "Image Pull Secrets" or "Registry Secrets" option

### Step 4: Verify Image Exists

Before deploying, verify the image exists in GitHub Container Registry:

1. Go to: https://github.com/kzfamirhossein-beep/WebsiteUtes/packages
2. Confirm you see the `utes-website` package
3. Check that it has the `latest` tag

### Step 5: Restart/Redeploy

After updating:
1. **Restart the deployment** or **redeploy** the application
2. **Monitor the pod status:**
   ```bash
   kubectl get pods
   kubectl describe pod <pod-name>
   ```

## Quick Checklist

- [ ] Image name includes `ghcr.io` prefix: `ghcr.io/kzfamirhossein-beep/utes-website`
- [ ] Tag is set to `latest`
- [ ] Image pull secret `ghcr-secret` is created
- [ ] Secret contains correct GitHub token with `read:packages` permission
- [ ] Deployment references the image pull secret
- [ ] Image exists in GitHub Container Registry packages page
- [ ] GitHub Actions workflow completed successfully

## Common Errors and Solutions

### Error: "401 Unauthorized"
- **Cause**: Invalid or missing GitHub token
- **Fix**: Regenerate GitHub Personal Access Token with `read:packages` permission

### Error: "Image not found"
- **Cause**: Image doesn't exist or wrong image name
- **Fix**: Verify image at https://github.com/kzfamirhossein-beep/WebsiteUtes/packages

### Error: "Pulling from docker.io instead of ghcr.io"
- **Cause**: Image name missing `ghcr.io` prefix
- **Fix**: Use full path: `ghcr.io/kzfamirhossein-beep/utes-website`

## Alternative: Make Package Public (Easier but less secure)

If you want to avoid authentication issues, you can make the GitHub package public:

1. Go to: https://github.com/kzfamirhossein-beep/WebsiteUtes/packages
2. Click on the `utes-website` package
3. Go to **Package settings**
4. Scroll down to **Danger Zone**
5. Click **Change visibility** → **Make public**

**Note**: This makes your image publicly accessible without authentication.


