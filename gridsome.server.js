const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const nodeExternals = require('webpack-node-externals');
const slugify = require('@sindresorhus/slugify');
const _ = require('lodash');
const fs = require('fs');
const dataprocessor = require('./tools/dataprocessor');

// TODO Revisit
function buildSearchIndex(courses){
  let records = [];
  for (let courseDoc of courses) {
    records.push({
      title: courseDoc.title,
      headline: courseDoc.headline,
      tags: courseDoc.tags,
      path: courseDoc.slug
    });
  }
  const output = {
    dir: './static',
    name: 'search.json'
  };
  const outputPath = path.resolve(process.cwd(), output.dir);
  const outputPathExists = fs.existsSync(outputPath);
  const fileName = output.name.endsWith('.json') ? output.name : `${output.name}.json`;
  if (!outputPathExists) {
    fs.mkdirSync(outputPath);
  }
  fs.writeFileSync(path.resolve(process.cwd(), output.dir, fileName), JSON.stringify(records));
}

module.exports = function(api) {
  const slugReplacement = {
    replacement: '-', // replace spaces with replacement
    remove: /[^\w\s-]/g, // regex to remove characters
    lower: true
  };

  api.chainWebpack((config, { isServer }) => {
    if (isServer) {
      config.externals([
        nodeExternals({
          whitelist: [/^vuetify/]
        })
      ]);
    }
  });

  /**
   * Some node customizations
   * * ensure that the tags are always saved as an array
   *   this allows us to use `tag1, tag2` and `['tag1', 'tag2']` as syntax in the md files
   *
   * * generates the slug (maybe obsolet, but needed for the dynamic pages)
   *
   * * adds the `typeName` to each node
   */
  api.onCreateNode(options => {
    if (options.internal.typeName === 'Post') {
      options.recordType = options.internal.typeName;
      options.tags = typeof options.tags === 'string' ? options.tags.split(',').map(string => string.trim()) : options.tags;
      options.slug = slugify(options.title, slugReplacement);
      return {
        ...options
      };
    }
  });

  api.loadSource(async actions => {
  });

  //api.createPages(({ createPage }) => {
  // Use the Pages API here: https://gridsome.org/docs/pages-api/
  //})

  /*
     // Use the Pages API here: https://gridsome.org/docs/pages-api
    const { data } = await graphql(`
      {
        allPost {
          edges {
            node {
              id
              slug
              path
              title
              timeToRead
              date(format: "D MMMM YYYY")
              tags {
                title
              }
            }
          }
        }
      }
    `);

  * */

  /**
   * Creates the article details pages
   * we're using this way, because we want to pass
   * some values to the page context
   *
   * this is required to enable the "related posts" functionality
   */
  api.createPages(async ({ graphql, createPage }) => {

    // First, process data
    dataprocessor.loadCSVData();
    dataprocessor.loadTimeSeries();
    dataprocessor.loadTimeSeriesCA(); 
    dataprocessor.loadTimeSeriesNewCases();
    dataprocessor.loadTimeSeriesCANewCases();
    dataprocessor.loadTimeSerioesCASanMateoNewCases();
    dataprocessor.loadTimeSerioesCAContraCostaNewCases();
    dataprocessor.loadTimeSeriesNVNewCases();
    dataprocessor.loadTimeSerioesNVWashoeNewCases();
    dataprocessor.processGeo();
    dataprocessor.loadUnemploymentTrend();

    // Just main page for now
    createPage({
      path: `/`,
      component: './src/templates/IndexTemplate.vue',
      context: {
      }
    });

    /*
    for (let courseDoc of coursesDocs) {
      let slug = slugify(courseDoc.title, slugReplacement);

      let related = getRelated(courseDoc);

      createPage({
        path: `/course/${slug}`,
        component: './src/templates/CourseTemplate.vue',
        context: {
          course: courseDoc,
          related: related
        }
      });
    }*/
  });

  api.beforeBuild((context) => {
    // TODO Implement. Only gets called when running "build", not called when "develop"
  });

};
