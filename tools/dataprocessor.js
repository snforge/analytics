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
const chartDataUSCASamMateoTrendNewCases = path.join(staticPath, 'us_CA_San_Mateo_new_cases_trend.json')
const chartDataUSCAContraCostaTrendNewCases = path.join(staticPath, 'us_CA_Contra_Costa_new_cases_trend.json')
const chartDataUSNVTrendNewCases = path.join(staticPath, 'us_NV_new_cases_trend.json');
const chartDataUSNVWashoeTrendNewCases = path.join(staticPath, 'us_NV_Washoe_new_cases_trend.json')

/********************************************************************
 * DataProcessor
 * ******************************************************************/
class DataProcessor {

  data = [];
  todayColumn = '';
  dataColums;
  summSpec;
  rollupTrend;

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

 /********************************************************************
 * loadCSVData
 * ******************************************************************/
loadCSVData(){
    // DataLib allows to load CSV and then do group by / calculations on the data
    // See documentation on DataLib: https://github.com/vega/datalib/wiki/API-Reference
    this.data = dl.csv(ccseTimeSeriesConfirmedUS);
    logger.info(`Loaded ${this.data.length} entries from ${ccseTimeSeriesConfirmedUS}`);
    this.todayColumn = this.getLasDayColumn(this.data); //  '4/6/20'; //moment().format('M/D/YY');
    logger.info(`Last available day:  ${this.todayColumn}`); 

     // Now we need to calculate totals in each Date column in csv to see the trend
    this.dateColumns = Object.keys(this.data[0]).slice(11);
    this.summSpec = this.dateColumns.map(x => {
       return { name: x, ops: ['sum'] };
     });
  }

/********************************************************************
* writeJson
* ******************************************************************/
writeJson(chartFileName, barLabels)
{
  let nameTodayColumn = `sum_${this.todayColumn}`;
  this.currentTotal = this.rollupTrend[0][nameTodayColumn];
  logger.info(`currentTotal:  ${this.currentTotal}`);

  let jsonTrendData = [];
  jsonTrendData = this.dateColumns.map(x => {
    let currDate = moment.utc(x, 'M/D/YY').valueOf();
    let rollupColumnName = `sum_${x}`;
    let value = this.rollupTrend[0][rollupColumnName] || 0;
    return [currDate, value];
  });

  let jsonChartData = {
    total: this.currentTotal,
    at: this.todayColumn,
    labels: barLabels,
    data: jsonTrendData
  };

  fs.writeJsonSync(chartFileName, jsonChartData);
  console.log(`Saved ${chartDataUSTrend}`);
}

/********************************************************************
* loadTimeSeries
* ******************************************************************/
  loadTimeSeries() {

    this.loadCSVData();

    this.rollupTrend = dl
      .groupby('Country_Region')
      .summarize(this.summSpec)
      .execute(this.data);
 
    this.writeJson(chartDataUSTrend, ['Date', 'Total in US']);
 }

/********************************************************************
* loadTimeSeriesCA
* ******************************************************************/
  loadTimeSeriesCA() {
   
    this.loadCSVData();

    this.rollupTrend = dl
      .groupby('Province_State')
      .summarize(this.summSpec)
      .execute(this.data)
      .filter(d => d['Province_State'] === 'California');

    this.writeJson(chartDataUSCATrend, ['Date', 'Total in California']);
  }

/********************************************************************
* loadTimeSeriesNewCases
* ******************************************************************/
  loadTimeSeriesNewCases() {

    this.loadCSVData();
     
    let dataNewCases = this.data;
    let dataColumns = Object.keys(dataNewCases[0]).slice(11);
    for ( let i = 1; i < dataNewCases.length; i++ )
    { 
      // logger.info(`NEW CASES :  ${dataNewCases[0].length}`);
      for ( let j = dataColumns.length - 1; j > 0; j-- )
      {
        dataNewCases[i][dataColumns[j]] = dataNewCases[i][dataColumns[j]] - dataNewCases[i][dataColumns[j-1]];
      } 
    }

    this.rollupTrend = dl
      .groupby('Country_Region')
      .summarize(this.summSpec)
      .execute(dataNewCases);

   this.writeJson(chartDataUSTrendNewCases, ['Date', 'Daily New Cases in US']);
  }

/********************************************************************
* loadTimeSeriesNewCases
* ******************************************************************/
  loadTimeSeriesCANewCases() {

    this.loadCSVData();

    let dataNewCases = this.data;
    let dataColumns = Object.keys(dataNewCases[0]).slice(11);
    for ( let i = 1; i < dataNewCases.length; i++ )
    {
      for ( let j = dataColumns.length - 1; j > 0; j-- )
      {
        dataNewCases[i][dataColumns[j]] = dataNewCases[i][dataColumns[j]] - dataNewCases[i][dataColumns[j-1]];
      } 
    }

    this.rollupTrend = dl
      .groupby('Province_State')
      .summarize(this.summSpec)
      .execute(dataNewCases)
      .filter(d => d['Province_State'] === 'California');

    this.writeJson(chartDataUSCATrendNewCases, ['Date', 'Daily New Cases in CA']);
  }

/********************************************************************
* loadTimeSerioesCASanMateoNewCases
* ******************************************************************/  
  loadTimeSerioesCASanMateoNewCases() {

    this.loadCSVData();

    let dataNewCases = this.data;
    let dataColumns = Object.keys(dataNewCases[0]).slice(11);
    for ( let i = 1; i < dataNewCases.length; i++ )
    {
      for ( let j = dataColumns.length - 1; j > 0; j-- )
      {
        dataNewCases[i][dataColumns[j]] = dataNewCases[i][dataColumns[j]] - dataNewCases[i][dataColumns[j-1]];
      } 
    }

    this.rollupTrend = dl
      .groupby('Admin2')
      .summarize(this.summSpec)
      .execute(dataNewCases)
      .filter(function(d) {return d['Admin2'] == 'San Mateo'});

   this.writeJson(chartDataUSCASamMateoTrendNewCases, ['Date', 'Daily New Cases in San Mateo']); 
  }

/********************************************************************
* loadTimeSerioesCAContraCostaNewCases
* ******************************************************************/ 
  loadTimeSerioesCAContraCostaNewCases() {

    this.loadCSVData();

    let dataNewCases = this.data;
    let dataColumns = Object.keys(dataNewCases[0]).slice(11);
    for ( let i = 1; i < dataNewCases.length; i++ )
    {
      for ( let j = dataColumns.length - 1; j > 0; j-- )
      {
        dataNewCases[i][dataColumns[j]] = dataNewCases[i][dataColumns[j]] - dataNewCases[i][dataColumns[j-1]];
      } 
    }
   
    this.rollupTrend = dl
      .groupby('Admin2')
      .summarize(this.summSpec)
      .execute(this.data)
      .filter(function(d) {return d['Admin2'] == 'Contra Costa'});

    this.writeJson(chartDataUSCAContraCostaTrendNewCases,['Date', 'Daily New Cases in Contra Costa']);
  }

/********************************************************************
* loadTimeSeriesNVNewCases
* ******************************************************************/   
  loadTimeSeriesNVNewCases() {

    this.loadCSVData();

    let dataNewCases = this.data;
    let dataColumns = Object.keys(dataNewCases[0]).slice(11);
    for ( let i = 1; i < dataNewCases.length; i++ )
    {
      for ( let j = dataColumns.length - 1; j > 0; j-- )
      {
        dataNewCases[i][dataColumns[j]] = dataNewCases[i][dataColumns[j]] - dataNewCases[i][dataColumns[j-1]];
      } 
    }

    this.rollupTrend = dl
      .groupby('Province_State')
      .summarize(this.summSpec)
      .execute(dataNewCases)
      .filter(d => d['Province_State'] === 'Nevada');

    this.writeJson(chartDataUSNVTrendNewCases, ['Date', 'Daily New Cases in NV']);
  }

/********************************************************************
* loadTimeSerioesNVWashoeNewCases
* ******************************************************************/ 
  loadTimeSerioesNVWashoeNewCases() {

    this.loadCSVData();

    let dataNewCases = this.data;
    let dataColumns = Object.keys(dataNewCases[0]).slice(11);
    for ( let i = 1; i < dataNewCases.length; i++ )
    {
      for ( let j = dataColumns.length - 1; j > 0; j-- )
      {
        dataNewCases[i][dataColumns[j]] = dataNewCases[i][dataColumns[j]] - dataNewCases[i][dataColumns[j-1]];
      } 
    }
   
    this.rollupTrend = dl
      .groupby('Admin2')
      .summarize(this.summSpec)
      .execute(this.data)
      .filter(function(d) {return d['Admin2'] == 'Washoe'});

    this.writeJson(chartDataUSNVWashoeTrendNewCases,['Date', 'Daily New Cases in Washoe']);
  }

/********************************************************************
* processGeo
* ******************************************************************/ 
  processGeo() {

    this.loadCSVData();
    
    let jsonGeoData = [];

    for (let i = 0; i < this.data.length; i++) {
      let entry = this.data[i];
      let lat = pathOr(null, ['Lat'], entry);
      let lng = pathOr(null, ['Long_'], entry);
      let val = pathOr(0, [this.todayColumn], entry);
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
