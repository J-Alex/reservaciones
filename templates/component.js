
module.exports = function(input){
return `
import ${input}Ctrl from './${input}.ctrl.js';
export const ${input}Component = {
    controller: ${input}Ctrl,
    controllerAs: '${input}',
    templateUrl: './partials/${input}/${input}.component.html'
};
`
};