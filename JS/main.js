function tabs_products() {
    $('.b-tabs-tab:not(:first)').hide();    
    $('.b-tabs-btns a').click(function(e) {
        e.preventDefault();
        if ( ! $(this).hasClass('active')) {
            $('.b-tabs-tab').hide();
            $('.b-tabs-btns a.active').removeClass('active');
            $(this).addClass('active');
            var clicked = $(this).attr('href');
            $(clicked).fadeIn('fast');
        }
    });
}

function tabs_profile() {
    $('.b-profile-tabs-tab:not(:first)').hide();    
    $('.b-profile-tabs-btns a').click(function(e) {
        
        if ( ! $(this).hasClass('mod') ) {
            e.preventDefault();

            if ( ! $(this).parent('li').hasClass('active') ) {
                $('.b-profile-tabs-tab').hide();
                $('.b-profile-tabs-btns .active').removeClass('active');
                $(this).parent('li').addClass('active');
                var clicked = $(this).attr('href');
                $(clicked).fadeIn('fast');
            }
        }
    });
}

function chatExpand() {
    $('#chatHeader').click(function(){
        if ( $('#chatBody').is(':visible') ) {
            $('#chatBody').slideUp().removeClass('open');
            $('#container').animate({left: 0});
        } else {
            $('#chatScroll').height( $(window).height() - 213 );
            $('#chatBody').slideDown().addClass('open');
            $('#container').animate({left: -150});
        }
    });
}
function randomFreeElement(){
    var elements = $('.b-drawing-panel .b-cell');
    var needElements = [];
    elements.each(function(){
        if(!$(this).hasClass('active'))
            needElements.push($(this));
    });
    return needElements[Math.floor(Math.random() * needElements.length)];
}
function changeProgressBar(progressBar, sign){
    var maxValue = parseInt(progressBar.attr('aria-valuemax'));
    var minValue = parseInt(progressBar.attr('aria-valuemin'));
    var currentValue = parseInt(progressBar.attr('aria-valuenow'));
    var unit = 100 / maxValue;
    if (sign == 'plus' && maxValue > currentValue){
        currentValue += 1;
    }
    if (sign == 'minus' && minValue < currentValue){
        currentValue -= 1;
    }
    var vacantValue = maxValue - currentValue;
    var currentPercentValue = currentValue * unit;
    progressBar.closest('.b-progr').find('.taken b').html(currentValue);
    progressBar.closest('.b-progr').find('.vacant b').html(vacantValue);
    progressBar.attr('aria-valuenow', currentValue);
    progressBar.css('width', currentPercentValue+'%');
    return {'take':currentValue, 'vacant':vacantValue};
}
function getWinNumber(){
    return 20;
}
function startLottery(players){
    var elements = $('.b-drawing-panel .b-cell');
    var countElements = elements.length;

    var audio = new Audio('media/collect.mp3');
    audio.play();

    var intervalAudio = setInterval(function(){
        var audio = new Audio('media/collect.mp3');
        audio.play();
    }, 3900);

    var intervalID = setInterval(function(){
        var oneTimeActiveElements = parseInt(countElements / 2);
        var activeElements = [];
        for(var i = 0; i < oneTimeActiveElements; i++){
            var element = elements.eq(Math.floor(Math.random() * elements.length));
            activeElements.push(element);

        }
        elements.removeClass('yell');
        for(element in activeElements){
            if (!activeElements.hasOwnProperty(element)) continue;
            activeElements[element].addClass('yell');
        }
    }, 200);
    setTimeout(function(){
        clearInterval(intervalID);
        clearInterval(intervalAudio);
        elements.removeClass('yell');
        var winNumber = getWinNumber();
        elements.each(function(){
            if($(this).find('span').text() == winNumber){
                $(this).addClass('win');
            }
        });
        var winner = {};
        for(index in players){
            if (!players.hasOwnProperty(index)) continue;
            if(players[index]['number'] == winNumber) winner = players[index];
        }
        $('.b-drawing-results').addClass('active');
        $('.b-drawing-results .place-w').html(winNumber);
        $('.b-drawing-results_user .name').html(winner['user']);
        $('.b-drawing-results_user .ava').attr('src',winner['avatar'])
    }, 10000);

}
function betAlert(number){
    $('body .alerts').append('<div class="dialog-mess"><div class="close">&times;</div>Вы заняли место №'+number+'</div>');
    var alert = $('body .alerts .dialog-mess').last();
    setTimeout(function(){
        alert.remove();
    }, 3000);
}
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip({
       animated : 'fade',
       container: 'body'
    });
    var months = ['Январь', 'Февраль', 'Март', 'Апрель','Май', 'Июнь', 'Июль', 'Август','Ментябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    var players = [
    ];
    //я не знаю как с бэкенда будут передваться данные с js поэтому пока так
    var user = {
        avatar:'images/ava1.jpg',
        name:'Челвечег',
        count: 0
    };
    tabs_products();
    tabs_profile();
    chatExpand();
    changeProgressBar($('.progress-bar'));

    $('body').on('click', '.dialog-mess .close', function(){
        $(this).closest('.dialog-mess').remove();
    });
    $('body').on('click', '.b-drawing-panel .b-cell', function(){
        if($(this).hasClass('active')) return false;
        var number = $(this).find('span').text();
        $(this).addClass('active');
        $(this).prepend('<img src="'+user['avatar']+'" alt="ava">');
        players.push({number:number, user:user['name'], avatar:user['avatar']});
        var state = changeProgressBar($('.progress-bar'), 'plus');
        user.count++;
        $('.b-drawing-controls .info span').html(user.count+' мест');
        betAlert(number);
        var date = new Date();
        var log = '<p class="b-drawing-log_itm"><i class="icon icon-time-big"></i> '+date.getDate()+'. '+months[date.getMonth()+1]+' '+date.getFullYear()+', '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+' '+user.name+' занял место #'+number+'</p>';
        $('.b-drawing-log').append(log);
        var audio = new Audio('media/song.mp3');
        audio.play();
        if(state['vacant'] == 0) startLottery(players);
    });
    $('body').on('click', '.b-drawing-controls .but-main', function(e){
        e.preventDefault();
        var element = randomFreeElement();
        var number = element.find('span').text();
        element.addClass('active');
        element.prepend('<img src="'+user['avatar']+'" alt="ava">');
        players.push({number:number, user:user['name'], avatar:user['avatar']});
        var state = changeProgressBar($('.progress-bar'), 'plus');
        user.count++;
        $('.b-drawing-controls .info span').html(user.count+' мест');
        betAlert(number);
        var date = new Date();
        var log = '<p class="b-drawing-log_itm"><i class="icon icon-time-big"></i> '+date.getDate()+'. '+months[date.getMonth()+1]+' '+date.getFullYear()+', '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+' '+user.name+' занял место #'+number+'</p>';
        $('.b-drawing-log').append(log);
        var audio = new Audio('media/song.mp3');
        audio.play();
        if(state['vacant'] == 0) startLottery(players);
    });
    //Для теста - такивация старта лоттереи при клике по картинке
    /*$('body').on('click', '.b-prod_img', function(e){
        e.preventDefault();
        $('.b-drawing-panel .b-cell').each(function(){
            var number = $(this).find('span').text();
            $(this).addClass('active');
            $(this).prepend('<img src="'+user['avatar']+'" alt="ava">');
            players.push({number:number, user:user['name'], avatar:user['avatar']});
            var state = changeProgressBar($('.progress-bar'), 'plus');
            if(state['vacant'] == 0) startLottery(players);
        });
        startLottery(players);
    });*/

    $('.b-data-url input').validate();

    $(".b-data-url input").addClass('blank');
    $(".b-data-url input").on("input", function() {
        if($(".b-data-url input").is(":blank")) {
          $(".b-data-url input").addClass('blank');
        } else {
            $(".b-data-url input").removeClass('blank');
        }        
    });



    $('#carousel-winners').slick({
        slidesToShow: 6,
        infinite: false,
        speed: 200,
        appendArrows: $('.b-winners_carousel'),
        prevArrow: "<button class='slick-prev'></button>",
        nextArrow: "<button class='slick-next'></button>",
    });   

    $('#carousel-shoplist').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        variableWidth: true,
        appendArrows: $('#carousel-shoplist'),
        prevArrow: "<button class='slick-prev'>&lt;</button>",
        nextArrow: "<button class='slick-next'>&gt;</button>",
    });   
});