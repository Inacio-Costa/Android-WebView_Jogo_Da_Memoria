package webview.android2018.com.webview;

import android.content.DialogInterface;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.InputType;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    public WebView webView;
    private boolean click = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = (WebView) findViewById(R.id.webView);
        webView.setVisibility(View.INVISIBLE);
        webView.setWebChromeClient(new WebChromeClient());
// Habilita o JS
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
// Garante que usará o WebView e não o navegador padrão
        webView.setWebViewClient(new WebViewClient(){
            // Callback que determina quando o front-end terminou de ser carregado
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                ImageView imageView = (ImageView) findViewById(R.id.imageView);
                imageView.setVisibility(View.INVISIBLE);
                webView.setVisibility(View.VISIBLE);
            }
        });
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");
        webView.loadUrl("file:///android_asset/index.html");
    }

    // Possibilita o uso do botão voltar
    @Override
    public void onBackPressed() {
        if(webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    // Executa um comando JavaScript
    public void runJavaScript(final String jsCode){
        this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                int SDK_INT = android.os.Build.VERSION.SDK_INT;
                if (SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
                    webView.evaluateJavascript(jsCode, null);
                } else {
                    webView.loadUrl("javascript:" + jsCode);
                }
            }
        });
    }

    // Interface para binding Javascript -> Java
    public class WebAppInterface {
        MainActivity mainActivity;
        public WebAppInterface(MainActivity activity) {
            this.mainActivity = activity;
        }
        @JavascriptInterface
        public void androidToast(String msg) {
            Toast.makeText(mainActivity, msg, Toast.LENGTH_SHORT).show();
// Chama uma função do JavaScript
            runJavaScript("oculta_botao();");
        }

        @JavascriptInterface
        public String androidAlertDialog(String titulo, String mensagem, String textoButtonPositivo, String textoButtonNegativo){
            return alert(titulo, mensagem, textoButtonPositivo, textoButtonNegativo);
        }



    }

    private String alert(String titulo, String mensagem, String textoButtonPositivo, String textoButtonNegativo){

        AlertDialog.Builder alertDialog = new AlertDialog.Builder(MainActivity.this);
        alertDialog.setTitle(titulo);
        alertDialog.setMessage(mensagem);

        alertDialog.setCancelable(false);

        //Nesse caso estou adicionando um campo de texto no alertDialog.Builder mais
        // poderia ser adicionado qualquer outro componente.
        final EditText editText = new EditText(MainActivity.this);
        editText.setInputType(InputType.TYPE_CLASS_TEXT);
        alertDialog.setView(editText);

        alertDialog.setPositiveButton(textoButtonPositivo, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

            }
        });

        alertDialog.setNegativeButton(textoButtonNegativo, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                click = false;
            }
        });

        if(!click)
            return null;

        alertDialog.create();
        alertDialog.show();
        return editText.getText().toString();
    }

    private Boolean clica(Boolean button){
        if(!button){
            return false;
        }
        return true;
    }
}
