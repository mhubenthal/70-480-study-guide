// app.js

// IIFE, declares db object on window
(function(window){
  // Global object  
  window.app = {};
  app.results;
  app.currentSection;
  app.currentTopic;
  app.numFinished;
  
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
          app.numFinished = 0;
          window.localStorage.setItem('studyGuide',xhr.responseText);
          window.localStorage.setItem('app',JSON.stringify(app));
          displayResults(app.currentSection,app.currentTopic);
          loadListeners(); // Load listeners on buttons
        }
      };
      xhr.open("GET","data/curriculum.json",false);
      xhr.send();
    }
    // Data already loaded
    else{
      // Get state of app
      app = JSON.parse(localStorage.getItem('app'));
      displayResults(app.currentSection,app.currentTopic);
      loadListeners(); // Load listeners on buttons
    }
  }
  
  // Load event listeners for five main buttons
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
    var topicStatus = window.document.querySelector("#topic-status");
    topicStatus.addEventListener('click',function(){
      app.results[app.currentSection].topics[app.currentTopic].isFinished = topicStatus.checked;
      if(topicStatus.checked){app.numFinished += 1;}
      if(!topicStatus.checked){app.numFinished -= 1;}
    });
    var saveState = window.document.querySelector("#save-state");
    saveState.addEventListener('click',function(){
      saveUserInput();
      window.localStorage.setItem('app',JSON.stringify(app));
    });
  }
  
  // Save current user input
  function saveUserInput(){
    var userText = document.querySelector("#user-input").value;
    // Add user input to app object
    app.results[app.currentSection].topics[app.currentTopic].userContent = userText;
  }
  
  // Display current section and current topic
  function displayResults(section,topic){
    // Get content to display
    if(section===-1){app.currentSection = app.results.length-1;}
    else if(section>app.results.length-1){app.currentSection = 0;}
    else{app.currentSection = section;}
    if(topic===-1){app.currentTopic = app.results[app.currentSection].topics.length-1;}
    else if(topic>app.results[app.currentSection].topics.length-1){app.currentTopic = 0;}
    else{app.currentTopic = topic;}
    
    // Create textNodes for content to display
    var sectionTitle = document.createTextNode(app.results[app.currentSection].sectionTitle);
    var topicTitle = document.createTextNode(app.results[app.currentSection].topics[app.currentTopic].topicTitle);
    var topicContent = document.createTextNode(app.results[app.currentSection].topics[app.currentTopic].topicContent);
    var userContent = app.results[app.currentSection].topics[app.currentTopic].userContent;
    
    // Insert textNodes and values into HTML
    var oldSectionTitle = document.querySelector(".section-title");
    oldSectionTitle.replaceChild(sectionTitle,oldSectionTitle.childNodes[0]);
    var oldTopicTitle = document.querySelector(".topic-title");
    oldTopicTitle.replaceChild(topicTitle,oldTopicTitle.childNodes[0]);
    var oldTopicContent = document.querySelector(".topic-content");
    oldTopicContent.replaceChild(topicContent,oldTopicContent.childNodes[0]);
    var oldUserContent = document.querySelector("#user-input");
    oldUserContent.value = userContent;
    
    // Display value of checkbox
    var topicStatus = document.querySelector("#topic-status");
    topicStatus.checked = app.results[app.currentSection].topics[app.currentTopic].isFinished;
    
    // Display number finished
    var numFinished = document.createTextNode(app.numFinished);
    var oldFinishedCount = document.querySelector("#current-topics");
    oldFinishedCount.replaceChild(numFinished,oldFinishedCount.childNodes[0]);
  }
  
  // PUBLIC METHODS
  
  app.load = function(){
    loadData(); // Check local storage, load JSON if not present
  };
}(window));