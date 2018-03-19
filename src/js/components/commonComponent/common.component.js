import HeaderCtrl from './commonController/header.ctrl';
import NavCtrl from './commonController/nav.ctrl';
import SidebarCtrl from './commonController/sidebar.ctrl';
import FooterCtrl from './commonController/footerl.ctrl';

export const headerComponent = {
    templateUrl: 'partials/common/headerTmpl.html',
    controller: HeaderCtrl,
    controllerAs: 'header'
}

export const navComponent = {
    templateUrl: 'partials/common/navTmpl.html',
    controller: NavCtrl,
    controllerAs: 'nav'
}

export const sidebarComponent = {
    templateUrl: 'partials/common/sidebarTmpl.html',
    controller: SidebarCtrl,
    controllerAs: 'sidebar'
}

export const footerComponent = {
    templateUrl: 'partials/common/footerTmpl.html',
    controller: FooterCtrl,
    controllerAs: 'footer'
}
