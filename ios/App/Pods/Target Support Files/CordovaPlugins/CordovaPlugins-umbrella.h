#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "AppDelegate+nativepagetransitions.h"
#import "NativePageTransitions.h"
#import "BLECentralPlugin.h"
#import "BLECommandContext.h"
#import "CBPeripheral+Extensions.h"
#import "CTCrop.h"
#import "PECropRectView.h"
#import "PECropView.h"
#import "PECropViewController.h"
#import "PEResizeControl.h"
#import "UIImage+PECrop.h"
#import "CDVDevice.h"
#import "CGPDFDocument.h"
#import "ReaderConstants.h"
#import "ReaderContentPage.h"
#import "ReaderContentTile.h"
#import "ReaderContentView.h"
#import "ReaderDocument.h"
#import "ReaderDocumentOutline.h"
#import "ReaderMainPagebar.h"
#import "ReaderMainToolbar+SDVReaderMainToolbarPassThrough.h"
#import "ReaderMainToolbar.h"
#import "ReaderThumbCache.h"
#import "ReaderThumbFetch.h"
#import "ReaderThumbQueue.h"
#import "ReaderThumbRender.h"
#import "ReaderThumbRequest.h"
#import "ReaderThumbsView.h"
#import "ReaderThumbView.h"
#import "ReaderViewController+SDVReaderViewControllerPassThrough.h"
#import "ReaderViewController.h"
#import "SDVReaderContentViewDoublePage.h"
#import "SDVReaderMainPagebar.h"
#import "SDVReaderMainToolbar.h"
#import "SDVReaderViewController.h"
#import "SDVThumbsMainToolbar.h"
#import "SDVThumbsViewController.h"
#import "SitewaertsDocumentViewer.h"
#import "ThumbsMainToolbar+SDVThumbsMainToolbarPassThrough.h"
#import "ThumbsMainToolbar.h"
#import "ThumbsViewController+SDVThumbsViewControllerPassThrough.h"
#import "ThumbsViewController.h"
#import "UIXToolbarView.h"
#import "CDVAssetLibraryFilesystem.h"
#import "CDVFile.h"
#import "CDVLocalFilesystem.h"
#import "IdfaPlugin.h"
#import "FileUtility.h"
#import "InAppPurchase.h"
#import "SKProduct+LocalizedPrice.h"
#import "SKProductDiscount+LocalizedPrice.h"
#import "CDVOrientation.h"
#import "NSString+SSURLEncoding.h"
#import "SocialSharing.h"

FOUNDATION_EXPORT double CordovaPluginsVersionNumber;
FOUNDATION_EXPORT const unsigned char CordovaPluginsVersionString[];

