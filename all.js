Vue.component('stackItem', {
    template: '#stackItem',
    props: ['item'],
    methods: {
        emittarget() {
            this.$emit('emittarget', this.item.id)
        },
        emitsound() {
            this.$emit('emitsound', this.item.cipher)
        }
    },
})

let app = new Vue({
    el: '#app',
    data: {
        insert: '',
        cipherNow: '',
        myStack: JSON.parse(localStorage.getItem('morseCodeList')) || [],
        morseCodeAlpha: {
            "0": "-----",
            "1": ".----",
            "2": "..---",
            "3": "...--",
            "4": "....-",
            "5": ".....",
            "6": "-....",
            "7": "--...",
            "8": "---..",
            "9": "----.",
            "a": ".-",
            "b": "-...",
            "c": "-.-.",
            "d": "-..",
            "e": ".",
            "f": "..-.",
            "g": "--.",
            "h": "....",
            "i": "..",
            "j": ".---",
            "k": "-.-",
            "l": ".-..",
            "m": "--",
            "n": "-.",
            "o": "---",
            "p": ".--.",
            "q": "--.-",
            "r": ".-.",
            "s": "...",
            "t": "-",
            "u": "..-",
            "v": "...-",
            "w": ".--",
            "x": "-..-",
            "y": "-.--",
            "z": "--..",
            ".": ".-.-.-",
            ",": "--..--",
            "?": "..--..",
            "!": "-.-.--",
            "-": "-....-",
            "/": "-..-.",
            "@": ".--.-.",
            "(": "-.--.",
            ")": "-.--.-",
            " ": " "
        },
        AudioContext: window.AudioContext || window.webkitAudioContext,
        ctx: new AudioContext(),
        dot: 1.2 / 15
    },
    methods: {
        pushStack() {
            let vm = this;
            let time = Date.now();

            if (!vm.insert) {
                return
            }

            vm.myStack.push({
                plainCode: vm.insert,
                cipher: vm.cipherNow,
                id: time
            });

            localStorage.setItem('morseCodeList', JSON.stringify(vm.myStack));

            vm.cipherNow = '';
            vm.insert = '';
        },
        removeStack(del) {
            let vm = this;
            let target = del;

            vm.myStack.forEach((el, index, arr) => {
                if (el['id'] === target) {
                    arr.splice(index, 1);
                }
            });

            localStorage.setItem('morseCodeList', JSON.stringify(vm.myStack));
        },
        //This Function from https://codepen.io/cople/pen/zZLJOz
        playMorse(myCode) {
            let vm = this;
            let t = vm.ctx.currentTime;

            let oscillator = vm.ctx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = 440;

            let gainNode = vm.ctx.createGain();
            gainNode.gain.setValueAtTime(0, t);

            let code = typeof myCode === 'string' ? myCode : vm.cipherNow;
            //console.log(code);
            code.split('').forEach(function (letter) {
                switch (letter) {
                    case ".":
                        gainNode.gain.setValueAtTime(1, t);
                        t += vm.dot;
                        gainNode.gain.setValueAtTime(0, t);
                        t += vm.dot;
                        break;
                    case "-":
                        gainNode.gain.setValueAtTime(1, t);
                        t += 3 * vm.dot;
                        gainNode.gain.setValueAtTime(0, t);
                        t += vm.dot;
                        break;
                    case " ":
                        t += 7 * vm.dot;
                        break;
                }
            });

            oscillator.connect(gainNode);
            gainNode.connect(vm.ctx.destination);

            oscillator.start();

            return false;
        }
    },
    computed: {
        encoder() {
            let vm = this;
            let output = [];
            
            if(!vm.insert){
                return
            }

            vm.insert.toLowerCase().split('').forEach((el) => {
                output.push(vm.morseCodeAlpha[el]);
            })

            vm.cipherNow = output.join('');
            return vm.cipherNow;
        }
    }
});
