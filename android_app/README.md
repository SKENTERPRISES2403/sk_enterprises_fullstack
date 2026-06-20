# S.K. Enterprises Android App

Modern Android WebView wrapper for the live S.K. Enterprises website.

- Package: `com.skenterprises.prayagraj`
- Target SDK: current installed Android SDK, default `36`
- Primary URL: `https://sk-enterprises-frontend.onrender.com/?native_app=1#store`
- Custom domain can be restored after `skenterprisesprayagraj.com` DNS is live.
- Backup disabled so uninstall/reinstall requires login again.
- Release-signed by default with a local keystore in `android_app\keystore`.
- Custom no-internet screen with Retry is shown if both URLs fail.
- Launcher icon is simplified for phone home screens; splash logo is optimized WebP.

Build locally:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-apk.ps1
```

The signed APK is created in `android_app\dist`.

Important: keep a backup of `android_app\keystore\sk-enterprises-release.jks`
and `android_app\keystore\release-signing.properties`. Future app updates must
use the same release keystore.
