// GameSehup.js Key objective is to define GameLevel objects and their assets.
import GameEnv from './GameEnv.js';
import GameLevel from './GameLevel.js';
// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'
import BackgroundHills from './BackgroundHills.js';
import BackgroundCoral from './BackgroundCoral.js';
import BackgroundMountains from './BackgroundMountains.js';
import BackgroundTransitions from './BackgroundTransitions.js';
import BackgroundClouds from './BackgroundClouds.js';
import BackgroundWinter from './BackgroundWinter.js';
import BackgroundSnow from './BackgroundSnow.js';
import BackgroundFish from './BackgroundFish.js';
import Platform from './Platform.js';
import JumpPlatform from './JumpPlatform.js';
import Player from './PlayerBase.js';
import PlayerHills from './PlayerHills.js';
import PlayerWinter from './PlayerWinter.js';
import PlayerMini from './PlayerMini.js';
import PlayerQuidditch from './PlayerQuidditch.js';
import PlayerBase from './PlayerBase.js';
import Tube from './Tube.js';
import Tube1 from './Tube1.js';
import Tree from './Tree.js';
import Cabin from './Cabin.js';
import Goomba from './Goomba.js';
import FlyingGoomba from './FlyingGoomba.js';
import BlockPlatform from './BlockPlatform.js';
import Mushroom from './Mushroom.js';
import Coin from './Coin.js';
import Snowflake from './Snowflake.js';
import FlyingUFO from './FlyingUFO.js';
import Alien from './Alien.js';
import GameControl from './GameControl.js';
import Enemy from './Enemy.js';
import Owl from './Owl.js';
import Snowman from './Snowman.js';
import Cerberus from './Cerberus.js';
import PlayerGreece from './PlayerGreece.js';
import Flag from './Flag.js';
import Dragon from './Dragon.js';
import Star from './Star.js';
import Dementor from './Dementor.js';
import Draco from './Draco.js';
import GlowBlock from './GlowBlock.js';
import skibidiTitan from './SkibidiTitan.js';
import Laser from './Laser.js';
import SkibidiToilet from './SkibidiToilet.js';

//test comment

/* Coding Style Notes
 *
 * GameSetup is defined as an object literal in in Name Function Expression (NFE) style
 * * const GameSetup = function() { ... } is an NFE
 * * NFEs are a common pattern in JavaScript, reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function 
 *
 * * Informerly, inside of GameSetup it looks like defining keys and values that are functions.
 * * * GameSetup is a singleton object, object literal, without a constructor.
 * * * This coding style ensures one instance, thus the term object literal.
 * * * Inside of GameSetup, the keys are functions, and the values are references to the functions.
 * * * * The keys are the names of the functions.
 * * * * The values are the functions themselves.
 *
 * * Observe, encapulation of this.assets and sharing data between methods.
 * * * this.assets is defined in the object literal scope.
 * * * this.assets is shared between methods.
 * * * this.assets is not accessible outside of the object literal scope.
 * * * this.assets is not a global variable.
 * 
 * * Observe, the use of bind() to bind methods to the GameSetup object.
 * * * * bind() ensures "this" inside of methods binds to "GameSetup"
 * * * * this avoids "Temporal Dead Zone (TDZ)" error...
 * 
 * 
 * Usage Notes
 * * call GameSetup.initLevels() to setup the game levels and assets.
 * * * the remainder of GameSetup supports initLevels()
 * 
*/

// Define the GameSetup object literal
const GameSetup = {

    /*  ==========================================
     *  ===== Game Level Methods +++==============
     *  ==========================================
     * Game Level methods support Game Play, and Game Over
     * * Helper functions assist the Callback methods
     * * Callback methods are called by the GameLevel objects
     */ 

    /**
     * Helper function that waits for a button click event.
     * @param {string} id - The HTML id or name of the button.
     * @returns {Promise<boolean>} - A promise that resolves when the button is clicked.
     * References:
     * * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
     * *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
     */
    waitForButtonStart: function(id) {
        // Returns a promise that resolves when the button is clicked
        return new Promise((resolve) => {
            const waitButton = document.getElementById(id);
            // Listener function to resolve the promise when the button is clicked
            const waitButtonListener = () => {
              GameControl.stopTimer()
                if (!GameEnv.timerActive) {
                  GameControl.startTimer()
                  resolve(true)
                }
                resolve(true);
            };
            // Add the listener to the button's click event
            waitButton.addEventListener('click', waitButtonListener);
        });
      },
    
      waitForButtonRestart: function(id) {
        // Returns a promise that resolves when the button is clicked
        return new Promise((resolve) => {
            const waitButton = document.getElementById(id);
            // Listener function to resolve the promise when the button is clicked
            const waitButtonListener = () => {
              if (document.getElementById('timeScore')) {
                document.getElementById('timeScore').textContent = GameEnv.time 
            }
            const userScoreElement = document.getElementById('userScore');
            
            if ( userScoreElement) {
                // Update the displayed time
                userScoreElement.textContent = (GameEnv.coinScore/1000).toFixed(2);
            }
                resolve(true);
            };
            // Add the listener to the button's click event
            waitButton.addEventListener('click', waitButtonListener);
        });
      },
  
    /*  ==========================================
     *  ===== Game Level Call Backs ==============
     *  ==========================================
     * Game Level callbacks are functions that return true or false
     */
    
    /**
     * Start button callback.
     * Unhides the gameBegin button, waits for it to be clicked, then hides it again.
     * @async
     * @returns {Promise<boolean>} Always returns true.
     */    
    startGameCallback: async function() {
        const id = document.getElementById("gameBegin");
        // Unhide the gameBegin button
        id.hidden = false;
        
        // Wait for the startGame button to be clicked
        await this.waitForButtonStart('startGame');
        // Hide the gameBegin button after it is clicked
        id.hidden = true;
        
        return true;
    }, 

    /**
     * Home screen exits on the Game Begin button.
     * Checks if the gameBegin button is hidden, which means the game has started.
     * @returns {boolean} Returns true if the gameBegin button is hidden, false otherwise.
     */
    homeScreenCallback: function() {
      // gameBegin hidden means the game has started
      const id = document.getElementById("gameBegin");
      return id.hidden;
    },

    /**
     * Level completion callback, based on Player off screen.
     * Checks if the player's x position is greater than the innerWidth of the game environment.
     * If it is, resets the player for the next level and returns true.
     * If it's not, returns false.
     * @returns {boolean} Returns true if the player's x position is greater than the innerWidth, false otherwise.
     */
    playerOffScreenCallBack: function() {
        // console.log(GameEnv.player?.x)
        if (GameEnv.player?.x > GameEnv.innerWidth) {
            GameEnv.player = null; // reset for next level
            if(this.tag == "skibidi"){
              GameEnv.playSound("flush");
            }
            return true;
        } else {
            return false;
        }
    },

    /**
     * Game Over callback.
     * Unhides the gameOver button, waits for it to be clicked, then hides it again.
     * Also sets the currentLevel of the game environment to null.
     * @async
     * @returns {Promise<boolean>} Always returns true.
     */    
    gameOverCallBack: async function() {
      const id = document.getElementById("gameOver");
      id.hidden = false;
      GameControl.stopTimer()
      // Wait for the restart button to be clicked
      await this.waitForButtonRestart('restartGame');
      id.hidden = true;
      
      // Change currentLevel to start/restart value of null
      GameEnv.currentLevel = false;

      return true;
    },

    /*  ==========================================
     *  ======= Data Definitions =================
     *  ==========================================
     * Assets for the Game Objects defined in nested JSON key/value pairs
     *
     * * assets: contains definitions for all game objects, images, and properties
     * * * 1st level: category (obstacles, platforms, backgrounds, players, enemies)
     * * * 2nd level: item (tube, grass, mario, goomba)
     * * * 3rd level: property (src, width, height, scaleSize, speedRatio, w, wa, wd, a, s, d)
    */

    assets: {
      obstacles: {
        tube: { src: "/images/platformer/obstacles/blue-tube-up.png",
                hitbox: { widthPercentage: 0.5, heightPercentage: 0.5}
              },
        cabin: { src: "/images/platformer/obstacles/cabin.png",
        hitbox: { widthPercentage: 0.5, heightPercentage: 0.5}
              },
        coin: { src: "/images/platformer/obstacles/coin.png"},
        vbucks: { src: "/images/platformer/obstacles/vbucks.png"},
        tree: { src: "/images/platformer/obstacles/tree.png",
                hitbox: { widthPercentage: 0.5, heightPercentage: 0.5}
              },
        flag: { src: "/images/platformer/obstacles/flag.png",
              hitbox: { widthPercentage: 0.5, heightPercentage: 0.5}
            },
        snitch: { src: "/images/platformer/obstacles/snitch.png"},
        whompingwillow: { src: "/images/platformer/obstacles/whompingwillowtree.png",
                      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5}
              },
        toilet: { src: "/images/platformer/obstacles/toilet.png",
                hitbox: { widthPercentage: 0.5, heightPercentage: 0.5}
              },
        laser: { src: "/images/platformer/obstacles/laser.png",
                hitbox: { widthPercentage: 0.5, heightPercentage: 0.5}
              },
      },
      platforms: {
        grass: { src: "/images/platformer/platforms/grass.png" },
        sand: {src: "/images/platformer/platforms/sand.png"},
        alien: { src: "/images/platformer/platforms/alien.png" },
        skibidiSand: {src: "/images/platformer/platforms/skibidiBlock.png"},
        bricks: { src: "/images/platformer/platforms/brick_wall.png" },
        lava: { src: "/images/platformer/platforms/lava.jpg" },
        sandstone: { src: "/images/platformer/platforms/sandstone.png" },
        cobblestone: { src: "/images/platformer/platforms/cobblestone.png"},
        yellowpattern: { src: "/images/platformer/platforms/yellowtowerpattern.jpg"},
        yellowredpattern: { src: "/images/platformer/platforms/yellowredpattern.jpg"},
        lionpattern: {src: "/images/platformer/platforms/lionpattern.jpg"},
        turf: {src:"/images/platformer/platforms/turf.png"},
        block: { src: "/images/platformer/platforms/brick_block.png" }, //MAY need 3 new variables: sizeRatio, widthRatio, and heightRatio
        itemBlock: {
          src: "/images/platformer/platforms/mario_block_spritesheet_v2.png",
          sizeRatio: 83.2,
          widthRatio: 0.5,
          heightRatio: 1.0,
          width: 204,
          height: 204,
          scaleSize: 80,
          speedRatio: 0.7,
          hitbox: { widthPercentage: 0.4, heightPercentage: -0.2}
        }
      },
      backgrounds: {
        start: { src: "/images/platformer/backgrounds/home.png" },
        hills: { src: "/images/platformer/backgrounds/hills.png" },
        avenida: { src: "/images/platformer/backgrounds/avenidawide3.jpg" },
        mountains: { src: "/images/platformer/backgrounds/mountains.jpg" },
        desert: {src: "/images/platformer/backgrounds/desertbg.png"},
        clouds : { src: "/images/platformer/backgrounds/clouds.png"},
        water: { src: "/images/platformer/backgrounds/water.png" },
        fish : { src: "/images/platformer/backgrounds/school-fish.png"},
        reef: { src: "/images/platformer/backgrounds/reef.png" },
        quidditch: { src: "/images/platformer/backgrounds/quidditch2.jpg"},
        space: { src: "/images/platformer/backgrounds/planet.jpg" },
        castles: { src: "/images/platformer/backgrounds/castles.png" },
        loading: { src: "/images/platformer/backgrounds/greenscreen.png" },
        complete: { src: "/images/platformer/backgrounds/OneStar.png" },
        complete2: { src: "/images/platformer/backgrounds/TwoStar.png" },
        complete3: { src: "/images/platformer/backgrounds/skibidiCompletion.png" },
        end: { src: "/images/platformer/backgrounds/Congratulations!!!.png" }
      },
      players: {
        mario: {
          src: "/images/platformer/sprites/mario.png",
          width: 256,
          height: 256,
          scaleSize: 80,
          speedRatio: 0.7,
          idle: {
              left: { row: 1, frames: 15 },
              right: { row: 0, frames: 15},
          },
          walk: {
              left: { row: 3, frames: 7 },
              right: { row: 2, frames: 7 },
          },
          run: {
              left: { row: 5, frames: 15 },
              right: { row: 4, frames: 15 },
          },
          jump: {
              left: { row: 11, frames: 15 },
              right: { row: 10, frames: 15 },
          },
          hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
        },       
        whitemario: {
          src: "/images/platformer/sprites/white_mario.png",
          width: 256,
          height: 256,
          scaleSize: 80,
          speedRatio: 0.7,
          idle: {
              left: { row: 1, frames: 15 },
              right: { row: 0, frames: 15},
          },
          walk: {
              left: { row: 3, frames: 7 },
              right: { row: 2, frames: 7 },
          },
          run: {
              left: { row: 5, frames: 15 },
              right: { row: 4, frames: 15 },
          },
          jump: {
              left: { row: 11, frames: 15 },
              right: { row: 10, frames: 15 },
          },
          hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
        },
        escaper: {
          src: "/images/platformer/sprites/escaper.png",
          width: 50,
          height: 50,
          scaleSize: 60,
          speedRatio: 0.7,
          wa: { row: 9, min: 8, frames: 15 },
          wd: { row: 9, min: 0, frames: 7 },
          a: { row: 1, frames: 15, idleFrame: { column: 7, frames: 0 } },
          s: { row: 12, frames: 15 },
          d: { row: 0, frames: 15, idleFrame: { column: 7, frames: 0 } }
        },
        monkey: {
          src: "/images/platformer/sprites/monkey.png",
          width: 40,
          height: 40,
          scaleSize: 100,
          speedRatio: 0.7,
          wa: { row: 9, min: 8, frames: 15 },
          wd: { row: 9, min: 0, frames: 7 },
          a: { row: 1, frames: 15, idleFrame: { column: 7, frames: 0 } },
          s: { row: 12, frames: 15 },
          d: { row: 0, frames: 15, idleFrame: { column: 7, frames: 0 } }
        },
        knight: {
          src: "/images/platformer/sprites/knight.png",
          width: 128,
          height: 128,
          scaleSize: 120,
          speedRatio: 0.7,
          idle: {
              left: { row: 1, frames: 23 },
              right: { row: 0, frames: 23},
          },
          walk: {
              left: { row: 7, frames: 20 },
              right: { row: 6, frames: 20 },
          },
          run: {
              left: { row: 5, frames: 23 },
              right: { row: 4, frames: 23 },
          },
          jump: {
              left: { row: 3, frames: 23 },
              right: { row: 2, frames: 23 },
          },
          hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
        },  harry: {
          src: "/images/platformer/sprites/harryanimation3.png", 
          width: 32,
          height: 32,
          scaleSize: 60,
          speedRatio: 0.7,
          idle: {
            left: { row: 1, frames: 1 },
            right: { row: 2, frames: 1 },
          },
          walk: {
            left: { row: 1, frames: 5 },
            right: { row: 2, frames: 5 },
          },
          run: {
            left: { row: 1, frames: 5 },
            right: { row: 2, frames: 5 },
          },
          jump: {
            left: { row: 1, frames: 1 },
            right: { row: 2, frames: 1 },
          },
          hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
        },
        lopez: {
          src: "/images/platformer/sprites/lopezanimation.png", 
          width: 46,
          height: 52.5,
          scaleSize: 60,
          speedRatio: 0.7,
          wa: {row: 1, frames: 3}, // Up-Left Movement 
          wd: {row: 2, frames: 3}, // Up-Right Movement
          idle: { row: 6, frames: 1, idleFrame: {column: 1, frames: 0} },
          a: { row: 1, frames: 3, idleFrame: { column: 1, frames: 0 } }, // Left Movement
          s: {row: 1, frames: 3}, // Stop the movement 
          d: { row: 2, frames: 3, idleFrame: { column: 1, frames: 0 } }, // Right Movement 
          runningLeft: { row: 5, frames: 3, idleFrame: {column: 1, frames: 0} },
          runningRight: { row: 4, frames: 3, idleFrame: {column: 1, frames: 0} },
        },        
      },
      enemies: {
        goomba: {
          src: "/images/platformer/sprites/goomba.png",
          width: 448,
          height: 452,
          scaleSize: 60,
          speedRatio: 0.7,
          xPercentage: 0.6,
          hitbox: { widthPercentage: 0.0, heightPercentage: 0.2}
        },
        Snowman: {
          src: "/images/platformer/sprites/snowman.png",
          width: 308,
          height: 327,
          scaleSize: 60,
          speedRatio: 0.7,
          xPercentage: 0.6,
          hitbox: { widthPercentage: 0.0, heightPercentage: 0.2},
          wa: {row: 0, frames: 0}, // Up-Left Movement 
          wd: {row: 0, frames: 0}, // Up-Right Movement
          a: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Left Movement
          s: {row: 0, frames: 0}, // Stop the movement 
          d: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Right Movement 
        },
        Owl: {
          src: "/images/platformer/sprites/owl.png",
          width: 499,
          height: 500,
          scaleSize: 60,
          speedRatio: 0.8,  
        },
        flyingGoomba: {
          src: "/images/platformer/sprites/flying-goomba.png",
          width: 448,
          height: 452,
          scaleSize: 60,
          speedRatio: 0.7,
        },
        mushroom: {
          src: "/images/platformer/platforms/mushroom.png",
          width: 200,
          height: 180,
          hitbox: { widthPercentage: 0.0, heightPercentage: 0.2}
        },
        alien: {
          src: "/images/platformer/sprites/alien.png",
          width: 444,
          height: 640,
          scaleSize: 60,
          speedRatio: 0.85,
        },
        skibidiToilet: {
          src: "/images/platformer/sprites/skibidiEnemy.png",
          width: 529,
          height: 884,
          scaleSize: 60,
          speedRatio: 0.85,
        },
        skibidiTitan: {
          src: "/images/platformer/sprites/skibidiTItan.png",
          width: 529,
          height: 884,
          scaleSize: 1500,
          speedRatio: 0.85,
        },
        flyingUFO: {
          src: "/images/platformer/sprites/flying-ufo.png",
          width: 1920,
          height: 1166,
          scaleSize: 150,
          speedRatio: 0.9,
        },
        cerberus: {
          src: "/images/platformer/sprites/cerberus.png",
          width: 103,
          height: 103,
          scaleSize: 80,
          speedRatio: 0.85,
          wa: {row: 0, frames: 0}, // Up-Left Movement 
          wd: {row: 0, frames: 0}, // Up-Right Movement
          a: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Left Movement
          s: {row: 0, frames: 0}, // Stop the movement 
          d: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Right Movement 
        },
        dragon: {
          src: "/images/platformer/sprites/dragon.png",
          width: 152,
          height: 119,
          scaleSize: 60,
          speedRatio: 0.7,
        },dementor: {
          src: "/images/platformer/sprites/dementor2.png",
          width: 400,
          height: 400,
          scaleSize: 80,
          speedRatio: 0.7,
        },
        draco: {
          src: "/images/platformer/sprites/dracomalfoy.png",
          width: 301,
          height: 261,
          scaleSize: 80,
          speedRatio: 0.7,
          xPercentage: 0.6,
          wa: {row: 0, frames: 0}, // Up-Left Movement 
          wd: {row: 0, frames: 0}, // Up-Right Movement
          a: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Left Movement
          s: {row: 0, frames: 0}, // Stop the movement 
          d: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Right Movement 
      },
      }
    },

    /*  ==========================================
     *  ========== Game Level init ===============
     *  ==========================================
     * 
     * Game Level sequence as defined in code below
     * * a.) tag: "start" level defines button selection and cycles to the home screen
     * * b.) tag: "home" defines background and awaits "start" button selection and cycles to 1st game level
     * * c.) tag: "hills" and other levels before the tag: "end" define key gameplay levels
     * * d.) tag: "end"  concludes levels with game-over-screen background and replay selections
     * 
     * Definitions of new Object creations and JSON text
     * * 1.) "new GameLevel" adds game objects to the game environment.
     * * * JSON key/value "tag" is for readability
     * * * JSON "callback" contains function references defined above that terminate a GameLevel
     * * * JSON "objects" contain zero to many "GameObject"(s)
     * * 2.) "GameObject"(s) are defined using JSON text and include name, id, class, and data.  
     * * * JSON key/value "name" is for readability
     * * * JSON "id" is a GameObject classification and may have program significance
     * * * JSON "class" is the JavaScript class that defines the GameObject
     * * J* SON "data" contains assets and properties for the GameObject
    */

    initLevels: function(path) {  // ensure valid {{site.baseurl}} for path

      // Add File location in assets relative to the root of the site
      Object.keys(this.assets).forEach(category => {
          Object.keys(this.assets[category]).forEach(item => {
          this.assets[category][item]['file'] = path + this.assets[category][item].src;
          });
      });

        var fun_facts = {
          //data structure
          "Fun Fact #1" : "Mario's full name is Mario Mario.", //key and value
          "Fun Fact #2" : "Mario's least favorite food is shittake mushrooms.", //single quotes to include the double quotes
          "Fun Fact #3" : "Mario, in human years, is 24-25 years old.",
          "Fun Fact #4" : "Mario's girlfriend's name is Pauline.",
          "Fun Fact #5" : "Call or text 929-55-MARIO (929-556-2746) to get a fun suprise!",
          "Fun Fact #6" : "Mario's original name was Jumpman.",
          "Fun Fact #7" : "March 10th is known as Mario Day because the abbreviation for March 10th (Mar10) looks like Mario.",
          "Fun Fact #8" : " Mario was originally a carpenter, not a plumber.",
          "Fun Fact #9" : " There are actually lyrics to the Mario theme song."
          }
        function generate(){
          var nums = Object.keys(fun_facts);
          //console.log(nums);
          var num = nums[Math.floor(Math.random()*nums.length)]
          var fun_fact = fun_facts[num]; //using dictionary
          //access ids
          document.getElementById("fun_fact").innerHTML = fun_fact;
          document.getElementById("num").innerHTML = num;
          }
    
        let k = 0;
        let interval2 = setInterval(() => 
        {
        generate();
        k++;
        if(k == fun_facts.length)
        {
          clearInterval(interval2);
        }
        }, 3000);
      
        // Home screen added to the GameEnv ...
        new GameLevel( {tag: "start", callback: this.startGameCallback } );
        const homeGameObjects = [
        { name:'background', id: 'background', class: Background, data: this.assets.backgrounds.start }
        ];
        // Home Screen Background added to the GameEnv, "passive" means complementary, not an interactive level..
        new GameLevel( {tag: "home",  callback: this.homeScreenCallback, objects: homeGameObjects, passive: true } );
        
      // Check local storage for the difficulty mode set
      let difficulty = localStorage.getItem("difficulty");

    // If difficulty is not set (null or undefined), set it to a default value
    // if (!difficulty) {
    //     difficulty = "normal"; // Set default difficulty to "normal" or any other suitable value
    // }
    
    // Hills Game Level defintion...
    const allHillsGameObjects = [
      { name: 'mountains', id: 'background', class: BackgroundMountains,  data: this.assets.backgrounds.mountains },
      { name: 'clouds', id: 'background', class: BackgroundClouds, data: this.assets.backgrounds.clouds },
      { name: 'hills', id: 'background', class: BackgroundHills, data: this.assets.backgrounds.hills },
      { name: 'grass', id: 'floor', class: Platform, data: this.assets.platforms.grass },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.block, xPercentage: 0.2, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.block, xPercentage: 0.2368, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.block, xPercentage: 0.2736, yPercentage: 0.85 },
      { name: 'blocks', id: 'wall', class: GlowBlock, data: this.assets.platforms.block, xPercentage: 0.6, yPercentage: 1 },
      { name: 'itemBlock', id: 'jumpPlatform', class: JumpPlatform, data: this.assets.platforms.itemBlock, xPercentage: 0.4, yPercentage: 0.65 }, //item block is a platform
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.5, yPercentage: 1, minPosition: 0.05},
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.4, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"]},
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.3, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"]},
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.2, yPercentage: 1, minPosition: 0.05, difficulties: ["hard", "impossible"]},
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.1, yPercentage: 1, minPosition: 0.05, difficulties: ["impossible"]},
      { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage:  0.75, yPercentage: 1, minPosition: 0.5 }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
      { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage:  0.95, yPercentage: 1, minPosition: 0.5, difficulties: ["hard", "impossible"] }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage:  0.9, minPosition: 0.5, difficulties: ["normal","hard","impossible"]},
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage:  0.9, minPosition: 0.5, difficulties: ["hard","impossible"]},
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage:  0.9, minPosition: 0.5, difficulties: ["impossible"]},
      { name: 'mushroom', id: 'mushroom', class: Mushroom, data: this.assets.enemies.mushroom, xPercentage: 0.49},
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.1908, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.2242, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.2575, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.5898, yPercentage: 0.900 },
      { name: 'mario', id: 'player', class: PlayerHills, data: this.assets.players.mario },
      { name: 'tube', id: 'tube', class: Tube, data: this.assets.obstacles.tube },
      { name: 'loading', id: 'background', class: BackgroundTransitions,  data: this.assets.backgrounds.loading },
    ];
    let hillsGameObjects = allHillsGameObjects.filter(obj => !obj.difficulties || obj.difficulties.includes(difficulty));
    // Hills Game Level added to the GameEnv ...
    new GameLevel( {tag: "hills", callback: this.playerOffScreenCallBack, objects: hillsGameObjects } );


    // Greece Game Level definition...
    const greeceGameObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'greece', id: 'background', class: Background, data: this.assets.backgrounds.greece },
      { name: 'grass', id: 'platform', class: Platform, data: this.assets.platforms.grass },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.2, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.2368, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.2736 , yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.3104, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.3472, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.384, yPercentage: 0.76 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.4208, yPercentage: 0.70 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.5090, yPercentage: 0.64 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.5642, yPercentage: 0.34 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.5274, yPercentage: 0.34 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.4906, yPercentage: 0.34 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 1 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.94 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.88 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.76 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.70 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.64 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.58 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.52 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.46 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.40 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.34 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.28 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.22 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6368, yPercentage: 0.64 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.16 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.1 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.06 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 1 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.94 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.88 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.76 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.70 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.64 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.58 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.52 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.46 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.40 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.34 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.28 },
      { name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.22 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.16 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.1 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.06 },
      { name: 'cerberus', id: 'cerberus', class: Cerberus, data: this.assets.enemies.cerberus, xPercentage:  0.2, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"]},
      { name: 'cerberus', id: 'cerberus', class: Cerberus, data: this.assets.enemies.cerberus, xPercentage:  0.5, minPosition: 0.3, difficulties: ["normal", "hard", "impossible"]},
      { name: 'cerberus', id: 'cerberus', class: Cerberus, data: this.assets.enemies.cerberus, xPercentage:  0.7, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"]},//this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
      { name: 'dragon', id: 'dragon', class: Dragon, data: this.assets.enemies.dragon, xPercentage:  0.5, minPosition:  0.05},
      { name: 'knight', id: 'player', class: PlayerGreece, data: this.assets.players.knight },
      { name: 'flag', id: 'flag', class: Flag, data: this.assets.obstacles.flag },
      { name: 'complete2', id: 'background', class: BackgroundTransitions,  data: this.assets.backgrounds.complete2 },
    ];
    // Greece Game Level added to the GameEnv ...
    new GameLevel( {tag: "ancient greece", callback: this.playerOffScreenCallBack, objects: greeceGameObjects} );


    const miniGameObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'mini', id: 'background', class: Background, data: this.assets.backgrounds.mini },
      // { name: 'rock', id: 'platform', class: Platform, data: this.assets.platforms.rock },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.59, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.6268, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.3, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.3368, yPercentage: 0.35 },

      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.3, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.3368, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.4684, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.6, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.6368, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.4334 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.5167 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.4104, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.4472, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.484, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.5208, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.5167 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.4334 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.35 },

      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.5167 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.4334 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.35 },

      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.8208, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.784, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.7472, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.7104, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.6736, yPercentage: 0.6 },

      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.4334 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.5167 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.6 },
      
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.28, yPercentage: 0.25 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.32, yPercentage: 0.25 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.29, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.33, yPercentage: 0.75 },
      { name: 'star', id: 'star', class: Star, data: this.assets.obstacles.star, xPercentage: 0.4584, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.40, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.42, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.44, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.46, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.48, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.5, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.59, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.63, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.58, yPercentage: 0.25 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.62, yPercentage: 0.25 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.6475, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.6675, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.6875, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.7075, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.7275, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.7475, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.7675, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.7875, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.8075, yPercentage: 0.5 },
      { name: 'mario', id: 'player', class: PlayerMini, data: this.assets.players.mario },
      { name: 'tubeD', id: 'tubeD', class: Tube1, data: this.assets.obstacles.tubeD},
      { name: 'tube', id: 'tube', class: Tube, data: this.assets.obstacles.tube },
      // { name: 'complete', id: 'background', class: BackgroundTransitions,  data: this.assets.backgrounds.complete },
    ];
    // Space Game Level added to the GameEnv ...
    new GameLevel( {tag: "mini", callback: this.playerOffScreenCallBack, objects: miniGameObjects} );


    // Under Water Game Level defintion...
    const allWaterGameObjects = [
      { name: 'water', id: 'background', class: Background,  data: this.assets.backgrounds.water },
      { name: 'fish', id: 'background', class: BackgroundFish, data: this.assets.backgrounds.fish },
      { name: 'reef', id: 'background', class: BackgroundCoral, data: this.assets.backgrounds.reef},
      { name: 'sand', id: 'floor', class: Platform, data: this.assets.platforms.sand },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.block, xPercentage: 0.2, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.block, xPercentage: 0.2368, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: GlowBlock, data: this.assets.platforms.block, xPercentage: 0.2736, yPercentage: 0.85 },
      { name: 'blocks', id: 'wall', class: GlowBlock, data: this.assets.platforms.block, xPercentage: 0.6, yPercentage: 1 },
      { name: 'itemBlock', id: 'jumpPlatform', class: JumpPlatform, data: this.assets.platforms.itemBlock, xPercentage: 0.4, yPercentage: 0.65 }, //item block is a platform
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.5, yPercentage: 1, minPosition: 0.05},
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.4, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"]},
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.3, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"]},
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.2, yPercentage: 1, minPosition: 0.05, difficulties: ["hard", "impossible"]},
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.1, yPercentage: 1, minPosition: 0.05, difficulties: ["impossible"]},
      { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage:  0.75, yPercentage: 1, minPosition: 0.5 }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
      { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage:  0.95, yPercentage: 1, minPosition: 0.5, difficulties: ["hard", "impossible"] }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage:  0.9, minPosition: 0.5, difficulties: ["normal","hard","impossible"]},
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage:  0.9, minPosition: 0.5, difficulties: ["hard","impossible"]},
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage:  0.9, minPosition: 0.5, difficulties: ["impossible"]},
      { name: 'mushroom', id: 'mushroom', class: Mushroom, data: this.assets.enemies.mushroom, xPercentage: 0.49},
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.1908, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.2242, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.2575, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.5898, yPercentage: 0.900 },
      { name: 'mario', id: 'player', class: PlayerHills, data: this.assets.players.mario },
      { name: 'tube', id: 'tube', class: Tube, data: this.assets.obstacles.tube },
      { name: 'loading', id: 'background', class: BackgroundTransitions,  data: this.assets.backgrounds.loading },
    ];
    let waterGameObjects = allWaterGameObjects.filter(obj => !obj.difficulties || obj.difficulties.includes(difficulty));
    // Water Game Level added to the GameEnv ...
    new GameLevel( {tag: "water", callback: this.playerOffScreenCallBack, objects: waterGameObjects } );

        // Avenida Game Level definition...
        const avenidaGameObjects = [
        // GameObject(s), the order is important to z-index...
        { name: 'avenida', id: 'background', class: Background, data: this.assets.backgrounds.avenida },
        { name: 'grass', id: 'platform', class: Platform, data: this.assets.platforms.grass },
        { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.2, yPercentage: 0.85 },
        { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.2368, yPercentage: 0.85 },
        { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.5, yPercentage: 0.85 },
        { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.5368, yPercentage: 0.85 },
        { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.3, minPosition: 0.05},
        { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage:  0.5, minPosition: 0.3 },
        { name: 'mushroom', id: 'mushroom', class: Mushroom, data: this.assets.enemies.mushroom, xPercentage: 0.09},
        { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage:  0.75, minPosition: 0.5 }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
        { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage:  0.6, minPosition:  0.05 },
        { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage:  0.35, minPosition: 0.3 },
        { name: 'lopez', id: 'player', class: Player, data: this.assets.players.lopez },
        { name: 'tube', id: 'tube', class: Tube, data: this.assets.obstacles.tube },
        { name: 'complete', id: 'background', class: BackgroundTransitions,  data: this.assets.backgrounds.complete },
        ];
        // Avenida Game Level added to the GameEnv ...
        new GameLevel( {tag: "avenida", callback: this.playerOffScreenCallBack, objects: avenidaGameObjects } );
    
    // Quidditch Game Level definition...
    const quidditchGameObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'quidditch', id: 'background', class: Background, data: this.assets.backgrounds.quidditch },
      { name: 'turf', id: 'platform', class: Platform, data: this.assets.platforms.turf },

      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.1, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.14, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.18, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.22, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.22, yPercentage: 0.69 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.69 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.57 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.33 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.21 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.34, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.42, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.57 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.45 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.33 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.21 },

      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.536, yPercentage: 0.72 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.616, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.696, yPercentage: 0.90 },

      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lionpattern, xPercentage: 0.456, yPercentage: 0.4 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.yellowpattern, xPercentage: 0.456, yPercentage: 0.515 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.yellowredpattern, xPercentage: 0.456, yPercentage: 0.63 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.yellowpattern, xPercentage: 0.456, yPercentage: 0.745 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lionpattern, xPercentage: 0.456, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.yellowpattern, xPercentage: 0.456, yPercentage: 0.965 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.yellowredpattern, xPercentage: 0.456, yPercentage: 1.08 },

      { name: 'draco', id: 'draco', class: Draco, data: this.assets.enemies.draco, xPercentage: 0.3, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"]},
      { name: 'draco', id: 'draco', class: Draco, data: this.assets.enemies.draco, xPercentage:  0.5, minPosition: 0.3, difficulties: ["normal", "hard", "impossible"] },
      { name: 'draco', id: 'draco', class: Draco, data: this.assets.enemies.draco, xPercentage:  0.75, minPosition: 0.5, difficulties: ["normal", "hard", "impossible"] }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
      { name: 'dementor', id: 'dementor', class: Dementor, data: this.assets.enemies.dementor, xPercentage:  0.5, minPosition:  0.05},
      { name: 'dementor', id: 'dementor', class: Dementor, data: this.assets.enemies.dementor, xPercentage:  0.9, minPosition: 0.5},

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.095, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.135, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.175, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.295, yPercentage: 0.46 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.687, yPercentage: 0.79, },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.611, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.529, yPercentage: 0.61 },

      { name: 'harry', id: 'player', class: PlayerQuidditch, data: this.assets.players.harry },
      { name: 'tube', id: 'tube', class: Tube, data: this.assets.obstacles.tube },
      //{ name: 'loading', id: 'background', class: BackgroundTransitions,  data: this.assets.backgrounds.loading },
      ];

      // Quidditch Game Level added to the GameEnv ...
      new GameLevel( {tag: "quidditch", callback: this.playerOffScreenCallBack, objects: quidditchGameObjects } );

        // Space Game Level definition...
        const spaceGameObjects = [
          // GameObject(s), the order is important to z-index...
          { name: 'space', id: 'background', class: Background, data: this.assets.backgrounds.space },
          { name: 'grass', id: 'platform', class: Platform, data: this.assets.platforms.grass },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.alien, xPercentage: 0.2, yPercentage: 0.85 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.alien, xPercentage: 0.2368, yPercentage: 0.85 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.alien, xPercentage: 0.5, yPercentage: 0.85 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.alien, xPercentage: 0.5368, yPercentage: 0.85 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.alien, xPercentage: 0.4, yPercentage: 1 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.alien, xPercentage: 0.4, yPercentage: 0.9 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.alien, xPercentage: 0.4, yPercentage: 0.8 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.alien, xPercentage: 0.4, yPercentage: 0.7 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.alien, xPercentage: 0.4, yPercentage: 0.6 },
          { name: 'alien', id: 'alien', class: Alien, data: this.assets.enemies.alien, xPercentage:  0.3, minPosition: 0.07 },
          { name: 'alien', id: 'alien', class: Alien, data: this.assets.enemies.alien, xPercentage:  0.5, minPosition: 0.3 },
          { name: 'alienSpecial', id: 'alien', class: Alien, data: this.assets.enemies.alien, xPercentage:  0.75, minPosition: 0.5 }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
          { name: 'flyingUFO', id: 'flyingUFO', class: FlyingUFO, data: this.assets.enemies.flyingUFO, xPercentage:  0.1, minPosition:  0.05},
          { name: 'flyingUFO', id: 'flyingUFO', class: FlyingUFO, data: this.assets.enemies.flyingUFO, xPercentage:  0.5, minPosition:  0.05},
          { name: 'monkey', id: 'player', class: Player, data: this.assets.players.monkey },
          { name: 'tree', id: 'tree', class: Tree, data: this.assets.obstacles.tree },
          { name: 'complete2', id: 'background', class: BackgroundTransitions,  data: this.assets.backgrounds.complete2 },
        ];
        // Space Game Level added to the GameEnv ...
        new GameLevel( {tag: "space", callback: this.playerOffScreenCallBack, objects: spaceGameObjects} );

    const winterObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'winter', id: 'background', class: BackgroundWinter, data: this.assets.backgrounds.winter },
      { name: 'snow', id: 'background', class: BackgroundSnow, data: this.assets.backgrounds.snow },
      { name: 'snowyfloor', id: 'platform', class: Platform, data: this.assets.platforms.snowyfloor },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2368, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2736 , yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3104, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3472, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.384, yPercentage: 0.74 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.4208, yPercentage: 0.66 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.56 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.48 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.40 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.32 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.69, yPercentage: 0.76 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.655, yPercentage: 0.68 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.62, yPercentage: 0.68 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.72, yPercentage: 0.76 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 1 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 0.92 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 0.84 },
      { name: 'snowflake', id: 'snowflake', class: Snowflake, data: this.assets.obstacles.snowflake, xPercentage: 0.2100, yPercentage: 0.75 },
      { name: 'snowflake', id: 'snowflake', class: Snowflake, data: this.assets.obstacles.snowflake, xPercentage: 0.2619, yPercentage: 0.75 },
      { name: 'snowflake', id: 'snowflake', class: Snowflake, data: this.assets.obstacles.snowflake, xPercentage: 0.3136, yPercentage: 0.75 },
      { name: 'owl', id: 'owl', class: Owl, data: this.assets.enemies.Owl, xPercentage:  0.3, minPosition:  0.05},
      { name: 'owl', id: 'owl', class: Owl, data: this.assets.enemies.Owl, xPercentage:  0.8, minPosition:  0.05},
      { name: 'snowman', id: 'snowman', class: Snowman, data: this.assets.enemies.Snowman, xPercentage:  0.2, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"]},
      { name: 'snowman', id: 'snowman', class: Snowman, data: this.assets.enemies.Snowman, xPercentage:  0.35, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"]},
      { name: 'snowman', id: 'snowman', class: Snowman, data: this.assets.enemies.Snowman, xPercentage:  0.5, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"]},
      { name: 'mario', id: 'player', class: PlayerWinter, data: this.assets.players.whitemario },
      { name: 'cabin', id: 'cabin', class: Cabin, data: this.assets.obstacles.cabin },
      { name: 'complete', id: 'background', class: BackgroundTransitions,  data: this.assets.backgrounds.complete },
    ];
    // Winter Game Level added to the GameEnv ...
    new GameLevel( {tag: "winter", callback: this.playerOffScreenCallBack, objects: winterObjects} );

        

        //Skibidi Toilet Level
        const skibidiGameObjects = [
          // GameObject(s), the order is important to z-index...
          { name: 'desert', id: 'background', class: Background, data: this.assets.backgrounds.desert },
          //{ name: 'clouds', id: 'background', class: BackgroundClouds, data: this.assets.backgrounds.clouds },
          { name: 'skibidiTitan', id: 'skibidiTitan', class: skibidiTitan, data: this.assets.enemies.skibidiTitan, xPercentage:  0.35, minPosition: 0.5 }, 
          { name: 'sand', id: 'platform', class: Platform, data: this.assets.platforms.sand },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.skibidiSand, xPercentage: 0.2, yPercentage: 1 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.skibidiSand, xPercentage: 0.4, yPercentage: 0.6 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.skibidiSand, xPercentage: 0.325, yPercentage: 0.8 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.skibidiSand, xPercentage: 0.2, yPercentage: 0.5 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.skibidiSand, xPercentage: 0.225, yPercentage: 0.5 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.skibidiSand, xPercentage: 0.0, yPercentage: 0.5 } ,
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.skibidiSand, xPercentage: 0.025, yPercentage: 0.5 },
          { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.skibidiSand, xPercentage: 0.025, yPercentage: 0.5 },
          { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.vbucks, xPercentage: 0.325, yPercentage: 0.7 },
          { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.vbucks, xPercentage: -0.0125, yPercentage: 0.4 },
          { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.vbucks, xPercentage: 0.0125, yPercentage: 0.4 },
          { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.vbucks, xPercentage: 0.0325, yPercentage: 0.4 },
          { name: 'skibidiToilet', id: 'Alien', class: Alien, data: this.assets.enemies.skibidiToilet, xPercentage:  0.3, minPosition: 0.07 },
          { name: 'skibidiToilet', id: 'Alien', class: Alien, data: this.assets.enemies.skibidiToilet, xPercentage:  0.5, minPosition: 0.3 },
          { name: 'skibidiToilet', id: 'Alien', class: Alien, data: this.assets.enemies.skibidiToilet, xPercentage:  0.75, minPosition: 0.5 }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
          { name: 'monkey', id: 'player', class: Player, data: this.assets.players.monkey },
          { name: 'laser', id: 'Laser', class: Laser, data: this.assets.obstacles.laser, xPercentage:  0.75, yPercentage: 0.5 },
          { name: 'toiletTube', id: 'toiletEnd', class: Tree, data: this.assets.obstacles.toilet },
          { name: 'complete3', id: 'background', class: BackgroundTransitions,  data: this.assets.backgrounds.complete3 },
        ];

        new GameLevel( {tag: "skibidi", callback: this.playerOffScreenCallBack, objects: skibidiGameObjects} );

        // Game Over Level definition...
        const endGameObjects = [
        { name:'background', class: Background, id: 'background', data: this.assets.backgrounds.end}
        ];
        // Game Over screen added to the GameEnv ...
        new GameLevel( {tag: "end",  callback: this.gameOverCallBack, objects: endGameObjects } );
    }
} 
// Bind the methods to the GameSetup object, ensures "this" inside of methods binds to "GameSetup"
// * * this avoids "Temporal Dead Zone (TDZ)" error... 
// * * * * "Cannot access 'GameSetup' before initialization", light reading TDZ (ha ha)...
// * * * * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_Dead_Zone
GameSetup.startGameCallback = GameSetup.startGameCallback.bind(GameSetup);
GameSetup.gameOverCallBack = GameSetup.gameOverCallBack.bind(GameSetup);

export default GameSetup;