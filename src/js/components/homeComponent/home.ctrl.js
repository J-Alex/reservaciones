class HomeCtrl {
    
    constructor($document, $scope, $interval, TestService, API) {
        'ngInject'

        this.$document = $document;
        this.$scope = $scope;
        this.$interval = $interval;

        this.API = API;
        this.TestService = TestService;

        this.title = "HOGAR";
        this.maxlength = 19; 

        this.i18n;
        
        this.esp = {
            infoGral: "Comprobar Disponibilidad",
            llegada: "Día de LLegada",
            salida: "Día de Salida"
        }

        this.eng = {
            infoGral: "General Information",
            llegada: "Arriving Day",
            salida: "Out Day"
        }

        /**/
        this.roomsAvailables = [];

        this.suitePresidencial = [];
        this.suiteJunior = [];
        this.triple = [];
        this.dobleSuperior = [];
        this.dobleCompuesta = [];
        this.dobleStandard = [];
        this.matrimonial = [];
        /**/

        this.manejador = true;
        //this.noches = (this.reserva.fecha_fin - this.reserva.fecha_ini) / (1000*60*60*24);
        
        //FECHA, HOY, MAÑANA
        let date = new Date();

        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        
        let hoy = new Date(year, month,  day)
        let tomorrow = new Date(year, month,  day + 1); 
        
        //BINDINGS MODELS TO INPUTS[TYPE=TEXT]
        this.fecha_in = hoy;
        this.fecha_out = tomorrow;
        this.noches = 1;
        this.nochesValidator = true;
        
        /*console.log(tomorrow);
        console.log(this.fecha_out);
        console.log(this.fecha_in);*/
        
        this.reserva = {
            today: hoy,
            fecha_res: moment(new Date()).format('YYYY-MM-DD'),
            habitaciones: [],
            origen: 1,
            estado: 0,
            total: 0,
            cancelado: 0/*,
            fecha_ini: new Date,
            fecha_fin: new Date*/
        };
    }

    $onInit() {
        this.i18n = this.esp;
        this.getRoomsAvailables();
        //console.log(this);
    }
    english() {
        this.i18n = this.eng;
    }
    spanish() {
        this.i18n = this.esp;
    }
    getRoomsAvailables() {
        this.roomsAvailables = [];

        let esteDia = this.reserva.today / (1000*60*60*24);
        let entrada = this.fecha_in / (1000*60*60*24);
        let salida = this.fecha_out / (1000*60*60*24);
        console.log("Hoy:" + esteDia);
        console.log("Entrada:" + entrada);
        console.log("Salida:" + salida);
        /*let hoy = this.reserva.today * 1;
        let inicio = this.reserva.fecha_ini * 1;
        let fin = this.reserva.fecha_fin * 1;

        console.log(hoy, inicio, fin);*/

        this.noches = (this.fecha_out - this.fecha_in) / (1000*60*60*24);

        if( this.fecha_in == undefined ||
            this.fecha_out == undefined ||
            entrada < esteDia ||
            entrada > salida ||
            salida <= esteDia ||
            salida <= entrada
            /*this.reserva.fecha_ini < this.reserva.today ||
            this.reserva.fecha_in <= this.reserva.today ||
            this.reserva.fecha_out <= this.reserva.fecha_in*/) {

                console.log("Malo");
                this.roomsAvailables = [];
                this.nochesValidator = false;
                //this.$document.find('input[type=date]').val("");
                //this.$document.find('').reset();
        
        } else {
            console.log("Bueno");
            this.nochesValidator = true;

            this.TestService.getData({fecha_ini: this.fecha_in, fecha_fin: this.fecha_out})
                .then( (res) => {
                    //RESET HABITACIONES Y HABITACIONES EN RESERVACION
                    this.reserva.total = 0;
                    this.reserva.habitaciones = [];
                    this.suitePresidencial = [];
                    this.suiteJunior = [];
                    this.triple = [];
                    this.dobleSuperior = [];
                    this.dobleCompuesta = [];
                    this.dobleStandard = [];
                    this.matrimonial = [];


                    this.roomsAvailables = res;
                    //this.noches = (this.reserva.fecha_fin - this.reserva.fecha_ini) / (1000*60*60*24);
                    //console.log(this.reserva);
                    this.roomsAvailables.forEach(element => {
                        if (element.c_king == 1) { element.precio = element.s_presi; element.categoria = "Suite P."; this.suitePresidencial.push(element) }
                        if (element.c_queen == 1) { element.precio = element.s_junior; element.categoria = "Suite Jr."; this.suiteJunior.push(element) }
                        if (element.c_matrimonial == 1 && element.tipo == "suite") { element.precio = element.s_junior; element.categoria = "Suite Junior"; this.suiteJunior.push(element) }
                        if (element.c_individual == 3 ) { element.precio = element.triple; element.categoria = "Triple"; this.triple.push(element) }
                        if (element.c_matrimonial == 2) { element.precio = element.ddvv; element.categoria = "D. Superior"; this.dobleSuperior.push(element) }
                        if (element.c_matrimonial == 1 && element.c_individual == 1) { element.precio = element.ddvv; element.categoria = "D. Compuesta"; this.dobleCompuesta.push(element) }
                        if (element.c_individual == 2) { element.precio = element.mmvv; element.categoria = "D. Standard"; this.dobleStandard.push(element) }
                        if (element.c_matrimonial == 1 && !element.c_individual && element.mmvv) { element.precio = element.mmvv; element.categoria = "Matrimonial"; this.matrimonial.push(element) }
                        /*if (element.c_individual == 2) { this.dobleSencilla.push(element) }
                        if (element.c_individual == 1 && element.c_matrimonial == 1) { this.dobleCompuesta.push(element) }
                        }*/
                    });
                });

        }

    }
    precioHabit(habitacion){
        //ASIGNANDO HUESPEDES A LA HABITACION AL CAMBIAR CONTROLES DE ADULTOS Y NINOS
        if(!habitacion.ninos) {
            habitacion.huespedes = habitacion.adultos;            
        } else {
            habitacion.huespedes = habitacion.adultos + habitacion.ninos;
        }

        //ASIGNANDO PRECIO A LA HABITACION AL CAMBIAR CONTROLES DE ADULTOS Y NINOS
        if( habitacion.huespedes == 1 ) { habitacion.precio = habitacion.ssvv; }
        if( habitacion.huespedes == 1 && habitacion.aire ) { habitacion.precio = habitacion.ssaa; }
        
        if( habitacion.huespedes == 1 && habitacion.c_matrimonial == 2 ) { habitacion.precio = habitacion.ddvv; }
        if( habitacion.huespedes == 1 && habitacion.c_matrimonial == 2 && habitacion.aire ) { habitacion.precio = habitacion.ddaa; }

        if( habitacion.huespedes == 1 && habitacion.c_matrimonial == 1 && habitacion.c_individual == 1 ) { habitacion.precio = habitacion.ddvv; }
        if( habitacion.huespedes == 1 && habitacion.c_matrimonial == 1 && habitacion.c_individual == 1 && habitacion.aire ) { habitacion.precio = habitacion.ddaa; }

        if( habitacion.huespedes == 2 && habitacion.ddvv ) { habitacion.precio = habitacion.ddvv; }
        if( habitacion.huespedes == 3 && habitacion.triple ) { habitacion.precio = habitacion.triple; }
        if( habitacion.huespedes == 2 && habitacion.ddaa && habitacion.aire ){ habitacion.precio = habitacion.ddaa; }
        if( habitacion.huespedes == 3 && habitacion.triple && habitacion.aire ){ habitacion.precio = habitacion.triple; }

        if( habitacion.huespedes == 2 && habitacion.mmvv ) { habitacion.precio = habitacion.mmvv; }
        if( habitacion.huespedes == 2 && habitacion.mmaa && habitacion.aire ){ habitacion.precio = habitacion.mmaa; }             
        
        if( habitacion.c_individual == 3 && habitacion.triple ) { habitacion.precio = habitacion.triple; }
        if( habitacion.huespedes == 4 ) { habitacion.precio = habitacion.cuadruple; }
        
        if( habitacion.huespedes != 0 && habitacion.s_presi ) { habitacion.precio = habitacion.s_presi; }
        if( habitacion.huespedes != 0 && habitacion.s_junior ) { habitacion.precio = habitacion.s_junior; }
        
        //ASIGNANDO PRECIO A LA HABITACION AL CAMBIO DEL CHKBOX AIRE ACONDICIONADO
        //true
        if(habitacion.aire == true) {
            if(habitacion.precio == habitacion.ddvv) { habitacion.precio = habitacion.ddaa }
            if(habitacion.precio == habitacion.mmvv) { habitacion.precio = habitacion.mmaa }
            if(habitacion.precio == habitacion.ssvv) { habitacion.precio = habitacion.ssaa }
        }
        //false
        if(habitacion.aire == false) {
            if(habitacion.precio == habitacion.ddaa) { habitacion.precio = habitacion.ddvv }
            if(habitacion.precio == habitacion.mmaa) { habitacion.precio = habitacion.mmvv }
            if(habitacion.precio == habitacion.ssaa) { habitacion.precio = habitacion.ssvv }
        }

/*
        switch(habitacion.huespedes){
            case 1:
                habitacion.precio = habitacion.ssvv;
                break;
            case 2:
                habitacion.precio = habitacion.ddvv;
                break;
            case 3:
                habitacion.precio = habitacion.triple;
                break;
            case 4:
                habitacion.precio = habitacion.cuadruple;
                break;
        }
*/
    }

/*
    habitacionAdd(habitacion){
        if(!habitacion.huespedes){
            alert("Indique una cantidad de huespedes para esta habitación")
        } else {
            this.roomsAvailables.forEach( (e, i) => {
                if(e.id == habitacion.id) {
                    this.roomsAvailables.splice(i, 1);
                    e.precio *= this.noches;
                    this.reserva.habitaciones.push(e);
                } else {
                    //console.log(this.habitacion);
                }
            });
        }

        //this.reserva.total = this.reserva.habitaciones.reduce( (total, habitacion) => { return total + habitacion.precio })
        this.reserva.total = 0;
        this.reserva.cant_adult = 0;

        this.reserva.habitaciones.forEach( (habitacion) => {
            this.reserva.total += habitacion.precio;
            this.reserva.cant_adult += habitacion.huespedes;
        });
    }
*/
    addRoom(arr, room) {
        
        if(!room.huespedes || room.huespedes <= 0){
            swal({text: "Indique una cantidad de huespedes para esta habitación", icon: "warning"})
        } else if (room.huespedes > room.max_huesp) {
            console.log("Capacidad rebasada");
        } else {
            arr.pop();
            room.precio *= this.noches;

            this.reserva.habitaciones.push(room);
        }

        this.reserva.total = 0;
        this.reserva.cant_adult = 0;
        this.reserva.cant_menores = 0;

        this.reserva.habitaciones.forEach( (habitacion) => {
            this.reserva.total += habitacion.precio;
            this.reserva.cant_adult += habitacion.adultos;
            this.reserva.cant_menores += habitacion.ninos;
        });
    }
    habitacionRemove(obj){
        console.log(obj);
        this.reserva.habitaciones.forEach( (e, i) => {
            if(e.id == obj.id) {
                //this.habitaciones.push(e);
                this.reserva.habitaciones.splice(i, 1);


                if (obj.c_king == 1) { this.suitePresidencial.push(obj) }
                if (obj.c_queen == 1) { this.suiteJunior.push(obj) }
                if (obj.c_matrimonial == 1 && obj.tipo == "suite") { this.suiteJunior.push(obj) }
                if (obj.c_individual == 3 ) { this.triple.push(obj) }
                if (obj.c_matrimonial == 2) { this.dobleSuperior.push(obj) }
                if (obj.c_matrimonial == 1 && obj.c_individual == 1) { this.dobleCompuesta.push(obj) }
                if (obj.c_individual == 2) { this.dobleStandard.push(obj) }
                if (obj.c_matrimonial == 1 && !obj.c_individual && obj.mmvv) { this.matrimonial.push(obj) }


                this.reserva.total = 0;
                this.reserva.cant_adult = 0;
    
                this.reserva.habitaciones.forEach( (habitacion) => {
                    this.reserva.total += habitacion.precio;
                    this.reserva.cant_adult += habitacion.huespedes;
                });
            } else {
                //console.log(obj);
            }
        });
    }

    reservar() {
        if(this.manejador){
            this.manejador = false;
            /**/
                //this.reserva.id_recepcionista = 16;                
                //this.reserva.hora_llegada = "06:30 pm";
                this.reserva.titular_reservacion = "VACIO-L278";
            /**/
            this.reserva.fecha_in = moment(this.fecha_in).format('YYYY-MM-DD');
            this.reserva.fecha_out = moment(this.fecha_out).format('YYYY-MM-DD');
            
            if(this.reserva.habitaciones.length == 0) {
                swal({text: "No has seleccionado ninguna habitación", icon: "warning"});
                this.manejador = true;
            } else {
                this.TestService.guardarReserva(this.reserva)
                    .then( (res) => {
                        if(res == undefined) {
                            swal({text: "Falló", icon: "warning"});
                            this.manejador = true;
                        } else {
                            swal({title: "Su reservación ha sido enviada con éxito!!", text: "Le enviaremos un mensaje de confirmación a su correo.", icon: "success"});
                            this.manejador = true;

                            this.reserva = {
                                fecha_res: moment(new Date()).format('YYYY-MM-DD'),
                                habitaciones: [],
                                origen: 1,
                                estado: 0,
                                total: 0
                            };
                        }
                    })
            }            
            //setTimeout(() =>{ this.manejador = true; },5000)          
            console.log(this.reserva);
        } else {
            swal({text: "Espere a que la acción anterior concluya", icon: "info"});
        }
    }
}

export default HomeCtrl;
