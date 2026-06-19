param(
    [string]$Configuration = "release"
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ProjectRoot
$SdkRoot = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$BuildTools = Join-Path $SdkRoot "build-tools\37.0.0"
$Platform = Join-Path $SdkRoot "platforms\android-36.1"
$AndroidJar = Join-Path $Platform "android.jar"
$Aapt2 = Join-Path $BuildTools "aapt2.exe"
$D8 = Join-Path $BuildTools "d8.bat"
$ZipAlign = Join-Path $BuildTools "zipalign.exe"
$ApkSigner = Join-Path $BuildTools "apksigner.bat"
$JavaHome = "C:\Program Files\Android\Android Studio\jbr"
$Javac = Join-Path $JavaHome "bin\javac.exe"
$Keytool = Join-Path $JavaHome "bin\keytool.exe"
$env:JAVA_HOME = $JavaHome
$env:PATH = (Join-Path $JavaHome "bin") + ";" + $env:PATH

foreach ($tool in @($AndroidJar, $Aapt2, $D8, $ApkSigner, $Javac, $Keytool)) {
    if (!(Test-Path -LiteralPath $tool)) {
        throw "Missing Android build tool: $tool"
    }
}

$BuildDir = Join-Path $ProjectRoot "build"
$DistDir = Join-Path $ProjectRoot "dist"
$ResDir = Join-Path $ProjectRoot "res"
$GenDir = Join-Path $BuildDir "gen"
$ClassesDir = Join-Path $BuildDir "classes"
$DexDir = Join-Path $BuildDir "dex"
$AndroidCompileJar = Join-Path $BuildDir "android.jar"
$CompiledZip = Join-Path $BuildDir "compiled-resources.zip"
$UnsignedApk = Join-Path $BuildDir "unsigned.apk"
$ApkWithDex = Join-Path $BuildDir "with-dex.apk"
$AlignedApk = Join-Path $BuildDir "aligned.apk"
$FinalApk = Join-Path $DistDir "S.K. Enterprises modern.apk"

Remove-Item -LiteralPath $BuildDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $BuildDir, $DistDir, $GenDir, $ClassesDir, $DexDir | Out-Null
Copy-Item -LiteralPath $AndroidJar -Destination $AndroidCompileJar -Force

Add-Type -AssemblyName System.Drawing
$LogoPath = Join-Path $RepoRoot "frontend\public\assets\sk-logo.png"
$Densities = @(
    @{ Name = "mipmap-mdpi"; Size = 48 },
    @{ Name = "mipmap-hdpi"; Size = 72 },
    @{ Name = "mipmap-xhdpi"; Size = 96 },
    @{ Name = "mipmap-xxhdpi"; Size = 144 },
    @{ Name = "mipmap-xxxhdpi"; Size = 192 }
)
$SourceImage = [System.Drawing.Image]::FromFile($LogoPath)
foreach ($density in $Densities) {
    $dir = Join-Path $ResDir $density.Name
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    foreach ($name in @("ic_launcher.png", "ic_launcher_round.png")) {
        $bitmap = New-Object System.Drawing.Bitmap $density.Size, $density.Size
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($SourceImage, 0, 0, $density.Size, $density.Size)
        $bitmap.Save((Join-Path $dir $name), [System.Drawing.Imaging.ImageFormat]::Png)
        $graphics.Dispose()
        $bitmap.Dispose()
    }
}
$SourceImage.Dispose()

& $Aapt2 compile --dir $ResDir -o $CompiledZip
if ($LASTEXITCODE -ne 0) { throw "aapt2 compile failed" }

& $Aapt2 link `
    -o $UnsignedApk `
    -I $AndroidJar `
    --manifest (Join-Path $ProjectRoot "AndroidManifest.xml") `
    --java $GenDir `
    --min-sdk-version 24 `
    --target-sdk-version 36 `
    $CompiledZip
if ($LASTEXITCODE -ne 0) { throw "aapt2 link failed" }

$JavaFiles = @()
$JavaFiles += Get-ChildItem -Path (Join-Path $ProjectRoot "src") -Recurse -Filter *.java
$JavaFiles += Get-ChildItem -Path $GenDir -Recurse -Filter *.java
& $Javac -encoding UTF-8 -source 8 -target 8 -bootclasspath $AndroidCompileJar -d $ClassesDir @($JavaFiles.FullName)
if ($LASTEXITCODE -ne 0) { throw "javac failed" }

$ClassFiles = Get-ChildItem -Path $ClassesDir -Recurse -Filter *.class
& $D8 --lib $AndroidCompileJar --min-api 24 --output $DexDir @($ClassFiles.FullName)
if ($LASTEXITCODE -ne 0) { throw "d8 failed" }

Copy-Item -LiteralPath $UnsignedApk -Destination $ApkWithDex -Force
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$Zip = [System.IO.Compression.ZipFile]::Open($ApkWithDex, [System.IO.Compression.ZipArchiveMode]::Update)
$ExistingDex = $Zip.GetEntry("classes.dex")
if ($ExistingDex) { $ExistingDex.Delete() }
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($Zip, (Join-Path $DexDir "classes.dex"), "classes.dex") | Out-Null
$Zip.Dispose()

if (Test-Path -LiteralPath $ZipAlign) {
    & $ZipAlign -f -p 4 $ApkWithDex $AlignedApk
    if ($LASTEXITCODE -ne 0) { throw "zipalign failed" }
} else {
    Copy-Item -LiteralPath $ApkWithDex -Destination $AlignedApk -Force
}

$DebugDir = Join-Path $ProjectRoot "keystore"
$DebugKeystore = Join-Path $DebugDir "debug.keystore"
if (!(Test-Path -LiteralPath $DebugKeystore)) {
    New-Item -ItemType Directory -Force -Path $DebugDir | Out-Null
    & $Keytool -genkeypair -v `
        -storepass android `
        -keypass android `
        -keystore $DebugKeystore `
        -alias androiddebugkey `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -dname "CN=Android Debug,O=Android,C=US"
    if ($LASTEXITCODE -ne 0) { throw "debug keystore generation failed" }
}

& $ApkSigner sign `
    --ks $DebugKeystore `
    --ks-key-alias androiddebugkey `
    --ks-pass pass:android `
    --key-pass pass:android `
    --out $FinalApk `
    $AlignedApk
if ($LASTEXITCODE -ne 0) { throw "apksigner failed" }

& $ApkSigner verify --verbose --print-certs $FinalApk
if ($LASTEXITCODE -ne 0) { throw "APK signature verify failed" }

Write-Host "Built APK: $FinalApk"
