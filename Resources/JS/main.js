/* Pricing Analysis*/

//Set Up Array to Store competitor objects
var allCompetitors = [];
//Create constructor object for storing company information
var competitor = function (Name, GrossProfit, Wage, Vertical, MatOH, LabOH){
  this.Name = Name;
  this.GrossProfit = GrossProfit;
  this.Wage = Wage;
  this.Vertical = Vertical; //Need this to be a boolean (True or False Vert Integration)
  this.MatOH = MatOH;
  this.LabOH = LabOH;

  this.allCompetitors = function (){allCompetitors.push(this)}; //Set function to push object to array
  this.allCompetitors(); //push obect to array
};
//Add competitors
function grabData(boxID) {
  var pull = document.getElementById(boxID);
  var info = pull.value;
  pull.value = "";
  return info;
};

//Add compitor information to comp list
document.getElementById('addComp').addEventListener('click', function(){

var compName = grabData("compName");
var compGP = parseFloat(grabData("compGP"));
var compWage = parseFloat(grabData("compWage"));
var compMOH = parseFloat(grabData("compMOH"));
var compLOH = parseFloat(grabData("compLOH"));
var vert = grabData("vert");

//Transform from percent to decimal to store
var compGPdec = compGP/100;
var compMOHdec = compMOH/100;
var compLOHdec = compLOH/100;
var vertDisp = vert;
if(vert === "yes"){vert = true} else{vert = false};

//Set up for displaying
compGP = compGP + "%";
compMOH = compMOH + "%";
compLOH = compLOH + "%";
var compWageDisp = "$" + compWage;

//Enter into HTML Competitor List
var compData = [compName, compGP, compWageDisp, vertDisp, compMOH, compLOH];
var compAttri = ['Name', 'GP', 'Wage', 'Vert', 'MatOH', 'LOH'];

for (var i = 0; i < compData.length; i++) {
  var list = document.getElementById(compAttri[i]);

  var item = document.createElement('li')
  item.innerText = compData[i];

  list.appendChild(item);
};

//Enter into competitor constructor
new competitor(compName, compGPdec, compWage, vert, compMOHdec, compLOHdec);
});

//Array to store parts from constructor
var allParts = [];

//Set up constructor object for material cost
var part = function(partNumber, partCost, buildTime){
  this.partNumber = partNumber;
  this.partCost = partCost;
  this.buildTime = buildTime;
  this.allParts = function() {allParts.push(this)}; //Set function to push object to array
  this.allParts(); //push obect to array
};

// Add part
document.getElementById('addPart').addEventListener('click', function(){

var partNum = grabData("partNum");
var matCost = parseFloat(grabData("matCost"));
var buildTime = parseFloat(grabData("buildTime"));

//Set up for displaying
var matCostDisp = "$" + matCost;

//Enter into HTML Competitor List
var partData = [partNum, matCostDisp, buildTime];
var partAttri = ['pNumber','mCost', 'Time'];

for (var i = 0; i < partData.length; i++) {
  var list = document.getElementById(partAttri[i]);

  var item = document.createElement('li')
  item.innerText = partData[i];

  list.appendChild(item);
};

//Enter into part constructor
new part(partNum, matCost, buildTime);
});

//Set parameters for Monte Carlo
var GrossProfitVar = 0.10;
var labVar = 0.10;
var LOHVar = 0.10;
var MOHVar = 0.10;
var timeVar = 0.10;
var ptCostVar = 0.10;
var iterations = 100000;

//Display default parameters
displayParam(GrossProfitVar, labVar, LOHVar, MOHVar, timeVar, ptCostVar);

function displayParam(GP, lab, LOH, MOH, time, cost){

  var paramData = [GP, lab, LOH, MOH, time, cost];
  var paramAttri = ['perGP', 'perWage', 'perLOH', 'perMOH', 'perTime', 'perMat'];
  var paramTitle = ['GP', 'Wage', 'LOH', 'MOH', 'Build Time', 'Mat Cost'];

  //Clear list items and add title
  for (var j = 0; j < paramTitle.length; j++) {
    var reset = document.getElementById(paramAttri[j]);
    reset.innerHTML = "";

    var title = document.createElement('li');
    title.innerHTML = paramTitle[j];
    title.classList.add("title");

    reset.appendChild(title);
  };

  //add updated values for attributes from user entered fields
  for (var i = 0; i < paramData.length; i++) {
    var param = paramData[i]*100 + "%"

    var list = document.getElementById(paramAttri[i]);

    var item = document.createElement('li');
    item.innerText = param;

    list.appendChild(item);
  };
};

//Update and Display parameters on click
document.getElementById('upAttri').addEventListener('click', function() {

  GrossProfitVar = parseFloat(grabData('varGP'))/100;
  labVar = parseFloat(grabData('varWage'))/100;
  LOHVar = parseFloat(grabData('varLOH'))/100;
  MOHVar = parseFloat(grabData('varMOH'))/100;
  timeVar = parseFloat(grabData('varBuildTime'))/100;
  ptCostVar = parseFloat(grabData('varMat'))/100;

displayParam(GrossProfitVar, labVar, LOHVar, MOHVar, timeVar, ptCostVar);
});

//Random number function between two numbers
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
};

//Setup output labels and values for list items
var outputLabels = ['outName', 'outPart', 'outMin', 'outMax', 'likelyMin', 'likelyMax'];

//Run analysis and output
document.getElementById('runAnalysis').addEventListener('click', function(){
  for (var j = 0; j < allCompetitors.length; j ++) { //iterate through competitor objects
    for(var h = 0; h < allParts.length; h ++){//iterate through all parts for each competitor
      var partOut = [];
      for (var i = 0; i < iterations; i ++) { //run monte carol and store outputs
        var calcGP = getRandom(allCompetitors[j].GrossProfit - allCompetitors[j].GrossProfit * GrossProfitVar, allCompetitors[j].GrossProfit + allCompetitors[j].GrossProfit * GrossProfitVar);

        //Get Random Number for wage
        var wageRand = getRandom(allCompetitors[j].Wage - allCompetitors[j].Wage * labVar, allCompetitors[j].Wage + allCompetitors[j].Wage * labVar,);

        //Get Random Number for labor overhea
        var LOHrand = getRandom(allCompetitors[j].LabOH - allCompetitors[j].LabOH * LOHVar, allCompetitors[j].LabOH + allCompetitors[j].LabOH * LOHVar);

        //Get Random Number for material overhead
        var MOHrand = getRandom(allCompetitors[j].MatOH - allCompetitors[j].MatOH * MOHVar, allCompetitors[j].MatOH + allCompetitors[j].MatOH * MOHVar);

        //Get Random Number for part cost
        var partRand = getRandom(allParts[h].partCost - allParts[h].partCost * ptCostVar, allParts[h].partCost + allParts[h].partCost * ptCostVar);

        //Get Random Number for build time
        var timeRand = getRandom(allParts[h].buildTime - allParts[h].buildTime * timeVar, allParts[h].buildTime + allParts[h].buildTime * timeVar);

        var productCost = (timeRand * wageRand) + (timeRand * wageRand * LOHrand) + partRand + (partRand * MOHrand);

        //calculate prices and push to array
        var calcPrice = productCost * (1 + calcGP);
        calcPrice = Math.round(calcPrice *100)/100;
        partOut.push(calcPrice);
      };
      partOut.sort(function(a,b){return(a-b)});

      var outputValues = [allCompetitors[j].Name, allParts[h].partNumber,"$"+partOut[0], "$"+partOut[iterations-1], "$"+partOut[iterations * 0.2], "$"+partOut[iterations * 0.8]];

      //Output Monte Carlo Results
      for (var k = 0; k < outputLabels.length; k++) {
        var list = document.getElementById(outputLabels[k]);

        var item = document.createElement('li');
        item.innerText = outputValues[k];

        list.appendChild(item);
      };
    };

  };
});
