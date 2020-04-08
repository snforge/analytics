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
const ccseTimeSeriesConfirmedUSCA = path.join(dataPath, 'csse_covid_19_time_series', 'time_series_covid19_confirmed_US_CA.csv');

const staticPath = path.join(__dirname, '..', 'static');
const chartDataUSTrend = path.join(staticPath, 'us_trend.json');
const chartDataUSCATrend = path.join(staticPath, 'us_CA_trend.json');
const chartDataUSGeo = path.join(staticPath, 'us_geo.json');
const Country_Region_Field_Name = 'Province_State';
const Province_State_Field_Name = 'County_Region'; // Province_State

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
    let data = dl.csv(ccseTimeSeriesConfirmedUSCA);

    logger.info(`Loaded ${data.length} entries from ${ccseTimeSeriesConfirmedUSCA}`);
    let todayColumn = moment().format('M/D/YY');
    logger.info(`Today is ${todayColumn}`);
    //console.log(dl.format.summary(data));

    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    // This sums up total in today's column in CSV
    let rollup = dl
      .groupby(Province_State_Field_Name)
      .summarize([{ name: todayColumn, get: 'California', ops: ['sum'] }])
      .execute(data);
    let currentTotal = pathOr(0, [0, `sum_${todayColumn}`], rollup);

    // Now we need to calculate totals in each Date column in csv to see the trend
    let dateColumns = Object.keys(data[0]).slice(11);
    let summSpec = dateColumns.map(x => {
      return { name: x, ops: ['sum'] };
    });

    let rollupTrend = dl
      .groupby(Province_State_Field_Name)
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

    fs.writeJsonSync(chartDataUSCATrend, jsonChartData);
    console.log(`Saved ${chartDataUSTrend}`);
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
