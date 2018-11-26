import {
    BottomBarBase,
    items,
    androidLabelVisibility,
    inactiveTintColor,
    activeTintColor,
    barBackgroundColor
} from '../bottombar.base';
import { Color } from 'tns-core-modules/color/color';
import { BottomBarItem } from '../../bottombar-item/android/bottombar-item';
import { createIconsStateListDrawable } from '../../utils/android/utils';
import { LABEL_VISIBILITY } from './label-visibility.enum';
// Types declaration
export declare type BottomNavigationViewType = android.support.design.widget.BottomNavigationView;
export declare type MenuItemType = android.view.MenuItem;
export declare type MenuType = android.view.Menu;
// Classes shortcuts
const { BottomNavigationView } = android.support.design.widget;
const { Menu } = android.view;
const { ColorStateList } = android.content.res;

export class BottomBar extends BottomBarBase {
    nativeView: BottomNavigationViewType;
    items: BottomBarItem[];
    get android() {
        return this.nativeView;
    }

    public createNativeView(): BottomNavigationViewType {
        const bottomBar: BottomNavigationViewType = new BottomNavigationView(this._context);

        const owner = new WeakRef(this);
        bottomBar.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener({
            onNavigationItemSelected: (item: MenuItemType) => {
                owner.get().onTabSelected(item.getItemId());
                return true;
            }
        }));

        // Have to instantiate the bottomBar to create children that's why children creation 
        // is not done in the _addChildFromBuilder like in ios
        this.createItems(bottomBar);

        // Typings don't match design API >28.0
        // (bottomBar as any).setLabelVisibilityMode(LABEL_VISIBILITY.AUTO);

        return bottomBar;
    }

    public _addChildFromBuilder(name: string, value: BottomBarItem) {
        if (name === 'BottomBarItem') {
            this.items.push(value);
        }
    }

    initNativeView() {
        super.initNativeView();
    } 

    private createItem(item: BottomBarItem, id: number, bottomBar: BottomNavigationViewType): MenuItemType {
        const nativeItem: MenuItemType = bottomBar.getMenu().add(Menu.NONE, id, Menu.NONE, '');
        
        if (item._icon && item._title) {
            item.index = id;

            nativeItem.setTitle(item._title);

            nativeItem
                .setIcon(createIconsStateListDrawable(item._icon, item._checkedIcon));

            if (item._badge) {
                item.setViewBadge(bottomBar, this._context);
            }
            
        }
        return nativeItem;
    }

    protected createItems(bottomNavigationView: BottomNavigationViewType) {
        const menu: MenuType  = bottomNavigationView.getMenu();
        
        if (menu.size() > 0) {
            menu.clear();
        }

        this.items.forEach((item: BottomBarItem, index: number) => {
            const menuItem = this.createItem(item, index, bottomNavigationView);
            item.setNativeView(menuItem);
        });
    }
    

    private setItemsColorStateList(activeTintColor: number, inactiveTintColor: number): void {
        const stateUnChecked = Array.create('int', 1);
        stateUnChecked[0] = -android.R.attr.state_checked;
        const defaultState = Array.create('int', 0);

        const states = java.lang.reflect.Array.newInstance(stateUnChecked.getClass() || defaultState.getClass(), 2);
        states[0] = stateUnChecked;
        states[1] = defaultState;

        const colors = Array.create('int', 2);
        colors[0] = inactiveTintColor;
        colors[1] = activeTintColor;

        const bottomBar: BottomNavigationViewType = this.nativeView;

        const colorStateList = new ColorStateList(states, colors);

        bottomBar.setItemTextColor(colorStateList);
        bottomBar.setItemIconTintList(colorStateList);
    }

    onTabSelected(index: number) {
        super.onTabSelected(index);
    }

    [items.setNative](items: BottomBarItem[]) {
        if (items) {
            this.items = [...items];
            this.createItems(this.nativeView);
        }
    }

    [inactiveTintColor.setNative](color: Color): void {
        this.setItemsColorStateList(this.activeTintColor.android, color.android);
    }


    [activeTintColor.setNative](color: Color): void {
        this.setItemsColorStateList(color.android, this.inactiveTintColor.android);
    }

    [barBackgroundColor.setNative](color: Color): void {
        this.nativeView.setBackgroundColor(color.android);
    }

    [androidLabelVisibility.setNative](labelVisibility: LABEL_VISIBILITY): void {
        // Typings don't match design API >28.0
        // (this.nativeView as any).setLabelVisibilityMode(labelVisibility);
    }

    hide() {
        // const height = (this.nativeView as BottomNavigationViewType).getMeasuredHeight();
        const height = this.getActualSize().height;
        this.visibility = 'collapse';
        this.animate({
            duration: 200,
            translate: {
                x: 0,
                y: height
            },
            opacity: 0
        });
        setTimeout(() => {
            
        }, 100);
        // (this.nativeView as BottomNavigationViewType).animate()
        //     .setDuration(200)
        //     .translationY(height)
        //     .start();
    }

    show() {
        // const height = (this.nativeView as BottomNavigationViewType).getMeasuredHeight();
        const height = this.getActualSize().height;
        console.log(height);
        this.visibility = 'visible';
        this.animate({
            duration: 200,
            translate: {
                x: 0,
                y: -height
            },
            opacity: 1
        });
        // (this.nativeView as BottomNavigationViewType).animate()
        //     .setDuration(200)
        //     .translationY(-height)
        //     .start();
    }
}
