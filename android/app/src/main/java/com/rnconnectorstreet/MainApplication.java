package com.rnconnectorstreet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.goldenowl.twittersignin.TwitterSigninPackage;
import com.RNTextInputMask.RNTextInputMaskPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.beefe.picker.PickerViewPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.rnnestedscrollview.RNNestedScrollViewPackage;
import net.jodybrewster.linkedinlogin.RNLinkedinLoginPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.smixx.fabric.FabricPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.facebook.CallbackManager;
import android.support.multidex.MultiDex;
import android.content.Context;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      mCallbackManager = new CallbackManager.Factory().create();
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new VectorIconsPackage(),
            new TwitterSigninPackage(),
            new RNTextInputMaskPackage(),
            new RNSpinkitPackage(),
            new PickerViewPackage(),
            new ReactNativeOneSignalPackage(),
            new RNNestedScrollViewPackage(),
            new RNLinkedinLoginPackage(),
            new LinearGradientPackage(),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
            new PickerPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new FBSDKPackage(mCallbackManager),
            new FastImageViewPackage(),
            new FabricPackage(),
            new ReactNativeContacts()
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

  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this);
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
