
document.addEventListener('DOMContentLoaded', () =>{   

function setActiveMenuItem (event) {
           

   // console.log(event.target.textContent);
    let activeItem = document.querySelector('.active');
    if (activeItem) activeItem.classList.remove('active');
    event.target.classList.add('active');
          
}

function selectUnit (event) {
    console.log("select unit");
    let unitName = document.querySelector('.active').getAttribute('name');
    console.log('unitName =', unitName);
    return unitName;

}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

function fillFormWords(count){
    document.querySelector('.msg').classList.remove('visible');
    document.querySelector('.answer').textContent = '';
    let word_ukr = wordList[shuffledKeys[count]];
    let answer = shuffledKeys[count];
    document.querySelector('.word-ukr').textContent = word_ukr;
    document.querySelector('#word_eng').name = answer;
    document.querySelector('.card').classList.add('visible');
    

    
}

function addRepeatMarker() {
    for (i=0; i<wordList.length; i++) {
        wordList[i].repeat = true;
    }
}


let count;
let wordList;
let shuffledKeys;
let wordsQuantity;
let countCorrect;
function startPractice(list, unitName){
    countCorrect = 0;
    wordList = list;
    addRepeatMarker();
    console.log('type of wordlist = ', typeof(wordList));
    const keys = Object.keys(wordList);
    console.log('keys = ',keys);
    shuffledKeys = shuffleArray(keys);
    wordsQuantity = shuffledKeys.length;
    console.log('wordsQuantity = ', wordsQuantity);
    document.querySelector('.msgStart').classList.add('hidden');
    document.querySelector('.card').classList.add('visible');
    if (unitName == "irregular") {
        /// можно ли здесь использовать тоггл?
        document.querySelector('.words').classList.add('hidden');
        document.querySelector('.irregular_words').classList.remove('hidden');
        console.log('fill__irreg');
        console.log('count_before fillFormIrreg - ', count);
        fillFormIrregular(count);
    } else {
        document.querySelector('.irregular_words').classList.add('hidden');
        document.querySelector('.words').classList.remove('hidden');
      console.log('fill  __ words');
        fillFormWords(count); 
    }
    
}

function resetFormWords() {
    document.querySelector('.word-ukr').textContent = ""; // не работает?!!!!!
    let elem = document.getElementById('word_eng');
    elem.disabled = false;
    elem.className = '';
    elem.name = '';
    elem.value = '';
    elem.focus();
}


function wordsPractice() {
    document.querySelector('#units').addEventListener('click', event => {    
        if (event.target.tagName === 'LI') {
            count = 0;
            setActiveMenuItem (event);
            let unitName = selectUnit (event);
            if (unitName == "irregular") {
                resetFormIrregular();
            } else {
                resetFormWords();  
            }
            let jsonName = unitName + '_words.json';

            fetch(jsonName)
                .then(response => response.json())
                .then(wordList => {                
                    console.log('wordList = ', wordList);
                    startPractice(wordList, unitName);        
                })
                .catch(error => {
                    console.error('Ошибка при загрузке JSON: ', error);
            });  
        }           
    });         
}

function checkAnswer () {
    let elem = document.getElementById('word_eng');
    elem.classList.add('checked');
    let word = elem.value;
    let answer = elem.name;
    if (word === answer) {
        countCorrect++;
        elem.classList.remove('error');
        elem.classList.add('correct');
        document.getElementById('next').focus();
    } else {
        elem.classList.remove('correct');
        elem.classList.add('error');
    }
}



  //  setActiveMenuItem ();
    wordsPractice();

    document.querySelector('#show-answer').addEventListener('click', function(){
        let elem = document.getElementById('word_eng');
        elem.disabled = true;
        let answer = elem.name;
        document.querySelector('.answer').textContent = answer;
    });

    

    document.querySelector('#next').addEventListener('click', function() {
        let elem = document.getElementById('word_eng');
        if (!elem.classList.contains('checked')) {
            checkAnswer()
        };
        resetFormWords();
        
        if (count < wordsQuantity-1) {
            count++;
            console.log('count+ = ', count);
            fillFormWords(count);
        }
        else {
            document.querySelector('.card').classList.remove('visible');
            document.querySelector('.msg').classList.add('visible');
            let result = Math.round(countCorrect*100/wordsQuantity);
            document.querySelector('.result' ).innerHTML = "Result: <br>"+result+"% correct";
        }
    });
    document.getElementById('check-answer').addEventListener('click', function (){
        checkAnswer();
    });

    

    document.getElementById('word_eng').addEventListener('focus', event => {
        event.target.className = '';
    });

    document.getElementById('word_eng').addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            document.getElementById('check-answer').focus();
        }
    });

    // IRREGULAR VERBS

    function fillFormIrregular(count){
        console.log('count-irreg = ', count);
        document.querySelector('.msg').classList.remove('visible');
        document.querySelector('.irregular_words p').textContent = wordList[shuffledKeys[count]].word;
        document.getElementById('word-eng-f1').name = wordList[shuffledKeys[count]].form1;
        document.getElementById('word-eng-f2').name = wordList[shuffledKeys[count]].form2;
        document.getElementById('word-eng-f3').name = wordList[shuffledKeys[count]].form3;
        document.getElementById('word-eng-f1').focus();

    }

   function checkAnswerIrregular(){
        let elem1 = document.getElementById('word-eng-f1');
        let elem2 = document.getElementById('word-eng-f2');
        let elem3 = document.getElementById('word-eng-f3');
        elem1.className = '';
        elem2.className = '';
        elem3.className = '';
        if (elem1.name != elem1.value) {
        
            elem1.classList.add('error');
        } else {
            
            elem1.classList.add('correct');
        };
        if (elem2.name != elem2.value) {
            
            elem2.classList.add('error')
        } else {
            
            elem2.classList.add('correct');
        
        }; 
        if (elem3.name != elem3.value) {
            
            elem3.classList.add('error')
        } else {
            
            elem3.classList.add('correct');
        };
        elem1.classList.add('checked');
        elem2.classList.add('checked');
        elem3.classList.add('checked');
        if (elem1.classList.contains('correct') & elem2.classList.contains('correct') & elem3.classList.contains('correct')) {
            document.getElementById('next-irregular').focus();
        }

    }
    /// сделать один обработчик
    document.getElementById('word-eng-f1').addEventListener('keydown', event =>{
        if (event.key === 'Enter') {
            document.getElementById('word-eng-f2').focus();
        }
    });
    document.getElementById('word-eng-f2').addEventListener('keydown', event =>{
        if (event.key === 'Enter') {
            document.getElementById('word-eng-f3').focus();
        }
    });
    document.getElementById('word-eng-f3').addEventListener('keydown', event =>{
        if (event.key === 'Enter') {
            document.getElementById('check-answer-irregular').focus();
        }
    });

    document.getElementById('check-answer-irregular').addEventListener('click', function (){
        checkAnswerIrregular();
    });
    document.getElementById('next-irregular').addEventListener('click', function(){
        
        if (!document.getElementById('word-eng-f1').classList.contains('checked')){
            checkAnswerIrregular();
        }
        // переписать через foreach?
        let form1 = document.getElementById('word-eng-f1');
        let form2 = document.getElementById('word-eng-f2');
        let form3 = document.getElementById('word-eng-f3');
        if (form1.classList.contains('correct') & form2.classList.contains('correct') & form3.classList.contains('correct')){
            countCorrect++;
            console.log('countCorrect = ', countCorrect);
        }
        resetFormIrregular();
        
        if (count <wordsQuantity-1) {
            count++;
            console.log('count_irreg = ', count);
            fillFormIrregular(count);
        } else {
            document.querySelector('.card').classList.remove('visible');
            document.querySelector('.msg').classList.add('visible');
            let result = Math.round(countCorrect*100/wordsQuantity);
            document.querySelector('.result' ).innerHTML = "Result: <br>"+result+"% correct";
        }
    });


    document.querySelector('#show-answer-irregular').addEventListener('click', function(){
        let form1 = document.getElementById('word-eng-f1').name;
        let form2 = document.getElementById('word-eng-f2').name;
        let form3 = document.getElementById('word-eng-f3').name;

        document.querySelector('label[for = "word-eng-f1"]').textContent = form1;
        document.querySelector('label[for = "word-eng-f2"]').textContent = form2;
        document.querySelector('label[for = "word-eng-f3"]').textContent = form3;   
        let itemsInput = document.querySelectorAll('input[type = "text"]');
        itemsInput.forEach(itemsInput => {
            itemsInput.disabled = true;
        });
        document.getElementById('next-irregular').focus();


    });

    function resetFormIrregular(){
        let itemsInput = document.querySelectorAll('.irregular_words input[type="text"]');
        itemsInput.forEach(itemsInput => {
            itemsInput.disabled = false;
            itemsInput.textContent = "";
            itemsInput.className = '';
            itemsInput.name = '';
            itemsInput.value = '';
        });
        itemsInput[0].focus();

        let itemsLabel = document.querySelectorAll('label');
        itemsLabel.forEach(itemsLabel => {
            itemsLabel.textContent = "";
        })
    }

});



