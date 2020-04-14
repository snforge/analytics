const path = require('path');
const fs = require('fs-extra');
const { pathOr } = require('ramda');
XMLHttpRequest = undefined;
const dataprocessor = require('../tools/dataprocessor.js');

const dataPath = path.join(__dirname, '..', 'data');
const staticPath = path.join(__dirname, '..', 'static');

describe('Test group', function() {
  test('Sample test', async () => {
    dataprocessor.loadUnemploymentTrend();
    expect(fs.existsSync(path.join(staticPath, 'unemployment_trend.json'))).toBeTruthy();
  });
});