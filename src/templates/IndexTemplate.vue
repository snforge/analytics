<template>
  <Layout>
    <v-row no-gutters>
      <v-col cols="12">
        <geo-map></geo-map>
      </v-col>
    </v-row>
// the dark banner is in the file dark_banner.vue
    <v-row no-gutters>
      <v-col>
        <v-container>
        </v-container>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-container>
          <div class="pa-1 mb-0" style="height: 600px;">
            <dygraphs :data="chartData" :options="chartOptions" :dark="false" style="height: 150px;"></dygraphs>
            <dygraphs :data="chartDataCA" :options="chartOptions" :dark="false" style="height: 150px;"></dygraphs>
            <dygraphs :data="chartDataNewCases" :options="chartOptions" :dark="false" style="height: 150px;"></dygraphs>
            <dygraphs :data="chartDataCANewCases" :options="chartOptions" :dark="false" style="height: 150px;"></dygraphs>
          </div>
        </v-container>
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
//import HeaderBanner from '~/components/HeaderBanner.vue';
import DarkBanner from '~/components/DarkBanner.vue';
import FooterBanner from '~/components/FooterBanner.vue';
import Dygraphs from '../components/Dygraphs.vue';
import GeoMap from '../components/geomap.vue';
import backendAPI from '../components/backendapi';

export default {
  metaInfo: {
    title: 'analytics'
  },
  components: {
    DarkBanner,
    FooterBanner,
    Dygraphs,
    GeoMap
  },
  props: {},
  data() {
    return {
      pageTitle: '',
      pageTotal: '',
      chartFileName: '',
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
      chartDataCA: [],
      chartDataNewCases: [],
      chartDataCANewCases: []
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
        let chartDataCA = [];
        if(Array.isArray(usCATrendResponse.data.data)){
          chartDataCA = usCATrendResponse.data.data.map( x => [new Date(x[0]),x[1]]);
        }
        this.chartDataCA = chartDataCA;
      }
      let usNewCasesTrendResponse = await backendAPI.getUSNewCasesTrendData('us_new_cases_trend.json');
      if(usNewCasesTrendResponse.success){
        let chartData = [];
        if(Array.isArray(usNewCasesTrendResponse.data.data)){
          chartData = usNewCasesTrendResponse.data.data.map( x => [new Date(x[0]),x[1]]);
        }
        this.chartDataNewCases = chartData;
      }
      let usCANewCasesTrendResponse = await backendAPI.getUSCANewCasesTrendData('us_CA_new_cases_trend.json');
      if(usCANewCasesTrendResponse.success){
        let chartData = [];
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
  }
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>