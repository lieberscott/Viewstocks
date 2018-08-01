$(document).ready(async () => {
  
  /*global io*/
  let socket = io();

  let todayDate = new Date();
  let year = todayDate.getFullYear();
  let month = todayDate.getMonth() + 1;
  
  if (month < 10) {
    month = "0" + month;
  }
  
  let day = todayDate.getDate();
  
  if (day < 10) {
    day = "0" + day;
  }
  
  let today = year + "-" + month + "-" + day; // for API call
  
  let seriesArr = [];
  
  for (let i = 0; i < symbolsArr.length; i++) {
    
    let obj = {};
    //https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json?start_date=2016-05-01&end_date=2018-07-01&order=asc&column_index=4&collapse=daily
    await $.getJSON('https://www.quandl.com/api/v3/datasets/WIKI/' + symbolsArr[i] + '.json?api_key=bZ4_NUnHRGAFx3-yNN3y&start_date=2016-05-01&end_date=' + today + '&order=asc&column_index=4&collapse=daily', async (d) => {

      let responseData = d.dataset.data;
      
       let convertedData = responseData.map((item, ind) => {
        let arr = [];
        
        arr = item[0].split("-");
        let date = new Date(arr[0], arr[1], arr[2]).getTime();
        
        return [date, item[1]];
        
      });
      
      obj.name = symbolsArr[i];
      obj.type = "spline";
      obj.data = convertedData;
      seriesArr.push(obj);
      
      let desc = d.dataset.name;
      
      // add closeable component
      $('<div class="col-md-4"><div class="onecomponent"><div id="' + symbolsArr[i] + '" class="exout">x</div><div class="innertext name">' + symbolsArr[i] + '<div class="desc">' + desc + '</div></div></div></div>')
      .insertBefore(".insertbefore"); // ".insertbefore" class is on stock submission component, and only for this reason
    })
    
    .fail((err) => console.log(err));
    
  }
  
	$('#main').highcharts('StockChart', {

    colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
    chart: {
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, '#2a2a2b'],
          [1, '#3e3e40']
        ]
      },
      style: {
        fontFamily: '\'Unica One\', sans-serif'
      },
      plotBorderColor: '#606063'
    },
    title: {
      style: {
        color: '#E0E0E3',
        textTransform: 'uppercase',
        fontSize: '20px'
      }
    },
    subtitle: {
      style: {
        color: '#E0E0E3',
        textTransform: 'uppercase'
      }
    },
    xAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
        style: {
          color: '#A0A0A3'
        }
      }
    },
    yAxis: {
      gridLineColor: '#707073',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
        style: {
          color: '#A0A0A3'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
        color: '#F0F0F0'
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          color: '#B0B0B3'
        },
        marker: {
          lineColor: '#333'
        }
      },
      boxplot: {
        fillColor: '#505053'
      },
      candlestick: {
        lineColor: 'white'
      },
      errorbar: {
        color: 'white'
      }
    },
    legend: {
      itemStyle: {
        color: '#E0E0E3'
      },
      itemHoverStyle: {
        color: '#FFF'
      },
      itemHiddenStyle: {
        color: '#606063'
      }
    },
    credits: {
      style: {
        color: '#666'
      }
    },
    labels: {
      style: {
        color: '#707073'
      }
    },
    drilldown: {
      activeAxisLabelStyle: {
        color: '#F0F0F3'
      },
      activeDataLabelStyle: {
        color: '#F0F0F3'
      }
    },
    navigation: {
      buttonOptions: {
        symbolStroke: '#DDDDDD',
        theme: {
          fill: '#505053'
        }
      }
    },
    // scroll charts
    rangeSelector: {
      buttonTheme: {
        fill: '#505053',
        stroke: '#000000',
        style: {
          color: '#CCC'
        },
        states: {
          hover: {
            fill: '#707073',
            stroke: '#000000',
            style: {
              color: 'white'
            }
          },
          select: {
            fill: '#000003',
            stroke: '#000000',
            style: {
              color: 'white'
            }
          }
        }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
        backgroundColor: '#333',
        color: 'silver'
      },
      labelStyle: {
        color: 'silver'
      }
    },
    navigator: {
      handles: {
        backgroundColor: '#666',
        borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
        color: '#7798BF',
        lineColor: '#A6C7ED'
      },
      xAxis: {
        gridLineColor: '#505053'
      }
    },
    scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
    },
    // special colors for some of the
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#C0C0C0',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)',
    // end theme options
    
    rangeSelector: {
      selected: 5
    },
    credits: {
      enabled: false
    },
    title: {
      text: "Interactive Stock Price Checker"
    },
	  series: seriesArr
	});

  $('#addSeries').click(async () => {
    
    let chart = $("#main").highcharts();
    let symbol = $("#symbol").val();
    let series = chart.series;
    let sym = symbol.toUpperCase(); // for adding the symbol to the chart
    let response;
    let unique = true; // ensure it's not a repeat
    
    for (let i = 0; i < series.length; i++) {
      if (series[i].name == sym) {
        unique = false;
        break;
      }
    }
    
    if (unique && series.length < 10) {
      await $.getJSON('https://www.quandl.com/api/v3/datasets/WIKI/' + sym + '.json?api_key=bZ4_NUnHRGAFx3-yNN3y&start_date=2016-05-01&end_date=' + today + '&order=asc&column_index=4&collapse=daily', (data) => {
        // still need better error handling (try an ajax request as in other challenges)
        socket.emit('add symbol', sym);
      })
      .fail(() => {
        $(".sync").append('<div class="alert">Incorrect or not existing stock code</div>');
        setInterval(() => $(".alert").remove(), 3000); 
      });

    }
    
    $("#symbol").val('');
    
  });
  
  // receive messages from others (and yourself)
  socket.on('add symbol', async (symbol) => {
    
    
    console.log("hello");
    let chart = $("#main").highcharts();
    let sym = symbol.symbol.toUpperCase(); // for adding the symbol to the chart
    let responseData;
    let convertedData;
    let desc;
    
    await $.getJSON('https://www.quandl.com/api/v3/datasets/WIKI/' + sym + '.json?api_key=bZ4_NUnHRGAFx3-yNN3y&start_date=2016-05-01&end_date=' + today + '&order=asc&column_index=4&collapse=daily', async (d) => {
      // still need better error handling (try an ajax request as in other challenges)
      responseData = d.dataset.data;
      
      let convertedData = responseData.map((item, ind) => {
        let arr = [];
        
        arr = item[0].split("-");
        let date = new Date(arr[0], arr[1], arr[2]).getTime();
        
        return [date, item[1]];
        
      })
      
      chart.addSeries({
        type: "spline",
        name: sym,
        data: convertedData
      });

      if (chart.series.length > 8) {
        chart.series[0].remove();
      };
        
      desc = d.dataset.name;

      // add closeable component
      $('<div class="col-md-4"><div class="onecomponent"><div id="' + sym + '" class="exout">x</div><div class="innertext name">' + sym + '<div class="desc">' + desc + '</div></div></div></div>')
      .insertBefore(".insertbefore"); // ".insertbefore" class is on stock submission component, and only for this reason
      
    })
    .fail(() => console.log("error"));

  });
  
  $("#components").on("click", ".exout", (e) => { // delete component on click
    
    let sym = e.currentTarget.id; // AAPL, GOOG, etc.
        
    socket.emit('delete symbol', sym);
  });
  
  socket.on('delete symbol', async (symbol) => {
    
    let sym = symbol.symbol;

    let del = $("#" + sym).parentsUntil("#components");

    let chart = $("#main").highcharts();
    let series = chart.series;
    
    for (let i = 0; i < series.length; i++) {
      if (series[i].name == sym) {
        series[i].remove();
      }
    }
    
    del.remove();

  });

});