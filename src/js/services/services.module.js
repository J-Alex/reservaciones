import TestService from './test.service';

const services = angular
    .module('services', [])
    .service('TestService', TestService)
    .name;

export default services;
