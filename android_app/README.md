# S.K. Enterprises Android App

Modern Android WebView wrapper for the live S.K. Enterprises website.

- Package: `com.skenterprises.prayagraj`
- Target SDK: current installed Android SDK, default `36`
- URL: `https://sk-enterprises-frontend.onrender.com/#store`
- Backup disabled so uninstall/reinstall requires login again.

Build locally:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-apk.ps1
```

The signed APK is created in `android_app\dist`.
