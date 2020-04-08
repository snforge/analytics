import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Color from 'd3-color';

// eslint-disable-next-line
const grafanaColors = [
  '#7EB26D', // 0: pale green
  '#EAB839', // 1: mustard
  '#6ED0E0', // 2: light blue
  '#EF843C', // 3: orange
  '#E24D42', // 4: red
  '#1F78C1', // 5: ocean
  '#BA43A9', // 6: purple
  '#705DA0', // 7: violet
  '#508642', // 8: dark green
  '#CCA300', // 9: dark sand
  '#447EBC',
  '#C15C17',
  '#890F02',
  '#0A437C',
  '#6D1F62',
  '#584477',
  '#B7DBAB',
  '#F4D598',
  '#70DBED',
  '#F9BA8F',
  '#F29191',
  '#82B5D8',
  '#E5A8E2',
  '#AEA2E0',
  '#629E51',
  '#E5AC0E',
  '#64B0C8',
  '#E0752D',
  '#BF1B00',
  '#0A50A1',
  '#962D82',
  '#614D93',
  '#9AC48A',
  '#F2C96D',
  '#65C5DB',
  '#F9934E',
  '#EA6460',
  '#5195CE',
  '#D683CE',
  '#806EB7',
  '#3F6833',
  '#967302',
  '#2F575E',
  '#99440A',
  '#58140C',
  '#052B51',
  '#511749',
  '#3F2B5B',
  '#E0F9D7',
  '#FCEACA',
  '#CFFAFF',
  '#F9E2D2',
  '#FCE2DE',
  '#BADFF4',
  '#F9D9F9',
  '#DEDAF7'
];

// eslint-disable-next-line
let g2 = [
  '#508642', // 8: dark green
  '#CCA300', // 9: dark sand
  '#447EBC',
  '#C15C17',
  '#890F02',
  '#0A437C',
  '#6D1F62',
  '#584477',
  '#B7DBAB',
  '#F4D598',
  '#70DBED',
  '#F9BA8F',
  '#F29191',
  '#82B5D8',
  '#E5A8E2',
  '#AEA2E0',
  '#629E51',
  '#E5AC0E',
  '#64B0C8',
  '#E0752D',
  '#BF1B00'
];

// eslint-disable-next-line
let g3 = ['#3F6833', '#967302', '#2F575E', '#99440A', '#58140C', '#052B51', '#511749', '#3F2B5B', '#E0F9D7', '#FCEACA', '#CFFAFF', '#F9E2D2', '#FCE2DE', '#BADFF4', '#F9D9F9', '#DEDAF7'];

// rgb(126, 178, 109)
// #7EB26D

// eslint-disable-next-line
const carbonDarkR = ['#007d79', '#ff7eb6', '#fa4d56', '#fff1f1', '#6fdc8c', '#4589ff', '#d12771', '#d2a106', '#08bdba', '#bae6ff', '#ba4e00', '#d4bbff', '#8a3ffc', '#33b1ff'];

// eslint-disable-next-line
const diverging1 = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'];
// eslint-disable-next-line
const diverging2 = ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'];
// eslint-disable-next-line
const diverging3 = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'];

const defaultColorScheme = {
  light: d3ScaleChromatic.schemeTableau10,
  dark: grafanaColors
};

class Colors {
  constructor() {
    this.d3ScaleChromatic = d3ScaleChromatic;
    this.d3Color = d3Color;
    this.grafanaColors = grafanaColors;
    this.colorSchemes = {
      default: defaultColorScheme
    };
    this.spectralDiverging = d3ScaleChromatic.schemeSpectral[4];
    this.a = d3ScaleChromatic.schemeRdYlBu[6];
    this.b = this.a.reverse();
  }

  setColorScheme(name, colorScheme) {
    this.colorSchemes[name] = colorScheme;
  }

  getColorScheme(name) {
    let schemeName = name || 'default';
    return schemeName in this.colorSchemes ? this.colorSchemes[schemeName] : this.colorSchemes['default'];
  }

  getColors(dark, name) {
    dark = dark || false;
    name = name || 'default';
    let colorScheme = this.getColorScheme(name) || defaultColorScheme;
    return dark ? colorScheme['dark'] : colorScheme['light'];
  }

  hex2RGBA(hex, opacity) {
    let c = d3Color.color(hex);
    c.opacity = opacity;
    return c + '';
  }
}

let colors = new Colors();
export default colors;
