/*
 * Data processing
 */

const dl = require('datalib');
const fs = require('fs-extra');
const path = require('path');
const { getLogger } = require('./logger');
const moment = require('moment');
const logger = getLogger('DATAPROCESSOR');
const { pathOr } = require('ramda');
const dataPath = path.join(__dirname, '..', 'data');
const ccseTimeSeriesConfirmedUS = path.join(dataPath, 'csse_covid_19_time_series', 'time_series_covid19_confirmed_US.csv');
const ccseTimeSeriesConfirmedUSCA = path.join(dataPath, 'csse_covid_19_time_series', 'time_series_covid19_confirmed_US_CA test.csv');

const staticPath = path.join(__dirname, '..', 'static');
const chartDataUSTrend = path.join(staticPath, 'us_trend.json');
const chartDataUSCATrend = path.join(staticPath, 'us_CA_trend.json');
const chartDataUSTrendNewCases = path.join(staticPath, 'us_new_cases_trend.json');
const chartDataUSCATrendNewCases = path.join(staticPath, 'us_CA_new_cases_trend.json');
const chartDataUSGeo = path.join(staticPath, 'us_geo.json');
const chartDataUSCASamMateoTrend = path.join(staticPath, 'us_CA_San_Mateo_new_cases_trend.json')

const Country_Region_Field_Name = 'County_Region';
const Province_State_Field_Name = 'County_Region'; // 'County_Region'; // 'Province_State';

class DataProcessor {
  constructor() {
    // TODO
  }

  // Detect last available day in the data
  getLasDayColumn(data) {
    let diff = 0;
    for (let i = 0; i < 5; i++) {
      let todayColumn = moment
        .utc()
        .subtract(diff++, 'day')
        .format('M/D/YY');
      if (todayColumn in data[0]) {
        logger.info(`Last day is ${todayColumn}`);
        return todayColumn;
      }
    }
    return '4/1/20';
  }

  loadTimeSeries() {
    // DataLib allows to load CSV and then do group by / calculations on the data
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    let data = dl.csv(ccseTimeSeriesConfirmedUS);

    logger.info(`Loaded ${data.length} entries from ${ccseTimeSeriesConfirmedUS}`);
    let todayColumn = this.getLasDayColumn(data); //  '4/6/20'; //moment().format('M/D/YY');
    logger.info(`Last available day:  ${todayColumn}`);
    //console.log(dl.format.summary(data));

    // Get US data
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    // This sums up total in today's column in CSV
    let rollup = dl
      .groupby('Country_Region')
      .summarize([{ name: todayColumn, ops: ['sum'] }])
      .execute(data);
    let currentTotal = pathOr(0, [0, `sum_${todayColumn}`], rollup);

    // Now we need to calculate totals in each Date column in csv to see the trend
    let dateColumns = Object.keys(data[0]).slice(11);
    let summSpec = dateColumns.map(x => {
      return { name: x, ops: ['sum'] };
    });

    let rollupTrend = dl
      .groupby('Country_Region')
      .summarize(summSpec)
      .execute(data);

    let jsonTrendData = [];
    jsonTrendData = dateColumns.map(x => {
      let currDate = moment.utc(x, 'M/D/YY').valueOf();
      let rollupColumnName = `sum_${x}`;
      let value = rollupTrend[0][rollupColumnName] || 0;
      return [currDate, value];
    });

    // Group by State, County; filter specific state
    let rollupSC = dl
      .groupby(['Province_State', 'Admin2'])
      .summarize([{ name: todayColumn, ops: ['sum'] }])
      .execute(data)
      .filter(d => d['Province_State'] === 'California');

    // TODO Write to JSON
    let jsonChartData = {
      total: currentTotal,
      at: todayColumn,
      labels: ['Date', 'Confirmed'],
      data: jsonTrendData
    };

    fs.writeJsonSync(chartDataUSTrend, jsonChartData);
    console.log(`Saved ${chartDataUSTrend}`);
  }

  loadTimeSeriesCA() {
    // DataLib allows to load CSV and then do group by / calculations on the data
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    let data = dl.csv(ccseTimeSeriesConfirmedUS);

    logger.info(`Loaded ${data.length} entries from ${ccseTimeSeriesConfirmedUS}`);
    let todayColumn = this.getLasDayColumn(data); //  '4/6/20'; //moment().format('M/D/YY');
    logger.info(`Last available day:  ${todayColumn}`);
    
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    // This sums up total in today's column in CSV
    let rollup = dl
      .groupby('Province_State')
      .summarize([{ name: todayColumn, ops: ['sum'] }])
      .execute(data)
      .filter(d => d['Province_State'] === 'California');
    let currentTotal = pathOr(0, [0, `sum_${todayColumn}`], rollup);
    logger.info(`CA currentTotal = ${currentTotal}`);

    // Now we need to calculate totals in each Date column in csv to see the trend
    let dateColumns = Object.keys(data[0]).slice(11);
    let summSpec = dateColumns.map(x => {
      return { name: x, ops: ['sum'] };
    });

    let rollupTrend = dl
      .groupby('Province_State')
      .summarize(summSpec)
      .execute(data)
      .filter(d => d['Province_State'] === 'California');

    let jsonTrendData = [];
    jsonTrendData = dateColumns.map(x => {
      let currDate = moment.utc(x, 'M/D/YY').valueOf();
      let rollupColumnName = `sum_${x}`;
      let value = rollupTrend[0][rollupColumnName] || 0;
      return [currDate, value];
    });
    logger.info(`CA rollupTrend.length = ${rollupTrend.length}`);
    logger.info(`CA rollupTrend[0] = ${rollupTrend[0]}`);

    // TODO Write to JSON
    let jsonChartData = {
      total: currentTotal,
      at: todayColumn,
      labels: ['Date', 'Confirmed'],
      data: jsonTrendData
    };

    fs.writeJsonSync(chartDataUSCATrend, jsonChartData);
    logger.info(`CA Saved ${chartDataUSTrend}`);
  }

  loadTimeSeriesNewCases() {
    // DataLib allows to load CSV and then do group by / calculations on the data
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    let data = dl.csv(ccseTimeSeriesConfirmedUS);

    logger.info(`Loaded ${data.length} entries from ${ccseTimeSeriesConfirmedUS}`);
    let todayColumn = this.getLasDayColumn(data); //  '4/6/20'; //moment().format('M/D/YY');
    logger.info(`Last available day:  ${todayColumn}`);
    //console.log(dl.format.summary(data));

    // Get US data
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    // This sums up total in today's column in CSV
    let rollup = dl
      .groupby('Country_Region')
      .summarize([{ name: todayColumn, ops: ['sum'] }])
      .execute(data);
    let currentTotal = pathOr(0, [0, `sum_${todayColumn}`], rollup);

    let dataNewCases = data;
    let dataColumns = Object.keys(data[0]).slice(11);
    for ( let i = 1; i < dataNewCases.length; i++ )
    {
      // logger.info(`NEW CASES :  ${dataNewCases[0].length}`);
      for ( let j = dataColumns.length - 1; j > 0; j-- )
      {
        // logger.info(`dataColumns[j]:  ${dataColumns[j]}`); 
        // logger.info(`dataNewCases[i][dataColumns[j]]):  ${dataNewCases[i][dataColumns[j]]}`);
        dataNewCases[i][dataColumns[j]] = dataNewCases[i][dataColumns[j]] - dataNewCases[i][dataColumns[j-1]];
        // logger.info(`dataNewCases[i,dataColumns[j]]:  ${dataNewCases[i][dataColumns[j]}`);
        // logger.info(`dataNewCases[i,dataColumns[j-1]]:  ${dataNewCases[i][dataColumns[j-1]]}`); 
      } 
    }

    data = dataNewCases;
   
    // Now we need to calculate totals in each Date column in csv to see the trend
    let dateColumns = Object.keys(data[0]).slice(11);
      let summSpec = dateColumns.map(x => {
      return { name: x, ops: ['sum'] };
    });

    let rollupTrend = dl
      .groupby('Country_Region')
      .summarize(summSpec)
      .execute(data);

    let jsonTrendData = [];
    jsonTrendData = dateColumns.map(x => {
      let currDate = moment.utc(x, 'M/D/YY').valueOf();
      let rollupColumnName = `sum_${x}`;
      let value = rollupTrend[0][rollupColumnName] || 0;
      return [currDate, value];
    });

    // TODO Write to JSON
    let jsonChartData = {
      total: currentTotal,
      at: todayColumn,
      labels: ['Date', 'Confirmed'],
      data: jsonTrendData
    };

    fs.writeJsonSync(chartDataUSTrendNewCases, jsonChartData);
    console.log(`Saved ${chartDataUSTrendNewCases}`);
  }

  loadTimeSeriesCANewCases() {
    // DataLib allows to load CSV and then do group by / calculations on the data
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    let data = dl.csv(ccseTimeSeriesConfirmedUS);

    logger.info(`Loaded ${data.length} entries from ${ccseTimeSeriesConfirmedUS}`);
    let todayColumn = this.getLasDayColumn(data); //  '4/6/20'; //moment().format('M/D/YY');
    logger.info(`Last available day:  ${todayColumn}`);
    //console.log(dl.format.summary(data));

    // Get US data
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    // This sums up total in today's column in CSV
    let rollup = dl
      .groupby('Province_State')
      .summarize([{ name: todayColumn, ops: ['sum'] }])
      .execute(data)
      .filter(d => d['Province_State'] === 'California');
    let currentTotal = pathOr(0, [0, `sum_${todayColumn}`], rollup);

    let dataNewCases = data;
    let dataColumns = Object.keys(data[0]).slice(11);
    for ( let i = 1; i < dataNewCases.length; i++ )
    {
      for ( let j = dataColumns.length - 1; j > 0; j-- )
      {
        dataNewCases[i][dataColumns[j]] = dataNewCases[i][dataColumns[j]] - dataNewCases[i][dataColumns[j-1]];
      } 
    }

    data = dataNewCases;
   
    // Now we need to calculate totals in each Date column in csv to see the trend
    let dateColumns = Object.keys(data[0]).slice(11);
      let summSpec = dateColumns.map(x => {
      return { name: x, ops: ['sum'] };
    });

    let rollupTrend = dl
      .groupby('Province_State')
      .summarize(summSpec)
      .execute(data)
      .filter(d => d['Province_State'] === 'California');

    let jsonTrendData = [];
    jsonTrendData = dateColumns.map(x => {
      let currDate = moment.utc(x, 'M/D/YY').valueOf();
      let rollupColumnName = `sum_${x}`;
      let value = rollupTrend[0][rollupColumnName] || 0;
      return [currDate, value];
    });

    // TODO Write to JSON
    let jsonChartData = {
      total: currentTotal,
      at: todayColumn,
      labels: ['Date', 'Daily New Cases'],
      data: jsonTrendData
    };

    fs.writeJsonSync(chartDataUSCATrendNewCases, jsonChartData);
    console.log(`Saved ${chartDataUSCATrendNewCases}`);
  }

  loadTimeSerioesCASanMateoNewCases() {
    // DataLib allows to load CSV and then do group by / calculations on the data
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    let data = dl.csv(ccseTimeSeriesConfirmedUS);

    logger.info(`Loaded ${data.length} entries from ${ccseTimeSeriesConfirmedUS}`);
    let todayColumn = this.getLasDayColumn(data); //  '4/6/20'; //moment().format('M/D/YY');
    logger.info(`Last available day:  ${todayColumn}`);
    //console.log(dl.format.summary(data));

    // Get US data
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    // This sums up total in today's column in CSV
    let rollup = dl
      .groupby('Province_State')
      .summarize([{ name: todayColumn, ops: ['sum'] }])
      .execute(data)
      .filter(d => d['Province_State'] === 'California');
    let currentTotal = pathOr(0, [0, `sum_${todayColumn}`], rollup);

    let dataNewCases = data;
    let dataColumns = Object.keys(data[0]).slice(11);
    for ( let i = 1; i < dataNewCases.length; i++ )
    {
      for ( let j = dataColumns.length - 1; j > 0; j-- )
      {
        dataNewCases[i][dataColumns[j]] = dataNewCases[i][dataColumns[j]] - dataNewCases[i][dataColumns[j-1]];
      } 
    }

    data = dataNewCases;
   
    // Now we need to calculate totals in each Date column in csv to see the trend
    let dateColumns = Object.keys(data[0]).slice(11);
      let summSpec = dateColumns.map(x => {
      return { name: x, ops: ['sum'] };
    });

    let rollupTrend = dl
      .groupby('Province_State')
      .summarize(summSpec)
      .execute(data)
      .filter(d => d['Province_State'] === 'California');

    let jsonTrendData = [];
    jsonTrendData = dateColumns.map(x => {
      let currDate = moment.utc(x, 'M/D/YY').valueOf();
      let rollupColumnName = `sum_${x}`;
      let value = rollupTrend[0][rollupColumnName] || 0;
      return [currDate, value];
    });

    // TODO Write to JSON
    let jsonChartData = {
      total: currentTotal,
      at: todayColumn,
      labels: ['Date', 'Daily New Cases'],
      data: jsonTrendData
    };

    fs.writeJsonSync(chartDataUSCASanMateoTrendNewCases, jsonChartData);
    console.log(`Saved ${chartDataUSCASanMateoTrendNewCases}`);
  }

  processGeo() {
    // DataLib allows to load CSV and then do group by / calculations on the data
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    let data = dl.csv(ccseTimeSeriesConfirmedUS);
    let todayColumn = this.getLasDayColumn(data); //  '4/6/20'; //moment().format('M/D/YY');
    logger.info(`Last available day:  ${todayColumn}`);
    let jsonGeoData = [];

    for (let i = 0; i < data.length; i++) {
      let entry = data[i];
      let lat = pathOr(null, ['Lat'], entry);
      let lng = pathOr(null, ['Long_'], entry);
      let val = pathOr(0, [todayColumn], entry);
      if (lat && lng && val) {
        jsonGeoData.push({
          lat: lat,
          lng: lng,
          val: val
        });
      }
    }

    fs.writeJsonSync(chartDataUSGeo, jsonGeoData);
    console.log(`Saved ${chartDataUSGeo}`);
  }
}

let dataProcessor = new DataProcessor();
module.exports = dataProcessor;
