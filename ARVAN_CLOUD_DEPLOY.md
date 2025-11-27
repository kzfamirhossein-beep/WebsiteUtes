# Quick Guide: Deploy to Arvan Cloud

## Image Information

- **Registry**: GitHub Container Registry (ghcr.io)
- **Image Name**: `ghcr.io/kzfamirhossein-beep/utes-website`
- **Tag**: `latest`
- **Username**: `kzfamirhossein-beep`
- **Password**: Your GitHub Personal Access Token (with `read:packages` permission)

## Steps to Deploy

### 1. Verify Image is Built
- Go to: https://github.com/kzfamirhossein-beep/WebsiteUtes/packages
- Check that the package `utes-website` exists and has been built successfully
- Or check Actions tab to see if the workflow completed

### 2. Get GitHub Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "Arvan Cloud GHCR Access"
4. Select scope: `read:packages`
5. Generate and copy the token

### 3. Deploy in Arvan Cloud Dashboard

1. **Navigate to Container → Create Application**

2. **Select "Docker Image (داکر ایمیج)" section**

3. **Check "Private Registry (رجیستری خصوصی)"**

4. **Enter the following:**
   
   **Option 1 (Try this first - Full registry path):**
   ```
   Image Name: ghcr.io/kzfamirhossein-beep/utes-website
   Tag: latest
   Username: kzfamirhossein-beep
   Password: [Paste your GitHub Personal Access Token]
   ```
   
   **Option 2 (If Option 1 shows "invalid image" error):**
   ```
   Image Name: kzfamirhossein-beep/utes-website
   Registry URL: ghcr.io
   Tag: latest
   Username: kzfamirhossein-beep
   Password: [Paste your GitHub Personal Access Token]
   ```
   
   **Note:** Some platforms require the registry URL separately. If Arvan Cloud has a separate "Registry URL" field, use Option 2.

5. **Configure Application:**
   - Port: `3000`
   - Environment: Production
   - Set resource limits as needed

6. **Click "Start (شروع)"**

### 4. Access Your Application
- Arvan Cloud will provide a service URL after deployment
- Your website will be accessible at that URL

## Troubleshooting

- **"ایمیج نامعتبر است" (Image is invalid) error**:
  1. **Verify the image is published**: Go to https://github.com/kzfamirhossein-beep/WebsiteUtes/packages and confirm the package exists
  2. **Try different image name formats**:
     - Full path: `ghcr.io/kzfamirhossein-beep/utes-website`
     - Without registry: `kzfamirhossein-beep/utes-website` (if there's a separate registry field)
  3. **Check if the image is private**: GitHub Container Registry images are private by default. Make sure:
     - Your GitHub token has `read:packages` permission
     - The package visibility allows access (check package settings on GitHub)
  4. **Wait for build to complete**: If the workflow just finished, wait a few minutes for the image to be fully available

- **Image not found**: Make sure GitHub Actions workflow completed successfully
- **Authentication failed**: Verify your GitHub token has `read:packages` permission
- **Port issues**: Ensure port 3000 is exposed and accessible
- **Application not starting**: Check logs in Arvan Cloud dashboard

## Updating the Application

When you push new changes:
1. GitHub Actions will automatically build a new image
2. In Arvan Cloud, restart the application or redeploy with the same image name and tag
3. The new image will be pulled automatically

