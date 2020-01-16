package com.interiord;

import android.app.Application;
import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage;
import com.facebook.react.ReactApplication;
import com.reactlibrary.TfliteReactNativePackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.rnfs.RNFSPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.brentvatne.react.ReactVideoPackage;
//import cl.json.ShareApplication;
import com.swmansion.rnscreens.RNScreensPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.wix.RNCameraKit.RNCameraKitPackage;
import com.viromedia.bridge.ReactViroPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new TfliteReactNativePackage(),
            new FastImageViewPackage(),
            new RNFSPackage(),
            new LottiePackage(),
            new ReactVideoPackage(),
           new ReactViroPackage(ReactViroPackage.ViroPlatform.valueOf(BuildConfig.VR_PLATFORM)),
            new RNScreensPackage(),
            new SvgPackage(),
            new VectorIconsPackage(),
         //   new NetInfoPackage(),
            new AsyncStoragePackage(),
            new ReanimatedPackage(),
            new RNGestureHandlerPackage(),
            new RNCameraKitPackage(),
            new AndroidKeyboardAdjustPackage()
            
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
