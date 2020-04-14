const dp = require('./dataprocessor');

test('tests that some data is returned', () => {
  expect(dp.loadUnemploymentTrend()).toBeDefined();
});

test('tests getLasDayColumn on the correct data', () => {
    expect(dp.getLasDayColumn([{"date":'4/1/65'}])).toBe('4/1/20');
});