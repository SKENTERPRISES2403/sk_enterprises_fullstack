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

function Save-CroppedPng {
    param(
        [System.Drawing.Image]$SourceImage,
        [System.Drawing.Rectangle]$Crop,
        [string]$OutputPath,
        [int]$CanvasSize,
        [double]$Padding = 0.94
    )

    $bitmap = New-Object System.Drawing.Bitmap $CanvasSize, $CanvasSize
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::White)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $scale = [Math]::Min(($CanvasSize * $Padding) / $Crop.Width, ($CanvasSize * $Padding) / $Crop.Height)
    $drawWidth = [int]($Crop.Width * $scale)
    $drawHeight = [int]($Crop.Height * $scale)
    $drawX = [int](($CanvasSize - $drawWidth) / 2)
    $drawY = [int](($CanvasSize - $drawHeight) / 2)
    $destination = New-Object System.Drawing.Rectangle $drawX, $drawY, $drawWidth, $drawHeight

    $graphics.DrawImage($SourceImage, $destination, $Crop, [System.Drawing.GraphicsUnit]::Pixel)
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

$Densities = @(
    @{ Name = "mipmap-mdpi"; Size = 48 },
    @{ Name = "mipmap-hdpi"; Size = 72 },
    @{ Name = "mipmap-xhdpi"; Size = 96 },
    @{ Name = "mipmap-xxhdpi"; Size = 144 },
    @{ Name = "mipmap-xxxhdpi"; Size = 192 }
)
$SourceImage = [System.Drawing.Image]::FromFile($LogoPath)
$IconCrop = New-Object System.Drawing.Rectangle 170, 70, 920, 700
foreach ($density in $Densities) {
    $dir = Join-Path $ResDir $density.Name
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    foreach ($name in @("ic_launcher.png", "ic_launcher_round.png")) {
        Save-CroppedPng -SourceImage $SourceImage -Crop $IconCrop -OutputPath (Join-Path $dir $name) -CanvasSize $density.Size
    }
}

$DrawableDir = Join-Path $ResDir "drawable-nodpi"
New-Item -ItemType Directory -Force -Path $DrawableDir | Out-Null
$SplashCrop = New-Object System.Drawing.Rectangle 180, 70, 900, 1080
Save-CroppedPng -SourceImage $SourceImage -Crop $SplashCrop -OutputPath (Join-Path $DrawableDir "splash_logo.png") -CanvasSize 512 -Padding 0.92
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

function New-SigningPassword {
    $chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"
    $bytes = New-Object byte[] 36
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $rng.Dispose()
    return -join ($bytes | ForEach-Object { $chars[[int]$_ % $chars.Length] })
}

$SigningDir = Join-Path $ProjectRoot "keystore"
New-Item -ItemType Directory -Force -Path $SigningDir | Out-Null

if ($Configuration.ToLowerInvariant() -eq "debug") {
    $SigningKeystore = Join-Path $SigningDir "debug.keystore"
    $SigningAlias = "androiddebugkey"
    $SigningStorePass = "android"
    $SigningKeyPass = "android"

    if (!(Test-Path -LiteralPath $SigningKeystore)) {
        & $Keytool -genkeypair -v `
            -storepass $SigningStorePass `
            -keypass $SigningKeyPass `
            -keystore $SigningKeystore `
            -alias $SigningAlias `
            -keyalg RSA `
            -keysize 2048 `
            -validity 10000 `
            -dname "CN=Android Debug,O=Android,C=US"
        if ($LASTEXITCODE -ne 0) { throw "debug keystore generation failed" }
    }
} else {
    $SigningPropertiesFile = Join-Path $SigningDir "release-signing.properties"
    if (!(Test-Path -LiteralPath $SigningPropertiesFile)) {
        $generatedPassword = New-SigningPassword
        @(
            "storeFile=sk-enterprises-release.jks",
            "storePassword=$generatedPassword",
            "keyAlias=skenterprisesrelease",
            "keyPassword=$generatedPassword"
        ) | Set-Content -LiteralPath $SigningPropertiesFile -Encoding ASCII
    }

    $SigningProperties = ConvertFrom-StringData (Get-Content -LiteralPath $SigningPropertiesFile -Raw)
    $SigningStoreFile = $SigningProperties.storeFile
    if ([string]::IsNullOrWhiteSpace($SigningStoreFile)) { $SigningStoreFile = "sk-enterprises-release.jks" }
    if ([System.IO.Path]::IsPathRooted($SigningStoreFile)) {
        $SigningKeystore = $SigningStoreFile
    } else {
        $SigningKeystore = Join-Path $SigningDir $SigningStoreFile
    }
    $SigningAlias = $SigningProperties.keyAlias
    $SigningStorePass = $SigningProperties.storePassword
    $SigningKeyPass = $SigningProperties.keyPassword

    if ([string]::IsNullOrWhiteSpace($SigningAlias) -or [string]::IsNullOrWhiteSpace($SigningStorePass) -or [string]::IsNullOrWhiteSpace($SigningKeyPass)) {
        throw "Release signing properties are incomplete: $SigningPropertiesFile"
    }

    if (!(Test-Path -LiteralPath $SigningKeystore)) {
        & $Keytool -genkeypair -v `
            -storetype PKCS12 `
            -storepass $SigningStorePass `
            -keypass $SigningKeyPass `
            -keystore $SigningKeystore `
            -alias $SigningAlias `
            -keyalg RSA `
            -keysize 2048 `
            -validity 10000 `
            -dname "CN=S.K. Enterprises,OU=Mobile,O=S.K. Enterprises,L=Prayagraj,ST=Uttar Pradesh,C=IN"
        if ($LASTEXITCODE -ne 0) { throw "release keystore generation failed" }
    }
}

Write-Host "Signing APK with $Configuration keystore: $SigningKeystore"

& $ApkSigner sign `
    --ks $SigningKeystore `
    --ks-key-alias $SigningAlias `
    --ks-pass "pass:$SigningStorePass" `
    --key-pass "pass:$SigningKeyPass" `
    --out $FinalApk `
    $AlignedApk
if ($LASTEXITCODE -ne 0) { throw "apksigner failed" }

& $ApkSigner verify --verbose --print-certs $FinalApk
if ($LASTEXITCODE -ne 0) { throw "APK signature verify failed" }

Write-Host "Built APK: $FinalApk"
