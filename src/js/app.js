import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import moment from 'moment'; ///src/moment
import swal from 'sweetalert';

import angular from 'angular';
//import uiRouter from '@uirouter/angularjs';

import { homeComponent } from './components/homeComponent/home.component';
import TestService from './services/test.service';

/*import services from './services/services.module';
import uiRouting from './uirouting/ui.routing';
import transitionRunnner from './stateTransition/transition.runner';

import rootComponent from './components/rootComponent/root.component';
import common from './components/commonComponent/common.module';
import components from './components/components.module';*/

angular
    .module('app', [/*services, uiRouter, common, components*/])
    /*.config(uiRouting)
    .run(transitionRunnner)*/
    .constant('API', 'http://sistema.hotelosarcosesteli.com') //'http://reservas-jlex.c9users.io'
    .service('TestService', TestService)
    .component('homeComponent', homeComponent)
    .name;
