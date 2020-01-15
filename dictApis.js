const https = require('https');
var __                = require('underscore');

  const apihost = 'https://fourtytwowords.herokuapp.com';
  const API_KEY = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164';
  var game_state = false;
  var game_state_pause = false;
  let game_entire_data = null;
  exports.getRandomWord = async function(){
    let data = '';
    return new Promise((resolve,reject)=>{
      https.get(apihost+'/words/randomWord?api_key='+API_KEY, (resp) => {

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          //console.log(JSON.parse(data));
          resolve();
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    }).then(()=>{
      return data;
    });
  }
  exports.game_entire_data = game_entire_data;
  exports.game_state = game_state;


  exports.defineRandomWord = async function(){
    let def_data = '';
    return new Promise((resolve,reject)=>{
        this.getRandomWord().then(data=>{
        let json_data = JSON.parse(data);
        https.get(apihost+'/word/'+json_data.word+'/definitions?api_key='+API_KEY, (resp) => {

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          def_data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve();
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    });
    }).then(()=>{
      return JSON.parse(def_data);
    });
    
  }


  exports.definitionOfWord = async function(word){
    let def_data = '';

    return new Promise((resolve,reject)=>{
        https.get(apihost+'/word/'+word+'/definitions?api_key='+API_KEY, (resp) => {

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          def_data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve();
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    }).then(()=>{
      return JSON.parse(def_data);
    });
  }



  exports.getWordSynonyms = async function(word){
    let synonym_data = '';

    return new Promise((resolve,reject)=>{
        https.get(apihost+'/word/'+word+'/relatedWords?api_key='+API_KEY, (resp) => {

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          synonym_data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve();
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    }).then(()=>{
      let res_data;
      let temp_data = JSON.parse(synonym_data);
      if(typeof temp_data.error == 'undefined'){
        for(var i=0; i<temp_data.length; i++){
          if(temp_data[i].relationshipType == 'synonym'){
            res_data = temp_data[i];
            break;
          }
        }
      }else{
        res_data = temp_data;
      }
      return res_data;
    });
  }

  exports.getWordAntonyms = async function(word){
    let antonym_data = '';

    return new Promise((resolve,reject)=>{
        https.get(apihost+'/word/'+word+'/relatedWords?api_key='+API_KEY, (resp) => {

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          antonym_data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve();
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    }).then(()=>{
      let res_data;
      var flag = false;
      let temp_data = JSON.parse(antonym_data);
      if(typeof temp_data.error == 'undefined'){
        for(var i=0; i<temp_data.length; i++){
          if(temp_data[i].relationshipType == 'antonym'){
            res_data = temp_data[i];
            flag = true;
            break;
          }
        }
      }else{
        res_data = temp_data;
      }

      if(!flag){
        res_data = {'error':'No Antonym Present'};
      }
      return res_data;
    });
  }

  exports.getWordExamples = async function(word){
    let data = '';
    return new Promise((resolve,reject)=>{
      https.get(apihost+'/word/'+word+'/examples?api_key='+API_KEY, (resp) => {

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          //console.log(JSON.parse(data));
          resolve();
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    }).then(()=>{
      return JSON.parse(data);
    });
  }

    exports.getRandomInformation = async function(){
    let def_data = {};
    let word;
    return new Promise((resolve,reject)=>{
          this.getRandomWord().then((data)=>{
              data = JSON.parse(data);
              word = data.word;
              def_data.word = word;
              this.definitionOfWord(data.word).then((data1)=>{
                  def_data.def = data1;
                  if(typeof data1.error == 'undefined'){
                      def_data.def = data1;
                  }else{
                      def_data.def = data1;
                  }
                  this.getWordSynonyms(word).then((data2)=>{
                  if(typeof data2.error == 'undefined'){
                      def_data.synonym = data2;
                  }else{
                      def_data.synonym = data2;
                  }
                      this.getWordAntonyms(word).then((data3)=>{
                        if(typeof data3.error == 'undefined'){
                          def_data.antonym = data3;
                        }else{
                          def_data.antonym = data3;
                        }
                            this.getWordExamples(word).then((data4)=>{
                              if(typeof data4.error == 'undefined'){
                                def_data.examples = data4.examples;
                              }else{
                                def_data.examples = data4;
                              }
                              resolve();
                            });

                      });
                  });
              });
          });
    }).then(()=>{
      return def_data;
    })
    
  }


 exports.getWordInformation = async function(word){
    let def_data ={};
    def_data.word = word;
    return new Promise((resolve,reject)=>{
              this.definitionOfWord(word).then((data1)=>{
                  def_data.def = data1;
                  if(typeof data1.error == 'undefined'){
                      def_data.def = data1;
                  }else{
                      def_data.def = data1;
                  }
                  this.getWordSynonyms(word).then((data2)=>{
                  if(typeof data2.error == 'undefined'){
                      def_data.synonym = data2;
                  }else{
                      def_data.synonym = data2;
                  }
                      this.getWordAntonyms(word).then((data3)=>{
                        if(typeof data3.error == 'undefined'){
                          def_data.antonym = data3;
                        }else{
                          def_data.antonym = data3;
                        }
                            this.getWordExamples(word).then((data4)=>{
                              if(typeof data4.error == 'undefined'){
                                def_data.examples = data4.examples;
                              }else{
                                def_data.examples = data4;
                              }
                              resolve();
                            });

                      });
                  });
              });
    }).then(()=>{
      return def_data;
    })
    
  }

  exports.getGameData = async function(){
    let def_data = {};
    let word;
    this.game_state = true;
    this.game_state_pause = true;
    return new Promise((resolve,reject)=>{
          this.getRandomWord().then((data)=>{
              data = JSON.parse(data);
              word = data.word;
              def_data.word = word;
              this.definitionOfWord(data.word).then((data1)=>{
                  def_data.def = data1;
                  this.getWordSynonyms(word).then((data2)=>{
                  if(typeof data2.error == 'undefined'){
                      def_data.synonym = data2;
                  }else{
                      def_data.synonym = data2;
                  }
                      this.getWordAntonyms(word).then((data3)=>{
                        if(typeof data3.error == 'undefined'){
                          def_data.antonym = data3;
                        }else{
                          def_data.antonym = data3;
                        }
                            this.getWordExamples(word).then((data4)=>{
                              if(typeof data4.error == 'undefined'){
                                def_data.examples = data4.examples;
                              }else{
                                def_data.examples = data3;
                              }
                              resolve();
                            });

                      });
                  });
              });
          });
    }).then(()=>{
      return def_data;
    })
    
  }



  exports.showDefinations = function(data,word){
    if(typeof data.error=='undefined'){
        console.log("Below are the definations of "+word);
        for(var i= 0;i<data.length;i++){
          console.log((i+1)+") "+data[i].text);
        }
      }else{
        console.log('Sorry,',data.error);
      }
  }

  exports.showSynonyms = function(data,word){
    if(typeof data.error == 'undefined'){
        console.log("Below are the synonyms of "+word);
        for(var i= 0;i<data.words.length;i++){
          console.log((i+1)+") "+data.words[i]);
        }
        //console.log(data.words);
      }else{
        console.log('The',data.error);
      }
  }

  exports.showAntonyms = function(data,word){
    if(typeof data.error == 'undefined'){
        console.log("Below are the antonyms of "+word);
        for(var i= 0;i<data.words.length;i++){
          console.log((i+1)+") "+data.words[i]);
        }
        //console.log(data.words);
      }else{
        console.log(data.error,'for',word);
      }
  }


  exports.showExamples = function(data,word){
    if(typeof data.error=='undefined'){
        console.log("Below are the examples of "+word);
        for(var i= 0;i<data.length;i++){
          console.log((i+1)+") "+data[i].text);
        }
      }else{
        console.log('Sorry,',data.error);
      }
  }


  exports.showRandomMessage = function(data){
    data = JSON.parse(JSON.stringify(data));
    console.log('WORD:',data.word);
    console.log('-------------------------');
    console.log('DEFINITIONS');
    this.showDefinations(data.def,data.word);
    console.log('-------------------------');
    console.log('EXAMPLES');
    this.showExamples(data.examples,data.word);
    console.log('-------------------------');
    console.log('SYNONYMS');
    this.showSynonyms(data.synonym,data.word);
    console.log('-------------------------');
    console.log('ANTONYMS');
    this.showAntonyms(data.antonym, data.word);
  }

 exports.showGameData = function(data){
    data = JSON.parse(JSON.stringify(data));
    this.game_entire_data = data;
    console.log('What is the word???????');
    console.log('-------------------------');
    console.log('DEFINITIONS');
    this.showDefinationsGame(data.def);
    console.log('-------------------------');
    console.log('-------------------------');
    console.log('SYNONYMS');
    this.showSynonymGame(data.synonym);
  }

  exports.showDefinationsGame = function(data){
    if(typeof data.error=='undefined'){
        var random = Math.floor(Math.random() * data.length);
        console.log("Below are the defination of the word");
        console.log(data[random].text);
      }else{
        console.log('Sorry,',data.error);
      }
  }



  exports.showSynonymGame = function(data){
    if(typeof data.error == 'undefined'){
      this.game_entire_data.syn = data.words[Math.floor(Math.random() * data.words.length)]
        console.log("Synonym of the word:",this.game_entire_data.syn);
        //console.log(data.words);
      }else{
        console.log('The',data.error);
      }
  }

  exports.closeGame = function(){
    this.game_state = false;
    this.game_state_pause = false;
    this.game_entire_data = null;
  }


  exports.checkAnswer = function(data,answer){
    if(data.word==answer){
      console.log('Correct Answer, Game finished!');
      this.game_state = false;
    }else{
      for(var i=0;i<data.synonym.words.length;i++){
        if(data.synonym.words[i]==answer && answer!=this.game_entire_data.syn){
          console.log('Correct Answer, Game finished!');
          this.game_state = false;
          return;
        }
      }
      this.game_state_pause = false;
      console.log('1. Try Again.');
      console.log('2. Hint');
      console.log('3. Quit');
    }
  }

  exports.getJumbleWord =  function(word){
    var wordsArray      = word.split('');
        jumbleArray     = __.shuffle(wordsArray);

    console.log('Jumbled word:',jumbleArray.join(''));
  }



  