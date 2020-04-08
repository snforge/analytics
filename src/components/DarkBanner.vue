<template>
  <v-row no-gutters dense>
    <v-col class="white--text" style="background-color: #191A1A;">
        <v-container pa-0 class="mt-8">
        <v-row class="mb-12" justify="center">
            <v-col class="text-center" dense>
                <slot></slot>
            </v-col>
          </v-row>
        </v-container>
    </v-col>
  </v-row>
</template>
