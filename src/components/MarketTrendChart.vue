<template>
  <div class="BarChart">
    <dygraphs ref="chart" :data="localChartData" :options="localChartOptions" :bar-opacity="0.4" style="height: 350px;"></dygraphs>
  </div>
</template>

<script>
import Dygraphs from '../components/Dygraphs.vue';
import usTrendData from '../../static/us_trend.json';
import marketTrendData from '../../static/market_data.json';
import pathOr from 'ramda/src/pathOr';

export default {
  name: 'MarketTrendChart',
  components: {
    Dygraphs
  },
  props: {
    filename: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localChartOptions: {
        legend: 'follow',
        plotter: null,
        connectSeparatedPoints: true,
        stackedGraph: false,
        fillGraph: false,
        strokeWidth: 2,
        //ylabel: 'Market Value ($)',
        //y2label: 'Total cases',
        //colors: ['#B71C1C'],
        labels: [],
        rightGap: 5,
        strokeBorderWidth: 0,
        strokeBorderColor: 'black',
        highlightSeriesOpts: {
          strokeWidth: 3,
          strokeBorderWidth: 0,
          highlightCircleSize: 5
        }
      },
      localChartData: []
    };
  },
  mounted: function() {
    this.processData();
  },
  methods: {
    async processData() {
      this.localChartOptions.labels = ['Date','Total in US','Dow Jones Industrial Average','Nasdaq Composite','S&P 500'];
      let chartData = [];
      let dowValues = {};
      marketTrendData['dow'].map(v => { dowValues[v['Date']] = v['Close']});
      let nasdaqValues = {};
      marketTrendData['nasdaq'].map(v => { nasdaqValues[v['Date']] = v['Close']});
      let sandpValues = {};
      marketTrendData['sandp'].map(v => { sandpValues[v['Date']] = v['Close']});
      chartData = usTrendData.data.map(x => {
        let ts = x[0];
        let dowValue = pathOr(null,[ts],dowValues);
        let nasdaqValue = pathOr(null,[ts],nasdaqValues);
        let sandpValue = pathOr(null,[ts],sandpValues);
        return [new Date(x[0]), x[1], dowValue,nasdaqValue,sandpValue];
      });

      let barPlotter = this.$refs.chart.barChartPlotter;
      let allSeries = ['Total in US','Dow Jones Industrial Average','Nasdaq Composite'];
      let allSeriesSettings = {};
      allSeries.map(x => {
        let s = x === 'Total in US' ? { plotter: barPlotter, axis: 'y2' } : { strokeWidth: 2 };
        allSeriesSettings[x] = s;
      });
      this.localChartOptions.series = allSeriesSettings;

      let prevTs = usTrendData.data[usTrendData.data.length - 2][0];
      let lastTs = usTrendData.data[usTrendData.data.length - 1][0];
      let timeStep = (lastTs-prevTs);
      let newTs = lastTs+timeStep;
      chartData.push([new Date(newTs), null,pathOr(null,[newTs],dowValues),pathOr(null,[newTs],nasdaqValues),pathOr(null,[newTs],sandpValues)]);

      this.localChartData = chartData;


      /*
      let response = await backendAPI.getUSTrendData(this.filename);
      if (response.success) {
        this.localChartOptions.labels = response.data.labels;
        let chartData = [];
        // Convert X to Date
        if (Array.isArray(response.data.data)) {
          chartData = response.data.data.map(x => [new Date(x[0]), x[1]]);
          // Push one more time step (day or month) with empty value into data, so last bar is fully visible
          let prevTs = response.data.data[response.data.data.length - 2][0];
          let lastTs = response.data.data[response.data.data.length - 1][0];
          let timeStep = (lastTs-prevTs);
          chartData.push([new Date(lastTs+timeStep), null]);
        }
        this.localChartData = chartData;
      }*/
    }
  }
};
</script>

<style>
.BarChart {
  padding: 20px;
}
</style>
