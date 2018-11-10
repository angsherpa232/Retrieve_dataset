/**
 * Watson - Collects data for Sherlock to analyze.
 * Copyright (c) 2016 Neil Gupta
 */

var Watson = (function() {
    var helpers = {
  //Prefix any 4 digit number (i.e."2002") with "jan 1" and "dec 29" if two date is given
      convertYear: function (str, Sherlocked) {
        str = str.replace(/(\d{4})/g,'aug 2 $1');
        return [str, Sherlocked];
      }
    };
  
    return {
      /*
       * Takes the untouched input string, returns 
       * an array with the modified input string at position 0 and a new Sherlocked object at position 1
      */
      preprocess: function(str) {
        // Manipulate str and Sherlocked here...
     
        return helpers.convertYear(str, {});
      },
  
      /* 
       * Takes a Sherlocked object, and returns that Sherlocked object with any desired modifications.
      */
      postprocess: function(Sherlocked) {
  
        // Manipulate Sherlocked here...
  
        return Sherlocked;
      },
  
      /* Config vars for disabling certain features */
      config: {
        // Should Sherlock try to parse time ranges and return an endDate?
        disableRanges: false
      }
    };
  })();
  
  