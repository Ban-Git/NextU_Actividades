var Calculadora = {
	
	oDisplay: document.getElementById("display"),
	aValorOnDisplay: "0",
	aTipoOperacion: "",
	nPrimerValor: 0,
	nSegundoValor: 0,
	nUltimoValor: 0,
	nResultado: 0,
	lObtenerResultado: false,
	lOperacionSelecionada: false,
	
	init: (function(){
		this.fnCreateOnMouseEvent(".tecla");
		this.fnCreateClickEvent();
	}),
	
	//Eventos de botones
	fnCreateOnMouseEvent: function(oSelector){
		var oTecla = document.querySelectorAll(oSelector);
		for (var i = 0; i<oTecla.length;i++) {
			oTecla[i].onmouseover = this.fnSmallButton;
			oTecla[i].onmouseleave = this.fnResizeButton;
		};
	},

	fnSmallButton: function(event){
		Calculadora.fnSetSmallButton(event.target);
	},

	fnResizeButton: function(event){
		Calculadora.fnSetBigButton(event.target);
	},
	
	// Teclas
	fnSetSmallButton: function(elemento){
		var x = elemento.id;
		if (x=="1" || x=="2" || x=="3" || x=="0" || x=="igual" || x=="punto" ) {
			elemento.style.width = "27%";
			elemento.style.height = "61.8px";
		} else if(x=="mas") {
			elemento.style.width = "88%";
			elemento.style.height = "98%";
		} else {
			elemento.style.width = "21%";
			elemento.style.height = "62px";
		}
	},
	
	fnSetBigButton: function(elemento){
		var x = elemento.id;
		if (x=="1" || x=="2" || x=="3" || x=="0" || x=="igual" || x=="punto" ) {
			elemento.style.width = "29%";
			elemento.style.height = "62.91px";
		} else if(x=="mas") {
			elemento.style.width = "90%";
			elemento.style.height = "100%";
		} else {
			elemento.style.width = "22%";
			elemento.style.height = "62.91px";
		}
	},
	
	fnCreateClickEvent: function(){
		var oTeclas = document.querySelectorAll('.tecla');
		for(var x=0; x<oTeclas.length; x++){
			if(!isNaN(parseInt(oTeclas[x].id)))
				document.getElementById(oTeclas[x].id).addEventListener("click", function(e) { Calculadora.fnCapturaNumero(e.target.id); } );
		}
		
		document.getElementById("on").addEventListener("click", function() { Calculadora.fnCleanDisplay(); });
		document.getElementById("sign").addEventListener("click", function() { Calculadora.fnABS(); });
		document.getElementById("punto").addEventListener("click", function() { Calculadora.fnPuntoDecimal(); });
		document.getElementById("igual").addEventListener("click", function() { Calculadora.fnGenerarResultado(); });
		document.getElementById("raiz").addEventListener("click", function() { Calculadora.fnTipoOperacion("raiz"); });
		document.getElementById("dividido").addEventListener("click", function() { Calculadora.fnTipoOperacion("/"); });
		document.getElementById("por").addEventListener("click", function() { Calculadora.fnTipoOperacion("*"); });
		document.getElementById("mas").addEventListener("click", function() { Calculadora.fnTipoOperacion("+"); });
		document.getElementById("menos").addEventListener("click", function() { Calculadora.fnTipoOperacion("-"); });
	},
	
	fnCleanDisplay: function(){ 
	    this.aValorOnDisplay = "0";
		this.aTipoOperacion = "";
		this.nPrimerValor = 0;
		this.nSegundoValor = 0;
		this.nResultado = 0;
		this.Operación = "";
		this.lObtenerResultado = false;
		this.nUltimoValor = 0;
		this.fnActualizaDisplay();
	},
	
	fnABS: function(){
		if (this.aValorOnDisplay !="0") {
			var aux;
			if (this.aValorOnDisplay.charAt(0)=="-") {
				aux = this.aValorOnDisplay.slice(1);
			}	else {
				aux = "-" + this.aValorOnDisplay;
			}
			this.aValorOnDisplay = "";
			this.aValorOnDisplay = aux;
			this.fnActualizaDisplay();
		}
	},
	
	fnPuntoDecimal: function(){
		if (this.aValorOnDisplay.indexOf(".")== -1) {
			if (this.aValorOnDisplay == ""){
				this.aValorOnDisplay = this.aValorOnDisplay + "0.";
			} else {
				this.aValorOnDisplay = this.aValorOnDisplay + ".";
			}
			this.fnActualizaDisplay();
		}
	},
	
	fnCapturaNumero: function(valor){
		if (this.aValorOnDisplay.length < 8) {
			if (this.aValorOnDisplay=="0" || this.lObtenerResultado) {
				this.aValorOnDisplay = "";
				this.aValorOnDisplay = this.aValorOnDisplay + valor;
				if(this.lObtenerResultado){
					this.nPrimerValor = 0;
					this.nResultado = 0;
					this.lObtenerResultado = false;
				}
			} else {
				this.aValorOnDisplay = this.aValorOnDisplay + valor;
			}
			this.fnActualizaDisplay();
			if(this.lOperacionSelecionada)
				this.lOperacionSelecionada = false;
		}
	},
	
	fnTipoOperacion: function(tOperacion){
		if(!this.lOperacionSelecionada){
			if(this.nPrimerValor == 0){
				this.nPrimerValor = parseFloat(this.aValorOnDisplay);
			}
			else{
				this.fnCalculaOperacion(this.nPrimerValor, parseFloat(this.aValorOnDisplay), this.aTipoOperacion);
				this.nPrimerValor = this.nResultado;
			}
		}
		if(tOperacion != "raiz")
			this.aValorOnDisplay = "";
		else
			this.aValorOnDisplay = "√"+this.aValorOnDisplay.replace("√", "");
		this.aTipoOperacion = tOperacion;
		this.lObtenerResultado = false;
		this.lOperacionSelecionada = true;
		this.fnActualizaDisplay();
	},
	
	fnGenerarResultado: function(){
		if(!this.lObtenerResultado){ 
			this.nSegundoValor = parseFloat(this.aValorOnDisplay);
			this.nUltimoValor = this.nSegundoValor;
			this.fnCalculaOperacion(this.nPrimerValor, this.nSegundoValor, this.aTipoOperacion);
		
		} else {
			this.fnCalculaOperacion(this.nPrimerValor, this.nUltimoValor, this.aTipoOperacion);
		}
	
		this.nPrimerValor = this.nResultado;
		this.aValorOnDisplay = "";
	
		if (this.nResultado.toString().length < 9){
			this.aValorOnDisplay = this.nResultado.toString();
		} else {
			this.aValorOnDisplay = this.nResultado.toString().slice(0,8) + "...";
		}
	
		this.lObtenerResultado = true;
		this.lOperacionSelecionada = false;
		this.fnActualizaDisplay();	
	},
	
	fnCalculaOperacion: function(nPrimerValor, nSegundoValor, aTipoOperacion){
		switch(aTipoOperacion){
			case "+": 
				this.nResultado = eval(nPrimerValor + nSegundoValor);
			break;
			case "-": 
				this.nResultado = eval(nPrimerValor - nSegundoValor);
			break;
			case "*": 
				this.nResultado = eval(nPrimerValor * nSegundoValor);
			break;
			case "/": 
				this.nResultado = eval(nPrimerValor / nSegundoValor);
			break;
			case "raiz":
				this.nResultado = eval(Math.sqrt(nPrimerValor));
		}
	},
	
	fnActualizaDisplay: function(){
		this.oDisplay.innerHTML = this.aValorOnDisplay;
	}
	
};

Calculadora.init();