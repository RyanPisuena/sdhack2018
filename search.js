// Create search object for target index (data list)
var search = instantsearch({
  appId: 'W1MOOQ9FQ0',
  apiKey: 'e1dd4f79b4cc18493e64eb45db66197e',
  indexName: 'shops_index',
  urlSync: true,
  searchParameters: {
    hitsPerPage: 5
  }
});

// Search box widget
search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search-input'
  })
);

// Sort options widget
search.addWidget(
  instantsearch.widgets.sortBySelector({
    container: '#sort-by',
    indices: [
      {name: 'shops_index', label: 'Sort by: rating'},
      {name: 'shops_index_by_distance', label: 'Sort by: distance'}
    ]
  })
);

// Results widget
search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: document.getElementById('hit-template').innerHTML,
      empty: "We didn't find any results for the search <em>\"{{query}}\"</em>"
    }
  })
);

// Pagination widget
search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination'
  })
);


search.start();
