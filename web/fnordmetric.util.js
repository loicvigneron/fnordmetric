FnordMetric.util.getNextWidgetUID = function(){
  return (FnordMetric.currentWidgetUID += 1);
}

FnordMetric.util.decPrint = function(val){
  return (val < 10 ? '0'+val : val);
}

FnordMetric.util.format = function(str){
  if(str.substring(0, 1) == "$"){
    str = "FnordMetric.util."+str.substring(1)
    return eval(str);
  } else {
    return str;
  }
}

FnordMetric.util.formatTimeOfDay = function(_time){
  if(_time === null) {
    return "";
  } else {
    var time = new Date();
    time.setTime(_time*1000);
    return FnordMetric.util.decPrint(time.getHours()) + ':' +
           FnordMetric.util.decPrint(time.getMinutes()) + ':' +
           FnordMetric.util.decPrint(time.getSeconds());
  }
}

FnordMetric.util.formatTimeRange = function(range){
  if (range < 60){
    return parseInt(range) + ' sec';
  } else if(range<3600){
    return parseInt(range/60) + ' min';
  } else if(range==3600){
    return '1 hour';
  } else if(range<(3600*24)){
    return parseInt(range/3600) + ' hours';
  } else if(range==(3600*24)){
    return '1 day';
  } else {
    return parseInt(range/(3600*24)) + ' days';
  }
}

FnordMetric.util.formatTimeRangePre = function(range, offset){
  if((offset == 0) && (range==(3600*24))){
    return 'today';
  } if((offset == 0) && (range==3600)){
    return 'this hour';
  } else if(offset == 0){
    return 'last ' + FnordMetric.util.formatTimeRange(offset||0);
  } else if((offset==-1) && (range==3600*24)){
    return 'yesterday';
  } else if((offset==-1) && (range==3600)){
    return 'last hour';
  } else {
    return FnordMetric.util.formatTimeRange(range) + ' ago';
  }
}

FnordMetric.util.formatTimeSince = function(time){
  var now = new Date().getTime()/1000;
  var since = now - time;
  return FnordMetric.util.formatTimeRange(since);
}

FnordMetric.util.formatOffset = function(offset, next_offset){
  if((offset == 0) && (next_offset==(3600*24))){
    return 'today';
  } if((offset == 0) && (next_offset==3600)){
    return 'this hour';
  } else if(offset == 0){
    return 'last ' + FnordMetric.util.formatTimeRange(next_offset||0);
  } else if(offset==(3600*24)){
    return 'yesterday';
  } else if(offset==3600){
    return 'last hour';
  } else {
    return FnordMetric.util.formatTimeRange(offset) + ' ago';
  }
}

FnordMetric.util.formatValue = function(value){
  if(value < 10){
    return value.toFixed(2);
  } else if(value > 1000){
    return (value/1000.0).toFixed(1) + "k";
  } else {
    return value.toFixed(0);
  }
}

FnordMetric.util.formatTimeValue = function(value){
  if (value < 60){
    return parseFloat(value).toFixed(1) + 's';
  } else if(value<3600){
    return parseFloat(value/60).toFixed(1) + 'm';
  } else if(value<(3600*24)){
    return parseFloat(value/3600).toFixed(1) + 'h';
  } else {
    return parseFloat(value/(3600*24)).toFixed(1) + 'd';
  }
}

FnordMetric.util.formatPercentValue = function(value){
  return value + '%';  
}

FnordMetric.util.formatGaugeValue = function(gauge_key, value){
  if(gauge_key.slice(0,8) === '__time__'){
    return FnordMetric.util.ormatTimeValue(value);
  } else if(gauge_key.slice(0,11) === '__percent__'){
    return FnordMetric.util.formatPercentValue(value);
  } else {
    return FnordMetric.util.formatValue(value);
  }
}

FnordMetric.util.updateNumbers = function(trgt_elem, diff_factor){
    var still_running = false;
    if(!diff_factor){ diff_factor = 4; }
    $('.number', $(trgt_elem)).each(function(){
      var target_val = parseFloat($(this).attr('data'));
      var current_val = parseFloat($(this).attr('data-current'));
      if(!current_val){ current_val=0; }
      if(!target_val){ target_val=0; }
      var diff = (target_val-current_val)/diff_factor;
      if((diff > 0) && (diff < 1)){ diff=1; }
      if((diff < 0) && (diff > -1)){ diff=-1; }
      if(target_val != current_val){
        still_running = true;
        var new_val = current_val+diff;
        if((diff > 0) && (new_val > target_val)){ new_val = target_val; }
        if((diff < 0) && (new_val < target_val)){ new_val = target_val; }
        $(this).attr('data-current', new_val);
        $('.value', this).html(FnordMetric.util.formatGaugeValue($(this).attr('rel'), new_val));
      }
    });
    if(still_running){
      (function(te, df){
        window.setTimeout(function(){ 
          FnordMetric.util.updateNumbers(te, df); 
        }, 30);
      })(trgt_elem, diff_factor);
    }
  }