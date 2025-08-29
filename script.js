
document.addEventListener('DOMContentLoaded', () =>{   
/*const wordsUnit01 = {
    "ache": "біль (н-д, голова)",
    "active": "активний",
    "affect": "вплив",
    "allergic": "алергічний",
    "allergy": "алергія",
    "aspirin": "аспірин",
    "backache": "біль у спині",
    "band-aid": "пластир",
    "bandage": "пов'язка",
    "bleed": "кровотеча",
    "catch": "ловити"
  }
*/
function setActiveMenuItem (event) {
           

    console.log(event.target.textContent);
    let activeItem = document.querySelector('.active');
    if (activeItem) activeItem.classList.remove('active');
    event.target.classList.add('active');
          
}

function selectUnit (event) {
    let unitName = document.querySelector('.active').textContent.replaceAll(' ', '');
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

function fillForm(count){

    //console.log('======= globalWordList: ', wordList);
   // console.log('shuffledKeys : ', shuffledKeys);
    document.querySelector('.msgStart').classList.add('hidden');
    document.querySelector('.msg').classList.remove('visible');
    document.querySelector('.answer').textContent = '';
    //console.log('shuffledKeys[count]: ', shuffledKeys[count]);
    //console.log('wordList[shuffledKeys[count]]: ', wordList[shuffledKeys[count]]);
    let word_ukr = wordList[shuffledKeys[count]];
    let answer = shuffledKeys[count];
    //console.log('word_ukr: ', word_ukr);
   // console.log('answer: ', answer);
    document.querySelector('.word-ukr').textContent = word_ukr;
    document.querySelector('#word_eng').name = answer;
    document.querySelector('.card').classList.add('visible');
}

let count;
let wordList;
let shuffledKeys;
let wordsQuantity;
let countCorrect;
function startPractice(list){
    countCorrect = 0;
    wordList = list;

   // console.log('practice ', wordList);
    const keys = Object.keys(wordList);
   // console.log('keys :', keys);
    shuffledKeys = shuffleArray(keys);
    wordsQuantity = shuffledKeys.length;
    //console.log('shuffledKeys : ', shuffledKeys);
    // Перебираем перемешанные ключи
 /*   for (const key of shuffledKeys) {
        console.log(`Ключ: ${key}, Значение: ${wordList[key]}`);

    }
    
    wordCheck(wordList, shuffledKeys);    */
    
    
   
    fillForm(count);

}

function resetInput() {
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
            resetInput();
            setActiveMenuItem (event);
            let unitName = selectUnit (event);
            let jsonName = unitName + '_words.json';

            fetch(jsonName)
                .then(response => response.json())
                .then(wordList => {                
                    console.log('wordList = ', wordList);
                    startPractice(wordList);        
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
    console.log('word = ', word);
    console.log('answer = ', answer);
    if (word === answer) {
        //console.log("correct");
        countCorrect++;
        console.log('countCorrect = ', countCorrect);
        elem.classList.remove('error');
        elem.classList.add('correct');
        document.getElementById('next').focus();
    } else {
        elem.classList.remove('correct');
        elem.classList.add('error');
        //console.log("incorrect");
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
        //console.log('count = ', count);
        //console.log('wordList = ', shuffledKeys);
       // console.log('length = ', shuffledKeys.length);
        let elem = document.getElementById('word_eng');
        if (!elem.classList.contains('checked')) checkAnswer();
        resetInput();
        
        if (count < wordsQuantity-1) {
            count++;
            console.log('count+ = ', count);
            fillForm(count);
        }
        else {
            document.querySelector('.card').classList.remove('visible');
            document.querySelector('.msg').classList.add('visible');
            let result = Math.round(countCorrect*100/wordsQuantity);
            document.querySelector('.result' ).innerHTML = "Result: <br>"+result+"% correct";
            //document.querySelector('.card').innerHTML 
        }
    });

    /*document.querySelector('.repeat').addEventListener('click', wordsPractice());

    document.getElementById('word_eng').addEventListener('blur', event => {
        console.log('value = ', event.target.value);
        let word =  event.target.value;
        let answer = event.target.name;
        console.log('word = ', word);
        console.log('answer = ', answer);
        if (word === answer) {
            console.log("correct");
            event.target.classList.remove('error');
            event.target.classList.add('correct');
        } else {
            event.target.classList.remove('correct');
            event.target.classList.add('error');
            console.log("incorrect");
        }
    }); */
   
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
});



