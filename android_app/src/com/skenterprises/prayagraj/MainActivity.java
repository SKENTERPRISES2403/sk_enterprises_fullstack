package com.skenterprises.prayagraj;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.webkit.WebResourceError;
import android.webkit.WebResourceResponse;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private static final String CUSTOM_START_URL = "https://skenterprisesprayagraj.com/?native_app=1#store";
    private static final String FALLBACK_START_URL = "https://sk-enterprises-frontend.onrender.com/?native_app=1#store";
    private WebView webView;
    private FrameLayout rootLayout;
    private ImageView splashLogo;
    private View offlineView;
    private boolean pageLoaded = false;
    private boolean minimumSplashShown = false;
    private boolean fallbackAttempted = false;
    private boolean currentLoadFailed = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(10, 37, 64));
        getWindow().setNavigationBarColor(Color.rgb(10, 37, 64));

        rootLayout = new FrameLayout(this);
        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        WebSettings settings = webView.getSettings();
        settings.setUserAgentString(settings.getUserAgentString() + " SKEnterprisesApp/1.0");
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        }

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                currentLoadFailed = false;
                hideOfflineView();
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleExternalUrl(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleExternalUrl(Uri.parse(url));
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pageLoaded = true;
                hideSplashWhenReady();
                if (!currentLoadFailed) {
                    hideOfflineView();
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    handleMainFrameLoadFailure(request.getUrl());
                }
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
                if (request.isForMainFrame()) {
                    handleMainFrameLoadFailure(request.getUrl());
                }
            }
        });

        rootLayout.addView(webView);
        offlineView = createOfflineView();
        offlineView.setVisibility(View.GONE);
        rootLayout.addView(offlineView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        splashLogo = new ImageView(this);
        splashLogo.setImageResource(R.drawable.splash_logo);
        splashLogo.setAdjustViewBounds(true);
        splashLogo.setScaleType(ImageView.ScaleType.FIT_CENTER);

        FrameLayout splashLayer = new FrameLayout(this);
        splashLayer.setBackgroundColor(Color.WHITE);
        splashLayer.setTag("splash");
        splashLayer.setClickable(true);
        splashLayer.setFocusable(true);
        splashLayer.addView(splashLogo, new FrameLayout.LayoutParams(dp(330), dp(330), Gravity.CENTER));
        rootLayout.addView(splashLayer, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        setContentView(rootLayout);
        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
            @Override
            public void run() {
                minimumSplashShown = true;
                hideSplashWhenReady();
            }
        }, 1300);
        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
            @Override
            public void run() {
                pageLoaded = true;
                minimumSplashShown = true;
                hideSplashWhenReady();
            }
        }, 4500);
        webView.loadUrl(CUSTOM_START_URL);
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private void hideSplashWhenReady() {
        if (!pageLoaded || !minimumSplashShown || rootLayout == null) return;
        for (int i = rootLayout.getChildCount() - 1; i >= 0; i--) {
            if ("splash".equals(rootLayout.getChildAt(i).getTag())) {
                rootLayout.removeViewAt(i);
                break;
            }
        }
    }

    private View createOfflineView() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setPadding(dp(28), dp(28), dp(28), dp(28));
        layout.setBackgroundColor(Color.WHITE);

        TextView title = new TextView(this);
        title.setText("No internet connection");
        title.setTextColor(Color.rgb(10, 37, 64));
        title.setTextSize(24);
        title.setGravity(Gravity.CENTER);
        title.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);

        TextView message = new TextView(this);
        message.setText("Please check your network and try again.");
        message.setTextColor(Color.rgb(85, 98, 115));
        message.setTextSize(15);
        message.setGravity(Gravity.CENTER);
        message.setPadding(0, dp(12), 0, dp(22));

        Button retry = new Button(this);
        retry.setText("Retry");
        retry.setTextColor(Color.WHITE);
        retry.setBackgroundColor(Color.rgb(244, 123, 32));
        retry.setPadding(dp(26), dp(8), dp(26), dp(8));
        retry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                retryLoad();
            }
        });

        layout.addView(title, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));
        layout.addView(message, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));
        layout.addView(retry, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                dp(48)
        ));
        return layout;
    }

    private void retryLoad() {
        fallbackAttempted = false;
        hideOfflineView();
        pageLoaded = false;
        webView.loadUrl(CUSTOM_START_URL);
    }

    private void handleMainFrameLoadFailure(Uri uri) {
        currentLoadFailed = true;
        if (!fallbackAttempted && isCustomHost(uri)) {
            fallbackAttempted = true;
            webView.loadUrl(FALLBACK_START_URL);
            return;
        }
        showOfflineView();
    }

    private boolean isCustomHost(Uri uri) {
        String host = uri == null ? null : uri.getHost();
        return host != null && (host.equals("skenterprisesprayagraj.com") || host.endsWith(".skenterprisesprayagraj.com"));
    }

    private void showOfflineView() {
        pageLoaded = true;
        hideSplashWhenReady();
        if (offlineView != null) offlineView.setVisibility(View.VISIBLE);
    }

    private void hideOfflineView() {
        if (offlineView != null) offlineView.setVisibility(View.GONE);
    }

    private boolean handleExternalUrl(Uri uri) {
        String host = uri.getHost();
        if (host == null) return false;
        boolean allowedHost =
                host.equals("sk-enterprises-frontend.onrender.com")
                        || host.equals("sk-enterprises-api.onrender.com")
                        || host.equals("skenterprisesprayagraj.com")
                        || host.endsWith(".skenterprisesprayagraj.com");
        if (allowedHost) return false;
        startActivity(new Intent(Intent.ACTION_VIEW, uri));
        return true;
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
