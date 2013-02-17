$(function() {
  convertDescription();
  resetArea();

  var getTitle = function(info) {
    if (info.ogTitle) {
      return info.ogTitle;
    }
    return info.title;
  };
  var getOneImage = function(info) {
    if (info.ogImage) {
      return info.ogImage;
    }
    if (info.images.length > 0) {
      return info.images[0].src;
    }
    return null;
  };
  var n = 0;
  var submitData = {};

  $("#preview").empty();
  $("#make-submit").attr("disabled", "disabled");
  $("#make").submit(function(event) {
    var keys = Object.keys(submitData)
      , j = 0;
    for (var i = 0; i < keys.length; i++) {
      var data = submitData[keys[i]];
      data.n = j;
      $("#tinput").tmpl(data).appendTo($('#make'));
      j++;
    }
  });
  $("#import-r-bookmark").click(function(event) {
    window.open('https://app.rakuten.co.jp/services/authorize?response_type=code&client_id={{ config.rakuten_api.application_id }}&redirect_uri='+encodeURIComponent('{{ config.base_url }}/api/rakuten/fb')+'&scope=rakuten_favoritebookmark_read', '', 'width=600,height=500,resizable=yes,scrollbars=yes');
  });
  var addNewSuggestion = function(data) {
    var obj = $("#stmpl").tmpl(data, {isa: true});
    obj.appendTo($('#suggest'));
    convertDescription();
    resetArea()
    $(obj).find('.s-add-button').click(function(e){
      var pitem = $("#stmpl").tmpl(data, {isd: true})
        , i = n++;
      $("#make-submit").removeAttr("disabled");
      submitData[i] = data;
      pitem.click(function(event) {
        delete submitData[i];
        pitem.remove();
        if (Object.keys(submitData).length == 0){
          $("#make-submit").attr("disabled", "disabled");
        }
        resetArea();
        return false;
      });
      pitem.appendTo($('#preview'));
      convertDescription();
      obj.remove();
      resetArea();
      return;
    });
  };
  $("#url-form").submit(function(event){
    var url = event.target.url.value;
    $("#suggest").empty();
    $("#suggest").append(
      $('<img>').attr('src', '/images/ajax-loader.gif')
    );
    $.ajax({
      type: "GET",
      url: "/api/getInfo",
      data: {url: url},
      dataType: 'json',
      success: function(data) {
        data.url   = url;
        data.image = getOneImage(data);
        data.title = getTitle(data);
        if (data.cost) {
          data.formattedCost = data.cost
          .toString()
          .replace(/([\d]+?)(?=(?:\d{3})+$)/g, function(t){ return t + ','; });
        }
        $("#suggest").empty();
        addNewSuggestion(data);
      },
      error: function(xhr, status, error) {
        $("#suggest").empty();
        $("#suggest").text('エラー');
        resetArea();
      }
    });

    return false;
  });
  window.onGetRakutenFb = function(data) {
    $("#suggest").empty();
    $(data.items).each(function(i, item) {
      var item = item.item;
      var d = {};
      d.url = item.itemUrl;
      d.image = item.mediumImageUrl;
      d.type = "ほしい";
      d.title = item.itemName;
      addNewSuggestion(d);
    });
    return;
  };
});

function convertDescription() {
  var limit = '300';
  var reader = '…';
  var $desc = $('div.description');
  $desc.each(function(){
    var textLength = $(this).text().length;
    var textTrim = $(this).text().substr(0,(limit))
    if(limit < textLength) {
      $(this).html(textTrim + reader).css({visibility:'visible'});
    } else if(limit >= textLength) {
      $(this).css({visibility:'visible'});
    }
  });
};

function resetArea() {
  if($("#suggest div.row").length == 0){
    $('#suggestArea').hide();
  } else {
    $('#suggestArea').show();
  }
  if($("#preview div.row").length == 0){
    $('#previewArea').hide();
  } else {
    $('#previewArea').show();
  }
};