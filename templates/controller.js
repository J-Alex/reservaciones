module.exports = function(input){
return `
class ${input}Ctrl {
    constructor(){
        'ngInject'
    }
    $onInit(){
    }
}
export default ${input}Ctrl;
`
}