// (function () {
    beforeAll( function (done) {
        document.body.innerHTML = '<style> .pseudo-class { position: relative; } .pseudo-class:before, .pseudo-class:after { content: ""; position: absolute; top: 0; left: 0; width: 100px; height: 100px; background-color: red; } </style> <div id="container"> <div id="id" class="div"> </div> <div class="div"> </div> <form id="form"> <input type="radio" class="radio checked" checked> <input type="radio" class="radio"> <button id="button">submit</button> </form> <ul class="list"> <li id="first-child" class="li"></li> <li class="li"> <p class="p nth-child-2n"></p> </li> <li class="li"></li> <li class="li"> <p class="p nth-child-2n"></p> </li> <li class="li"></li> </ul> <div class="pseudo-class"> </div> </div>';
    });
// })();