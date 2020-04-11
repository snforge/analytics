<template>
  <div class="BarChart">
    <dygraphs :data="localChartData" :options="localChartOptions" style="height: 150px;"></dygraphs>
  </div>
</template>

<script>

import backendAPI from '../components/backendapi';
import Dygraphs from '../components/Dygraphs.vue';

export default {
  name: 'BarChart',
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
        connectSeparatedPoints: false,
        stackedGraph: false,
        fillGraph: false,
        strokeWidth: 2,
        yLabelWidth: 0,
        colors: ['#B71C1C'],
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
    this.getData();
  },
  methods: {
     async getData() {
      console.log('Got response!');
      let response = await backendAPI.getUSTrendData(this.filename);
      if(response.success){
        this.localChartOptions.labels = response.data.labels;
        let chartData = [];
        // Convert X to Date
        if(Array.isArray(response.data.data)){
          chartData = response.data.data.map( x => [new Date(x[0]),x[1]]);
        }
        this.localChartData = chartData;
      }
      console.log('Got response!');
    }
  }
}
</script>

<style>
.BarChart {
  padding: 20px;
  background: #FFF;
}
</style>