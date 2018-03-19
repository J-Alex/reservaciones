module.exports = function(input){

let inputUP = input.charAt(0).toUpperCase() + input.slice(1);

return `
class ${input}Service {
    constructor($http){
        'ngInject'
        this.$http = $http;
    }
    guardar${inputUP}(${input}) {
        return this.$http({ method: "POST", url: '/${input}', data: ${input} })
            .then( res => res.data )
            .catch( err => console.log(err) );
    }
    obtener${inputUP}() {
        return this.$http({ method: "GET", url: '/${input}' })
            .then( res => res.data )
            .catch( err => console.log(err) );
    }
    actualizar${inputUP}(${input}) {
        return this.$http({ method: "PUT", url: '/${input}', data: ${input} })
            .then( res => res.data )
            .catch( err => console.log(err) );
    }
    eliminar${inputUP}(id) {
        return this.$http({ method: "DELETE", url: \`/${input}/\${id}\` })
            .then( res => res.data )
            .catch( err => console.log(err) );
    }
    obtenerUno${inputUP}(id) {
        return this.$http({ method: "GET", url: \`/${input}/\${id}\` })
            .then( res => res.data )
            .catch( err => console.log(err) );
    }
}
export default ${input}Service;
`
}