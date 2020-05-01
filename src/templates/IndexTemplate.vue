<template>
  <Layout>
      <v-row no-gutters>
      <v-col>
        <v-container>
          <h1> Analytics Platform </h1>
          <p> Analytics about the most importnat world events at your fingerprints</p>          
        </v-container>
      </v-col>
      </v-row>

      <v-row no-gutters>
      <v-col>
        <v-container>
        <h2> COVID-19 Analytics </h2>
        </v-container>
        <v-container>
          <g-link class="nav__link" to="/covid-19-analytics">Selected COVID-19 Analytics</g-link>
        </v-container>
      </v-col>
      </v-row>

      <v-row no-gutters>
      <v-container>
        <h2> Solar Energy </h2>
        </v-container>         
      <v-col>
        <v-container>
          <g-link class="nav__link" to="https://www.timeanddate.com/sun/usa/san-francisco?month=6">Daylight duration</g-link>
          <g-link class="nav__link" to="https://www.google.com/get/sunroof">Google sunroof</g-link>
        </v-container>
      </v-col>
    </v-row>
  </Layout>
</template>

<script>
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