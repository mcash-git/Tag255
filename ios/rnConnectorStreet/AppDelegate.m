/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <TwitterKit/TWTRKit.h>
#import <RCTLinkedinLogin.h>

#define TWITTER_SCHEME @"twitterkit-b1f8neshryqkz53iikfi2ujbe"
#define FACEBOOK_SCHEME  @"fb1900097746727777"
#define LINKEDIN_SCHEME @"li86do9fqtz6q1bn"

@implementation AppDelegate
@synthesize oneSignal = _oneSignal;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  UIView *backgroundView = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] firstObject];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"rnConnectorStreet"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  //  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  rootView.backgroundColor = [UIColor clearColor];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  //  rootViewController.view = rootView;
  rootViewController.view = backgroundView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [backgroundView addSubview:rootView];
  rootView.frame = backgroundView.frame;
  
  [Fabric with:@[[Crashlytics class]]];
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                         appId:@"ebe363fd-fb35-43e5-8a77-4df6adc02b63"];
  return YES;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  NSLog(@"Sheme: %@ ", [url scheme]);
  if ([[url scheme] isEqualToString:TWITTER_SCHEME])
    return [[Twitter sharedInstance] application:application openURL:url options:options];
  
  if ([[url scheme] isEqualToString:FACEBOOK_SCHEME])
    return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                          openURL:url
                                                sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                       annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
  
  if ([[url scheme] isEqualToString:LINKEDIN_SCHEME])
    return [RCTLinkedinLogin application:application openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
  
  return YES;
}

@end
