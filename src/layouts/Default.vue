<template>
  <v-app id="inspire">
    <!--<v-navigation-drawer
            v-model="drawer"
            :clipped="$vuetify.breakpoint.lgAndUp"
            app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
                  v-if="item.heading"
                  :key="item.heading"
                  align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
                    cols="6"
                    class="text-center"
            >
              <a
                      href="#!"
                      class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
                  v-else-if="item.children"
                  :key="item.text"
                  v-model="item.model"
                  :prepend-icon="item.model ? item.icon : item['icon-alt']"
                  append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
                    v-for="(child, i) in item.children"
                    :key="i"
                    link
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
                  v-else
                  :key="item.text"
                  link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <g-link class="nav__link" to="/">Home</g-link>
      <br/>
      <g-link class="nav__link" to="/about/">About</g-link>
      <br/>
      <g-link class="nav__link" to="/blog/how-to-check-if-a-variable-is-a-number/">Blog</g-link>
      <br/>

    </v-navigation-drawer>-->

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app dark dense class="gb-toolbar">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Home</span>
      </v-toolbar-title>
      <v-spacer />

      <!--<v-text-field v-model="searchQuery" flat solo-inverted hide-details dense color="primary" append-icon="mdi-magnify" clearable label="Search" class="hidden-sm-and-down" v-on:click:append="doSearch" />-->
      <v-menu
              :close-on-content-click="false"
              :nudge-width="200"
              offset-x
              v-model="showMenu"
      >

        <!--<template v-slot:activator="{on}">
          <v-text-field v-model="searchQuery" flat solo-inverted hide-details dense color="primary" append-icon="mdi-magnify" clearable label="Search" class="hidden-sm-and-down" v-on:click:append="doSearch" />
        </template>-->

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>John Leider</v-list-item-title>
                <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn
                        :class="'red--text'"
                        icon
                >
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            AAA
          </v-card-actions>
        </v-card>
      </v-menu>

      <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid pa-0>
        <slot />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    source: String
  },
  created() {
    // TODO Move to Vuex
    axios('/search.json')
      .then(response => {
        this.coursesIndex = response.data;
      })
      .catch(error => {
        this.coursesIndex = null;
        console.log(error);
      });
  },
  data: () => ({
    coursesIndex: null, // TODO Move to Vuex
    searchQuery: '',
    searchOptions: {
      shouldSort: true,
      includeMatches: true,
      threshold: 0.4,
      location: 0,
      distance: 500,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['title', 'headline', 'tags']
    },
    showMenu: false,
    dialog: false,
    drawer: null,
    items: [
      { icon: 'mdi-contacts', text: 'Contacts' },
      { icon: 'mdi-history', text: 'Frequently contacted' },
      { icon: 'mdi-content-copy', text: 'Duplicates' },
      {
        icon: 'mdi-chevron-up',
        'icon-alt': 'mdi-chevron-down',
        text: 'Labels',
        model: true,
        children: [{ icon: 'mdi-plus', text: 'Create label' }]
      },
      {
        icon: 'mdi-chevron-up',
        'icon-alt': 'mdi-chevron-down',
        text: 'More',
        model: false,
        children: [{ text: 'Import' }, { text: 'Export' }, { text: 'Print' }, { text: 'Undo changes' }, { text: 'Other contacts' }]
      },
      { icon: 'mdi-settings', text: 'Settings' },
      { icon: 'mdi-message', text: 'Send feedback' },
      { icon: 'mdi-help-circle', text: 'Help' },
      { icon: 'mdi-cellphone-link', text: 'App downloads' },
      { icon: 'mdi-keyboard', text: 'Go to the old version' }
    ]
  }),
  methods: {
    async doSearch() {
      console.log(`Let's try searching for: ${this.searchQuery}`);
      let searchResults = await this.$search(this.searchQuery, this.coursesIndex, this.searchOptions);
      console.log(`Got ${searchResults.length} results: ${JSON.stringify(searchResults)}`);
      this.showMenu = true;
    }
  }
};
</script>

<!--
<g-link class="nav__link" to="/">Home</g-link>
<br/>
<g-link class="nav__link" to="/about/">About</g-link>
<br/>
<g-link class="nav__link" to="/blog/how-to-check-if-a-variable-is-a-number/">Blog</g-link>
<br/>
-->
