<template>
  <Layout>
    <v-row no-gutters>
      <v-col cols="12">

      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-container>
          <div class="pa-1 mb-0" style="height: 2000px;">
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
             US Unemployment Rate (from Buareu of Labor Statistics)
             <bar-chart :filename="'unemployment_trend.json'"> </bar-chart>
 
          </div>
          </div> <geo-map> </geo-map>
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
  props: {}
};
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>