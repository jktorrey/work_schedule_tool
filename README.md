# 1. Clone the project from GitLab
On your Mac:

> git clone https://gitlab.com/username/repository.git
> cd repository

Or in Xcode:
-  Open Xcode
-  File → Clone Repository
-  Paste the GitLab repo URL
-  Authenticate if needed (SSH key or access token)

# 2. Open the project in Xcode
Depending on the project, open one of these:

-  .xcodeproj
-  .xcworkspace (very important if the app uses CocoaPods)

If there is a .xcworkspace, always open that instead of .xcodeproj.

# 3. Install dependencies (if required)
Check the project for dependency managers:
- CocoaPods

If there’s a Podfile:
> sudo gem install cocoapods   # only once
> pod install
> Swift Package Manager (SPM)

Xcode usually resolves these automatically
Or go to File → Packages → Resolve Package Versions

# 4. Connect your iPhone
-  Plug your iPhone into your Mac via cable
-  Unlock the phone
-  On the phone, tap Trust This Computer

In Xcode:
-  Top toolbar → device selector
-  Choose your iPhone instead of a simulator

# 5. Set up Apple Developer signing
-  Add your Apple ID
-  Xcode → Settings → Accounts
-  Add your Apple ID
  -A free Apple ID is enough for testing on your own device.

# 6. Configure Signing & Capabilities
In Xcode:
-  Select the project (blue icon)
-  Select the app target
-  Go to Signing & Capabilities
-  Set:
  -  Team → your Apple ID
  -  Bundle Identifier → must be unique
  -  Example: com.yourname.myapp.test
  -  Check:
    -  ✅ “Automatically manage signing”

Xcode will create a provisioning profile for you.

# 7. Fix common build issues
Before running, watch for:
-  ❌ “Bundle identifier already in use” → change it
-  ❌ Missing permissions (camera, photos, etc.) → add to Info.plist
-  ❌ iOS version too high → lower Deployment Target to match your phone

# 8. Run the app on your iPhone
-  Select your iPhone as the destination
-  Press ▶ Run (or Cmd + R)

First time only:
-  On your iPhone:
  -  Settings → General → VPN & Device Management
  -  Trust your developer profile
  -  Then relaunch the app.

# 9. Debug & iterate
Logs → Xcode console
UI debugging → Xcode’s visual debugger
Hot changes → re-run (Cmd + R)

# 10. (Optional) Enable GitLab CI awareness
If the project uses GitLab CI:
-  Local testing does not require CI
-  CI is only for automated builds/tests
-  You can mirror CI locally by running:
  -  xcodebuild test

Common gotchas
-  Always open .xcworkspace if it exists
-  Bundle ID must be unique
-  Free Apple IDs require re-signing every 7 days
-  Simulator ≠ real device (permissions, camera, Bluetooth differ)
