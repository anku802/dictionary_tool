
var HELP_MESSAGE = 'Available commands:\n\nFor definition:      ./dict def <word>'
                        + '\nFor synonyms:        ./dict syn <word>\nFor antonyms:        ./dic ant <word>'
                        + '\nFor examples:        ./dict ex <word>\nFor full dictionary: ./dict <word>'
                        + '\nFor word of the day dictionary:  ./dict\nFor word game:       ./dict play';
  
var dictApis = require('../dictApis.js');

function Routes(data){
  // if either data or config not present return
  if(!data)
    return;

  // split the data to extract app(./dic), command and word
  if(dictApis.game_state == false){
    data = data.split(' ');
    let app = data[0];
    let command = data[1];
    let word = data[2];
    if(typeof command=='undefined'){
        dictApis.getRandomInformation().then((data)=>{
        dictApis.showRandomMessage(data);
    });
    }else{
      switch(command){
        case 'defn':{
          dictApis.definitionOfWord(word).then((data)=>{
          dictApis.showDefinations(data,word);
        });
        break;
      }

      case 'syn':{
        dictApis.getWordSynonyms(word).then((data)=>{
          dictApis.showSynonyms(data,word);
        });
        break;
      }

      case 'ant':{
        dictApis.getWordAntonyms(word).then((data)=>{
         dictApis.showAntonyms(data,word);
        });
        break;
      }

      case 'ex':{
        dictApis.getWordExamples(word).then((data)=>{
          dictApis.showExamples(data.examples,word);
      
        });
        break;
      }

      case 'play':{
        dictApis.getGameData(command).then((data)=>{
          dictApis.showGameData(data);
        });
        break;
      }

      case 'help':{
        console.log(HELP_MESSAGE);
      break;
      }

      default:{
          dictApis.getWordInformation(command).then((data)=>{
            dictApis.showRandomMessage(data);
            
          });
          break;
      }
    }
  }
  }else{
    this._input = data;
     switch(this._input[0]){
      case '1':
          dictApis.game_state_pause = true;
          console.log('Please  enter the word again');
          break;
      case '2':
          dictApis.game_state_pause = true;
          console.log('=======HINT=========');
          dictApis.getJumbleWord(dictApis.game_entire_data.word);
          dictApis.showDefinationsGame(dictApis.game_entire_data.def);
          dictApis.showSynonymGame(dictApis.game_entire_data.synonym);
          break;
      case '3':
          dictApis.game_state_pause = true; 
          dictApis.closeGame();
          break;
      default:
          if(dictApis.game_entire_data!=null && dictApis.game_state_pause){
            dictApis.checkAnswer(dictApis.game_entire_data,_input);
          }else{
            if(!dictApis.game_state_pause){
              console.log('1. Try Again.');
              console.log('2. Hint');
              console.log('3. Quit');
            }
          }
          break;

      
  }
  
}};



module.exports = Routes;