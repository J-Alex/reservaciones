//"use strict"
class TestService {
    
    constructor(API, $http){
        'ngInject';
        
        this.API = API;        
        this.$http = $http;
    }
    //http://reservas-jlex.c9users.io
    getData(fechas){
        return this.$http({ method: 'POST', url:`${ this.API }/habitaciones_dispon`, fechas })
            .then( res => res.data )
            .catch( err => console.log(err) );
    }
    guardarReserva(reserva) {
        return this.$http({ method: 'POST', url: `${ this.API }/reservas`, data: reserva })
            .then( res => res.data )
            .catch( err => console.log(err) );
    }
}
//TestService.$inject = ['API', '$http'];

export default TestService;
