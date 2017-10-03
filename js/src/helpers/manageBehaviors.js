A17.Helpers.manageBehaviors = function(options) {

  /*
    default init listens for event 'page:updated':
    A17.Helpers.manageBehaviors();

    init for pjax:
    A17.Helpers.manageBehaviors({pageUpdatedEventName:'pjax:end'});

    init for spf:
    A17.Helpers.manageBehaviors({pageUpdatedEventName:'spfdone'});
  */

  var idCounter = 0;
  var pageUpdatedEventName = (options && options.pageUpdatedEventName) ? options.pageUpdatedEventName : 'page:updated';

  function searchDomAndInitBehaviors(context) {
    if(context === undefined) {
      context = document;
    }
    var all = context.querySelectorAll('[data-behavior]');
    var i = -1;
    while (all[++i]) {
      var currentElement = all[i];

      // check to see if this element has had its behaviors already initialized by looking for _A17BehaviorsActive
      if (!currentElement._A17BehaviorsActive) {
        //console.log('initializing behaviors for:\n', currentElement);
        var behaviors = currentElement.getAttribute('data-behavior');
        var splittedBehaviors = behaviors.split(' ');
        for (var j = 0, k = splittedBehaviors.length; j < k; j++) {
          var ThisBehavior = A17.Behaviors[splittedBehaviors[j]];
          if(typeof ThisBehavior !== 'undefined') {
            try {
              // mark the element as having its behaviors initialized
              currentElement._A17BehaviorsActive = true;

              // add this instance to the activeBehaviors object so it can be interrogated if the page is updated later
              A17.activeBehaviors[idCounter] = {
                el: currentElement,
                behavior: new ThisBehavior(currentElement),
                name: splittedBehaviors[j]
              };

              try {
                A17.activeBehaviors[idCounter].behavior.init();
              } catch (err) {
                //console.log('failed to init behavior: ', A17.activeBehaviors[idCounter].name, '\n', err, A17.activeBehaviors[idCounter]);
              }

              idCounter++;
            } catch(err) {
              //console.log(err, currentElement, ThisBehavior);
            }
          }
        }
      } else {

        //console.log('behaviors already initialized for:\n', currentElement);
      }
    }
  }

  function pageUpdated() {
    // first check if anything was removed and clean up
    for (var activeBehaviorObj in A17.activeBehaviors) {
      if (A17.activeBehaviors.hasOwnProperty(activeBehaviorObj)) {
        var thisBehaviorObj = A17.activeBehaviors[activeBehaviorObj];

        // check if the element is still there
        if (!document.body.contains(thisBehaviorObj.el)) {
          //console.log('element no longer exists:\n', thisBehaviorObj.name, thisBehaviorObj);

          // trigger its destroy if its gone
          try {
            thisBehaviorObj.behavior.destroy();
            delete A17.activeBehaviors[activeBehaviorObj];
          } catch (err) {
            //console.log('failed to destroy behavior: ', thisBehaviorObj.name, '\n', err, thisBehaviorObj);
          }
        } else {

          //console.log('element still exists:\n', thisBehaviorObj.name, thisBehaviorObj);
        }
      }
    }

    // now look for new behaviors!
    searchDomAndInitBehaviors();
  }

  searchDomAndInitBehaviors();
  document.addEventListener(pageUpdatedEventName, pageUpdated);
  document.addEventListener('content:updated', function() {
    searchDomAndInitBehaviors( (event.data.el) ? event.data.el : '' );
  });
};
