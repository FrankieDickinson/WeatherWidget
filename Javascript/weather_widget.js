/*
 * Constructor function for a WeatherWidget instance.
 * 
 * container_element : a DOM element inside which the widget will place its UI

 *
 */

function WeatherWidget(container_element){

    //declare the data properties of the object 
    var _wtown = [];
    var _woutlook = [];
    var _wmin = [];
    var _wmax = [];

    
    //declare an inner object literal to represent the widget's UI
    var _ui={
    	select: null, 
    	button: null,
      display_div: null,
      fieldset: null  
    };
    // Object literal which handles UI functions
    widget = {
    	ui: {
        // Create an option and then place select options from server
        option : function(town){
        var select = _ui.select;  
         
       for(var i = 0; i < town.length; i++){ 
        var option = document.createElement("option");
        option.text = town[i][0];
        option.value = town[i][0];
        select.appendChild(option);
       }
      },
        // Create select and then store it in the object literal
        select : function(){ 	
          var menu = document.createElement("SELECT");
          menu.setAttribute("id", "select_menu");
          _ui.select = menu;
          
          return menu;
          },
      // Create a button and save it in the object literal
      button : function() {
        var btn = document.createElement("input");
        btn.type = "button";
        btn.onclick = widget.ui.action;
        btn.value = "update";
        _ui.button = btn;
        return btn; 

      },
      // Action for the btn which generates the select on initialisation
        action : function(){
          widget.ui.update(_ui.select.value);
          // Applys correct sorting if checked
         _ui.fieldset[0].checked = false;
         _ui.fieldset[1].checked = false;
        },
      sorting: function(type){
       
       // Create array to keep track of town and index position 
          var names = [];
          var maxtemp = [];
          for(var i = 0; i < _wtown.length; i++){
            names.push(_wtown[i]);
            maxtemp.push([_wmax[i], _wtown[i]]);
          }
      // Check which sorting method to use
        if(type == "town")
        {
          names.sort();
          console.log(names);
        }else{
          _ui.display_div.innerHTML = "";
          widget.ui.display_div;
          // Rearrange _wnames into max temp sorted order
          maxtemp.sort();
         var mx = 0;
         var sortMax = maxtemp.length - 1; 
          for(var k = sortMax; k > -1; k--){
            mx = maxtemp[k]; 
            for(var j = 0; j < _wtown.length; j++){
              if(mx[0] == _wmax[j]){
                  if(mx[1] == _wtown[j]){
                    new WLine(_wtown[j], _woutlook[j], _wmin[j], _wmax[j], _ui.display_div);
                  }
                }
              }
            
          }
          return;
        }
      // Reset value displayed in div 
          _ui.display_div.innerHTML = "";
          widget.ui.display_div;
          var index = 0;
          // Keep track of sorted town
          for(var j = 0; j < _wtown.length; j++){
            // Itterate through unsorted towns 
            for(var k = 0; k < names.length; k++){
              // Compare sorted town with unsorted town
                if(_wtown[k] == names[j]){
                  new WLine(_wtown[k], _woutlook[k], _wmin[k], _wmax[k],_ui.display_div);
                  break;
              }
            } 
          }
        
      },
      // rad sets the values of the radio button
      rad: function(){
        var menu = document.createElement("INPUT");
        menu.setAttribute("type", "radio");
        menu.setAttribute("name", "sort");
      
        //menu.setAttribute("action", 'widget.ui.sorting()');
        
        return menu;
    },
		// radio creates a fieldset and then calls rad to store radio dials 						
      radio: function(){
          
        var fieldset = document.createElement("form");
        var radTown = widget.ui.rad();
        radTown.onclick = function () { 
          widget.ui.sorting("town");
        };
        fieldset.appendChild(radTown);
        var text = document.createTextNode("town");
        fieldset.appendChild(text);
                  
        var radMax = widget.ui.rad();
        radMax.onclick = function () {
          widget.ui.sorting("max");
        }
        fieldset.appendChild(radMax);
        var text2 = document.createTextNode("max temp");
        fieldset.appendChild(text2);

        _ui.fieldset = fieldset;
        _ui.fieldset[0].checked = false;
        _ui.fieldset[0].checked = false;
        return fieldset;
		
        },
      // Div which is used to display all the data 
      display_div: function(){
        var display_div = document.createElement("div");
        display_div.setAttribute("id", "div_display");
        _ui.display_div = display_div;
        return display_div;	

        },

      update: function(option){
        // Create an ajax requeset which then loads the parseJson call back
        // function
       var xhr = new XMLHttpRequest ();
        xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            widget.parseJson(this.responseText, option);
          }
        };
        xhr.open('GET', 'PHP/weather.php', true);
        xhr.send(); 
      },
    },     

      parseJson : function(json, option){
        var town = JSON.parse(json);
        var count = 0; 
        var index = 0;
        var pos = 0;
       if(option == "init"){
        widget.ui.option(town);

       }else{
         // Get the index position of town for our City 
         for(var i = 0; i < town.length; i++){
          if(option == town[i][0]){
            pos = i;
            break;
          }
         }

          // How has my town been inserted more than once
         for(var j = 0; j < _wtown.length; j++){
            if (option == _wtown[j]){
              count++;
              index = j;
            }

        }
          if(count > 0){
            // Replace town with updated version 
            _wtown[index] = town[pos][0];
            _woutlook[index] = town[pos][1];
            _wmin[index] = town[pos][2];
            _wmax[index] = town[pos][3];
            widget.store(pos);
            count = 0;
          }else{
          // Add town to lists which store relevant properties 
          _wtown.push(town[pos][0]);
          _woutlook.push(town[pos][1]);
          _wmin.push(town[pos][2]);
          _wmax.push(town[pos][3]);
            count = 0;
            pos = _wtown.length - 1;
           console.log(_ui.fieldset); 
            new WLine(_wtown[pos], _woutlook[pos], _wmin[pos], _wmax[pos], _ui.display_div);
          }
       } 
    },
      store : function(pos){
        // reset the div 
        _ui.display_div.innerHTML = "";
          widget.ui.display_div;
          var town;
          for(var i = 0; i < _wtown.length; i++){
            new WLine(_wtown[i], _woutlook[i], _wmin[i], _wmax[i], _ui.display_div);
          }
      },
      // Calls all function which creates the ui
      // then calls update which generates town names 
    	init : function(container){
    	    value = widget.ui.select();
    	    container.appendChild(value);
    	    
    	    var value = widget.ui.button();
    	    container.appendChild(value);
	    
    	    value = widget.ui.radio();
    	    container.appendChild(value);
	        
          value = widget.ui.display_div();
          container.appendChild(value);
          console.log(container_element);
          widget.ui.update("init");
      }
  }
    //write a function to create and configure the DOM elements for the UI
		  var _createUI = function(container){
        widget.init(container);	
    };
            
    /**
     * private method to intialise the widget's UI on start up
     * this method is complete
     */
    var _initialise = function(container_element){
			_createUI(container_element);
    };
    
    
    /*********************************************************
     * Constructor Function for the inner WLine object to hold the 
     * full weather data for a town
     ********************************************************/
    
    var WLine = function(wtown, woutlook, wmin, wmax, container) {
	
	//write a function to create and configure the DOM elements for the UI
	var _createUI = function(container){
    var label = document.createElement("label");
    var text = document.createTextNode(wtown + " " + woutlook + " " + wmin + " " + wmax);
    var br = document.createElement("br");
    label.appendChild(text);
    container.appendChild(br);
    container.appendChild(label); 
	};
	
	
	//_createUI() method is called when the object is instantiated
	_createUI(container);
};  //this is the end of the constructor function for the WLine object 
    
    
    //  _initialise method is called when a WeatherWidget object is instantiated
    _initialise(container_element);
}

//end of constructor function for WeatherWidget 	 


