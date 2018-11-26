import { BottomBarBase } from '../bottombar.base';
import { BottomBarItem } from '../../bottombar-item/ios/bottombar-item';
export declare class BottomBarControllerDelegate extends NSObject implements UITabBarControllerDelegate {
    static ObjCProtocols: {
        prototype: UITabBarControllerDelegate;
    }[];
    private _owner;
    static initWithOwner(owner: WeakRef<BottomBar>): BottomBarControllerDelegate;
    tabBarControllerDidSelectViewController(tabBarController: UITabBarController, viewController: UIViewController): void;
}
export declare class BottomBar extends BottomBarBase {
    _tabBarController: UITabBarController;
    private _delegate;
    items: BottomBarItem[];
    nativeView: UITabBar;
    readonly ios: UITabBar;
    createNativeView(): UITabBar;
    _addChildFromBuilder(name: string, value: BottomBarItem): void;
    initNativeView(): void;
    private createItem(item, id);
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
}
