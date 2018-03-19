import { headerComponent, navComponent, sidebarComponent, footerComponent } from './common.component';

const common = angular
    .module('common',[])
    .component('headerComponent', headerComponent)
    .component('navComponent', navComponent)
    .component('sidebarComponent', sidebarComponent)
    .component('footerComponent', footerComponent)    
    .name;

export default common;
