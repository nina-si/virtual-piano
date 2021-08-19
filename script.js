// Заранее прошу прощения за качество кода и спасибо за проверку!

const piano = document.querySelector('.piano');
const keys = document.querySelectorAll('.piano-key');
const notesLetters = document.querySelector('.btn-container'); // Контейнер кнопок переключения Notes/Letters
const lettersButtons = document.querySelectorAll('.btn'); // Кнопки Notes/Letters
const fullScreenButton = document.querySelector('.fullscreen'); // Кнопка для перехода в режим Fullscreen

// Создаем объект для запоминания, нажата ли клавиша
let pianoLetters = 'DFGHJKLRTUIO';
pressedLetters = {};
for (let i = 0; i < pianoLetters.length; i++) {
  pressedLetters[pianoLetters[i]] = {symbol: pianoLetters[i], pressed: false};
}

// Переключение отображаемых символов Notes/Letters
function toggleLetters() {
  lettersButtons.forEach((e) => {
    if((e.classList.contains('btn-active')) && (e.classList.contains('btn-letters'))) {
      keys.forEach((e) => {
        e.classList.add('letter');
      });
    } else {
        keys.forEach((e) => {
          e.classList.remove('letter');
        });
      }
  });
}

// Переключение класса .btn-active у кнопок Notes/Letters
notesLetters.addEventListener('click', (event) => {
  if(event.target.classList.contains('btn')) {
    lettersButtons.forEach((e) => {
      if(e.classList.contains('btn-active')) {
        e.classList.remove('btn-active');
      }
    });
    event.target.classList.add('btn-active');
  }  
  toggleLetters();
});

// Проигрывание аудио
const playAudio = (event) => {
  if(event.type=='keydown') {
    const keyCode = event.code.substring(3); // Получаем символ нажатой клавиши
    const activeKey = document.querySelector(`.piano-key[data-letter="${keyCode}"]`);
    if(!activeKey) return; // Выходим из функции, если не найден элемент .piano-key дл выбранного символа
    if(!pressedLetters[`${keyCode}`].pressed) { // Если клавиша клавиатуры не была зажата ранее, делаем клавишу пианино активной и воспроизводим звук
      activeKey.classList.add('piano-key-active');
      const keyAudio = document.querySelector(`audio[data-letter="${keyCode}"]`);
      keyAudio.currentTime = 0;
      keyAudio.play();
      pressedLetters[`${keyCode}`].pressed = true;
    }
  } else if((event.type=='mousedown')||(event.type=='mouseover')) {
    const mouseAudio = document.querySelector(`audio[data-letter="${event.srcElement.dataset.letter}"]`);
    if(!mouseAudio) return;
    mouseAudio.currentTime = 0;
    mouseAudio.play();
  }
}

// Присвоение класса Active при использовании мыши
const makeActive = (event) => {
  event.target.classList.add('piano-key-active');
  playAudio(event);
}

// Убираем класс Active
const undoActive = (event) => {
  event.target.classList.remove('piano-key-active');
}

// Отслеживание перемещения мыши с зажатой ЛКМ, добавляем обработчики событий для клавиш пианино
const startMouseover = (event) => {
  if(event.target.classList.contains('piano-key')) {
    event.target.classList.add('piano-key-active');
    playAudio(event);
  }
  keys.forEach((e) => {
    e.addEventListener('mouseover', makeActive);
    e.addEventListener('mouseout', undoActive);
  });
}

// Перестаем отслеживать перемещение мыши, убираем класс Active у клавиш
const stopMouseover = () => {
  keys.forEach((e) => {
    e.classList.remove('piano-key-active');
    e.removeEventListener('mouseover', makeActive);
    e.removeEventListener('mouseout', undoActive);
  });
}

// Удаление класса piano-key-active при отжатии клавиши на клавиатуре и переключение флага pressed
const removeActiveClass = (event) => {
  const unpressedSymbol = event.code.substring(3); // Символ на отжатой клавише клавиатуры
  if(!pressedLetters[unpressedSymbol]) return; // Выходим из функции, если отжата клавиша, не вызывающая звук
  pressedLetters[unpressedSymbol].pressed = false;
  const unpressedKey = document.querySelector(`.piano-key[data-letter="${unpressedSymbol}"]`);
  unpressedKey.classList.remove('piano-key-active');
}

// Переход в режим FullScreen и обратно
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

piano.addEventListener('mousedown', startMouseover, false);
window.addEventListener('mouseup', stopMouseover);
document.addEventListener('keydown', playAudio);
document.addEventListener('keyup', removeActiveClass);
fullScreenButton.addEventListener('click', toggleFullScreen);
