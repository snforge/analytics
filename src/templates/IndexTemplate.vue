<template>
  <Layout>
    <v-row no-gutters>
      <v-col cols="12">

      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-container>
          <div class="pa-1 mb-0" style="height: 900px;">
            <bar-chart :filename="'us_trend.json'"> </bar-chart>
            <bar-chart :filename="'us_CA_trend.json'"> </bar-chart>
            <bar-chart :filename="'us_new_cases_trend.json'"> </bar-chart>
            <bar-chart :filename="'us_CA_new_cases_trend.json'"> </bar-chart>
          </div>
        </v-container>
      </v-col>
    </v-row>
      <v-row no-gutters>
          <v-col>
              <dark-banner>
                  <v-col class="text-center" dense>
                      <p class="display-2 mb-0">{{pageTitle}}</p>
                      <p class="display-4 mb-0 font-weight-bold red--text text--darken-1">{{pageTotal}}</p>
                  </v-col>
              </dark-banner>
          </v-col>
      </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <footer-banner/>
      </v-col>
    </v-row>
  </Layout>
</template>

<script>
/*
            <dygraphs :data="chartData" :options="chartOptions" :dark="false" style="height: 150px;"></dygraphs>
            <dygraphs :data="chartDataCA" :options="chartOptions" :dark="false" style="height: 150px;"></dygraphs>
            <dygraphs :data="chartDataNewCases" :options="chartOptions" :dark="false" style="height: 150px;"></dygraphs>
            <dygraphs :data="chartDataCANewCases" :options="chartOptions" :dark="false" style="height: 150px;"></dygraphs>
*/

//import HeaderBanner from '~/components/HeaderBanner.vue';
import DarkBanner from '~/components/DarkBanner.vue';
import FooterBanner from '~/components/FooterBanner.vue';
import Dygraphs from '../components/Dygraphs.vue';
import GeoMap from '../components/geomap.vue';
import backendAPI from '../components/backendapi';
import BarChart from '../components/BarChart.vue';

export default {
  metaInfo: {
    title: 'analytics'
  },
  components: {
    DarkBanner,
    FooterBanner,
    Dygraphs,
    BarChart,
    GeoMap
  },
  props: {},
  /* 
  data() {
    return {
      pageTitle: '',
      pageTotal: '',
      chartOptions: {
        legend: 'follow',
        connectSeparatedPoints: false,
        stackedGraph: false,
        fillGraph: false,
        strokeWidth: 2,
        yLabelWidth: 0,
        colors: ['#B71C1C'],
        labels: [],
        highlightSeriesOpts: {
          strokeWidth: 3,
          strokeBorderWidth: 0,
          highlightCircleSize: 5
        }
      },
      chartData: [],
      chartOptionsUS: [],
      chartDataCA: [],
      chartOptionsCA: [],
      chartDataNewCases: [],
      chartOptionsNewCases: [],
      chartDataCANewCases: [],
      chartOptionsCANewCases: []
    };
  }, 
  mounted: function() {
    this.getData();
  },
  methods: {
    async getData() {
      let usTrendResponse = await backendAPI.getUSTrendData('us_trend.json');
      if(usTrendResponse.success){
        this.pageTitle = `US Confirmed Cases @${usTrendResponse.data.at}`;
        this.pageTotal = `${usTrendResponse.data.total}`;
        this.chartOptions.labels = usTrendResponse.data.labels;
        let chartData = [];
        // Convert X to Date
        if(Array.isArray(usTrendResponse.data.data)){
          chartData = usTrendResponse.data.data.map( x => [new Date(x[0]),x[1]]);
        }
        this.chartData = chartData;
      }
      let usCATrendResponse = await backendAPI.getUSCATrendData('us_CA_trend.json');
      if(usCATrendResponse.success){
        // this.chartOptionsCA = this.chartOptiopns;
        this.chartOptionsCA.labels = usCATrendResponse.data.labels;
        let chartDataCA = [];
        if(Array.isArray(usCATrendResponse.data.data)){
          chartDataCA = usCATrendResponse.data.data.map( x => [new Date(x[0]),x[1]]);
        }
        this.chartDataCA = chartDataCA;
      }
      let usNewCasesTrendResponse = await backendAPI.getUSNewCasesTrendData('us_new_cases_trend.json');
      if(usNewCasesTrendResponse.success){
        let chartData = [];
        // this.chartOptionsUSNewCases = this.chartOptiopns;
        // this.chartOptionsUSNewCases.labels = usNewCasesTrendResponse.data.labels;
        if(Array.isArray(usNewCasesTrendResponse.data.data)){
          chartData = usNewCasesTrendResponse.data.data.map( x => [new Date(x[0]),x[1]]);
        }
        this.chartDataNewCases = chartData;
      }
      let usCANewCasesTrendResponse = await backendAPI.getUSCANewCasesTrendData('us_CA_new_cases_trend.json');
      if(usCANewCasesTrendResponse.success){
        let chartData = [];
        // this.chartOptionsCANewCases = this.chartOptiopns;
        // this.chartOptionsCANewCases.labels = usCANewCasesTrendResponse.data.labels;
        if(Array.isArray(usCANewCasesTrendResponse.data.data)){
          chartData = usCANewCasesTrendResponse.data.data.map( x => [new Date(x[0]),x[1]]);
        }
        this.chartDataCANewCases = chartData;
      }
      console.log('Got response!');
    },
    generateData() {
      let dthData = [];
      let sTS = Date.now() - 100 * 3600 * 1000;

      for (let i = 0; i < 100; i++) {
        let cTs = sTS + i * 3600 * 1000;
        let d = new Date(cTs);
        let r = Math.random();
        dthData.push([d, r, r + 0.5]);
      }

      return {
        dthData: dthData
      };
    }
  } */
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>