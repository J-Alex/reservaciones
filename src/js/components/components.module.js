import { homeComponent } from './homeComponent/home.component';

const components = angular
    .module('components',[])
    .component('homeComponent', homeComponent)
    .name;

export default components;
