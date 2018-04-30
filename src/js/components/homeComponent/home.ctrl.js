class HomeCtrl {
    
    constructor($document, $scope, TestService) {
        'ngInject'

        this.$document = $document;
        this.$scope = $scope;

        this.TestService = TestService;

        /**/
        this.roomsAvailables = [];
        
        this.suitePresidencial = [];
        this.suiteJunior = [];
        this.triple = [];
        this.dobleSuperior = [];
        this.dobleStandard = [];
        this.doblePersonal = [];
        /**/

        this.manejador = true;
        //this.noches = (this.reserva.fecha_fin - this.reserva.fecha_ini) / (1000*60*60*24);
        this.condiciones = false;
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
        
        this.reserva = {
            today: hoy,
            fecha_res: moment(new Date()).format('YYYY-MM-DD'),
            habitaciones: [],
            origen: 1,
            estado: 0,
            total: 0,
            cancelado: 0,
            total: 0,
            cant_adult: 0,
            cant_menores: 0,/*,
            fecha_ini: new Date,
            fecha_fin: new Date*/
        };
    }

    $onInit() {
        this.$document.find('[data-toggle="tooltip"]').tooltip()
        this.getRoomsAvailables();
        this.diaIn = moment(this.fecha_in).format("DD-MM-YYYY");
        this.diaOut = moment(this.fecha_out).format("DD-MM-YYYY");

        let detalleReserva = this.$document.find('.component-reservation');
        let document = this.$document;
        
        document.scroll(function(e) {            
            if(document.scrollTop() > 100 ){
                detalleReserva.addClass('component-reservation__fixed');
            } else {
                detalleReserva.removeClass('component-reservation__fixed');
            }
        });

        this.individualRooms = [];
        this.individualCant = 0;
        this.individualMax = 0;
        this.individualHuespedes = 0;
        this.individualAdultos = 0;
        //this.individualNinos = 0;
        this.individualAdultosTot = 0;
        //this.individualNinosTot = 0;  
        this.individualAire = false;
        this.individualSubtotal = 0;

        this.standardRooms = [];
        this.standardCant = 0;
        this.standardMax = 0;
        this.standardHuespedes = 0;
        this.standardAdultos = 0;
        this.standardNinos = 0;
        this.standardAdultosTot = 0;
        this.standardNinosTot = 0;
        this.standardAire = false;
        this.standardSubtotal = 0;

        this.doblesRooms = [];
        this.doblesCant = 0;
        this.doblesMax = 0;
        this.doblesHuespedes = 0;
        this.doblesAdultos = 0;
        this.doblesNinos = 0;
        this.doblesAdultosTot = 0;
        this.doblesNinosTot = 0;
        this.doblesAire = false;
        this.doblesSubtotal = 0;
        
        this.triplesRooms = [];
        this.triplesCant = 0;
        this.triplesMax = 0;
        this.triplesHuespedes = 0;
        this.triplesAdultos = 0;
        this.triplesNinos = 0;
        this.triplesAdultosTot = 0;
        this.triplesNinosTot = 0;
        this.triplesAire = false;
        this.triplesSubtotal = 0;
        
        this.suitejrRooms = [];
        this.suitejrCant = 0;
        this.suitejrMax = 0;
        this.suitejrHuespedes = 0;
        this.suitejrAdultos = 0;
        this.suitejrNinos = 0;
        this.suitejrAdultosTot = 0;
        this.suitejrNinosTot = 0;
        this.suitejrAire = false;
        this.suitejrSubtotal = 0;
        
        this.suiteRooms = [];
        this.suiteCant = 0;
        this.suiteMax = 0;
        this.suiteHuespedes = 0;
        this.suiteAdultos = 0;
        this.suiteNinos = 0;
        this.suiteAdultosTot = 0;
        this.suiteNinosTot = 0;
        this.suiteAire = false;
        this.suiteSubtotal = 0;
        //console.log(this);
    }
    getRoomsAvailables() {
        this.roomsAvailables = [];
        this.reserva.cant_adult = 0;
        this.reserva.cant_menores = 0;
        this.individualRooms = [];
        
        this.diaIn = moment(this.fecha_in).format("DD-MM-YYYY");
        this.diaOut = moment(this.fecha_out).format("DD-MM-YYYY");

        let esteDia = this.reserva.today / (1000*60*60*24);
        let entrada = this.fecha_in / (1000*60*60*24);
        let salida = this.fecha_out / (1000*60*60*24);
        
        /*console.log("Hoy:" + esteDia);
        console.log("Entrada:" + entrada);
        console.log("Salida:" + salida);*/
        
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

                //console.log("Malo");
                this.roomsAvailables = [];
                this.nochesValidator = false;
                //this.$document.find('input[type=date]').val("");
                //this.$document.find('').reset();
        
        } else {
            //console.log("Bueno");
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
                    //this.dobleCompuesta = [];
                    this.dobleStandard = [];
                    //this.matrimonial = [];
                    this.doblePersonal = [];


                    this.roomsAvailables = res;
                    //this.noches = (this.reserva.fecha_fin - this.reserva.fecha_ini) / (1000*60*60*24);
                    //console.log(this.reserva);
                    this.roomsAvailables.forEach(element => {
                        if (element.c_king == 1) 
                            { element.precio = element.s_presi; element.categoria = "Suite P."; this.suitePresidencial.push(element) }
                        
                        if (element.c_queen == 1) 
                            { element.precio = element.s_junior; element.categoria = "Suite Jr."; this.suiteJunior.push(element) }
                        
                        if (element.c_matrimonial == 1 && element.tipo == "suite") 
                            { element.precio = element.s_junior; element.categoria = "Suite Jr."; this.suiteJunior.push(element) }
                        
                        if (element.c_individual == 3 ) 
                            { element.precio = element.triple; element.categoria = "Triple"; this.triple.push(element) }
                        
                        if (element.c_matrimonial == 2) 
                            { element.precio = element.ddvv; element.categoria = "D. Superior"; this.dobleSuperior.push(element) }
                        
                        if (element.c_matrimonial == 1 && element.c_individual == 1) 
                            { element.precio = element.ddvv; element.categoria = "D. Compuesta"; this.dobleSuperior.push(element) }

                        /*if (element.c_matrimonial == 1 && element.c_individual == 1) 
                            { element.precio = element.ddvv; element.categoria = "D. Compuesta"; this.dobleCompuesta.push(element) }*/
                        
                        if (element.c_individual == 2 && element.ssaa) 
                            { element.precio = element.ssvv; element.categoria = "D. Unipersonal"; this.doblePersonal.push(element) }
                        
                        if (element.c_individual == 2 && !element.ssaa && element.tipo == "doble sencilla (U/U)") 
                            { element.precio = element.mmvv; element.categoria = "D. Standard"; this.dobleStandard.push(element) }
                        
                        if (element.c_matrimonial == 1 && !element.c_individual && element.mmvv) 
                            { element.precio = element.mmvv; element.categoria = "Matrimonial"; this.dobleStandard.push(element) }
                        
                            /*if (element.c_matrimonial == 1 && !element.c_individual && element.mmvv) 
                            { element.precio = element.mmvv; element.categoria = "Matrimonial"; this.matrimonial.push(element) }*/
                        
                        
                        /*
                            if (element.c_individual == 2) { this.dobleSencilla.push(element) }
                            if (element.c_individual == 1 && element.c_matrimonial == 1) { this.dobleCompuesta.push(element) }
                        */
                    });
                });

        }

    }
    
    individualAddHabits() {
        this.individualMax = 1 * this.individualCant;
        this.individualAdultos = 1 * this.individualCant;
    }
    individualprecioHabit(){
        if(this.individualAire) {
            this.doblePersonal[this.doblePersonal.length - 1].precio = this.doblePersonal[this.doblePersonal.length - 1].ssaa
        } else {
            this.doblePersonal[this.doblePersonal.length - 1].precio = this.doblePersonal[this.doblePersonal.length - 1].ssvv
        }        
    }
    individualAddRoom(){

        if(this.individualCant == 0) {
            swal({ text: "Indique la cantidad de habitaciones individuales que desea reservar", icon: "warning" })
        } else if(this.individualAdultos == 0) {
            swal({ text: "Indique la cantidad de huespedes para las habitaciones seleccionadas", icon: "warning" })
        } else if( this.individualHuespedes > this.individualMax ) {
            swal({ text: "Cantidad de personas rebasa la capacidad de habitaciones seleccionadas", icon: "warning" })
        } else {
            for(let i=0; i < this.individualCant; i++) {
                
                if(this.individualAire){
                    this.doblePersonal[i].precio = this.doblePersonal[i].ssaa;
                } else {
                    this.doblePersonal[i].precio = this.doblePersonal[i].ssvv;
                }

                this.reserva.habitaciones.push( this.doblePersonal[i] );
                this.individualRooms.push( this.doblePersonal[i] );
            }

            for(let i=0; i < this.individualCant; i++) {
                this.doblePersonal.shift();
            }

            this.individualSubtotal = this.individualRooms.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);
            //this.individualTotal = this.individualRooms.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);

            this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio },0);
            this.reserva.total *= this.noches;
            this.reserva.cant_adult += this.individualAdultos;
            //this.reserva.cant_menores += this.individualNinos;

            this.individualAdultosTot += this.individualAdultos;
            //this.individualNinosTot += this.individualNinos;

            this.individualAdultos = 0;
            this.individualCant = 0;
        }        
    }
    removeIndividualRooms(){

        for(let i=0; i < this.individualRooms.length; i++) {
            this.individualAire = false;
            this.individualRooms[i].precio = this.individualRooms[i].ssvv;
            this.doblePersonal.push(this.individualRooms[i]);
        }

        //this.reserva.habitaciones.forEach( (e,i) => {
            this.remover("D. Unipersonal");
        //});
    
        this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio },0);
        
        this.reserva.cant_adult -= this.individualAdultosTot;
        //this.reserva.cant_menores -= this.individualNinosTot;
        this.individualAdultosTot = 0;
        //this.individualNinosTot = 0;

        this.individualRooms = [];
    }
   
    /*
    *   Standard Logic
    */    
    standardAddHabits() {
        this.standardMax = 2 * parseInt(this.standardCant);
        this.standardAdultos = 1;
    }
    standardPrecioHabit(){
        if(this.standardAire) {
            this.dobleStandard[this.dobleStandard.length - 1].precio = this.dobleStandard[this.dobleStandard.length - 1].mmaa;
        } else {
            this.dobleStandard[this.dobleStandard.length - 1].precio = this.dobleStandard[this.dobleStandard.length - 1].mmvv;
        }
    }
    standardAddRoom(){
        if(this.standardCant == 0) {
            swal({ text: "Indique la cantidad de habitaciones standard que desea reservar", icon: "warning" })
        } else if( this.standardMax < this.standardAdultos + this.standardNinos ) {
            swal({ text: "Cantidad de personas rebasa la capacidad de habitaciones seleccionadas", icon: "warning" })
        } else if(this.standardAdultos == 0 || this.standardAdultos + this.standardNinos == 0) {
            swal({ text: "Indique la cantidad de huespedes para las habitaciones seleccionadas", icon: "warning" })
        } else {
            //swal({ text:"Agregandas exitósamente", icon:"success" })
            for(let i=0; i < this.standardCant; i++) {
                
                if(this.standardAire){
                    this.dobleStandard[i].precio = this.dobleStandard[i].mmaa;
                } else {
                    this.dobleStandard[i].precio = this.dobleStandard[i].mmvv;
                }

                this.reserva.habitaciones.push( this.dobleStandard[i] );
                this.standardRooms.push( this.dobleStandard[i] );
            }

            for(let i=0; i < this.standardCant; i++) {
                this.dobleStandard.shift();
            }

            this.standardSubtotal = this.standardRooms.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);
            this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio },0);
            
            this.reserva.total *= this.noches;
            this.reserva.cant_adult += this.standardAdultos;
            this.reserva.cant_menores += this.standardNinos;            
            
            this.standardAdultosTot += this.standardAdultos;
            this.standardNinosTot += this.standardNinos;

            this.standardNinos = 0;
            this.standardAdultos = 0;
            this.standardCant = 0;
            this.standardMax = 0;
        }
        
    }
    remover(match) {
        let i=0;
        while(i != this.reserva.habitaciones.length){ 
            if(this.reserva.habitaciones[i].categoria === match){
                this.reserva.habitaciones.splice(i, 1);
                //delete this.reserva.habitaciones[i];
            } else {
                i++;
            }
        }
    }
    removeStandardRooms(){
        this.standardRooms.forEach( (e,i) => {
        //for(let i=0; i == this.standardRooms.length; i++) {
            this.standardAire = false;
            this.standardRooms[i].precio = this.standardRooms[i].mmvv;
            this.dobleStandard.push(this.standardRooms[i]);
        });

        this.remover("Matrimonial");
        
        this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);
        
        this.reserva.cant_adult -= this.standardAdultosTot;
        this.reserva.cant_menores -= this.standardNinosTot;
        this.standardAdultosTot = 0;
        this.standardNinosTot = 0;

        this.standardRooms = [];
    }
    
    /*
    * Superior Logic
    */
    doblesAddHabits(){
        this.doblesMax = 2 * parseInt(this.doblesCant);
        this.doblesAdultos = 1;
    }
    precioDoblesHabit(){
        if(this.doblesAire) {
            this.dobleSuperior[this.dobleSuperior.length - 1].precio = this.dobleSuperior[this.dobleSuperior.length - 1].ddaa;
        } else {
            this.dobleSuperior[this.dobleSuperior.length - 1].precio = this.dobleSuperior[this.dobleSuperior.length - 1].ddvv;
        }
    }
    addDoblesRoom(){
        if(this.doblesCant == 0) {
            swal({ text: "Indique la cantidad de habitaciones dobles superior que desea reservar", icon: "warning" })
        } else if( this.doblesMax < this.doblesAdultos + this.doblesNinos ) {
            swal({ text: "Cantidad de personas rebasa la capacidad de habitaciones seleccionadas", icon: "warning" })
        } else if(this.doblesAdultos == 0 || this.doblesAdultos + this.doblesNinos == 0) {
            swal({ text: "Indique la cantidad de huespedes para las habitaciones seleccionadas", icon: "warning" })
        } else {
            for(let i=0; i < this.doblesCant; i++) {
                
                if(this.doblesAire){
                    this.dobleSuperior[i].precio = this.dobleSuperior[i].mmaa;
                } else {
                    this.dobleSuperior[i].precio = this.dobleSuperior[i].mmvv;
                }

                this.reserva.habitaciones.push( this.dobleSuperior[i] );
                this.doblesRooms.push( this.dobleSuperior[i] );
            }

            for(let i=0; i < this.doblesCant; i++) {
                this.dobleSuperior.shift();
            }

            this.doblesSubtotal = this.doblesRooms.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);
            this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio },0);
            
            this.reserva.total *= this.noches;
            this.reserva.cant_adult += this.doblesAdultos;
            this.reserva.cant_menores += this.doblesNinos;
            
            this.doblesAdultosTot += this.doblesAdultos;
            this.doblesNinosTot += this.doblesNinos;

            this.doblesNinos = 0;
            this.doblesAdultos = 0;
            this.doblesCant = 0;
            this.doblesMax = 0;
        }
    }
    removeDoblesRooms(){
        
        this.doblesRooms.forEach( (e,i) => {
        //for(let i=0; i == this.doblesRooms.length; i++) {
            this.doblesAire = false;
            this.doblesRooms[i].precio = this.doblesRooms[i].mmvv;
            this.dobleSuperior.push(this.doblesRooms[i]);
        });

        this.remover("D. Superior");
        
        this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);
        
        this.reserva.cant_adult -= this.doblesAdultosTot;
        this.reserva.cant_menores -= this.doblesNinosTot;
        this.doblesAdultosTot = 0;
        this.doblesNinosTot = 0;

        this.doblesRooms = [];
    }
    
    /*
    * Triple Logic
    */
    triplesAddHabits(){
        this.triplesMax = 3 * parseInt(this.triplesCant);
        this.triplesAdultos = 1;
    }
    precioTriplesHabits(){
        console.log(this);
    }
    addTriplesRoom(){
        if(this.triplesCant == 0) {
            swal({ text: "Indique la cantidad de habitaciones triples que desea reservar", icon: "warning" })
        } else if( this.triplesMax < this.triplesAdultos + this.triplesNinos ) {
            swal({ text: "Cantidad de personas rebasa la capacidad de habitaciones seleccionadas", icon: "warning" })
        } else if(this.triplesAdultos == 0 || this.triplesAdultos + this.triplesNinos == 0) {
            swal({ text: "Indique la cantidad de huespedes para las habitaciones seleccionadas", icon: "warning" })
        } else {
            for(let i=0; i < this.triplesCant; i++) {
                
                /*if(this.triplesAire){
                    this.tripleSuperior[i].precio = this.tripleSuperior[i].mmaa;
                } else {
                    this.tripleSuperior[i].precio = this.tripleSuperior[i].mmvv;
                }*/

                this.reserva.habitaciones.push( this.triple[i] );
                this.triplesRooms.push( this.triple[i] );
            }

            for(let i=0; i < this.triplesCant; i++) {
                this.triple.shift();
            }

            this.triplesSubtotal = this.triplesRooms.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);
            //this.triplesTotal = this.triplesRooms.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);

            this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio },0);
            this.reserva.total *= this.noches;
            this.reserva.cant_adult += this.triplesAdultos;
            this.reserva.cant_menores += this.triplesNinos;

            this.triplesAdultosTot += this.triplesAdultos;
            this.triplesNinosTot += this.triplesNinos;
            
            this.triplesNinos = 0;
            this.triplesAdultos = 0;
            this.triplesCant = 0;
            this.triplesMax = 0;
        }
    }
    removeTriplesRoom(){
        this.triplesRooms.forEach( (e,i) => {
        //for(let i=0; i == this.triplesRooms.length; i++) {
            this.triplesAire = false;
            this.triplesRooms[i].precio = this.triplesRooms[i].triple;
            this.triple.push(this.triplesRooms[i]);
        });

        this.remover("Triple");
        
        this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);
        
        this.reserva.cant_adult -= this.triplesAdultosTot;
        this.reserva.cant_menores -= this.triplesNinosTot;
        this.triplesAdultosTot = 0;
        this.triplesNinosTot = 0;

        this.triplesRooms = [];
    }
    
    /*
    * SuiteJr Logic
    */
    suitejrAddHabits(){
        this.suitejrMax = 2 * parseInt(this.suitejrCant);
        this.suitejrAdultos = 1;        
    }
    addSuiteJrRoom(){
        console.log(this);
        if(this.suitejrCant == 0) {
            swal({ text: "Indique la cantidad de habitaciones suitejr que desea reservar", icon: "warning" })
        } else if( this.suitejrMax < this.suitejrAdultos + this.suitejrNinos ) {
            swal({ text: "Cantidad de personas rebasa la capacidad de habitaciones seleccionadas", icon: "warning" })
        } else if(this.suitejrAdultos == 0 || this.suitejrAdultos + this.suitejrNinos == 0) {
            swal({ text: "Indique la cantidad de huespedes para las habitaciones seleccionadas", icon: "warning" })
        } else {
            for(let i=0; i < this.suitejrCant; i++) {
                
                /*if(this.suitejrAire){
                    this.suitejruperior[i].precio = this.suitejruperior[i].mmaa;
                } else {
                    this.suitejruperior[i].precio = this.suitejruperior[i].mmvv;
                }*/

                this.reserva.habitaciones.push( this.suiteJunior[i] );
                this.suitejrRooms.push( this.suiteJunior[i] );
            }

            for(let i=0; i < this.suitejrCant; i++) {
                this.suiteJunior.shift();
            }

            this.suitejrSubtotal = this.suitejrRooms.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);
            //this.suitejrTotal = this.suitejrRooms.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);

            this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio },0);
            this.reserva.total *= this.noches;
            this.reserva.cant_adult += this.suitejrAdultos;
            this.reserva.cant_menores += this.suitejrNinos;
            
            this.suitejrAdultosTot += this.suitejrAdultos;
            this.suitejrNinosTot += this.suitejrNinos;

            this.suitejrNinos = 0;
            this.suitejrAdultos = 0;
            this.suitejrCant = 0;
            this.suitejrMax = 0;
        }
    }
    removeSuiteJrRoom(){
        this.suitejrRooms.forEach( (e,i) => {
        //for(let i=0; i == this.suitejrRooms.length; i++) {
            this.suitejrAire = false;
            this.suitejrRooms[i].precio = this.suitejrRooms[i].s_junior;
            this.suiteJunior.push(this.suitejrRooms[i]);
        });

        this.remover("Suite Jr.");
        
        this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);
        
        this.reserva.cant_adult -= this.suitejrAdultosTot;
        this.reserva.cant_menores -= this.suitejrNinosTot;
        this.suitejrAdultosTot = 0;
        this.suitejrNinosTot = 0;

        this.suitejrRooms = [];
    }
    
    /*
    * SuiteJr Logic
    */
    suiteAddHabits(){
        this.suiteMax = 2 * parseInt(this.suiteCant);
        this.suiteAdultos = 1;        
    }
    addSuiteRoom(){
        console.log(this);
        if(this.suiteCant == 0) {
            swal({ text: "Indique la cantidad de habitaciones suite que desea reservar", icon: "warning" })
        } else if( this.suiteMax < this.suiteAdultos + this.suiteNinos ) {
            swal({ text: "Cantidad de personas rebasa la capacidad de habitaciones seleccionadas", icon: "warning" })
        } else if(this.suiteAdultos == 0 || this.suiteAdultos + this.suiteNinos == 0) {
            swal({ text: "Indique la cantidad de huespedes para las habitaciones seleccionadas", icon: "warning" })
        } else {
            for(let i=0; i < this.suiteCant; i++) {
                
                /*if(this.suiteAire){
                    this.suiteuperior[i].precio = this.suiteuperior[i].mmaa;
                } else {
                    this.suiteuperior[i].precio = this.suiteuperior[i].mmvv;
                }*/

                this.reserva.habitaciones.push( this.suitePresidencial[i] );
                this.suiteRooms.push( this.suitePresidencial[i] );
            }

            for(let i=0; i < this.suiteCant; i++) {
                this.suitePresidencial.shift();
            }

            this.suiteSubtotal = this.suiteRooms.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);
            //this.suiteTotal = this.suiteRooms.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);

            this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio },0);
            this.reserva.total *= this.noches;
            this.reserva.cant_adult += this.suiteAdultos;
            this.reserva.cant_menores += this.suiteNinos;
            
            this.suiteAdultosTot += this.suiteAdultos;
            this.suiteNinosTot += this.suiteNinos;
            
            this.suiteNinos = 0;
            this.suiteAdultos = 0;
            this.suiteCant = 0;
            this.suiteMax = 0;
        }
    }
    removeSuiteRoom(){
        this.suiteRooms.forEach( (e,i) => {
        //for(let i=0; i == this.suiteRooms.length; i++) {
            this.suiteAire = false;
            this.suiteRooms[i].precio = this.suiteRooms[i].s_presi;
            this.suitePresidencial.push(this.suiteRooms[i]);
        });

        this.remover("Suite P.");
        
        this.reserva.total = this.reserva.habitaciones.reduce( (inicial, habitacion) => { return inicial += habitacion.precio }, 0);
        
        this.reserva.cant_adult -= this.suiteAdultosTot;
        this.reserva.cant_menores -= this.suiteNinosTot;
        this.suiteAdultosTot = 0;
        this.suiteNinosTot = 0;

        this.suiteRooms = [];
    }
    reservar() {
        if(this.condiciones){
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
                                this.condiciones = false;
                                
                                this.reserva = {
                                    fecha_res: moment(new Date()).format('YYYY-MM-DD'),
                                    habitaciones: [],
                                    origen: 1,
                                    estado: 0,
                                    total: 0,
                                    cant_adult: 0,
                                    cant_menores: 0,
                                };
                            }
                        })
                }            
                //setTimeout(() =>{ this.manejador = true; },5000)          
                console.log(this.reserva);
            } else {
                swal({text: "Espere a que la acción anterior concluya", icon: "info"});
            }
        } else {
            //swal({icon: "warning", text: `${this.condiciones}`})
            this.$document.find('#condiciones').tooltip('show');
        }

    }
    ver(){
        if(this.condiciones){
            swal({icon: "success", text: `${this.condiciones}`});
            console.log(this.reserva);
        } else {
            swal({icon: "warning", text: `${this.condiciones}`});
            this.$document.find('#condiciones').tooltip('show');
        }
    }
}

export default HomeCtrl;
