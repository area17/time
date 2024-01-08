A17.Helpers.getCurrentMediaQuery = function() {
  // Doc: https://code.area17.com/mike/a17-js-helpers/wikis/A17-Helpers-getCurrentMediaQuery

  function parse(str) {
    return str.replace(/'/gi, '').replace(/"/gi, '');
  }

  if (window.opera) {
    return parse(window.getComputedStyle(document.body, ':after').getPropertyValue('content')) || 'large';
  } else if (window.getComputedStyle) {
    return parse(window.getComputedStyle(document.head, null).getPropertyValue('font-family')) || 'large';
  } else {
    return 'large';
  }
};
