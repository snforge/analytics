/*
 * Market Data processing
 */

const dl = require('datalib');
const fs = require('fs-extra');
const path = require('path');
const { getLogger } = require('./logger');
const moment = require('moment');
const logger = getLogger('FINANCE');
const { pathOr } = require('ramda');
const { RestOp } = require('../src/components/restop');

const dataPath = path.join(__dirname, '..', 'data');
const staticPath = path.join(__dirname, '..', 'static');

const YAHOO_BASE = 'https://finance.yahoo.com/quote/';
const YAHOO_QUERY = 'https://query1.finance.yahoo.com/v7/finance/download/';

class MarketData {
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

  async loadAllData() {
    // Dow Jones Industrial Average
    let dataDOW = await this.loadData('^DJI', 'market_data_dji.json');
    // S&P 500 Index
    let dataSANDP = await this.loadData('^GSPC', 'market_data_gspc.json');
    // Nasdaq Composite
    let dataNASDAQ = await this.loadData('^IXIC', 'market_data_ixic.json');

    let fname = path.join(staticPath, 'market_data.json');
    fs.writeJsonSync(fname, {
      dow: dataDOW,
      sandp: dataSANDP,
      nasdaq: dataNASDAQ
    });
  }

  async loadData(symbol, filename) {
    let tsToday = Math.floor(moment.utc().valueOf() / 1000);
    let tsStart = Math.floor(moment.utc('1/22/20', 'M/D/YY').valueOf() / 1000);
    //let url = `${YAHOO_BASE}${symbol}/history?period1=${tsStart}&period2=${tsToday}&interval=1d&filter=history&frequency=1d`;
    //'https://query1.finance.yahoo.com/v7/finance/download/%5EDJI?period1=1579651200&period2=1586809882&interval=1d&events=history'
    let url = `${YAHOO_QUERY}${symbol}?period1=${tsStart}&period2=${tsToday}&interval=1d&events=history`;
    // This should return csv
    let op = new RestOp({ method: 'get', url: url });
    let result = await op.execute();
    if (!result.success) {
      logger.error(`Failed to get market history data for ${symbol}, error: ${result.message}`);
      return;
    }
    let jsondata = dl.read(result.data, { type: 'csv', parse: 'auto' });
    let fname = path.join(dataPath, 'market', filename);
    fs.writeJsonSync(fname, jsondata);
    logger.info(`Saved data for ${symbol}, file ${fname}`);
    return jsondata;
  }
}

let marketData = new MarketData();
module.exports = marketData;
