<template>
  <Layout>
    <v-row no-gutters>
      <v-col cols="12">

      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-container>
          <div class="pa-1 mb-0">
             US Confirmed Cases. Total (Population 328.2 million)
            <bar-chart :filename="'us_trend.json'"> </bar-chart>
             California Confirmed Cases. Total (Population 39.5 million)
            <bar-chart :filename="'us_CA_trend.json'"> </bar-chart>
             US Daily New Confirmed Cases
            <bar-chart :filename="'us_new_cases_trend.json'"> </bar-chart>
             California Daily New Confirmed Cases
            <bar-chart :filename="'us_CA_new_cases_trend.json'"> </bar-chart>
             San Mateo California  Daily New Confirmed Cases (Population 0.727 million)
            <bar-chart :filename="'us_CA_San_Mateo_new_cases_trend.json'"> </bar-chart>
             Contra Costa California  Daily New Confirmed Cases (Population 1.154 million)
            <bar-chart :filename="'us_CA_Contra_Costa_new_cases_trend.json'"> </bar-chart>
             Nevada Daily New Confirmed Cases (Population 3.08 million)
            <bar-chart :filename="'us_NV_new_cases_trend.json'"> </bar-chart>
             Washoe Nevada Daily New Confirmed Cases (Population 0.471 million)
            <bar-chart :filename="'us_NV_Washoe_new_cases_trend.json'"> </bar-chart>
             US Unemployment Rate (from US Buareu of Labor Statistics)
             <bar-chart :filename="'unemployment_trend.json'"> </bar-chart>
            US Jobless Clims  (from US Department of Labor)
             <bar-chart :filename="'jobless_claims_trend.json'"> </bar-chart>

             Market Indexes vs US Confirmed Cases
             <market-trend-chart></market-trend-chart>
          </div>
          <br></br>
          <div>
            <h2>Comparison of California with others</h2>
            <table>
              <tr><th>Mame</th><th>Total cases</th><th>Per 100k</th><th>Total deaths</th><th>Per 100k</th></tr>
              <tr><td>New York</td><td>247,815</td><td>1263.2</td><td>18,298</td><td>93.3 </td></tr>
              <tr><td>New Jersey</td><td>85,301</td><td>960.4</td><td>4,362</td><td>49.1</td></tr>
              <tr><td>Massachusetts</td><td>38,077</td><td>557.5</td><td>1,706</td><td>25.0</td></tr>
              <tr><td>Pennsylvania</td><td>32,902</td><td>257.2</td><td>1,276</td><td>10.0</td></tr>
              <tr><td>California</td><td>31,527</td><td>80.5</td><td>1,177</td><td>3.0</td></tr>
              <tr><td>Michigan</td><td>31,424</td><td>315.6</td><td>2,391</td><td>24.0</td></tr>
              <tr><td>Illinois</td><td>30,357</td><td>236.8</td><td>1,290</td><td>10.1</td></tr>
              <tr><td>Florida</td><td>26,314</v><td>127.7</td><td>774</td><td>3.8</td></tr>
              <tr><td>Louisiana</td><td>23,928</td><td>513.1</td><td>1,296</td><td>27.8</td></tr>
              <tr><td>Texas</td><td>19,260</td><td>69.1</td><td>490</td><td>1.8</td></tr>
            </table>
          </div>
          <br> </br>
          <geo-map> </geo-map>
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

//import HeaderBanner from '~/components/HeaderBanner.vue';
import DarkBanner from '~/components/DarkBanner.vue';
import FooterBanner from '~/components/FooterBanner.vue';
import Dygraphs from '../components/Dygraphs.vue';
import GeoMap from '../components/geomap.vue';
import backendAPI from '../components/backendapi';
import BarChart from '../components/BarChart.vue';
import MarketTrendChart from '../components/MarketTrendChart.vue';

export default {
  metaInfo: {
    title: 'analytics'
  },
  components: {
    DarkBanner,
    FooterBanner,
    Dygraphs,
    BarChart,
    GeoMap,
    MarketTrendChart
  },
  props: {}
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
},
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
</style>