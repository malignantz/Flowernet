// Holiday Inn SFO Shuttle JS
// ******************************
// Initialization
// ******************************
init();

function init(){
  document.getElementById('email').setAttribute('href','mailto:'+doArcaneThing()+'+sfoshuttle@gmail.com');
  window.selectedId = '';
  document.querySelector('#divToast').style = 'display:none';
}
// ******************************
// Business Logic
// ******************************

function handleLocationSelection(loc) {
  toggleButtonSelected(loc);
  let rec = recommend(loc,calculateWaitTime(loc));
  showRecommendation(rec.text,rec.style);
}

// give amount of time until you have to leave (np locations), or shuttle arrival time (sfo locations)
function calculateWaitTime(loc) {
  let waitMap = {
     'npsw': [54,24],
     'npne': [59,29],
     'sfo1': [45,15],
     'sfo2': [47,17],
     'sfo3': [49,19],
     'sfoi': [52,22],
     'hi':   [38,8]
 };
 let wait;
 let [firstBus, secondBus ] = waitMap[loc];
 let min = new Date().getMinutes();

 if(min > secondBus && min <= firstBus){
   wait = firstBus - min;
 } else if(min > firstBus) {
   wait = 60 - min + secondBus;
 } else if(min < secondBus) {
   wait = secondBus - min;
 }
 return wait;
}


// returns wait time in minutes when bus isn't running
// returns false during regularly scheduled shuttle hours
function isLongWait(loc) {
  let hours = new Date().getUTCHours();
  let mins = new Date().getMinutes();
  let lastBusMap = {
      npne: [29],
      npsw: [25],
      hi:   [38],
      sfo1: [15],
      sfo2: [17],
      sfo3: [19],
      sfoi: [22],
  };
  var longWait = false;
  if(hours  < 11 && hours > 7){
    longWait = true;
  }
  if(hours === 7 && mins > lastBusMap[loc][0]){
    longWait = true;
  }
  return longWait ? timeUntilFirstBus(loc) : false;
}

// calculates time until next first bus by location
// (only useful when bus not running / isLongWait is true)

function waitTimeUntilFirstBus(loc){
  let earliestBus = {
      npne: [3,59],
      npsw: [3,55],
      hi:   [4,8],
      sfo1: [4,15],
      sfo2: [4,17],
      sfo3: [4,19],
      sfoi: [4,22],
  };
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var nextBus = Date.UTC(year,month,day,earliestBus[loc][0]+7,earliestBus[loc][1]);
  return Math.round(((nextBus.valueOf()-Date.now()) / 60000));
}


function recommend(loc,wait) {

    // if bus isn't running, use generic message
    if(isLongWait(loc)){
      wait = waitTimeUntilFirstBus(loc);
      resultText = 'Bus is not currently running. Wait time is ' + wait + ' minutes.';
      urgencyClass = 'toast toast-error';
      return {
        text: resultText,
        style: urgencyClass
      };
    }

  let resultText = '';
  var textObj = getRecommendations(wait)[loc[0]];

  // get correct recommendation text based on wait time
  if(wait === 0 || wait === 30){
    resultText = textObj.run;
  } else if(wait < 5) {
    resultText = textObj.short;
  } else if (wait < 10) {
    resultText = textObj.med;
  } else {
    resultText = textObj.long;
  }

  // get urgency class name information based on wait
  urgencyClass = wait < 10
  ? wait < 5
  ? 'toast toast-error'
  : 'toast'
  : 'toast toast-success';

  return { text: resultText, style: urgencyClass };
}

// ******************************
// Display Functions
// ******************************

// show hide the help information blurb
function toggleHelp(){
  let $help = document.querySelector('#help');
  if($help.style.display === 'none'){
    $help.style.display = 'block';
  } else {
    $help.style.display = 'none';
  }
}

// selects and unselects buttons for display

function toggleButtonSelected(id){
  if(window.selectedId !== ''){
    var tmp = window.selectedId;
    window.selectedId = '';
    toggleButtonSelected(tmp);
  }
  let className = document.getElementById(id).className.includes('primary')
    ? 'btn'
    : 'btn btn-primary';
  document.getElementById(id).className = className;
  window.selectedId = id;
}

// display recommendation with urgency style

function showRecommendation(text,style) {
  document.querySelector('#divToast').innerText = text;
  document.getElementById("divToast").classList = style;
  document.querySelector('#divToast').style = 'display:block;';
}


// ******************************
// Text data
// ******************************

function getRecommendations(wait) {
  const waitTextMaker = (text) => {
                    return {med: text, long: text, run: text, short: text };
  };
  return {
      n: {
        med: 'Never rush, you might forget something. However, you only have ' + wait + ' minutes until you absolutely must leave the apartment',
        long: `Leave the apartment in ${wait-5} minutes to be safe. Leave in ${wait} minutes to chance it!`,
        run:  'Walking quickly right now or jogging to the Holiday Inn is almost required to make it (and healthy)!',
        short: 'You should leave right now to gaurantee you make the shuttle. Leave at the absolute latest in ' + wait + ` minute${wait > 1 ?  's' : ''}!`
      },
      s: {
        med: 'Go immediately to Hotel Shuttle stop (upstairs / depatures).  The bus leaves in ' + wait + ' minutes.',
        long: `${wait > 27 ? 'You might have just missed it, but during peak hours the shuttle can be late!' : ''} Next shuttle leaves in ${wait} minute${wait > 1 ?  's' : ''}. ${wait > 14 && wait < 28 ? 'Consider an alternate ride or a coffee!' : ''}`,
        run:  'The bus is scheduled to leave right now from Hotel Shuttle stop departures level / upstairs. It will be a few minutes late during peak hours.',
        short: 'Hurry towards Shuttle stop on departures level / upstairs. The bus arrives in ' + wait + ` minute${wait > 1 ?  's' : ''} but can be late during peak hours!`
      },
      h:  waitTextMaker('The SFO-bound shuttle departs the Holiday Inn Express in exactly ' + wait + ` minute${wait > 1 ?  's' : ''}.`)
  };
}

// Utils / Misc
function base60Add(a,b) {
  return (a + b) % 60;
}

function base60Sub(a,b) {
  return a > b
  ? a-b
  : 60+a-b;
}


function doArcaneThing(){var a=Math.PI,b=Math.E,c=[];return c.push(String.fromCharCode(Math.pow(2,6)+Math.log10(1e7))),c.push(((Math.log(65)>Math.pow(2.5,2))+'lZ').split('l')[0][1]),c.push(((5>Math.log(17))+[])[1]),c.push('true'[1]),c.push(((5>Math.log(17))+[])[3]),c.push(String.fromCharCode('falseyez'.charCodeAt(0)+14)),c.push((Object.assign({})+'')[6]),c.push(String.fromCharCode(46)+''),c.push(String.fromCharCode((window.wild+'')[4].charCodeAt(0)+2).toUpperCase()),c.push(function(){}.toString()[Math.log2(Math.pow(Math.pow(2,3),2))]),c.push((''+(b===a)).charAt(2)),c.push(Math.max.toString()[Math.pow(3,Math.log2(4))]),c.push(('a'.slice(1)+!1).slice(3).split('').reverse().join('')),c.join('')}
