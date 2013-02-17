$(function() {
  var $desc = $('div.description');
  var limit = '300';
  var reader = '…';
  $desc.each(function(){
    var textLength = $(this).text().length;
    var textTrim = $(this).text().substr(0,(limit))
    if(limit < textLength) {
      $(this).html(textTrim + reader).css({visibility:'visible'});
    } else if(limit >= textLength) {
      $(this).css({visibility:'visible'});
    }
  });
});