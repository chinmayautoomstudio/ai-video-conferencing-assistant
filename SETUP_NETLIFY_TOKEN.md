# 🔧 Netlify API Token Setup

## ❌ **Issue Detected**

The Netlify MCP server is not working because the `NETLIFY_AUTH_TOKEN` environment variable is not set in your current session.

## 🚀 **Quick Fix - Set the Token**

### **Option 1: Set for Current Session (Temporary)**

Run this command in your PowerShell terminal:

```powershell
$env:NETLIFY_AUTH_TOKEN = "your_actual_netlify_token_here"
```

**Replace `your_actual_netlify_token_here` with your real Netlify API token.**

### **Option 2: Set Permanently (Recommended)**

```powershell
[Environment]::SetEnvironmentVariable("NETLIFY_AUTH_TOKEN", "your_actual_netlify_token_here", "User")
```

## 🔍 **How to Get Your Netlify API Token**

1. **Go to**: [https://app.netlify.com/user/applications#personal-access-tokens](https://app.netlify.com/user/applications#personal-access-tokens)
2. **Click**: "New access token"
3. **Name it**: `AI Video Conference Assistant`
4. **Copy the token** (starts with something like `nfp_...`)

## ✅ **After Setting the Token**

1. **Set the environment variable** using one of the methods above
2. **Restart Cursor completely**
3. **Open a new chat** and test with: "Check my Netlify sites"

## 🧪 **Test Commands**

After setting up, you should be able to use these MCP commands:

- `mcp_netlify_list_sites` - List all your Netlify sites
- `mcp_netlify_get_site` - Get details about a specific site
- `mcp_netlify_list_deploys` - List deployments for a site
- `mcp_netlify_get_deploy` - Get details about a specific deployment

## 🔧 **Troubleshooting**

### **If still not working:**

1. **Verify token is set**:
   ```powershell
   echo $env:NETLIFY_AUTH_TOKEN
   ```

2. **Check token format**:
   - Should start with `nfp_`
   - Should be about 40+ characters long

3. **Restart Cursor**:
   - Close completely
   - Reopen and try again

## 📋 **Next Steps**

1. **Get your Netlify API token** from the dashboard
2. **Set the environment variable** using PowerShell
3. **Restart Cursor**
4. **Test the MCP connection**

**Once this is set up, you'll have full Netlify integration in Cursor!** 🚀
