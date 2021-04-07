monthlyTotals = runData.
    map(function selectColumns (run) {
        return { mileage: parseFloat(run.distance), 
                 month:  new Date(run.start_time).getMonth()+1,
                 year: new Date(run.start_time).getYear(),
                 time: parseFloat(run.moving_time_raw)
               }
    })
    .map(function createSortAndDisplay (run) {
        return {mileage: run.mileage, 
                month: run.month,
                year: run.year,
                time: run.time,
                monthSort: ((run.year-120)*12 + run.month),
                monthDisplay: (1900 + run.year) + " - " + run.month
            }
    })
    .reduce(function sumMonths (accumulator, run) {
      if (!accumulator[run.monthDisplay]) {
        accumulator[run.monthDisplay] = { mileage: run.mileage, 
                                          month: run.month,
                                          year: run.year,
                                          time: run.time,
                                          monthSort: run.monthSort,
                                          monthDisplay: run.monthDisplay,
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
      return { mileage: month.mileage, 
                month: month.month,
                year: month.year,
                time: month.time,
                monthSort: month.monthSort,
                monthDisplay: month.monthDisplay,
                numRuns: month.numRuns,
                avgMile: month.time / month.mileage / 60
              }
    })
    .map(function getAvgMileString (month){

      avgMileMin = Math.floor(month.avgMile);
      avgMileSecRaw = month.avgMile - avgMileMin
      avgMileSecRaw = Math.round(avgMileSecRaw * 60 )
      avgMileSec = avgMileSecRaw == 0 ? "00" : 
                    avgMileSecRaw < 10 ? "0" + avgMileSecRaw : avgMileSecRaw

      return { mileage: month.mileage, 
        month: month.month,
        year: month.year,
        time: month.time,
        monthSort: month.monthSort,
        monthDisplay: month.monthDisplay,
        numRuns: month.numRuns,
        avgMile: month.avgMile,
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
      return { time: run.time, 
               timeMinsString: run.timeMinsString, 
               timeMinsFloat: run.timeMinsFloat ,
               mileage: parseFloat(run.mileage), 
               date: run.date, 
               average: run.timeMinsFloat / run.mileage,
               dayNum: Math.floor( (new Date(run.date) - start) / oneDay) 
       }
    })
    .map(function stringifyAverageAndCalcWeekNum(run) {
      return { time: run.time, 
               timeMinsString: run.timeMinsString, 
               timeMinsFloat: run.timeMinsFloat ,
               mileage: parseFloat(run.mileage), 
               date: run.date, 
               average: run.average,
               averageStr: `${Math.floor(run.average)}:${
                 Math.round(run.average % Math.floor(run.average) * 60)  < 10 ? 
                 "0" + Math.round(run.average % Math.floor(run.average) * 60) : 
                 Math.round(run.average % Math.floor(run.average) * 60) 
                 }`, 
               dayNum: run.dayNum, 
               weekNum: Math.floor((run.dayNum +2) / 7),
               weekPos: (run.dayNum+2) % 7
       }
    })

runLUT = runsTimeAndDistance.reduce(function createLUT(accumulator, run) {
  if (!accumulator[run.dayNum]) {
      accumulator[run.dayNum] = { time: run.time, 
                                  timeMinsString: run.timeMinsString, 
                                  timeMinsFloat: run.timeMinsFloat ,
                                  mileage: run.mileage, 
                                  date: run.date, 
                                  average: run.average,
                                  averageStr: run.averageStr, 
                                  dayNum: run.dayNum, 
                                  weekNum: run.weekNum,
                                  weekPos: run.weekPos
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

