// app.js

// IIFE, declares db object on window
(function(window){
  // Global object  
  var app = {};
  app.results = [];
  app.currentSection;
  app.currentTopic;
  
  // Load JSON into localStorage if not already present
  function loadData(){
    // Initial visit, load data
    if(!window.localStorage.hasOwnProperty('studyGuide')){
       var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
          app.results = JSON.parse(xhr.responseText);
          app.currentSection = 0;
          app.currentTopic = 0;
          window.localStorage.setItem('studyGuide',xhr.responseText);
          window.localStorage.setItem('app',JSON.stringify(app));
          displayResults(app.currentSection,app.currentTopic);
        }
      };
      xhr.open("GET","data/curriculum.json",false);
      xhr.send();
    }
    // Data already loaded
    else{
      // Get state of app
      app = JSON.parse(localStorage.getItem('app'));
      console.log(app);
      // Get study guide data
      app.results = JSON.parse(localStorage.getItem('studyGuide'));
      displayResults(app.currentSection,app.currentTopic);
    }
  }
  
  // Load event listeners for four main buttons
  function loadListeners(){
    var previousSection = window.document.querySelector("#previous-section");
    previousSection.addEventListener('click',function(){
      displayResults(app.currentSection-1,0);
    });
    var nextSection = window.document.querySelector("#next-section");
    nextSection.addEventListener('click',function(){
      displayResults(app.currentSection+1,0);
    });
    var previousTopic = window.document.querySelector("#previous-topic");
    previousTopic.addEventListener('click',function(){
      displayResults(app.currentSection,app.currentTopic-1);
    });
    var nextTopic = window.document.querySelector("#next-topic");
    nextTopic.addEventListener('click',function(){
      displayResults(app.currentSection,app.currentTopic+1);
    });
    var saveState = window.document.querySelector("#save-state");
    saveState.addEventListener('click',function(){
      window.localStorage.setItem('app',JSON.stringify(app));
    });
  }
  
  // Display JSON to page
  function displayResults(section,topic){
    // Loop back to beginning of list
    console.log(section+' '+topic);
    if(section===-1){app.currentSection = app.results.length-1;}
    else if(section>app.results.length-1){app.currentSection = 0;}
    else{app.currentSection = section;}
    if(topic===-1){app.currentTopic = app.results[app.currentSection].topics.length-1;}
    else if(topic>app.results[app.currentSection].topics.length-1){app.currentTopic = 0;}
    else{app.currentTopic = topic;}
    var sectionTitle = document.createTextNode(app.results[app.currentSection].sectionTitle);
    var topicTitle = document.createTextNode(app.results[app.currentSection].topics[app.currentTopic].topicTitle);
    var topicContent = document.createTextNode(app.results[app.currentSection].topics[app.currentTopic].topicContent);
    var oldSectionTitle = document.querySelector(".section-title");
    oldSectionTitle.replaceChild(sectionTitle,oldSectionTitle.childNodes[0]);
    var oldTopicTitle = document.querySelector(".topic-title");
    oldTopicTitle.replaceChild(topicTitle,oldTopicTitle.childNodes[0]);
    var oldTopicContent = document.querySelector(".topic-content");
    oldTopicContent.replaceChild(topicContent,oldTopicContent.childNodes[0]);
  }
  
  // PUBLIC METHODS
  
  app.load = function(){
    loadData(); // Check local storage, load JSON if not present
    loadListeners(); // Load listeners on buttons
  };
  
  // Register the app object on the window.
  window.app = app;
}(window));