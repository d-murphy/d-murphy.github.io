monthlyTotals = runData.
    map(function selectColumns (run) {
        return { mileage: parseFloat(run.distance), 
                 month:  new Date(run.start_time).getMonth()+1,
                 year: new Date(run.start_time).getYear(),
                 time: parseFloat(run.moving_time_raw)
               }
    })
    .map(function createSortAndDisplay (run) {
        return {...run,
                monthSort: ((run.year-120)*12 + run.month),
                monthDisplay: (1900 + run.year) + " - " + run.month
            }
    })
    .reduce(function sumMonths (accumulator, run) {
      if (!accumulator[run.monthDisplay]) {
        accumulator[run.monthDisplay] = { ...run,
                                          numRuns: 1
                                        };
      }
      accumulator[run.monthDisplay].mileage += run.mileage;
      accumulator[run.monthDisplay].numRuns += 1;
      accumulator[run.monthDisplay].time += run.time; 
      return accumulator;
    }, {})
monthlyTotals = Object.values(monthlyTotals);
monthlyTotals = monthlyTotals
    .map(function calcAverage (month) {
      return { ...month, 
                avgMile: month.time / month.mileage / 60
              }
    })
    .map(function getAvgMileString (month){
      avgMileMin = Math.floor(month.avgMile);
      avgMileSecRaw = month.avgMile - avgMileMin
      avgMileSecRaw = Math.round(avgMileSecRaw * 60 )
      avgMileSec = avgMileSecRaw == 0 ? "00" : 
                    avgMileSecRaw < 10 ? "0" + avgMileSecRaw : avgMileSecRaw
      return { 
        ...month,
        avgMileStr: `${avgMileMin}:${avgMileSec}`        
      }
    })

monthlyTotals = monthlyTotals.sort((a,b) => a.monthSort - b.monthSort);

var start = new Date(2020,5,30);
var oneDay = 1000 * 60 * 60 * 24;

runsTimeAndDistance = runData
    .map(function selectTimeAndDistance(run) {
      return { time: run.moving_time_raw, 
               timeMinsString: run.moving_time, 
               timeMinsFloat: run.moving_time_raw / 60,
               mileage: parseFloat(run.distance), 
               date: run.start_time
              }
    })
    .map(function calcAverageAndDayNum(run) {
      return { ...run, 
               average: run.timeMinsFloat / run.mileage,
               dayNum: Math.floor( (new Date(run.date) - start) / oneDay) 
       }
    })
    .map(function stringifyAverageAndCalcWeekNum(run) {
      return { ...run, 
               averageStr: `${Math.floor(run.average)}:${
                 Math.round(run.average % Math.floor(run.average) * 60)  < 10 ? 
                 "0" + Math.round(run.average % Math.floor(run.average) * 60) : 
                 Math.round(run.average % Math.floor(run.average) * 60) 
                 }`, 
               weekNum: Math.floor((run.dayNum +2) / 7),
               weekPos: (run.dayNum+2) % 7
       }
    })

runLUT = runsTimeAndDistance.reduce(function createLUT(accumulator, run) {
  if (!accumulator[run.dayNum]) {
      accumulator[run.dayNum] = { ...run
                                }
    }
  return accumulator
  }, {});

  timelinePlotData = Array(273);

  for (i=0; i<timelinePlotData.length; i++){
    if(typeof runLUT[i] == 'undefined'){

      timelinePlotData[i] = { mileage: 0, 
                              dayNum: i, 
                              weekNum: Math.floor((i+2) / 7),
                              weekPos: (i+2) % 7, 
                              date: "" }
    } else {
      timelinePlotData[i] = runLUT[i]
    }
  }

