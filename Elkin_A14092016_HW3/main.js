/* load data on backend:*/
'use strict';

var EnergyAreaContents = {
    chart: {
        renderTo: 'EnergyGraph',
        type: 'areaspline',
        backgroundColor: 'transparent',
        style: {
            fontFamily: "Times New Roman"
        }
    },
    title: {
        text: 'Generation MW',
        align: 'left',
        style: { 
            fontSize: "15px"
        }
    },
    tooltip: {
      formatter: function () {
          return Highcharts.dateFormat('%e %b. %I:%M %P',
          new Date(this.points[0].x)) + ' Total '+ this.points[0].total + ' MW'
      },
      positioner: function () {
          return {
              x: this.chart.chartWidth - this.label.width,
              y: 10
          };
      },
      shared: true,
      borderWidth: 0,
      backgroundColor: 'none',
      shadow: false,
      style: {
          fontSize: '13px'
      },
      snap: 100
    },
    xAxis: {
        type: 'datetime',
        minorTickInterval: 30 * 60 * 1000,
        dateTimeLabelFormats: {
            month: '%b \'%y'
        },
        crosshair: {
            width: 1,
            zIndex: 5,
            color: '#CA5131'
        },
        events: {
            setExtremes: syncExtremes
        }
    },
    yAxis: {
        title: {
            enabled: false
        },
        labels: {
            formatter: function (){
                return this.value;
            },
            align: 'left',
            reserveSpace: false,
            x: 4,
            y: -3
        },
        tickInterval: 1000,
        showLastLabel: false,
        min: -300
    },
    legend: {
        enabled: true
    },
    plotOptions: {
        areaspline: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        },
        series: {
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    },
    series: []
};

var PriceLineContents = {
    chart: {
        renderTo: 'PriceGraph',
        type: 'line',
        backgroundColor: 'transparent',
        style: {
            fontFamily: "Times New Roman"
        }
    },
    title: {
        text: 'Price $/MWh',
        align: 'left',
        style: {
            color: "#333333", 
            fontSize: "15px"
        }
    },
    tooltip: {
      formatter: function () {
          return Highcharts.dateFormat('%e %b. %I:%M %P',
          new Date(this.point.x)) + ' $'+ this.point.y + '.00'
      },
      positioner: function () {
          return {
              x: this.chart.chartWidth - this.label.width,
              y: 10 
          };
      },
      borderWidth: 0,
      backgroundColor: 'none',
      shadow: false,
      style: {
          fontSize: '13px'
      },
      snap: 100
    },
    xAxis: {
        type: 'datetime',
        tickInterval: 30 * 60 * 1000,
        dateTimeLabelFormats: {
            day: '%e. %b',
            month: '%b \'%y'
        },
        crosshair: {
            width: 1,
            color: '#CA5131'
        },
        visible: false,
        events: {
            setExtremes: syncExtremes
        }
    },
    yAxis: {
        title: {
            enabled: false
        },
        labels: {
            align: 'left',
            reserveSpace: false,
            x: 4,
            y: -3
        },
        tickInterval: 100,
        showLastLabel: false,
        max: 350
    },
    plotOptions: {
        line: {
            step: 'center',
            lineWidth: 1
        },
        series: {
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    },
    legend: {
        enabled: false
    },
    series: []
};

var TempLineContents = {
    chart: {
        renderTo: 'TemperatureGraph',
        type: 'spline',
        backgroundColor: 'transparent',
        style: {
            fontFamily: "Times New Roman"
        }
    },
    title: {
        text: 'Temperature °F',
        align: 'left',
        style: {
            color: "#333333", 
            fontSize: "14px"
        }
    },
    tooltip: {
      formatter: function () {
          return Highcharts.dateFormat('%e %b. %I:%M %P',
          new Date(this.point.x)) + ' ' + this.point.y + ' °F'
      },
      positioner: function () {
          return {
              x: this.chart.chartWidth - this.label.width,
              y: 10 
          };
      },
      borderWidth: 0,
      backgroundColor: 'none',
      shadow: false,
      style: {
          fontSize: '13px'
      },
      snap: 100
    },
    xAxis: {
        type: 'datetime',
        tickInterval: 30*60*1000,
        dateTimeLabelFormats: {
            day: '%e. %b',
            month: '%b \'%y'
        },
        crosshair: {
            width: 1,
            color: '#CA5131'
        },
        visible: false,
        events: {
            setExtremes: syncExtremes
        }
    },
    yAxis: {
        title: {
            enabled: false
        },
        tickInterval: 20,
        maxPadding: 0.001,
        min: 0, 
        max: 100,
        labels: {
            align: 'left',
            reserveSpace: false,
            x: 4,
            y: -3
        },
        showLastLabel: false
    },
    plotOptions: {
        spline: {
            lineWidth: 1
        },
        series: {
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    },
    legend: {
        enabled: false
    },
    series: []
};

var pieOptions = {
    chart: {
        renderTo: 'pieChart',
        type: 'pie',
        backgroundColor: 'transparent',
        animation: false,
        style: {
            fontFamily: "Times New Roman"
        }
    },
    plotOptions: {
        pie: {
            innerSize: '50%',
            size: '75%',
            dataLabels: {
                enabled: false
            }
        },
        series: {
            animation: false
        }
    },
    title: {
        align: 'center',
        verticalAlign: 'middle',
        text: '',
        style: {
            fontSize: '14px'
        }
    },
    series: [{
        name: 'Energy',
        colorByPoint: true,
        data: []
    }]
}

var fileDataset = new Array();
$.getJSON('https://raw.githubusercontent.com/KevinElkin/DSC-106-HW3/master/HW_3/assets/springfield.json' , function(data) {
    var length = data.length
    for (var i = 0; i < length; i++) {

        fileDataset.push(data[i])
    }
    onSuccessCb(fileDataset);
})

var EnergyColors = {
    'black_coal': '#121212', 
    'distillate': '#C74523', 
    'gas_ccgt': '#FDB462',
    'hydro': '#4582B4',
    'wind': '#437607',
    'exports': '#977AB1',
    'pumps': '#88AFD0'
};

var globalEnergyData = {
    name: [],
    data: []
}

function updateEnergyData(data) {

    globalEnergyData.data = [];
    for (var idx = 0; idx < data[0]['data'].length; idx ++) {
        var energyBreakup = data.map(elm => {return elm['data'][idx]});
        globalEnergyData['data'].push(energyBreakup);
      }
      globalEnergyData['name'] = data.map(elm => elm['name']);
}

function renderPieChart(nodeId) {
    var pieDataSet = globalEnergyData['name'].map(function(elm, idx) {
        if (globalEnergyData['name'] !== 'exports' & globalEnergyData['name'] !== 'pumps') {
            return {
                name: elm.split('.')[elm.split('.').length - 1],
                color: EnergyColors[elm.split('.')[elm.split('.').length - 1]],
                y: globalEnergyData['data'][nodeId][idx]
                
            }
        }
    });

    pieOptions.series[0].data = pieDataSet;
    var sum = 0;

    for (var i = 0; i < pieOptions.series[0].data.length; i++) {
        sum = sum + pieOptions.series[0].data[i].y
    }

    pieOptions.title.text = Math.round(sum) + ' MW';

    Highcharts.chart(pieOptions)

    updateLegend(pieDataSet, sum)
  }

function onSuccessCb(fileDataset) {
    var energyData = fileDataset.filter(function(elm) {
        if (elm.fuel_tech !== 'rooftop_solar'){
            return elm['type'] === 'power';
        };
    }).map(function(elm) {
        var energyDatavals = new Array();
        if (elm.fuel_tech === 'pumps' || elm.fuel_tech === 'exports') {
            for (var i = 1; i < elm.history.data.length; i = i + 6) {
              energyDatavals.push(elm.history.data[i]*(-1));
            };
        } else {
            for (var i = 1; i < elm.history.data.length; i = i + 6) {
              energyDatavals.push(elm.history.data[i]);
            };
        }
        return {
            data: energyDatavals,
            name: elm.fuel_tech,
            color: EnergyColors[elm.fuel_tech],
            fillOpacity: 1,
            pointStart: (elm.history.start + 5 * 60) * 1000,
            pointInterval: 1000*60*30,
            tooltip: {
                valueSuffix: ' ' + elm.units
            }
        };
    });

    
    updateEnergyData(energyData)
    var tempData = fileDataset.filter(function(elm) {
        return elm.type === 'temperature';
    }).map(function(elm) {
        var tempDataVals = new Array();
        for (var i = 1; i < elm.history.data.length; i++) {
            tempDataVals.push(elm.history.data[i]);
        };
        return {
            data: tempDataVals,
            name: elm.type,
            pointStart: (elm.history.start + 30 * 60) * 1000,
            pointInterval: 1000*60*30,
            color: 'Red',
            tooltip: {
                valueSuffix: ' ' + elm.units
            }
        };
    })
    var priceData = fileDataset.filter(function(elm) {
        return elm.type === 'price';
    }).map(function(elm) {

        var priceDataVals = new Array();

        for (var i = 1; i < elm.history.data.length; i++) {
            priceDataVals.push(elm.history.data[i]);
        };

        return {
            data: priceDataVals,
            name: elm.type,
            pointStart: (elm.history.start + 30 * 60) * 1000,
            pointInterval: 1000 * 60 * 30,
            color: 'Red',
            tooltip: {
                valueSuffix: ' ' + elm.units
            }
        };
    })

    EnergyAreaContents.series = energyData.reverse();
    PriceLineContents.series = priceData;
    TempLineContents.series = tempData;
    
    Highcharts.chart(TempLineContents);
    Highcharts.chart(PriceLineContents);
    Highcharts.chart(EnergyAreaContents);

    renderPieChart(0)
}

['mouseleave'].forEach(function (eventType) {
    document.getElementById('ChartSpace').addEventListener(
        eventType,
        function (e) {
            var chart,
                point,
                i,
                event;
            
                for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                    chart = Highcharts.charts[i];
                    event = chart.pointer.normalize(e);
                    point = chart.series[0].searchPoint(event, true);
                    
                    if (point) {
                        point.onMouseOut(); 
                        chart.tooltip.hide(point);
                        chart.xAxis[0].hideCrosshair(); 
                    }
                }
            }
    )
});

['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    document.getElementById('ChartSpace').addEventListener(
        eventType,
        function (e) {
            var chart,
                point,
                i,
                event,
                idx;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);
                idx = chart.series[0].data.indexOf( point );

                if (point) {
                    point.highlight(e);
                    renderPieChart(idx);
                }
            }
        }
    );
});

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
    this.series.chart.yAxis[0].drawCrosshair(event, this);
};


/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { 
                    chart.xAxis[0].setExtremes(
                        e.min,
                        e.max,
                        undefined,
                        false,
                        { trigger: 'syncExtremes' }
                    );
                }
            }
        });
    }
}

function updateLegend(data, total) {
    
    var load = document.querySelector('#loads').querySelector('.summed');
    var sources = document.querySelector('#sources').querySelector('.summed');
    sources.innerHTML = Math.round(total);
    
    for(var i = 0; i < data.length; i++) {

        var name = '#' + data[i].name;
        var percentage = document.querySelector(name).querySelector('.percentage');
        var added = document.querySelector(name).querySelector('.summed');

        var per = ((data[i].y / total) * 100);
        percentage.innerHTML = per;
        
        if (data[i].y >= 1) {
            added.innerHTML = Math.round(data[i].y);
        } else {
            added.innerHTML = data[i].y.toFixed(2);
        }

        if (per >= 1) {
           percentage.innerHTML = per.toFixed(2)+'%';
        } else {
           percentage.innerHTML = per.toFixed(4)+'%';
        }
    }
    var pumps = document.querySelector('#pumps').querySelector('.summed');
    var exports = document.querySelector('#exports').querySelector('.summed');
    load.innerHTML = Math.round(Number(pumps.innerHTML) + Number(exports.innerHTML));

    var net = document.querySelector('#net').querySelector('.summed');
    net.innerHTML = Math.round(Number(sources.innerHTML) + Number(load.innerHTML));

    // var wind = document.querySelector('#wind').querySelector('.percentage');
    // var hydro = document.querySelector('#hydro').querySelector('.percentage');

    // var renew = document.querySelector('#renewables').querySelector('.percentage');
    // renew.innerHTML = Math.round((hydro.innerHTML) + (wind.innerHTML));
}
