const transitionRunner = ($rootScope, $state, $trace) => {
    'ngInject';
    
    $trace.enable('TRANSITION');
    
    $rootScope.$on('$stateChangeStart', (evt, toState, toParams, fromState, fromParams) => {
        console.log("$stateChangeStart " + fromState.name + JSON.stringify(fromParams) + " -> " + toState.name + JSON.stringify(toParams));
    });
    $rootScope.$on('$stateChangeSuccess', () => {
        console.log('test');
        console.log("$stateChangeSuccess " + fromState.name + JSON.stringify(fromParams) + " -> " + toState.name + JSON.stringify(toParams));
    });
    $rootScope.$on('$stateChangeError', () => {
        console.log("$stateChangeError " + fromState.name + JSON.stringify(fromParams) + " -> " + toState.name + JSON.stringify(toParams));
    });
};

export default transitionRunner;
