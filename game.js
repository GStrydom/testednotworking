function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
    return {'x': x, 'y': y};
}

let selectedImage = 'default.png';

const RAD = Math.PI/180;
 const scrn = document.getElementById('canvas');
 const sctx = scrn.getContext("2d");
 scrn.tabIndex = 1;

 const selScrn = document.getElementById('canvas2');
 const ssctx = selScrn.getContext('2d');

 const elScrn = document.getElementById('canvas3');
 const esctx = elScrn.getContext('2d');

const hsScrn = document.getElementById('canvas4');
const hsctx = hsScrn.getContext('2d');

 scrn.addEventListener("click",()=>{
    switch (state.curr) {
        case state.getReady :
            state.curr = state.charSelect;
            console.log(state.curr);
            bird.charSelect();
            SFX.introbattle.play();
            break;
        case state.charSelect :
            console.log('This is' + state.curr);
            break;
        case state.beforePlay :
            state.curr = state.Play
            console.log(state.curr);
            break;
        case state.Play :
            console.log(state.curr);
            SFX.gamemusic.play();
            bird.flap();
            break;
        case state.gameOver :
            if (UI.score.tokens > 0) {
                state.curr = state.showEliminations;
                bird.eliminateTester();
            }
            state.curr = state.getReady;
            console.log(state.curr);
            bird.speed = 0;
            bird.y = 100;
            pipe.pipes=[];
            UI.score.curr = 0;
            SFX.gamemusic.pause();
            SFX.gamemusic.currentTime = 0;
            SFX.played=false;
            break;
        case state.showEliminations :
            state.curr = state.getReady;
            console.log(state.curr);
            break;
    }
 })

scrn.onkeydown = function keyDown(e) {
    if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38) {
        switch (state.curr) {
            case state.getReady :
                state.curr = state.charSelect;
                console.log(state.curr);
                bird.charSelect();
                SFX.introbattle.play();
                break;
            case state.charSelect :
                console.log('This is' + state.curr);
                break;
            case state.beforePlay :
                state.curr = state.Play
                console.log(state.curr);
                break;
            case state.Play :
                console.log(state.curr);
                SFX.gamemusic.play();
                bird.flap();
                break;
            case state.gameOver :
                if (UI.score.tokens > 0) {
                    state.curr = state.showEliminations;
                    bird.eliminateTester();
                }
                state.curr = state.getReady;
                console.log(state.curr);
                bird.speed = 0;
                bird.y = 100;
                pipe.pipes=[];
                UI.score.curr = 0;
                SFX.gamemusic.pause();
                SFX.gamemusic.currentTime = 0;
                SFX.played=false;
                break;
            case state.showEliminations :
                state.curr = state.getReady;
                console.log(state.curr);
                break;
        }
    }
}

 let frames = 0;
 let dx = 2;
 const state = {
     curr : 0,
     getReady : 0,
     charSelect : 1,
     beforePlay : 2,
     Play : 3,
     gameOver : 4,
     showEliminations : 5
 }
 const SFX = {
     start : new Audio(),
     flap : new Audio(),
     score : new Audio(),
     hit : new Audio(),
     die : new Audio(),
     fixbugs : new Audio(),
     gamemusic : new Audio(),
     introbattle : new Audio(),
     token : new Audio(),
     played : false
 }
 const gnd = {
    sprite : new Image(),
     x : 0,
     y :0,
     draw : function() {
        this.y = parseFloat(scrn.height-this.sprite.height);
        sctx.drawImage(this.sprite,this.x,this.y);
     },
     update : function() {
        if(state.curr != state.Play) return;
        this.x -= dx;
        this.x = this.x % (this.sprite.width/2) + 2;
    }
 };
 const bg = {
    sprite : new Image(),
    x : 0,
    y :0,
    draw : function() {
        y = parseFloat(scrn.height-this.sprite.height);
        sctx.drawImage(this.sprite,this.x,y);
    }
 };
 const pipe = {
     top : {sprite : new Image()},
     bot : {sprite : new Image()},
     gap: 110,
     moved: true,
     pipes : [],
     draw : function(){
        for(let i = 0;i<this.pipes.length;i++)
        {
            let p = this.pipes[i];
            sctx.drawImage(this.top.sprite,p.x,p.y)
            sctx.drawImage(this.bot.sprite,p.x,p.y+parseFloat(this.top.sprite.height)+this.gap)
        }
     },
     update : function(){
         if(state.curr!=state.Play) return;
         if(frames%100==0)
         {
             this.pipes.push({x:parseFloat(scrn.width),y:-105*Math.min(Math.random()+1,1.8)});
         }
         this.pipes.forEach(pipe=>{
             pipe.x -= dx;
         })

         if(this.pipes.length&&this.pipes[0].x < -this.top.sprite.width)
         {
            this.pipes.shift();
            this.moved = true;
         }
     }
 };
 const bird = {
     curImg: selectedImage,
     animations :
        [
            {sprite : new Image()},
            {sprite : new Image()},
            {sprite : new Image()},
            {sprite : new Image()},
        ],
    rotatation : 0,
    x : 50,
    y :100,
    speed : 0,
    gravity : .120,
    thrust : 3.0,
    frame:0,
    draw : function() {
        let h = this.animations[this.frame].sprite.height;
        let w = this.animations[this.frame].sprite.width;
        sctx.save();
        sctx.translate(this.x,this.y);
        sctx.rotate(this.rotatation*RAD);
        sctx.drawImage(this.animations[this.frame].sprite,-w/2,-h/2);
        sctx.restore();
    },
    update : function() {
        let r = parseFloat( this.animations[0].sprite.width)/2;
        switch (state.curr) {
            case state.getReady :
                this.rotatation = 0;
                this.y +=(frames%10==0) ? Math.sin(frames*RAD) :0;
                this.frame += (frames%10==0) ? 1 : 0;
                break;
            case state.Play :
                this.frame += (frames%5==0) ? 1 : 0;
                this.y += this.speed;
                this.setRotation()
                this.speed += this.gravity;
                if(this.y + r  >= gnd.y||this.collisioned())
                {
                    state.curr = state.gameOver;
                }
                
                break;
            case state.gameOver : 
                this.frame = 1;
                if(this.y + r  < gnd.y) {
                    this.y += this.speed;
                    this.setRotation()
                    this.speed += this.gravity*2;
                }
                else {
                    this.speed = 0;
                    this.y=gnd.y-r;
                    this.rotatation=90;
                    SFX.die.play();
                }
                break;
        }
        this.frame = this.frame%this.animations.length;
    },
    flap : function(){
        if(this.y > 0)
        {
            SFX.flap.play();
            this.speed = -this.thrust;
        }
    },
    setRotation : function(){
        if(this.speed <= 0)
        {
            this.rotatation = Math.max(-25, -25 * this.speed/(-1*this.thrust));
        }
        else if(this.speed > 0 ) {
            this.rotatation = Math.min(90, 90 * this.speed/(this.thrust*2));
        }
    },

     charSelect : function () {
         $('#canvas').hide();
         $('#canvas2').show();
         $('#selBut').show();

         const imgWidth = 75;
         const imgHeight = 75;

         const akshayImg = document.getElementById('akshay');
         const alexImg = document.getElementById('alex');
         const guneetImg = document.getElementById('guneet');
         const prajwalImg = document.getElementById('prajwal');
         const willImg = document.getElementById('will');
         const harryImg = document.getElementById('harry');
         const abishekImg = document.getElementById('abishek');
         const nazmulImg = document.getElementById('nazmul');
         const bradImg = document.getElementById('brad');
         const justasImg = document.getElementById('justas');
         const wayneImg = document.getElementById('wayne');
         const vivianImg = document.getElementById('vivian');

         const pickerImg = document.getElementById('picker');
         const introTextImg = document.getElementById('introtext');
         const canv2BackImg = document.getElementById('canv2back');

         ssctx.drawImage(canv2BackImg, 0, 0);
         ssctx.drawImage(introTextImg, 8, 60);
         ssctx.drawImage(pickerImg, 170, 10);

         ssctx.drawImage(akshayImg, 10, 245, imgWidth, imgHeight)
         ssctx.drawImage(guneetImg, 95, 245, imgWidth, imgHeight)
         ssctx.drawImage(prajwalImg, 180, 245, imgWidth, imgHeight)
         ssctx.drawImage(willImg, 265, 245, imgWidth, imgHeight)
         ssctx.drawImage(harryImg, 350, 245, imgWidth, imgHeight)
         ssctx.drawImage(abishekImg, 435, 245, imgWidth, imgHeight)
         ssctx.drawImage(nazmulImg, 10, 345, imgWidth, imgHeight)
         ssctx.drawImage(alexImg, 95, 345, imgWidth, imgHeight)
         ssctx.drawImage(bradImg, 180, 345, imgWidth, imgHeight)
         ssctx.drawImage(justasImg, 265, 345, imgWidth, imgHeight)
         ssctx.drawImage(wayneImg, 350, 345, imgWidth, imgHeight)
         ssctx.drawImage(vivianImg, 435, 345, imgWidth, imgHeight)

         const canvas = document.getElementById('canvas2');
         canvas.addEventListener('mousedown', function(e) {
             let coords = getCursorPosition(canvas, e);
                 if (coords['x'] > 10 && coords['x'] < 75) {
                     if (coords['y'] > 250 && coords['y'] < 320) {
                         selectedImage = "Akshay.png";
                         bird.animations[0].sprite.src = "img/bird/devs/Akshay.png";
                         bird.animations[1].sprite.src = "img/bird/devs/Akshay.png";
                         bird.animations[2].sprite.src = "img/bird/devs/Akshay.png";
                         bird.animations[3].sprite.src = "img/bird/devs/Akshay.png";
                     }
                 }
                 if (coords['x'] > 96 && coords['x'] < 172) {
                     if (coords['y'] > 250 && coords['y'] < 320) {
                         selectedImage = "Guneet.png";
                         bird.animations[0].sprite.src = "img/bird/devs/Guneet.png";
                         bird.animations[1].sprite.src = "img/bird/devs/Guneet.png";
                         bird.animations[2].sprite.src = "img/bird/devs/Guneet.png";
                         bird.animations[3].sprite.src = "img/bird/devs/Guneet.png";
                     }
                 }
                 if (coords['x'] > 183 && coords['x'] < 255) {
                     if (coords['y'] > 250 && coords['y'] < 320) {
                         selectedImage = "Prajwal.png";
                         bird.animations[0].sprite.src = "img/bird/devs/Prajwal.png";
                         bird.animations[1].sprite.src = "img/bird/devs/Prajwal.png";
                         bird.animations[2].sprite.src = "img/bird/devs/Prajwal.png";
                         bird.animations[3].sprite.src = "img/bird/devs/Prajwal.png";
                     }
                 }
                 if (coords['x'] > 268 && coords['x'] < 338) {
                     if (coords['y'] > 250 && coords['y'] < 320) {
                         selectedImage = "Will.png";
                         bird.animations[0].sprite.src = "img/bird/devs/Will.png";
                         bird.animations[1].sprite.src = "img/bird/devs/Will.png";
                         bird.animations[2].sprite.src = "img/bird/devs/Will.png";
                         bird.animations[3].sprite.src = "img/bird/devs/Will.png";
                     }
                 }
                 if (coords['x'] > 356 && coords['x'] < 423) {
                     if (coords['y'] > 250 && coords['y'] < 320) {
                         selectedImage = "Harry.png";
                         bird.animations[0].sprite.src = "img/bird/devs/Harry.png";
                         bird.animations[1].sprite.src = "img/bird/devs/Harry.png";
                         bird.animations[2].sprite.src = "img/bird/devs/Harry.png";
                         bird.animations[3].sprite.src = "img/bird/devs/Harry.png";
                     }
                 }
                 if (coords['x'] > 438 && coords['x'] < 510) {
                     if (coords['y'] > 250 && coords['y'] < 320) {
                         selectedImage = "Abishek.png";
                         bird.animations[0].sprite.src = "img/bird/devs/Abishek.png";
                         bird.animations[1].sprite.src = "img/bird/devs/Abishek.png";
                         bird.animations[2].sprite.src = "img/bird/devs/Abishek.png";
                         bird.animations[3].sprite.src = "img/bird/devs/Abishek.png";
                     }
                 }
                 if (coords['x'] > 10 && coords['x'] < 75) {
                     if (coords['y'] > 350 && coords['y'] < 420) {
                         selectedImage = "Nazmul.png";
                         bird.animations[0].sprite.src = "img/bird/devs/Nazmul.png";
                         bird.animations[1].sprite.src = "img/bird/devs/Nazmul.png";
                         bird.animations[2].sprite.src = "img/bird/devs/Nazmul.png";
                         bird.animations[3].sprite.src = "img/bird/devs/Nazmul.png";
                     }
                 }
                 if (coords['x'] > 96 && coords['x'] < 172) {
                     if (coords['y'] > 350 && coords['y'] < 420) {
                         selectedImage = "Alex.png";
                         bird.animations[0].sprite.src = "img/bird/devs/Alex.png";
                         bird.animations[1].sprite.src = "img/bird/devs/Alex.png";
                         bird.animations[2].sprite.src = "img/bird/devs/Alex.png";
                         bird.animations[3].sprite.src = "img/bird/devs/Alex.png";
                     }
                 }
                 if (coords['x'] > 183 && coords['x'] < 255) {
                     if (coords['y'] > 350 && coords['y'] < 420) {
                         selectedImage = "Brad.png";
                         bird.animations[0].sprite.src = "img/bird/devs/Brad.png";
                         bird.animations[1].sprite.src = "img/bird/devs/Brad.png";
                         bird.animations[2].sprite.src = "img/bird/devs/Brad.png";
                         bird.animations[3].sprite.src = "img/bird/devs/Brad.png";
                     }
                 }
                 if (coords['x'] > 268 && coords['x'] < 338) {
                     if (coords['y'] > 350 && coords['y'] < 420) {
                         selectedImage = "Justas.png";
                         bird.animations[0].sprite.src = "img/bird/devs/Justas.png";
                         bird.animations[1].sprite.src = "img/bird/devs/Justas.png";
                         bird.animations[2].sprite.src = "img/bird/devs/Justas.png";
                         bird.animations[3].sprite.src = "img/bird/devs/Justas.png";
                     }
                 }
                 if (coords['x'] > 356 && coords['x'] < 423) {
                     if (coords['y'] > 350 && coords['y'] < 420) {
                         selectedImage = "Wayne.png";
                         bird.animations[0].sprite.src = "img/bird/devs/Wayne.png";
                         bird.animations[1].sprite.src = "img/bird/devs/Wayne.png";
                         bird.animations[2].sprite.src = "img/bird/devs/Wayne.png";
                         bird.animations[3].sprite.src = "img/bird/devs/Wayne.png";
                     }
                 }
                 if (coords['x'] > 438 && coords['x'] < 509) {
                     if (coords['y'] > 350 && coords['y'] < 420) {
                         selectedImage = "vivian.png";
                         bird.animations[0].sprite.src = "img/bird/devs/vivian.png";
                         bird.animations[1].sprite.src = "img/bird/devs/vivian.png";
                         bird.animations[2].sprite.src = "img/bird/devs/vivian.png";
                         bird.animations[3].sprite.src = "img/bird/devs/vivian.png";
                     }
                 }
         },

         $('#selBut').on('click', function() {
             state.curr = state.beforePlay;
             console.log(state.curr);
             SFX.fixbugs.play();
             SFX.introbattle.pause();
             SFX.introbattle.currentTime = 0;
             $('#selBut').hide();
             $('#canvas2').hide()
             $('#canvas').show();
         }))

         let te = 'Testers Eliminated: 0/10';
         ssctx.fillText(te,scrn.width/2-80,scrn.height/2+40);
         ssctx.strokeText(te,scrn.width/2-80,scrn.height/2+40);
     },

     eliminateTester: function () {
         $('#canvas').hide();
         $('#canvas2').hide();
         $('#canvas3').show();

         const eliminateImg = document.getElementById('eliminate')
         esctx.drawImage(eliminateImg, 20, 10);

         const imgWidth = 75;
         const imgHeight = 75;

         const canv3BackImg = document.getElementById('canv3back');

         // Safe
         const gregImg = document.getElementById('greg');
         const ishratImg = document.getElementById('ishrat');
         const nikaImg = document.getElementById('nika');
         const sandraImg = document.getElementById('sandra');
         const ubaidImg = document.getElementById('ubaid');
         const michelleImg = document.getElementById('michelle');
         const claudiaImg = document.getElementById('claudia');
         const heatherImg = document.getElementById('heather');

         // Eliminated
         const ishratEImg = document.getElementById('ishrat_e');
         const nikaEImg = document.getElementById('nika_e');
         const sandraEImg = document.getElementById('sandra_e');
         const ubaidEImg = document.getElementById('ubaid_e');
         const michelleEImg = document.getElementById('michelle_e');
         const claudiaEImg = document.getElementById('claudia_e');
         const gregEImg = document.getElementById('greg_e');
         const heatherEImg = document.getElementById('heather_e');

         esctx.drawImage(canv3BackImg, 0, 0);
         esctx.drawImage(ishratImg, 10, 265, imgWidth, imgHeight)
         esctx.drawImage(nikaImg, 95, 265, imgWidth, imgHeight)
         esctx.drawImage(sandraImg, 180, 265, imgWidth, imgHeight)
         esctx.drawImage(ubaidImg, 265, 265, imgWidth, imgHeight)
         esctx.drawImage(michelleImg, 350, 265, imgWidth, imgHeight)
         esctx.drawImage(claudiaImg, 435, 265, imgWidth, imgHeight)
         esctx.drawImage(gregImg, 10, 365, imgWidth, imgHeight)
         esctx.drawImage(heatherImg, 95, 365, imgWidth, imgHeight)

         let tks = 'Tokens: ' + UI.score.tokens;
         esctx.font = "30px Arial";
         esctx.fillText(tks, 120, 500);
         esctx.strokeText(tks, 120, 500);

         const canvas = document.getElementById('canvas3');
         canvas.addEventListener('mousedown', function(e) {
             let coords = getCursorPosition(canvas, e);
             if (coords['x'] > 14 && coords['x'] < 82) {
                 if (coords['y'] > 270 && coords['y'] < 340) {
                     if (UI.score.tokens <= 0) {
                         alert('You do not have enough tokens for that.');
                     } else {
                         let choice = confirm('Would you really like to eliminate this tester :( :( :(');
                         if (choice) {
                             UI.score.tokens -= 1;
                             tks = 'Tokens: ' + UI.score.tokens
                             esctx.font = "30px Arial";
                             esctx.fillText(tks, 120, 500);
                             esctx.strokeText(tks, 120, 500);
                             esctx.drawImage(ishratEImg, 10, 265, imgWidth, imgHeight)
                         }
                     }
                 }
             }
             if (coords['x'] > 99 && coords['x'] < 170) {
                 if (coords['y'] > 270 && coords['y'] < 340) {
                     if (UI.score.tokens <= 0) {
                         alert('You do not have enough tokens for that.');
                     } else {
                         let choice = confirm('Would you really like to eliminate this tester :( :( :(');
                         if (choice) {
                             UI.score.tokens -= 1;
                             tks = 'Tokens: ' + UI.score.tokens
                             esctx.font = "30px Arial";
                             esctx.fillText(tks, 120, 500);
                             esctx.strokeText(tks, 120, 500);
                             esctx.drawImage(nikaEImg, 95, 265, imgWidth, imgHeight)
                         }
                     }
                 }
             }
             if (coords['x'] > 183 && coords['x'] < 255) {
                 if (coords['y'] > 270 && coords['y'] < 340) {
                     if (UI.score.tokens <= 0) {
                         alert('You do not have enough tokens for that.');
                     } else {
                         let choice = confirm('Would you really like to eliminate this tester :( :( :(');
                         if (choice) {
                             UI.score.tokens -= 1;
                             tks = 'Tokens: ' + UI.score.tokens
                             esctx.font = "30px Arial";
                             esctx.fillText(tks, 120, 500);
                             esctx.strokeText(tks, 120, 500);
                             esctx.drawImage(sandraEImg, 180, 265, imgWidth, imgHeight)
                         }
                     }
                 }
             }
             if (coords['x'] > 268 && coords['x'] < 339) {
                 if (coords['y'] > 270 && coords['y'] < 340) {
                     if (UI.score.tokens <= 0) {
                         alert('You do not have enough tokens for that.');
                     } else {
                         let choice = confirm('Would you really like to eliminate this tester :( :( :(');
                         if (choice) {
                             UI.score.tokens -= 1;
                             tks = 'Tokens: ' + UI.score.tokens
                             esctx.font = "30px Arial";
                             esctx.fillText(tks, 120, 500);
                             esctx.strokeText(tks, 120, 500);
                             esctx.drawImage(ubaidEImg, 265, 265, imgWidth, imgHeight)
                         }
                     }
                 }
             }
             if (coords['x'] > 354 && coords['x'] < 425) {
                 if (coords['y'] > 270 && coords['y'] < 340) {
                     if (UI.score.tokens <= 0) {
                         alert('You do not have enough tokens for that.');
                     } else {
                         let choice = confirm('Would you really like to eliminate this tester :( :( :(');
                         if (choice) {
                             UI.score.tokens -= 1;
                             tks = 'Tokens: ' + UI.score.tokens
                             esctx.font = "30px Arial";
                             esctx.fillText(tks, 120, 500);
                             esctx.strokeText(tks, 120, 500);
                             esctx.drawImage(michelleEImg, 350, 265, imgWidth, imgHeight)
                         }
                     }
                 }
             }
             if (coords['x'] > 439 && coords['x'] < 508) {
                 if (coords['y'] > 270 && coords['y'] < 340) {
                     if (UI.score.tokens <= 0) {
                         alert('You do not have enough tokens for that.');
                     } else {
                         let choice = confirm('Would you really like to eliminate this tester :( :( :(');
                         if (choice) {
                             UI.score.tokens -= 1;
                             tks = 'Tokens: ' + UI.score.tokens
                             esctx.font = "30px Arial";
                             esctx.fillText(tks, 120, 500);
                             esctx.strokeText(tks, 120, 500);
                             esctx.drawImage(claudiaEImg, 435, 265, imgWidth, imgHeight)
                         }
                     }
                 }
             }
             if (coords['x'] > 14 && coords['x'] < 84) {
                 if (coords['y'] > 371 && coords['y'] < 437) {
                     if (UI.score.tokens <= 0) {
                         alert('You do not have enough tokens for that.');
                     } else {
                         let choice = confirm('Would you really like to eliminate this tester :( :( :(');
                         if (choice) {
                             UI.score.tokens -= 1;
                             tks = 'Tokens: ' + UI.score.tokens
                             esctx.font = "30px Arial";
                             esctx.fillText(tks, 120, 500);
                             esctx.strokeText(tks, 120, 500);
                             esctx.drawImage(gregEImg, 10, 365, imgWidth, imgHeight)
                         }
                     }
                 }
             }
             if (coords['x'] > 100 && coords['x'] < 169) {
                 if (coords['y'] > 371 && coords['y'] < 437) {
                     if (UI.score.tokens <= 0) {
                         alert('You do not have enough tokens for that.');
                     } else {
                         let choice = confirm('Would you really like to eliminate this tester :( :( :(');
                         if (choice) {
                             UI.score.tokens -= 1;
                             tks = 'Tokens: ' + UI.score.tokens
                             esctx.font = "30px Arial";
                             esctx.fillText(tks, 120, 500);
                             esctx.strokeText(tks, 120, 500);
                             esctx.drawImage(heatherEImg, 95, 365, imgWidth, imgHeight)
                         }
                     }
                 }
             }
         })
     },

    collisioned : function(){
        if(!pipe.pipes.length) return;
        let bird = this.animations[0].sprite;
        let x = pipe.pipes[0].x;
        let y = pipe.pipes[0].y;
        let r = bird.height/4 +bird.width/4;
        let roof = y + parseFloat(pipe.top.sprite.height);
        let floor = roof + pipe.gap ;
        let w = parseFloat(pipe.top.sprite.width);
        if(this.x + r>= x)
        {
            if(this.x + r < x + w)
            {
                if(this.y - r <= roof || this.y + r>= floor)
                {
                    SFX.hit.play();
                    return true;
                }

            }
            else if(pipe.moved)
            {
                UI.score.curr++;
                SFX.score.play();
                pipe.moved = false;
            }
        }
    }
 };
 const UI = {
    getReady : {sprite : new Image()},
    gameOver : {sprite : new Image()},
    tap : [{sprite : new Image()},
           {sprite : new Image()}],
    score : {
        curr : 0,
        best : 0,
        tokens : 0
    },
    x :0,
    y :0,
    tx :0,
    ty :0,
    frame : 0,
    draw : function() {
        switch (state.curr) {
            case state.getReady :
                this.y = parseFloat(scrn.height-this.getReady.sprite.height) - 200;
                this.x = parseFloat(scrn.width-this.getReady.sprite.width)/2;
                this.tx = parseFloat(scrn.width - this.tap[0].sprite.width)/2;
                this.ty = this.y + this.getReady.sprite.height- this.tap[0].sprite.height + 125;
                sctx.drawImage(this.getReady.sprite,this.x,this.y);
                sctx.drawImage(this.tap[this.frame].sprite,this.tx,this.ty)
                break;
            case state.gameOver :
                this.y = parseFloat(scrn.height-this.gameOver.sprite.height) - 425;
                this.x = parseFloat(scrn.width-this.gameOver.sprite.width)/2;
                this.tx = parseFloat(scrn.width - this.tap[0].sprite.width)/2;
                this.ty = this.y + this.gameOver.sprite.height- this.tap[0].sprite.height + 30;
                sctx.drawImage(this.gameOver.sprite,this.x,this.y);
                sctx.drawImage(this.tap[this.frame].sprite,this.tx,this.ty)
                break;
        }
        this.drawScore();
    },
    drawScore : function() {
            sctx.fillStyle = "#FFFFFF";
            sctx.strokeStyle = "#000000";
        switch (state.curr) {
            case state.Play :
                sctx.lineWidth = "2";
                sctx.font = "35px Squada One";
                sctx.fillText("Bugs Busted" + this.score.curr,scrn.width/2-90,650);

                sctx.strokeText("Bugs Busted" + this.score.curr,scrn.width/2-90,650);

                if (this.score.curr === 5 || this.score.curr === 10) {
                    SFX.token.play();
                }
                SFX.token.pause();
                SFX.token.currentTime = 0;
                break;
            case state.gameOver :
                    sctx.lineWidth = "2";
                    sctx.font = "30px Squada One";
                    let sc = `Bugs Fixed :     ${this.score.curr}`;
                    if (UI.score.curr > 5) {
                        UI.score.tokens += 1;
                    }
                    try {
                        this.score.best = Math.max(this.score.curr,localStorage.getItem("best"));
                        localStorage.setItem("best",this.score.best);
                        let bs = `Tested Working  :     ${this.score.best}`;
                        sctx.fillText(sc,scrn.width/2-80,scrn.height/2+40);
                        sctx.strokeText(sc,scrn.width/2-80,scrn.height/2+40);
                        sctx.fillText(bs,scrn.width/2-80,scrn.height/2+76);
                        sctx.strokeText(bs,scrn.width/2-80,scrn.height/2+76);
                        let tokens = 'Num Tokens: ' + UI.score.tokens;
                        sctx.fillText(tokens,scrn.width/2-80,scrn.height/2+110);
                        sctx.strokeText(tokens,scrn.width/2-80,scrn.height/2+110);
                    }
                    catch(e) {
                        sctx.fillText(sc,scrn.width/2-85,scrn.height/2+15);
                        sctx.strokeText(sc,scrn.width/2-85,scrn.height/2+15);
                    }
                break;
        }
    },
    update : function() {
        if(state.curr == state.Play) return;
        this.frame += (frames % 10==0) ? 1 :0;
        this.frame = this.frame % this.tap.length;
    },
 };

gnd.sprite.src="img/ground/g2.png";
bg.sprite.src="img/BG.png";
pipe.top.sprite.src="img/toppipe2.png";
pipe.bot.sprite.src="img/botpipe2.png";
UI.gameOver.sprite.src="img/go.png";
UI.getReady.sprite.src="img/intro.png";
UI.tap[0].sprite.src="img/tap/t0.png";
UI.tap[1].sprite.src="img/tap/t1.png";
bird.animations[0].sprite.src="img/bird/devs/" + selectedImage;
bird.animations[1].sprite.src="img/bird/devs/" + selectedImage;
bird.animations[2].sprite.src="img/bird/devs/" + selectedImage;
bird.animations[3].sprite.src="img/bird/devs/" + selectedImage;
SFX.start.src = "sfx/start.wav"
SFX.flap.src = "sfx/flap.wav"
SFX.score.src = "sfx/score.wav"
SFX.hit.src = "sfx/hit.wav"
SFX.die.src = "sfx/falling.wav"
SFX.gamemusic.src = "sfx/game-music.wav"
SFX.introbattle.src = "sfx/battle.wav"
SFX.fixbugs.src = "sfx/click.wav"
SFX.token.src = "sfx/Photo_click_1.wav"

gameLoop();

 function gameLoop()
 { 
     update();
     draw();
     frames++;
     requestAnimationFrame(gameLoop);
 }

 function update()
 {
  bird.update();  
  gnd.update();
  pipe.update();
  UI.update();
 }
 function draw()
 {
    // sctx.fillStyle = "#30c0df";
    sctx.fillRect(0,0,scrn.width,scrn.height)
     const shrek = document.getElementById('shrek');
     sctx.drawImage(shrek, 0, 0);
    bg.draw();
    pipe.draw();
    
    bird.draw();
    gnd.draw();
    UI.draw();
 }
