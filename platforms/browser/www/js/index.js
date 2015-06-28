/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    
    showAlert: function(message, title){
	if(navigator.notification){
	    navigator.notification.alert(message, null, title,'OK');
	}else{
	    alert(title ? (title + ": " + message) : message);
	}
    },
    
    renderContentView: function(){
	this.el.html(this.template());
	return this;
    },
	
    // Application Constructor
    initialize: function() {
	var self = this;
	this.store = new WebStore(function(){
	    this.contentTpl = Handlebars.compile($("#content-tpl").html());
	    self.renderContentView();
	});
    },
    
    // Route to the appropriate template
    route: function() {
	var hash = window.location.hash;
	if (!hash) {
            $('body').html(new AboutView().render().el);
            return;
	}
	var match = hash.match(app.detailsURL);
	if (match) {
            this.store.findById(Number(match[1]), function() {
		$('body').html(new EmployeeView().render().el);
            });
	}
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
